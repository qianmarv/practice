(defvar qianmarv-jira/sapjira-project-key)

(defconst qianmarv-jira/sapjira-task "5")
(defconst qianmarv-jira/sapjira-backlog "6")



(setq qianmarv-jira/sapjira-project-key "CCONS")

;; Only Get Task
(setq qianmarv-jira/sapjira-default-jql
      "assignee = currentUser() and resolution = unresolved and issueType = 5 ORDER BY
  priority DESC, created ASC")

(defvar qianmarv-jira/get-issue-list-callback
  (cl-function
   (lambda (&rest data &allow-other-keys)
     "Callback for async, DATA is the response from the request call."
     (let ((issues (append (cdr (assoc 'issues (cl-getf data :data))) nil)))
       (qianmarv-jira/get-issues issues)))))

(defun qianmarv-jira/get-issue-list ()
  (interactive
   (jiralib-do-jql-search qianmarv-jira/sapjira-default-jql nil qianmarv-jira/get-issue-list-callback)))

(defun qianmarv-jira/get-issues (issues)
  "Get list of ISSUES into an org buffer.

Default is get unfinished issues assigned to you, but you can
customize jql with a prefix argument.
See`org-jira-get-issue-list'"
  ;; If the user doesn't provide a default, async call to build an issue list
  ;; from the JQL style query
  (let* ((project-key qianmarv-jira/sapjira-project-key)
         (project-file (expand-file-name (concat project-key ".org") org-jira-working-dir))
         (project-buffer (or (find-buffer-visiting project-file)
                             (find-file project-file))))
    (with-current-buffer project-buffer
      (save-excursion
        (org-jira-mode t)
        (widen)
        (outline-show-all)
        (goto-char (point-min))

        (message "Start to Process")

        (mapc qianmarv-jira/handle-task issues)
        (switch-to-buffer project-buffer)
        (message "End of Proccess")))))


(defun qianmarv-jira/get-issue-type (issue)
  (org-jira-find-value (assoc 'fields issue) 'issuetype 'id))

(defun qianmarv-jira/get-issue-parent(issue)
  (cdr (assoc 'parent (cdr (assoc 'fields issue))))
  )

(defun qianmarv-jira/handle-task (issue)
  (let* ((issue-id (org-jira-get-issue-key issue))
         (issue-summary (org-jira-get-issue-summary issue))
         (issue-headline issue-summary)
         (parent-issue (qianmarv-jira/get-issue-parent issue))
         (parent-id (org-jira-get-issue-key issue-parent)))

    (setq p (org-find-entry-with-id issue-id))

    (message "Backlog => %s" issue-id)
    (save-restriction
      (if (and p (>= p (point-min))
               (<= p (point-max)))
          (progn
            (goto-char p)
            (forward-thing 'whitespace)
            (kill-line)) ;; Find Existing
        ;; Not Found, Try to Find Parent
        ;; TODO Try not to always update parent
        ;; Always Update Parent information for now
        (qianmarv-jira/handle-backlog parent-issue)
        (setq parent_p (org-find-entry-with-id parent-id)) ;; Should Always Find!
        (org-narrow-to-subtree)

        (goto-char (point-max))
        (unless (looking-at "^")
          (insert "\n"))
        (insert "** ")
        )

      (let ((status (org-jira-get-issue-val 'status issue)))
        (org-jira-insert (concat (cond (org-jira-use-status-as-todo
                                        (upcase (replace-regexp-in-string " " "-" status)))
                                       ((member status org-jira-done-states) "DONE")
                                       ("TODO")) " "
                                       issue-headline)))
      (save-excursion
        (unless (search-forward "\n" (point-max) 1)
          (insert "\n")))

      (org-narrow-to-subtree)
      (org-change-tag-in-region
       (point-min)
       (save-excursion
         (forward-line 1)
         (point))
       (replace-regexp-in-string "-" "_" issue-id)
       nil)

      (org-jira-entry-put (point) "ID" (org-jira-get-issue-key issue))
      )))

(defun qianmarv-jira/handle-backlog (issue)
  (let* ((issue-id (org-jira-get-issue-key issue))
         (issue-summary (org-jira-get-issue-summary issue))
         (issue-headline issue-summary))

    (message "Backlog => %s" issue-id)
    (setq p (org-find-entry-with-id issue-id))

    (save-restriction
      (if (and p (>= p (point-min))
               (<= p (point-max)))
          (progn
            (goto-char p)
            (forward-thing 'whitespace)
            (kill-line))
        (goto-char (point-max))
        (unless (looking-at "^")
          (insert "\n"))
        (insert "* ")
        )

      (let ((status (org-jira-get-issue-val 'status issue)))
        (org-jira-insert (concat (cond (org-jira-use-status-as-todo
                                        (upcase (replace-regexp-in-string " " "-" status)))
                                       ((member status org-jira-done-states) "DONE")
                                       ("TODO")) " "
                                       issue-headline)))
      (save-excursion
        (unless (search-forward "\n" (point-max) 1)
          (insert "\n")))

      (org-narrow-to-subtree)
      (org-change-tag-in-region
       (point-min)
       (save-excursion
         (forward-line 1)
         (point))
       (replace-regexp-in-string "-" "_" issue-id)
       nil)

      (org-jira-entry-put (point) "ID" (org-jira-get-issue-key issue))
      )))


(defun qianmarv-jira/handle-issue(issue)
  (if (string= (qianmarv-jira/get-issue-type issue) qianmarv-jira/sapjira-task)
      (qianmarv-jira/handle-issue (qianmarv-jira/get-issue-parent issue))
    t)

  (let* ((issue-id (org-jira-get-issue-key issue))
         (issue-type (qianmarv-jira/get-issue-type issue))
         (issue-summary (org-jira-get-issue-summary issue))
         (issue-headline issue-summary))

    (setq p (org-find-entry-with-id issue-id))

    (save-restriction
      (if (and p (>= p (point-min))
               (<= p (point-max)))
          (progn
            (goto-char p)
            (forward-thing 'whitespace)
            (kill-line))
        (goto-char (point-max))
        (unless (looking-at "^")
          (insert "\n"))
        (if (string= (qianmarv-jira/get-issue-type issue) qianmarv-jira/sapjira-task)
            (insert "** ")
          (insert "* "))
        )

      (let ((status (org-jira-get-issue-val 'status issue)))
        (org-jira-insert (concat (cond (org-jira-use-status-as-todo
                                        (upcase (replace-regexp-in-string " " "-" status)))
                                       ((member status org-jira-done-states) "DONE")
                                       ("TODO")) " "
                                       issue-headline)))
      (save-excursion
        (unless (search-forward "\n" (point-max) 1)
          (insert "\n")))

      (org-narrow-to-subtree)
      (org-change-tag-in-region
       (point-min)
       (save-excursion
         (forward-line 1)
         (point))
       (replace-regexp-in-string "-" "_" issue-id)
       nil)

      (org-jira-entry-put (point) "ID" (org-jira-get-issue-key issue))

      ;; Insert the duedate as a deadline if it exists
      ;; (when org-jira-deadline-duedate-sync-p
      ;;   (let ((duedate (org-jira-get-issue-val 'duedate issue)))
      ;;     (when (> (length duedate) 0)
      ;;       (org-deadline nil duedate))))

      ;; (mapc (lambda (heading-entry)
      ;;         (ensure-on-issue-id
      ;;          issue-id
      ;;          (let* ((entry-heading (concat (symbol-name heading-entry) (format ": [[%s][%s]]" (concat jiralib-url "/browse/" issue-id) issue-id))))
      ;;            (setq p (org-find-exact-headline-in-buffer entry-heading))
      ;;            (if (and p (>= p (point-min))
      ;;                     (<= p (point-max)))
      ;;                (progn
      ;;                  (goto-char p)
      ;;                  (org-narrow-to-subtree)
      ;;                  (goto-char (point-min))
      ;;                  (forward-line 1)
      ;;                  (delete-region (point) (point-max)))
      ;;              (if (org-goto-first-child)
      ;;                  (org-insert-heading)
      ;;                (goto-char (point-max))
      ;;                (org-insert-subheading t))
      ;;              (org-jira-insert entry-heading "\n"))

      ;;            (org-jira-insert (replace-regexp-in-string "^" "  " (org-jira-get-issue-val heading-entry issue))))))
      ;;       '(description))

      ;; (mapc (lambda (entry)
      ;;         (let ((val (org-jira-get-issue-val entry issue)))
      ;;           (when (or (and val (not (string= val "")))
      ;;                     (eq entry 'assignee)) ;; Always show assignee
      ;;             (org-jira-entry-put (point) (symbol-name entry) val))))
      ;;       '(assignee reporter type priority resolution status components created updated))

      ;; (org-jira-update-comments-for-current-issue)
      ;; (org-jira-update-attachments-for-current-issue)

      ;; ;; only sync worklog clocks when the user sets it to be so.
      ;; (when org-jira-worklog-sync-p
      ;;   (org-jira-update-worklogs-for-current-issue))

      )))

(setq org-jira-default-jql
      "assignee = currentUser() and resolution = unresolved and issueType = 5 ORDER BY
  priority DESC, created ASC")
(defun org-jira-get-issues (issues)
  "Get list of ISSUES into an org buffer.

Default is get unfinished issues assigned to you, but you can
customize jql with a prefix argument.
See`org-jira-get-issue-list'"
  ;; If the user doesn't provide a default, async call to build an issue list
  ;; from the JQL style query
  (interactive
   (org-jira-get-issue-list org-jira-get-issue-list-callback))
  (let (project-buffer)
    (mapc 'org-jira-handle-issue issues)
    (switch-to-buffer project-buffer)))


(defun org-jira-get-issue-type (issue)
  (org-jira-find-value (assoc 'fields issue) 'issuetype 'id))

(defun org-jira-get-issue-parent(issue)
  (progn
    (let ((parent-issue (assoc (assoc 'fields issue) 'parent)))
      (message (format "parent-issue: %s" (org-jira-get-issue-key parent-issue)))
      parent-issue)
    ))

(defun org-jira-handle-issue(issue)
  (if (string= (org-jira-get-issue-type issue) "5")
        (org-jira-handle-issue (org-jira-get-issue-parent issue))
    t)

  (let* ((proj-key (org-jira-get-issue-project issue))
         (issue-id (org-jira-get-issue-key issue))
         (issue-type (org-jira-get-issue-type issue))
         (issue-summary (org-jira-get-issue-summary issue))
         (issue-headline issue-summary))
    (let ((project-file (expand-file-name (concat proj-key ".org") org-jira-working-dir)))
      (setq project-buffer (or (find-buffer-visiting project-file)
                               (find-file project-file)))

      (with-current-buffer project-buffer
        (save-excursion
          (org-jira-mode t)
          (widen)
          (outline-show-all)
          (goto-char (point-min))
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
              (insert "* "))

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

            ))))))

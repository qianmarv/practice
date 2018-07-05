(jiralib--rest-call-it
 "/rest/api/2/search"
 :type "POST"
 :data (json-encode `((jql . ,(first params))
                      (maxResults . ,(second params)))))

(json-encode `((jql . ,(first params))
               (maxResults . ,(second params))))

(setq my-header `(,jiralib-token ("Content-Type" . "application/json")))

(setq my-data (json-encode `((jql . ,(first params))
                          (maxResults . ,(second params)))))

my-data
"{\"jql\":\"assignee = currentUser() and resolution = unresolved ORDER BY\\n  priority DESC, created ASC\",\"maxResults\":100}"
(request "https://sapjira.wdf.sap.corp/rest/api/2/search"
         :sync t
         :jheaders `(,jiralib-token ("Content-Type" . "application/json"))
         :type "POST"
         :parser 'json-read
         :data (json-encode `((jql . ,(first params))
                              (maxResults . ,(second params))))
         )

;; switch to get
(request "https://sapjira.wdf.sap.corp/rest/api/2/search"
         :sync nil
         :headers `(,jiralib-token ("Content-Type" . "application/json"))
         :type "GET"
         :parser 'json-read
         :params `((jql . ,(first params))
                   (maxResults . 2))
         :success (lambda (&rest data &allow-other-keys)
                    (message "debug: Success"))
         :error (lambda (&rest data &allow-other-keys)
                  (message "debug: Error"))
         :complete (lambda (&rest data &allow-other-keys)
                     (message "debug: Completed"))
         )


(defvar my-jira-get-issue-list-callback
  (cl-function
   (lambda (&rest data &allow-other-keys)
     "Callback for async, DATA is the response from the request call."
     (message "debug--data:%s" data)
     (let ((issues (append (cdr (assoc 'issues (cl-getf data :data))) nil)))
       (message "Callback called")))))

(setq jql (read-string "Jql: "
                       (if org-jira-jql-history
                           (car org-jira-jql-history)
                         "assignee = currentUser\(\) and resolution = unresolved")
                       'org-jira-jql-history
                       "assignee = currentUser() and resolution = unresolved"))

(jiralib-do-jql-search jql 10 my-jira-get-issue-list-callback)


(setq jiralib-url "https://sapjira.wdf.sap.corp:443")

(jiralib-call "getIssuesFromJqlSearch" nil jql 10)

(jiralib-do-jql-search jql nil )

(interactive
 (org-jira-get-issue-list my-jira-get-issue-list-callback))


(defun jiralib-get-issue (issue-key &optional callback)
  "Get the issue with key ISSUE-KEY, running CALLBACK after."
  (jiralib-call "getIssue" callback issue-key))

(defun org-jira-get-issue-by-id (id)
  "Get an issue by its ID."
  (jiralib-get-issue id)
)
(org-jira-get-issue-by-id "CCONS-590")



(org-jira-get-issue-list org-jira-get-issue-list-callback)

(jiralib--rest-call-it
 (format "/rest/api/2/issue/%s" "CCONS-590"))

 (expand-file-name "projects-list.org" org-jira-working-dir)

vv

jiralib-url

jiralib-token

(format "Project: [[file:%s.org][%s]]" "CCONS" "CCONS")

(defun jiralib-get-projects ()
  "Return a list of projects available to the user."
  (if jiralib-projects-list
      jiralib-projects-list
    (setq jiralib-projects-list
          (if jiralib-use-restapi
              (jiralib-call "getProjects" nil)
            (jiralib-call "getProjectsNoSchemes" nil)))))

(call-interactively 'jiralib-login)

(defun testjira ()
  (let ((proj (jiralib--rest-call-it "/rest/api/2/project/CCONS")))
      (let* ((proj-key (org-jira-find-value proj 'key))
             (proj-headline (format "Project: [[file:%s.org][%s]]" proj-key proj-key)))
        (save-restriction
          (widen)
          (goto-char (point-min))
          (outline-show-all)
          (setq p (org-find-exact-headline-in-buffer proj-headline))
          (if (and p (>= p (point-min))
                   (<= p (point-max)))
              (progn
                (goto-char p)
                (org-narrow-to-subtree)
                (end-of-line))
            (goto-char (point-max))
            (unless (looking-at "^")
              (insert "\n"))
            (insert "* ")
            (org-jira-insert proj-headline)
            (org-narrow-to-subtree))
          (org-jira-entry-put (point) "name" (org-jira-get-project-name proj))
          (org-jira-entry-put (point) "key" (org-jira-find-value proj 'key))
          (org-jira-entry-put (point) "lead" (org-jira-get-project-lead proj))
          (org-jira-entry-put (point) "ID" (org-jira-find-value proj 'id))
          (org-jira-entry-put (point) "url" (format "%s/browse/%s" (replace-regexp-in-string "/*$" "" jiralib-url) (org-jira-find-value proj 'key)))))
    )
  )

(testjira)


(org-jira-get-issues ())

(defvar org-jira-get-issue-list-callback
  (cl-function
   (lambda (&rest data &allow-other-keys)
     "Callback for async, DATA is the response from the request call."
     (let ((issues (append (cdr (assoc 'issues (cl-getf data :data))) nil)))
       (org-jira-get-issues issues)))))

(defun org-jira-get-issues (issues)
  "Get list of ISSUES into an org buffer.

Default is get unfinished issues assigned to you, but you can
customize jql with a prefix argument.
See`org-jira-get-issue-list'"
  ;; If the user doesn't provide a default, async call to build an issue list
  ;; from the JQL style query
  (interactive
   (org-jira-get-issue-list org-jira-get-issue-list-callback))
  )
  (let (project-buffer)
    (mapc (lambda (issue)
            (let* ((proj-key (org-jira-get-issue-project issue))
                   (issue-id (org-jira-get-issue-key issue))
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

                      (mapc (lambda (entry)
                              (let ((val (org-jira-get-issue-val entry issue)))
                                (when (or (and val (not (string= val "")))
                                          (eq entry 'assignee)) ;; Always show assignee
                                  (org-jira-entry-put (point) (symbol-name entry) val))))
                            '(assignee reporter type priority resolution status components created updated))

                      (org-jira-entry-put (point) "ID" (org-jira-get-issue-key issue))
                      (org-jira-entry-put (point) "CUSTOM_ID" (org-jira-get-issue-key issue))

                      ;; Insert the duedate as a deadline if it exists
                      (when org-jira-deadline-duedate-sync-p
                        (let ((duedate (org-jira-get-issue-val 'duedate issue)))
                          (when (> (length duedate) 0)
                            (org-deadline nil duedate))))

                      (mapc (lambda (heading-entry)
                              (ensure-on-issue-id
                               issue-id
                               (let* ((entry-heading (concat (symbol-name heading-entry) (format ": [[%s][%s]]" (concat jiralib-url "/browse/" issue-id) issue-id))))
                                 (setq p (org-find-exact-headline-in-buffer entry-heading))
                                 (if (and p (>= p (point-min))
                                          (<= p (point-max)))
                                     (progn
                                       (goto-char p)
                                       (org-narrow-to-subtree)
                                       (goto-char (point-min))
                                       (forward-line 1)
                                       (delete-region (point) (point-max)))
                                   (if (org-goto-first-child)
                                       (org-insert-heading)
                                     (goto-char (point-max))
                                     (org-insert-subheading t))
                                   (org-jira-insert entry-heading "\n"))

                                 (org-jira-insert (replace-regexp-in-string "^" "  " (org-jira-get-issue-val heading-entry issue))))))
                            '(description))
                      (org-jira-update-comments-for-current-issue)
                      (org-jira-update-attachments-for-current-issue)

                      ;; only sync worklog clocks when the user sets it to be so.
                      (when org-jira-worklog-sync-p
                        (org-jira-update-worklogs-for-current-issue))

                      ))))))
          issues)
    (switch-to-buffer project-buffer))


;;;;;;;;;;;;;;;;
;; 1. Authenticate
;; 2. Call Service API
;; 3. Interprete Result Data
;; 4. Operate Org Content
;; 5. Get Org Content => Update Jira

;; 1) How to get header properties?
;; https://emacs.stackexchange.com/questions/21713/how-to-get-property-values-from-org-file-headers


;; Credit to https://emacs.stackexchange.com/questions/21713/how-to-get-property-values-from-org-file-headers
;; DONE Already put into qianmarv-org/funcs
(defun qianmarv-org/get-global-props (&optional property buffer)
  "Get the plists of global org properties of current buffer."
  (unless property (setq property "PROPERTY"))
  (with-current-buffer (or buffer (current-buffer))
    (org-element-map (org-element-parse-buffer) 'keyword (lambda (el) (when (string-match property (org-element-property :key el)) el)))))

;; DONE Already put into qianmarv-org/funcs
(defun qianmarv-org/get-global-prop(property)
  (org-element-property :value (car (qianmarv-org/get-global-props property)))
  )

;; Get Authentication
;; Using Open authentication, put base64 encoded user:password into header

;; Get sapjira projects
(defun jiralib-get-project-by-key (proj-key)
  "Return a list of projects available to the user."
  (if jiralib-projects-list
      jiralib-projects-list
    (setq jiralib-projects-list
          (jiralib-call "getProjectByKey" nil proj-key))))

(sapjira-get-project "CCONS")

(defun sapjira-get-project (proj-key)
  "Get list of projects."
  (interactive)
  (let ((projects-file (buffer-file-name (current-buffer)))
        (proj (jiralib-get-project-by-key proj-key)))
    (let* ((proj-headline (format "SAPJIRA Project: %s" proj-key )))
      (save-restriction
        (message projects-file)
        (widen)
        (goto-char (point-min))
        (outline-show-all)
        (setq p (org-find-exact-headline-in-buffer proj-headline))
        (if (and p (>= p (point-min))
                 (<= p (point-max)))
            (progn
              (goto-char p)
              (org-narrow-to-subtree)
              (end-of-line))
          (goto-char (point-max))
          (unless (looking-at "^")
            (insert "\n"))
          (insert "* ")
          (org-jira-insert proj-headline)
          (org-narrow-to-subtree))
        (org-jira-entry-put (point) "name" (org-jira-get-project-name proj))
        (org-jira-entry-put (point) "key" (org-jira-find-value proj 'key))
        (org-jira-entry-put (point) "lead" (org-jira-get-project-lead proj))
        (org-jira-entry-put (point) "ID" (org-jira-find-value proj 'id))
        (org-jira-entry-put (point) "url" (format "%s/browse/%s" (replace-regexp-in-string "/*$" "" jiralib-url) (org-jira-find-value proj 'key)))))))

(defun sapjira-get-issue-list (&optional proj-key &optional callback)
  "Get list of issues, using jql (jira query language), invoke CALLBACK after.

Default is unresolved issues assigned to current login user; with
a prefix argument you are given the chance to enter your own
jql."
  (let ((jql org-jira-default-jql))
    (if proj-key (setq jql (format "assignee = currentUser() and resolution = unresolved and project=%s" proj-key)))
    (list (jiralib-do-jql-search jql nil callback))))

(defun test-jira()
  (interactive)
  (let ((proj-key (qianmarv-org/get-global-prop "PROJECT_KEY")))
    (sapjira-get-project proj-key)
    )
  )

(sapjira-get-issue-list "CCONS")


(defvar sapjira-get-issue-list-callback
  (cl-function
   (lambda (&rest data &allow-other-keys)
     "Callback for async, DATA is the response from the request call."
     ;; (let ((issues (append (cdr (assoc 'issues (cl-getf data :data))) nil)))
     (let ((issues (cl-getf data :data)))
       (sapjira-get-issues issues)))))

;;;###autoload
(defun sapjira-get-issues (issues)
  "Get list of ISSUES into an org buffer.

Default is get unfinished issues assigned to you, but you can
customize jql with a prefix argument.
See`org-jira-get-issue-list'"
  ;; If the user doesn't provide a default, async call to build an issue list
  ;; from the JQL style query
  (interactive
   (sapjira-get-issue-list nil sapjira-get-issue-list-callback))

  (mapc (lambda (issue)
          ;; Cares Backlog Item and Task only
          (message "issue type: %s" (sapjira-get-issue-type issue))
          (let* ((proj-key (org-jira-get-issue-project issue))
                 (issue-id (org-jira-get-issue-key issue))
                 (issue-summary (org-jira-get-issue-summary issue))
                 (issue-headline issue-summary))

            (save-excursion
              (org-jira-mode t)
              (widen)
              (outline-show-all)
              (goto-char (point-min))
              (setq p (org-find-entry-with-id issue-id))
              (save-restriction
                ;; Find Entry with issue-id
                (if (and p (>= p (point-min))
                         (<= p (point-max)))
                    (progn
                      (goto-char p)
                      (forward-thing 'whitespace)
                      (kill-line))
                  (goto-char (point-max))
                  ;; Insert heading
                  (unless (looking-at "^")
                    (insert "\n"))
                  (insert "** " ))
                ;; insert headline and TODO state
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

                ;; By qianmarv - No need to insert issue-id as tag
                ;; (org-change-tag-in-region
                ;;  (point-min)
                ;;  (save-excursion
                ;;    (forward-line 1)
                ;;    (point))
                ;;  (replace-regexp-in-string "-" "_" issue-id)
                ;;  nil)
                (mapc (lambda (entry)
                        (let ((val (org-jira-get-issue-val entry issue)))
                          (when (or (and val (not (string= val "")))
                                    (eq entry 'assignee)) ;; Always show assignee
                            (org-jira-entry-put (point) (symbol-name entry) val))))
                      '(assignee reporter type priority resolution status components created updated))

                (org-jira-entry-put (point) "ID" (org-jira-get-issue-key issue))
                ;; Insert the duedate as a deadline if it exists
                (when org-jira-deadline-duedate-sync-p
                  (let ((duedate (org-jira-get-issue-val 'duedate issue)))
                    (when (> (length duedate) 0)
                      (org-deadline nil duedate))))
                ;;TODO Insert descriptions as sub header
                (mapc (lambda (heading-entry)
                        (ensure-on-issue-id
                         issue-id
                         (let* ((entry-heading (concat (symbol-name heading-entry) (format ": [[%s][%s]]" (concat jiralib-url "/browse/" issue-id) issue-id))))
                           (setq p (org-find-exact-headline-in-buffer entry-heading))
                           (if (and p (>= p (point-min))
                                    (<= p (point-max)))
                               (progn
                                 (goto-char p)
                                 (org-narrow-to-subtree)
                                 (goto-char (point-min))
                                 (forward-line 1)
                                 (delete-region (point) (point-max)))
                             (if (org-goto-first-child)
                                 (org-insert-heading)
                               (goto-char (point-max))
                               (org-insert-subheading t))
                             (org-jira-insert entry-heading "\n"))

                           (org-jira-insert (replace-regexp-in-string "^" "  " (org-jira-get-issue-val heading-entry issue))))))
                      '(description))
                (org-jira-update-comments-for-current-issue)
                (org-jira-update-attachments-for-current-issue)

                ;; only sync worklog clocks when the user sets it to be so.
                (when org-jira-worklog-sync-p
                  (org-jira-update-worklogs-for-current-issue))

                ;; (insert issue-id)
                )
              )))
        issues)
  )

;; 2) Organize Hierarchy and drop issue without type Task or Backlog
(defun sapjira-get-issue-type(issue)
  (message "issue type: %s " (org-jira-get-issue-val 'type issue))
  )




;; Testing ;;;

;; Read File

(defun get-string-from-file (filePath)
  "Return filePath's file content."
  (with-temp-buffer
    (insert-file-contents filePath)
    (buffer-string)))

(json-read-from-string
 (get-string-from-file "~/ws/practice/lisp/test_issues.json"))

(defun mock-get-issues (&optional mockFilePath)
  (unless mockFilePath
    (setq mockFilePath "~/ws/practice/lisp/test_issues.json"))
  (json-read-file mockFilePath)
  ;; (json-read-from-string
  ;;  (with-temp-buffer
  ;;    (insert-file-contents mockFilePath)
  ;;    (buffer-string)))
  )

(assoc 'total (mock-get-issues))
;; assoc
(assoc 'fields (aref (cdr (assoc 'issues (mock-get-issues))) 0))


(assoc 'startAt (mock-get-issues))

(org-jira-find-value (aref (cdr (assoc 'issues (mock-get-issues))) 0) 'votes)
;; task . 5
(defconst SAPJIRA-ISSUETYPE-TASK "5")

;; backlog. 6
(defconst SAPJIRA-ISSUETYPE-BACKLOG "6")


;; Enum issue type
(defmacro get_issuetype_id (issue)
  '(cdr (assoc 'id (cdr (assoc 'issuetype (cdr (assoc 'fields issue)))))))

(progn
  (mapc (lambda(issue)
          (let (
                (issuetype-id (get_issuetype_id issue))
                (issue-key (cdr (assoc 'key issue)))
                )

            (if (or (string= issuetype-id SAPJIRA-ISSUETYPE-BACKLOG)
                    (string= issuetype-id SAPJIRA-ISSUETYPE-TASK))
                (message "key: %s and issuetype-id: %s" issue-key issuetype-id)
              )
            )
          )
        (cdr (assoc 'issues (mock-get-issues))))
  t
  )


;; Test
(setq test-json-data
      (json-read-from-string
       "{\"People\": {\"name\":\"Jack\", \"age\":18}}"))
(assoc 'name (cdr (assoc  'People test-json-data)))

;; Test - 2018-01-11
(setq jiralib-url "https://sapjira.wdf.sap.corp:443")
(defvar my-callback
  (cl-function
   (lambda (&rest data &allow-other-keys)
     "Callback for async, DATA is the response from the request call."
     ;; (let ((issues (append (cdr (assoc 'issues (cl-getf data :data))) nil)))
     (let ((issues (cl-getf data :data)))
       (save-excursion
         (progn
           (switch-to-buffer-other-window "*debug-log*")
           (erase-buffer)
           (goto-char (point-min))
           (insert "Issue:\n")
           (insert (format "%s" issues))))))))


(setq jiralib-token nil)

(jiralib-call "getIssuesByProject" my-callback "CCONS" 10) 

(jiralib-call "getIssuesFromJqlSearch" my-callback "assignee = currentUser() and resolution = unresolved and project = CCONS")



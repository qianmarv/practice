;;; sap-jira.el --- wrapped for sapjira              -*- lexical-binding: t; -*-

;; Copyright (C) 2017  Marvin Qian

;; Author: Marvin Qian <qianmarv@gmail.com>
;; Keywords: tools
;; Version: 0.0.1

;; This program is free software; you can redistribute it and/or modify
;; it under the terms of the GNU General Public License as published by
;; the Free Software Foundation, either version 3 of the License, or
;; (at your option) any later version.

;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;; GNU General Public License for more details.

;; You should have received a copy of the GNU General Public License
;; along with this program.  If not, see <http://www.gnu.org/licenses/>.

;;; Commentary:

;; A easy interface or view for sapjira usage.

;;; Code:

;; (defconst SAPJIRA-ISSUETYPE-TASK "5")

;; (defconst SAPJIRA-ISSUETYPE-BACKLOG "6")

;; (defmacro sapjira-get-issuetype-id (issue)
  ;; '(cdr (assoc 'id (cdr (assoc 'issuetype (cdr (assoc 'fields issue)))))))

(defun qianmarv/jiralib--rest-call-it (api &rest args)
  "Invoke the corresponding jira rest method API.
Invoking COMPLETE-CALLBACK when the
JIRALIB-COMPLETE-CALLBACK is non-nil, request finishes, and
passing ARGS to REQUEST."
  (append (request-response-data
           (apply #'request (if (string-match "^http[s]*://" api) api ;; If an absolute path, use it
                              (concat (replace-regexp-in-string "/*$" "/" jiralib-url)
                                      (replace-regexp-in-string "^/*" "" api)))
                  :sync (not jiralib-complete-callback)
                  :headers `(,jiralib-token ("Content-Type" . "application/json"))
                  :parser 'json-read
                  :complete jiralib-complete-callback
                  args))
          nil))


(defvar sapjira-project-key "CCONS")

(defvar sapjira-get-issue-list-callback
  (cl-function
   (lambda (&rest data &allow-other-keys)
     "Callback for async, DATA is the response from the request call."
     ;; (let ((issues (append (cdr (assoc 'issues (cl-getf data :data))) nil)))
     (let ((issues (cl-getf data :data)))
       ;; (save-excursion
       ;;   (progn
       ;;     (switch-to-buffer-other-window "*debug-log*")
       ;;     (erase-buffer)
       ;;     (goto-char (point-min))
       ;;     (insert "Issue:\n")
       ;;     (insert (format "%s" issues))))

       (sapjira-get-issues issues)))))

(defun sapjira-get-issue-list (&optional proj-key &optional callback)
  "Get list of issues, using jql (jira query language), invoke CALLBACK after.

Default is unresolved issues assigned to current login user; with
a prefix argument you are given the chance to enter your own
jql."
  (let ((jql org-jira-default-jql))
    (if proj-key (setq jql (format "assignee = currentUser() and resolution = unresolved and project=%s" proj-key)))
    (list (jiralib-do-jql-search jql nil callback))))

;; Insert Issue As Task Items
;; TODO How update works?
(defun sapjira-insert-issue (issue)
  (let* ((issue-id (org-jira-get-issue-key issue))
        (issue-summary (org-jira-get-issue-summary issue))
        (issue-type (org-jira-get-issue-val 'type issue))
        (issue-headline issue-summary)
        )

    ;; Update Message Status
    (message (assoc 'self issue))
    (message "Update Task %s" issue-id)
    (message "Issue type: %s" issue-type)
    ;;TODO Insert Parent Issue For Task -> Backlog
    (save-excursion
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
                                         issue-id ": "
                                         issue-headline)))
        (save-excursion
          (unless (search-forward "\n" (point-max) 1)
            (insert "\n")))
        (org-narrow-to-subtree)

        ;; insert properties
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
        ;; (org-jira-update-comments-for-current-issue)
        ;; (org-jira-update-attachments-for-current-issue)

        ;; only sync worklog clocks when the user sets it to be so.
        ;; (when org-jira-worklog-sync-p
        ;; (org-jira-update-worklogs-for-current-issue))

        ;; (insert issue-id)
        ))))

(defun sapjira-get-issues (issues)
  "Get list of ISSUES into an org buffer.

Default is get unfinished issues assigned to you, but you can
customize jql with a prefix argument.
See`org-jira-get-issue-list'"
  ;; If the user doesn't provide a default, async call to build an issue list
  ;; from the JQL style query
  (interactive
   (sapjira-get-issue-list sapjira-project-key sapjira-get-issue-list-callback))

  (mapc (lambda (issue)
          ;; Cares Backlog Item and Task only
          ;; (message "issue type: %s" (sapjira-get-issue-type issue))
          ;; TODO If Project file is not created, create from template with certain head properties
          (let* ((project-file (expand-file-name (concat sapjira-project-key ".org") org-jira-working-dir))
                 (project-buffer (or (find-buffer-visiting project-file)
                                    (find-file project-file))))

            ;; Print Debug Information
            (with-current-buffer project-buffer
              (sapjira-insert-issue issue)
              )
            )) issues))


(defun sapjira-get-issues-sync ( )
  "Get list of ISSUES into an org buffer.

Default is get unfinished issues assigned to you, but you can
customize jql with a prefix argument.
See`org-jira-get-issue-list'"
  ;; If the user doesn't provide a default, async call to build an issue list
  ;; from the JQL style query

  (mapc (lambda (issue)
          ;; Cares Backlog Item and Task only
          ;; (message "issue type: %s" (sapjira-get-issue-type issue))
          ;; TODO If Project file is not created, create from template with certain head properties
          (let* ((project-file (expand-file-name (concat sapjira-project-key ".org") org-jira-working-dir))
                 (project-buffer (or (find-buffer-visiting project-file)
                                    (find-file project-file))))

            ;; Print Debug Information
            (with-current-buffer project-buffer
              (sapjira-insert-issue issue)
              )
            )) (sapjira-get-issue-list sapjira-project-key))
  )
(sapjira-get-issues-sync)
(provide 'sap-jira)
;;; sap-jira.el ends here

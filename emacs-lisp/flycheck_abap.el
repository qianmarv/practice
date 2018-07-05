
  
(defun flycheck-abap-setup()
  "setup Flycheck abap"
  (interactive)
  (add-to-list 'flycheck-checkers 'abap)
  (setq flycheck-check-syntax-automatically '(mode-enabled save)))

(defun flycheck-abap--parse-error (alist checker)
  (let-alist alist
    (flycheck-error-new-at .line
                           .column
                           (intern .level)
                           .message)))

(defun flycheck-abap--start (checker callback)
  (condition-case err
      (let ((errors (delq nil
                          (mapcar
                           (lambda (alist)
                             (message "%s" alist)
                             (flycheck-abap--parse-error alist
                                                         checker))
                           (abap-check-source t)))))
        (funcall callback 'finished errors))
    (error (funcall callback 'errored (error-message-string err)))))

(defun flycheck-abap--verify (_checker)
  (list
   (flycheck-verification-result-new
    :label "ABAP Mode"
    :message (if (and abap-mode (abaplib-is-logged))
                 "enabled"
               "disabled")
    :face (if abap-mode 'success '(bold warning)))))

(flycheck-define-generic-checker 'abap
  "A syntax checker for ABAP using abap-mode"
  :start #'flycheck-abap--start
  :verify #'flycheck-abap--verify
  :modes 'abap-mode
  ;; :error-filter flycheck-abap-error-filter
  :predicate #'(lambda()
                 abap-mode))

(defun test()
  (interactive)
  (setq flycheck-mode t)

  (setq flycheck-mode nil))


(flycheck-abap-setup)

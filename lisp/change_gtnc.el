(defvar gtnc-map-table)
(setq gtnc-map-table
  '(
    ("CnsldtnChartOfAccounts"  "ConsolidationChartOfAccounts")
    ("CnsldtnDimension"  "ConsolidationDimension")
    ("CnsldtnLedger"  "ConsolidationLedger")
    ("CnsldtnPostingItem"  "ConsolidationPostingItem")
    ("CnsldtnUnit"  "ConsolidationUnit")
    ("CnsldtnVersion"  "ConsolidationVersion")
    ("CnsldtnLocalCurrency"  "LocalCurrency")
    ("CnsldtnGroupCurrency"  "GroupCurrency")
    ("CnsldtnPartnerUnit"  "PartnerConsolidationUnit")
    ("CnsldtnGroup"  "ConsolidationGroup")
    ("CnsldtnFinStmntItm"  "FinancialStatementItem")
    ("CnsldtnFinStmntSubItmCat"  "SubItemCategory")
    ("CnsldtnFinStmntSubItm"  "SubItem")
    ("CnsldtnPostingLevel"  "PostingLevel")
    ("CnsldtnApportionment"  "ConsolidationApportionment")
    ("CnsldtnCrcyCnvrsnDiffType"  "CurrencyConversionsDiffType")
    ("CnsldtnDocumentType"  "ConsolidationDocumentType")
    ("AmountInCnsldtnLocalCrcy"  "AmountInLocalCurrency")
    ("AmountInCnsldtnGroupCrcy"  "AmountInGroupCurrency")
    ("CnsldtnIsAutoPosting"  "ConsolidationPostgItemAutoFlag")
    ("CnsldtnCrcyTranslationDate"  "CurrencyTranslationDate")
    ("CnsldtnRefFiscalYear"  "ReferenceFiscalYear")
    ("CnsldtnDocumentNumber"  "ConsolidationDocumentNumber")
    ("CnsldtnInvmtActivityType"  "InvestmentActivityType")
    ("CnsldtnReversedDocument"  "ReversedDocument")
    ("CnsldtnDocReversalYear"  "ConsolidationDocReversalYear")
    ("CnsldtnReverseDocument"  "ReverseDocument")
    ("CnsldtnRecordNumber"  "ConsolidationRecordNumber")
    ("CnsldtnInvesteeUnit"  "InvesteeConsolidaitonUnit")
    ("CnsldtnAcquisitionYear"  "ConsolidationAcquisitionYear")
    ("CnsldtnAcquisitionPeriod"  "ConsolidationAcquisitionPeriod")
    ("CnsldtnBusinessTransactionType"  "BusinessTransactionType")
    ("CnsldtnRefAcctgDocument"  "RefConsolidationDocumentNumber")
    ("CnsldtnRefAcctgDocItem"  "RefConsolidationPostingItem")
    ("CnsldtnRefDocumentType"  "RefConsolidationDocumentType")
    ))

(defun is-amount-field (fieldname)
  (member
   fieldname
   '(
     "AmountInCnsldtnLocalCrcy"
     "AmountInCnsldtnGroupCrcy"
     )))

(defun duplicate-region (beg end)
  ;; (interactive)
  (copy-region-as-kill beg end)
  (open-line 1)
  (next-line 1)
  (yank)
  )
(defun duplicate-line()
  ;; (interactive)
  (move-beginning-of-line 1)
  (kill-line)
  (yank)
  (open-line 1)
  (next-line 1)
  (yank)
  ;; (previous-line)
  )

(defun insert-line-above ()
  (interactive)
  (move-beginning-of-line nil)
  (newline-and-indent)
  (indent-according-to-mode))


;; (defun is-invalid-field (field-name)
;;   (save-excursion
;;     (back-to-indentation)
;;     (if (or (looking-at "//")
;;             (looking-at "association")
;;             (looking-at "resultElement")
;;             (looking-at "@")
;;             (looking-at "_"))
;;         t
;;       nil
;;       )))

(defun point-eol()
  (save-excursion
    (end-of-line)
    (point)))

(defun point-bol()
  (save-excursion
    (beginning-of-line)
    (point)))

;; @VDM.viewType: #BASIC

(defconst VDM-CONSUMPTION "#CONSUMPTION")

(defconst VDM-COMPOSITE "#COMPOSITE")

(defconst VDM-BASIC "BASIC")

(defun is-vdm-consumption(end)
  (save-excursion
    (if (re-search-forward VDM-CONSUMPTION end t)
        t
      nil)))

(defun is-vdm-composite(end)
  (save-excursion
    (if (re-search-forward VDM-COMPOSITE end t)
        t
      nil)))

(defun is-vdm-basic(end)
  (save-excursion
    (if (re-search-forward VDM-BASIC end t)
        t
      nil)))

(defun gtnc-handle-vdm (vdm-handler)
  (mapc (lambda (item)
          (let ((old-gfn (car item))
                (new-gfn (car (cdr item))))
            (funcall vdm-handler old-gfn new-gfn)
            ))
        gtnc-map-table)
  )

(defun gtnc-handle-composite-view (old-gfn new-gfn)
  (save-excursion
    ;; Processing for Projected Field => Should Appear Once Only
    ;; (re-search-forward "[^_a-z1-9A-Z]Jack\s*,")
    (let ((prj-end-pos (re-search-forward (format "[^_a-z1-9A-Z]%s\s*," old-gfn) nil t)))
      (when prj-end-pos
        (move-beginning-of-line 1)
        (if (is-amount-field old-gfn)
            (let ((prj-start-pos (re-search-backward "@DefaultAggregation")))
              (goto-char prj-end-pos)
              (duplicate-region prj-start-pos prj-end-pos)
              ;; Add Deletion Mark
              (while (> (point) prj-end-pos)
                (move-end-of-line 1)
                (insert " //@DeleteAfterwards")
                (previous-line 1))
              (goto-char prj-start-pos)
              (while (word-search-forward old-gfn prj-end-pos t)
                (replace-match new-gfn))
              )
          ;; Not amount, simply dupliate lines
          (duplicate-line)
          (move-end-of-line 1)
          (insert " //@DeleteAfterwards")

          (previous-line 1)
          (move-beginning-of-line 1)
          (while (word-search-forward old-gfn (point-eol) t)
            (replace-match new-gfn))
          )
        )
      )
    ;; Replace Inside Annotation
    (goto-char (point-min))
    (while (re-search-forward
            (format "'%s'" old-gfn)
            nil t)
      (replace-match (format "'%s'" new-gfn))
      )

    ;; Replace Input Paramter
    (goto-char (point-min))
    (while (re-search-forward
            (format "P_%s" old-gfn)
            nil t)
      (replace-match (format "P_%s" new-gfn))
      )

    ;; Replace Other Existence
    (goto-char (point-min))
    (while (word-search-forward old-gfn nil t)
      (unless (looking-at "\s*,")
        (replace-match new-gfn)
      ))
    ))

(defun is-projection-field)
(defun gtnc-handle-consumption-view (old-gfn new-gfn)
  (save-excursion
    ;; Replace Single Field
    (goto-char (point-min))
    (while (word-search-forward old-gfn nil t)
      (replace-match new-gfn)
      )
    ;; Replace Input Paramter
    (goto-char (point-min))
    (while (re-search-forward
            (format "P_%s" old-gfn)
            nil t)
      (replace-match (format "P_%s" new-gfn))
      )
    ;; Replace Inside Annotation
    (goto-char (point-min))
    (while (re-search-forward
            (format "'%s'" old-gfn)
            nil t)
      (replace-match (format "'%s'" new-gfn))
      )
    ))

(defun add-new-gfn()
  (interactive)
  (goto-char (point-min))
  (re-search-forward "@VDM.viewType" nil t)
  (if (> (point) (point-min))
      (let* ((line-end-point (point-eol))
             (handler (cond ((is-vdm-consumption line-end-point) 'gtnc-handle-consumption-view)
                            ((is-vdm-composite line-end-point)  'gtnc-handle-composite-view)
                            ((is-vdm-basic line-end-point) 'gtnc-handle-basic-view )
                            (t nil)
                            )))
        (message (format "handler: %s" handler))
        (if handler
            (gtnc-handle-vdm handler)
          (message "Invalid VDM Type Or VDM Type Not Support!")))
    (message "Not a VDM!"))
  )


(defun delete-old-gfn()
  (interactive)
  (goto-char (point-min))
  (while (re-search-forward "@DeleteAfterwards" nil t)
      (move-beginning-of-line 1)
      (kill-line)
      (kill-line)
    )
  ;; (mapc (lambda (item)
  ;;         (progn
  ;;           (goto-char (point-min))
  ;;           (if (search-forward (car item) nil t)
  ;;               (evil-delete-line (point-bol) (point-eol))
  ;;             )))
  ;;       gtnc-map-table)
  )

;; (call-interactively 'evil-delete-line)
;;(evil-delete-whole-line (line-beginning-position) (line-end-position) t)


(global-set-key (kbd "C-x C-9") 'add-new-gfn)

(global-set-key (kbd "C-x C-1") 'delete-old-gfn)

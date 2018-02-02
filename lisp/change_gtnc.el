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
    ("CnsldtnGroupCurrency"  "GroupCurrency"
    ("CnsldtnPartnerUnit"  "PartnerConsolidationUnit")
    ("CnsldtnGroup"  "ConsolidationGroup")
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
;; Test Below
;;  (find-valid-old-gtnc "tester")

;; (re-search-forward "tester" nil t)
;; (evil-paste-after 1)
;; (evil-paste-after 1)
;; (beginning-of-line)
;; (end-of-line) test33


(defun insert-line-above ()
  (interactive)
  (move-beginning-of-line nil)
  (newline-and-indent)
  (indent-according-to-mode))


(defun is-invalid-field (field-name)
  (save-excursion
    (back-to-indentation)
    (if (or (looking-at "//")
            (looking-at "association")
            (looking-at "resultElement")
            (looking-at "@")
            (looking-at "_"))
        t
      nil
      )))

(defun point-eol()
  (save-excursion
    (end-of-line)
    (point)))

(defun point-bol()
  (save-excursion
    (beginning-of-line)
    (point)))

;; @VDM.viewType: #BASIC

(defconst VDM-CONSUMPTION "#COMSUMPTION")

(defconst VDM-COMPOSITE "#COMPOSITE")

(defconst VDM-BASIC "BASIC")

(defun get-vdm-type ()
  (save-excursion
    (goto-char (point-min))
    (re-search-forward "@VDM.viewType" nil t)
    (if (> (point) (point-min))
        (let ((current-point (point))
              (line-end-point (point-eol)))
          (cond ((is-vdm-consumption line-end-point) VDM-CONSUMPTION)
                ((is-vdm-composite line-end-point) VDM-COMPOSITE)
                ((is-vdm-basic line-end-point) VDM-BASIC)
                (nil))
          )
      nil)
    ))

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


(defun gtnc-handle-composite-view (item-mapping)
  (mapc (lambda (item)
          (let ((old-gtnc (car item))
                (new-gtnc (car (cdr item)))
                (vdm-type (get-vdm-type)))
            (goto-char (point-min))
            (let ((where-pos (word-search-forward "where" nil t)))
              ;; Process For Adding Additional
              (while (word-search-forward old-gtnc where-pos t)
                (progn
                  ;; (message (format "Process %s at %s" old-gtnc (point)))
                  (unless (is-invalid-field old-gtnc)
                    (insert-line-above)
                    (next-line -1)
                    (insert (format "%s," new-gtnc))

                    ;; (back-to-indentation)
                    ;; (evil-yank-line (point-bol) (point-eol))

                    ;; (spacemacs/evil-insert-line-above 1)
                    ;; (evil-line-move -1)
                    ;; (evil-paste-after 1)
                    ;; (if (re-search-forward old-gtnc nil t)
                    ;;     (replace-match new-gtnc))

                    (next-line 2)
                    (back-to-indentation)
                    )))
              (goto-char where-pos)
              (while (word-search-forward old-gtnc nil t)
                (progn
                  (unless (is-invalid-field old-gtnc)
                    (if (re-search-forward old-gtnc nil t)
                        (replace-match new-gtnc))
                    )
                  ))
              )
            ))
        item-mapping))

(defun gtnc-handle-consumption-view (item-mapping)
  (mapc (lambda (item)
          (let ((old-gtnc (car item))
                (new-gtnc (car (cdr item))))
            (goto-char (point-min))
            ;; Process For Adding Additional
            (while (word-search-forward old-gtnc nil t)
              (progn
                (if (re-search-forward old-gtnc nil t)
                    (replace-match new-gtnc))
                ))
            ))
        item-mapping))

(defun add-new-gtnc()
  (interactive)
  (let ((vdm-type (get-vdm-type)))
    (goto-char (point-min))

    (cond ((eq vdm-type VDM-CONSUMPTION) (gtnc-handle-consumption-view))
          ((eq vdm-type VDM-COMPOSITE) (gtnc-handle-composite-view))
          ((eq vdm-type VDM-BASIC) (gtnc-handle-basic-view))
          (nil))
    ))


(defun delete-old-gtnc()
  (interactive)
  (mapc (lambda (item)
          (progn
            (goto-char (point-min))
            (if (search-forward (car item) nil t)
                (evil-delete-line (point-bol) (point-eol))
              )))
        gtnc-map-table)
  )

;; (call-interactively 'evil-delete-line)
;;(evil-delete-whole-line (line-beginning-position) (line-end-position) t)


(global-set-key (kbd "C-x C-9") 'add-new-gtnc)

(global-set-key (kbd "C-x C-1") 'delete-old-gtnc)


;; Utility for those not supported by Racket
(define (square num)
  (* num 2))
(define nil '())

;; -----
;; Filtering a sequence to select only those elements that satisfy a given predicate is accomplished by
(define (filter predicate sequence)
  (cond ((null? sequence) nil)
        ((predicate (car sequence))
         (cons (car sequence)
               (filter predicate (cdr sequence))))
        (else (filter predicate (cdr sequence)))))

;;;; Usage
(filter odd? '(1 2 3 4 5))

;; Accumulations can be implemented by
(define (accumulate op initial sequence)
  (if (null? sequence)
      initial
      (op (car sequence)
          (accumulate op initial (cdr sequence)))))

;;;; Usage
(accumulate + 0 '(1 2 3 4)) ;; => 10
(accumualte * 1 '( 1 2 3 4)) ;; => 24

;; Enumerate the leaves of a tree
(define (enumerate-tree tree)
  (cond ((null? tree) nil)
        ((not (pair? tree)) (list tree))
        (else (append (enumerate-tree (car tree))
                      (enumerate-tree (cdr tree))))))

;;;; Usage
(enumerate-tree '(1 (2 3) (5 (6 7))))

;; Formualte `sum-odd-squares'
(define (sum-odd-squares tree)
  (accumulate +
              0
              (map square
                   (filter odd?
                           (enumerate-tree tree)))))


;; Exercise 2.33
(define (mymap p sequence)
  (accumulate (lambda (x y)
                (p x y)) nil sequence))
(mymap + '(1 2 3 4))

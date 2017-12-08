(define (p) (p))

(test 0 (p))

(define (test x y)
  (if (= x 0)
      0
      y))


(test 0 3)

(define (f1)
  (printf "Hello-1")
  1)
(f1)

(define (f2)
  (printf "Hello-2")
  2)
(f1)

(if (> 2 1)
    (f1)
    (f2))

(cond (> 2 1) (f1)
      (< 2 1) (f2))

(define (new-if predicate then-clause else-clause)
  (cond (predicate then-clause)
        (else else-clause)))

(define (new-if2 predicate then-clause else-clause)
  (if predicate then-clause
        else-clause))

(new-if (> 2 1)
    (f1)
    (f2))

(new-if2 (> 2 1)
        (f1)
        (f2))

(define (test x)
  (define (improve guess)
    (/ (+ (/ x (* guess guess)) (* guess 2)) 3))
  (improve 1))

(test 27)

(define (cube-root x)
  (define tolerance 0.0000000001)
  (define (improve guess)
    (/ (+ (/ x (* guess guess)) (* guess 2)) 3))
  (define (abs n)
    (if (< n 0) (* -1 n)
        n))
  (define (good-enough? guess)
    (< (abs (- x (* guess guess guess))) tolerance))
  (define (try guess)
    (if (good-enough? guess)
        guess
        (try (improve guess))))
  (try 1))
(cube-root 27.0)

(+ 1 2)
;; mimic cons, car, cdr with procedure
(define (my-cons x y)
  (define (dispatch m)
    (cond ((= m 0) x)
          ((= m 1) y)
          (else (error "Argument Error" m))))
  dispatch)

(define (my-car z)
  (z 0))

(define (my-cdr z)
  (z 1))

(let ((c1 (my-cons 1 9)))
  (my-car c1)
  (my-cdr c1))

;; Exercise 2.4
(define (my-cons2 x y)
  (lambda (m) (m x y)))

(define (my-car2 z)
  (z (lambda (p q) p)))

(define (my-cdr2 z)
  (z (lambda (p q) q)))

(let ((c2 (my-cons2 1 9)))
  (my-car2 c2)
  (my-cdr2 c2))

(define (make-cons a b)
  (* (expt 2 a) (expt 3 b)))

(define (car-tmp div c base)
  (if (not (eq? 0 (remainder div base))) c
      (car-tmp (/ div base) (+ c 1) base)))

(define (cons-car r)
    (car-tmp r 0 2))

(define (cons-cdr r)
  (car-tmp r 0 3))

(define (cons-car2 r)
  (if (eq? (remainder r 2) 0)
      (+ 1 (cons-car2 (/ r 2)))
      0))

(cons-car 24)
(cons-cdr 24)

(cons-car2 24)

(expt 5 2)
(remainder 18 2)

(define test_3
  (+ 1 2))

(let ((a 9))
  ((lambda (x) x) a))
;; variant
(define zero (lambda (f)
               (lambda (x) x)))

(define zero (lambda (f) (lambda (x) x)))

(define (add-1 n)
  (lambda (f) (lambda (x) (f ((n f) x)))))

(((add-1 zero) +) 9)

;; Define One!
;;(add-1 zero) 
;;=>(define )
(define one
  (lambda (f)
    (lambda (x) (f (((lambda (f)
                       (lambda (x) x)) f) x)))))

;;
(define one
  (lambda (f)
    (lambda (x)
      (f x))))
;; Define Two:
;; (add-1 one)
(define two
  (lambda (f)
    (lambda (x)
      (f (f x)))))

(/ 1 (+ (/ 1 7.48) (/ 1 4.935)))
(/ 1 (+ (/ 1 6.12) (/ 1 4.465)))

;;; Practice 2.7
(define (make-interval a b)
  (cons a b))

(define (upper-bound interval)
  (cdr interval))

(define (lower-bound interval)
  (car interval))

(define (add-interval x y)
  (make-interval (+ (lower-bound x) (lower-bound y))
                 (+ (upper-bound x) (upper-bound y))))
(define (sub-interval x y)
  (add-interval x
                (make-interval (* -1 (upper-bound y))
                               (* -1 (upper-bound y)))))

(define (mul-interval x y)
  (let ((p1 (* (lower-bound x) (lower-bound y)))
        (p2 (* (lower-bound x) (upper-bound y)))
        (p3 (* (upper-bound x) (lower-bound y)))
        (p4 (* (upper-bound x) (upper-bound y))))
    (make-interval (min p1 p2 p3 p4)
                   (max p1 p2 p3 p4))))

(define (div-interval x y)
  (let ((y_lo (lower-bound y))
        (y-hi (upper-bound y)))
    (if (and (> 0 y-hi)
             (< 0 y-lo)) (error "Range contains 0")
        (mul-interval x
                      (make-interval (/ 1 (upper-bound y))
                                     (/ 1 (lower-bound y)))))))
(define (is-interval-positive interval)
  (let ((lo (lower-bound interval))
        (hi (upper-bound interval)))
    (if (and (> hi 0)
             (> lo 0)) #t
        #f)))

(define aa (make-interval 1 3))
(is-interval-positive aa)

(car (cons (cons (cons 1 2) 3) '()))

(car (cons (cons 1 2) 3))

(car (cons 1 (cons 2 (cons 3 '())) ))

(null? '(1 2))
(length '(1 2))

(length '(1 '(1 2 3)))






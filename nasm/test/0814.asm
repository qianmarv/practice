  ;; Calculate 1+2+3+..+100
  %define START_ADDR 0x07c0
  %define DISPLAY_ADDR 0xb800

  mov ax, START_ADDR
  mov ds, ax
  mov si, DispStr
  mov cx, StrLen

  mov ax, DISPLAY_ADDR
  mov es, ax
  xor di, di

_loop:
  mov ah, [si]
  mov [es:di], ah
  inc si
  inc di
  ;; Set Background to Black, Foreground to White
  mov byte [es:di], 0x07
  inc di
  loop _loop

  mov cx, 100
  xor ax, ax

  ;; Calculate 1 + 2 + 3 + ... + 100 to ax
_loop2:
  add ax, cx
  loop _loop2

  ;; Display value in ax
  mov bx, 10

  mov si, DispStr
  xor cx, cx
_loop3:
  div bx
  ;; push dx
  mov [si], dx
  xor dx, dx
  inc si
  inc cx
  cmp ax, 0
  ja _loop3

  ;; push ax

  ;; mov cx, si
_loop4:
  ;; pop ax
  dec si
  mov al, [si]
  add al, 0x30
  mov [es:di], al
  inc di
  mov ah, 0x07
  mov byte [es:di], ah
  inc di
  loop _loop4

  jmp $

  DispStr db "1 + 2 + 3 + ... + 100 = "
  StrLen  db $ - DispStr
  ;; VarStr  db "00000000000000000000", 13, 10

  times 510 - ($ - $$) db 0
  dw 0xaa55

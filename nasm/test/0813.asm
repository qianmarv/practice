  ;; 将数据段调整到代码开始的位置对齐
  mov ax, 0x07c0
  mov ds, ax
  ;; 初始化段寄存器到显存开始的位置(0xb800)
  mov ax, 0xb800
  mov es, ax

  xor di, di
  mov si, HelloStr
  mov cx, StrLen

loopStr:
  mov ah, [si]
  mov [es:di], ah
  inc si
  inc di
  mov byte [es:di], 0x02
  inc di
  loop loopStr

  jmp $

HelloStr:  db 'Boot Loading...', 13, 10
StrLen:    db $ - HelloStr
  times 510 - ($-$$) db 0
  dw 0xaa55

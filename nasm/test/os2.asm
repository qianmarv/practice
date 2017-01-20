  mov ax, 0xb800
  mov ds, ax
  mov byte [0x00], 'H'
  mov byte [0x01], 0x27
  jmp $
  times 510-($-$$) db 0
  dw 0xaa55

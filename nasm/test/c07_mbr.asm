
         ;´úÂëÇåµ¥7-1
         ;ÎÄ¼þÃû£ºc07_mbr.asm
         ;ÎÄ¼þËµÃ÷£ºÓ²ÅÌÖ÷Òýµ¼ÉÈÇø´úÂë
         ;´´½¨ÈÕÆÚ£º2011-4-13 18:02

         jmp near start

 message db '1+2+3+...+100='

 start:
         mov ax,0x7c0           ;ÉèÖÃÊý¾Ý¶ÎµÄ¶Î»ùµØÖ·
         mov ds,ax

         mov ax,0xb800          ;ÉèÖÃ¸½¼Ó¶Î»ùÖ·µ½ÏÔÊ¾»º³åÇø
         mov es,ax

         ;ÒÔÏÂÏÔÊ¾×Ö·û´®
         mov si,message
         mov di,0
         mov cx,start-message
     @g:
         mov al,[si]
         mov [es:di],al
         inc di
         mov byte [es:di],0x07
         inc di
         inc si
         loop @g

         ;ÒÔÏÂ¼ÆËã1µ½100µÄºÍ
         xor ax,ax
         mov cx,1
     @f:
         add ax,cx
         inc cx
         cmp cx,100
         jle @f

         ;ÒÔÏÂ¼ÆËãÀÛ¼ÓºÍµÄÃ¿¸öÊýÎ»
         xor cx,cx              ;ÉèÖÃ¶ÑÕ»¶ÎµÄ¶Î»ùµØÖ·
         mov ss,cx
         mov sp,cx

         mov bx,10
         xor cx,cx
     @d:
         inc cx
         xor dx,dx
         div bx
         or dl,0x30
         push dx
         cmp ax,0
         jne @d

         ;ÒÔÏÂÏÔÊ¾¸÷¸öÊýÎ»
     @a:
         pop dx
         mov [es:di],dl
         inc di
         mov byte [es:di],0x07
         inc di
         loop @a

         jmp near $


times 510-($-$$) db 0
                 db 0x55,0xaa

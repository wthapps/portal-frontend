import { Directive, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[wth-chat-box]',
})

export class WthChatBoxDirective {
  @Output() sendMessage: EventEmitter<any> = new EventEmitter<any>();

  constructor(private element: ElementRef) {}

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    if (event.keyCode == 13 && !event.shiftKey) {
      event.preventDefault();
      if (event.target.value != '') {
        this.sendMessage.emit({body: event.target.value, type: 'text'});
      }
    }

    if (event.keyCode == 13 && event.shiftKey) {
      console.log('creating new line....:');
    }
  }
}

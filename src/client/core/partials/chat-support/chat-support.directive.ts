import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[chat-support]',
})

export class ChatSupportDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

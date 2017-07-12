import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[chatSupport]',
})

export class ChatSupportDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

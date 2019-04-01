import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'message-invitation',
  templateUrl: 'message-invitation.component.html'
})
export class MessageInvitationComponent {
  @Input() message: any;
  @Input() conversation: any;

  @Output() onAccept: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDecline: EventEmitter<any> = new EventEmitter<any>();

  accept() {
    this.onAccept.emit(this.conversation);
  }

  decline() {
    this.onDecline.emit(this.conversation);
  }
}

import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'w-user-actions',
  templateUrl: 'user-actions.component.html',
  styles: [':host{display: inline-block;}']
})
export class UserActionsComponent {
  @Input() user: any;
  @Output() onViewProfile: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChat: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRemove: EventEmitter<any> = new EventEmitter<any>();

  viewProfile(user: any) {
    this.onViewProfile.emit(user);
  }

  chat(user: any) {
    this.onChat.emit(user);
  }
}

import {
  Component, OnInit, Output, Input, EventEmitter
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support-user-info',
  templateUrl: 'chat-support-user-info.component.html'
})
export class ChatSupportUserInfoComponent implements OnInit, ChatSupportBaseComponent {
  @Input() data: any;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  onBack() {
    this.actionEvent.emit({name: 'goBack', previous: 'ChatSupportListComponent'});
  }

  send() {

  }

  onRegister() {
    this.actionEvent.emit({name: 'goToDetail'});
  }

}

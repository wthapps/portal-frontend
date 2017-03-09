import {
  Component, OnInit, Output, Input, EventEmitter
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { MessageService } from './message.service';

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support-user-info',
  templateUrl: 'chat-support-user-info.component.html'
})
export class ChatSupportUserInfoComponent implements OnInit, ChatSupportBaseComponent {
  @Input() data: any;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private messageService: MessageService) {
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

  onSendMessage(event: any) {

    this.messageService.sendMessage({senderId: this.data, message: {type: event.type, body: event.body}})
      .subscribe(
        (response: any) => {
          console.log('created message !!!!', response);
        },
        error => {

        }
      );


    console.log('on send message triggered', event);
  }
}

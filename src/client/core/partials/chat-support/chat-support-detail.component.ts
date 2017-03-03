import {
  Component, OnInit, Output, Input, EventEmitter, AfterViewInit
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { ChatSupportChannelService } from './shared/channel/chat-support-channel.service';

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support-detail',
  templateUrl: 'chat-support-detail.component.html'
})
export class ChatSupportDetailComponent implements OnInit, ChatSupportBaseComponent, AfterViewInit {
  @Input() data: any;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private chatSupportChanneService: ChatSupportChannelService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.chatSupportChanneService.subscribe();
  }

  onBack() {
    this.actionEvent.emit({name: 'goBack', previous: 'ChatSupportListComponent'});
  }

  send() {

  }
}

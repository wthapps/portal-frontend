import {
  Component, OnInit, EventEmitter, Output, Input, AfterViewInit
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';

// moduleId: module.id,
//   selector: 'wth-chat-support-list',
@Component({
  moduleId: module.id,
  templateUrl: 'chat-support-list.component.html'
})
export class ChatSupportListComponent implements ChatSupportBaseComponent, OnInit, AfterViewInit{
  @Input() data: any;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();
  conversations: Array<any>;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.conversations = new Array<any>();
    this.conversations = [

    ];
  }

  goToDetail() {
    this.actionEvent.emit({name: 'goToDetail'});
  }

  createConversation() {
    this.actionEvent.emit({name: 'createConversation'});
  }
}

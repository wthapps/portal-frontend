import {
  Component, OnInit, EventEmitter, Output, Input
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';

// moduleId: module.id,
//   selector: 'wth-chat-support-list',
@Component({
  moduleId: module.id,
  templateUrl: 'chat-support-list.component.html'
})
export class ChatSupportListComponent implements ChatSupportBaseComponent, OnInit {
  @Input() data: any;
  @Output() clickDetail: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor() {
  }

  ngOnInit() {
  }

  onShowDetail() {
    // this.clickDetail.emit(true);
  }

  createNewConversation() {
    this.clickDetail.emit(true);
  }
}

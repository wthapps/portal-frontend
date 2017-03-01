import {
  Component, OnInit, Output, EventEmitter
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support-detail',
  templateUrl: 'chat-support-detail.component.html'
})
export class ChatSupportDetailComponent implements OnInit {
  @Output() clickList: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  onShowList() {
    this.clickList.emit(false);
  }

  send() {

  }
}

import {
  Component, OnInit, Output, EventEmitter
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support-user-info',
  templateUrl: 'chat-support-user-info.component.html'
})
export class ChatSupportUserInfoComponent implements OnInit {
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

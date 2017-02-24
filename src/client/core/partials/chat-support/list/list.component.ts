import {
  Component, OnInit, EventEmitter, Output
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support-list',
  templateUrl: 'list.component.html'
})
export class CoreChatSupportListComponent implements OnInit {
  @Output() clickDetail: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  onShowDetail() {
    this.clickDetail.emit(true);
  }
}

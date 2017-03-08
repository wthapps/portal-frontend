import {
  Component, OnInit, EventEmitter, Output, Input, AfterViewInit
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { ApiBaseService } from '../../shared/services/apibase.service';

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

  constructor(private api: ApiBaseService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    console.log('chatsupport list...........', this.data);
    this.conversations = new Array<any>();
    this.api.get(`chat_support/conversations`, {uId: this.data})
      .subscribe(
        (response: any) => {
          this.conversations = response.data;
        },
        error => {

        }
      );
  }

  goToDetail() {
    this.actionEvent.emit({name: 'goToDetail'});
  }

  createConversation() {
    this.actionEvent.emit({name: 'createConversation'});
  }


}

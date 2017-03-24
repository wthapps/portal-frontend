import {
  Component, OnInit, Input, AfterViewInit, ViewChild, QueryList, ViewContainerRef, ViewChildren, OnChanges,
  SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { MessageItemComponent } from './message-item.component';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'cs-message-list',
  templateUrl: 'message-list.component.html'
})
export class MessageListComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() messages: Array<any>;
  // @ViewChild('messageViewChild') messageViewChild: ChatSupportMessageComponent;
  // @ViewChildren(ChatSupportMessageComponent) messageViewChildren: QueryList<ChatSupportMessageComponent>;
  // @ViewChildren('viewMessage', {read: ViewContainerRef}) viewMessages:QueryList<ViewContainerRef>;

  constructor(private ref: ChangeDetectorRef) {
  }

  ngOnInit() {

    if (this.messages === undefined) {
      this.messages = new Array<any>();
    }
  }

  ngAfterViewInit() {
    console.log('message list.............', this.messages, this.ref.detectChanges());



    // this.messageViewChildren.changes.subscribe( () => console.log('Something has changed') );
    // let messageViews: ChatSupportMessageComponent[] = this.messageViewChildren.toArray();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes..........', this.messages);
  }

}

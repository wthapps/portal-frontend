import {
  Component, OnInit, Input, AfterViewInit
} from '@angular/core';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'cs-message',
  templateUrl: 'message.component.html'
})
export class ChatSupportMessageComponent implements OnInit, AfterViewInit {

  @Input() message: any;

  constructor() {
  }

  ngOnInit() {
    console.log('MESSAGE --------------------');
  }

  ngAfterViewInit() {
    console.log('message..............');

  }


}

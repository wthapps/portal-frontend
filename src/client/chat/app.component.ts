import { Component, OnInit } from '@angular/core';
import './operators';
import 'rxjs/add/operator/filter';
import { ChatService } from './shared/services/chat.service';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.subscribeNotification();
  }
}

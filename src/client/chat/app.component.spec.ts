import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import {
  async
} from '@angular/core/testing';
import {
  Route
} from '@angular/router';
import {
  RouterTestingModule
} from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ZChatSettingComponent } from './setting/setting.component';
import { ZChatConversationComponent } from './conversation/conversation.component';
import { ZChatContactComponent } from './contact/contact.component';
import { ZChatNewConversationComponent } from './conversation/new-conversation.component';
import { ZChatConversationGlobalComponent } from './conversation/conversation-global.component';
import { ZChatHistoryComponent } from './history/history.component';

export function main() {

  describe('App component', () => {

    let config: Route[] = [
      {path: 'setting', component: ZChatSettingComponent},
      {path: 'history', component: ZChatHistoryComponent},
      {path: 'conversation', component: ZChatConversationGlobalComponent},
      {path: 'conversation/:id', component: ZChatConversationComponent},
      {path: 'new', component: ZChatNewConversationComponent},
      {path: 'contact', component: ZChatContactComponent},
      {path: '', component: ZChatConversationComponent}
    ];
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterTestingModule.withRoutes(config)],
        declarations: [AppComponent, ZChatSettingComponent, ZChatConversationComponent, ZChatContactComponent,
          ZChatNewConversationComponent, ZChatConversationGlobalComponent, ZChatConversationGlobalComponent, ZChatHistoryComponent],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' }
        ]
      });
    });

    it('should build without a problem',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let compiled = fixture.nativeElement;

            expect(compiled).toBeTruthy();
          });
      }));
  });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-app></sd-app>'
})

class TestComponent {
}




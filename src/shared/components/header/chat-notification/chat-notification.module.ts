import { ModuleWithProviders, NgModule } from '@angular/core';
import { ChatNotificationComponent } from '@shared/components/header/chat-notification/chat-notification.component';

@NgModule({
  imports: [
  ],
  declarations: [
    ChatNotificationComponent,
  ],
  exports: [
    ChatNotificationComponent,
  ]
})
export class ChatNotificationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChatNotificationModule,
      providers: []
    };
  }
}

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsNavigationComponent } from '@shared/components/header/apps-navigation/apps-navigation.component';

import { ProfileDropDownComponent } from '@shared/components/header/profile-dropdown/profile-dropdown.component';
import { NotificationDropDownComponent } from '@shared/components/header/notification-dropdown/notification-dropdown.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotificationListModule } from '@shared/shared/components/notification-list/notification-list.module';
import { ChatNotificationComponent } from '@shared/components/header/chat-notification/chat-notification.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { ZChatEmojiModule } from '@shared/shared/emoji/emoji.module';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { WTHEmojiModule } from '@shared/components/emoji/emoji.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NotificationListModule,
    ZChatEmojiModule,
    PipeModule,
    TooltipModule,
    WTHEmojiModule
  ],
  declarations: [
    AppsNavigationComponent,
    NotificationDropDownComponent,
    ChatNotificationComponent,
    ProfileDropDownComponent
  ],
  exports: [
    AppsNavigationComponent,
    NotificationDropDownComponent,
    ChatNotificationComponent,
    ProfileDropDownComponent
  ]
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComponentsModule,
      providers: []
    };
  }
}

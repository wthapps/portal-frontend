import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsNavigationComponent } from "@shared/components/header/apps-navigation/apps-navigation.component";
import { TooltipModule } from "primeng/primeng";
import { ProfileDropDownComponent } from "@shared/components/header/profile-dropdown/profile-dropdown.component";
import { NotificationDropDownComponent } from "@shared/components/header/notification-dropdown/notification-dropdown.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NotificationListModule } from "@shared/shared/components/notification-list/notification-list.module";
import { ChatNotificationComponent } from "@shared/components/header/chat-notification/chat-notification.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NotificationListModule,
    TooltipModule,
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
      providers: [
      ]
    };
  }
}

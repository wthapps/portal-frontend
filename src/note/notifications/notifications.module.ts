import { NgModule } from '@angular/core';
// import { ZSocialSharedModule } from '../shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';
import { CommonModule } from '@angular/common';
import { ZNoteSharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CommonNotificationsComponent } from '@wth/shared/shared/components/notification-list/notifications.component';


@NgModule({
  imports: [
    CommonModule,
    ZNoteSharedModule,
    SharedModule,

    RouterModule.forChild([
      {path: '', component: CommonNotificationsComponent},
    ])
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: []
})

export class NoteNotificationModule {
}

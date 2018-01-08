import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';

import { PipeModule } from '../../pipe/pipe.module';

import { NotificationItemComponent } from '@shared/shared/components/notification-list/item/notification-item.component';
import { NotificationListComponent } from '@shared/shared/components/notification-list/notification-list.component';
import { NotificationUndoComponent } from '@shared/shared/components/notification-list/undo/notification-undo.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    Ng2Bs3ModalModule,
    CheckboxModule,
    TooltipModule,

    PipeModule,
  ],
  declarations: [
    NotificationListComponent,
    NotificationItemComponent,
    NotificationUndoComponent
  ],
  exports: [
    NotificationListComponent,
    NotificationItemComponent,
    NotificationUndoComponent
  ],
  providers: []
})

export class NotificationListModule {
}

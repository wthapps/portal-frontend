import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotePhotoDetailComponent } from './photo-detail.component';
import { AuthGuard } from '@wth/shared/services';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'photos/:id',
        component: NotePhotoDetailComponent,
        outlet: 'modal',
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNotePhotoRoutingModule {}

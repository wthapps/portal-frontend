import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatPhotoDetailComponent } from './photo-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'photos/:id', component: ChatPhotoDetailComponent, outlet: 'modal'},
    ])
  ],
  exports: [RouterModule]
})
export class ZChatPhotoRoutingModule {
}

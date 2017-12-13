import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZNoteMyProfileComponent } from './my-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: ZNoteMyProfileComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteMyProfileRoutingModule {
}

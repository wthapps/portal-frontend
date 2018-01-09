import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMyProfileComponent } from "@shared/shared/components/profile/my-profile/my-profile.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: ZMyProfileComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteMyProfileRoutingModule {
}

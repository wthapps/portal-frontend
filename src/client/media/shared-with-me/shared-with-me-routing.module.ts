import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaSharedWithMeComponent } from './shared-with-me.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'shared-with-me', component: ZMediaSharedWithMeComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSharedWithMeRoutingModule {
}

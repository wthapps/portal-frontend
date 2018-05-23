import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZSocialNewsComponent } from './news.component';

const routes: Routes = [{ path: '', component: ZSocialNewsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZSocialNewsRoutingModule {}

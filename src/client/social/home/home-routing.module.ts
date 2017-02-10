import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialHomeComponent } from './home.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: ZSocialHomeComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialHomeRoutingModule { }

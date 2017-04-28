import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialSearchResultComponent } from './search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'search', component: ZSocialSearchResultComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialSearchRoutingModule { }

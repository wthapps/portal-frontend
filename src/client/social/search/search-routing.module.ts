import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialSearchResultComponent } from './search.component';
import { ZSocialSearchDetailComponent } from './search-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'search', component: ZSocialSearchResultComponent},
      {path: 'search/member', component: ZSocialSearchDetailComponent},
      {path: 'search/community', component: ZSocialSearchDetailComponent},
      {path: 'search/post', component: ZSocialSearchDetailComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialSearchRoutingModule { }

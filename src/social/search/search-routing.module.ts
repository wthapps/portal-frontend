import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialSearchResultDetailComponent } from './detail/search-detail.component';
import { ZSocialSearchResultAllComponent } from './all/search-all.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {path: 'member', component: ZSocialSearchResultDetailComponent},
          {path: 'community', component: ZSocialSearchResultDetailComponent},
          {path: 'post', component: ZSocialSearchResultDetailComponent},
          {path: 'all', component: ZSocialSearchResultAllComponent},
          {path: '', component: ZSocialSearchResultAllComponent}
        ]
      },
    ])
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule { }

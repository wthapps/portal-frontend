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
          { path: 'all', component: ZSocialSearchResultAllComponent },
          // { path: 'members', component: ZSocialSearchResultDetailComponent },
          // {
          //   path: 'communities',
          //   component: ZSocialSearchResultDetailComponent
          // },
          // { path: 'posts', component: ZSocialSearchResultDetailComponent },
          // { path: '', component: ZSocialSearchResultAllComponent},
          { path: ':group', component: ZSocialSearchResultDetailComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule {}

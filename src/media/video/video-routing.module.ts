import { NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, ApiBaseService } from '@wth/shared/services';
import { ZMediaVideoListComponent } from '@media/video/video-list.component';
import { ZVideoDetailComponent } from '@media/video/video-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'videos',
        component: ZMediaVideoListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'videos/:id',
        component: ZVideoDetailComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaVideoRoutingModule {}

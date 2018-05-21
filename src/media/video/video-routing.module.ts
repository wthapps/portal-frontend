import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaVideoListComponent } from '@media/video/video-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'videos',
        component: ZMediaVideoListComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaVideoRoutingModule {}

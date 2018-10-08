import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaTrashComponent } from '@media/trash/trash.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'trash',
        component: ZMediaTrashComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaTrashRoutingModule {}

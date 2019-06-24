import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriveTrashsComponent } from './trashs.component';

const routes: Routes = [
  {
    path: '',
    component: DriveTrashsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrashsRoutingModule {}

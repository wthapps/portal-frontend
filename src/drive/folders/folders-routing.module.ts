import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriveFolderListComponent } from './folders.component';

const routes: Routes = [
  {
    path: ':id',
    component: DriveFolderListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyDriveRoutingModule {}

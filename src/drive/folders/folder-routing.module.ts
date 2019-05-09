import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriveFolderListComponent } from './folder.component';

const routes: Routes = [
  // { path: '', redirectTo: 'my-drive', pathMatch: 'full' },
  {
    path: '',
    component: DriveFolderListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyDriveRoutingModule {}

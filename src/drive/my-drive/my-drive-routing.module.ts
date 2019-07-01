import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyDriveComponent } from './my-drive.component';

const routes: Routes = [
  // { path: '', redirectTo: 'my-drive', pathMatch: 'full' },
  {
    path: '',
    component: MyDriveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyDriveRoutingModule {}

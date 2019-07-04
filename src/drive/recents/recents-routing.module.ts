import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecentsComponent } from './recents.component';

const routes: Routes = [
  {
    path: '',
    component: RecentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyDriveRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WDriveHeaderModule } from './shared/components/header/header.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: './my-drive/my-drive.module#MyDriveModule'
  }
];

@NgModule({
  imports: [WDriveHeaderModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

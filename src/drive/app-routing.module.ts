import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WDriveHeaderModule } from './shared/components/header/header.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/my-drive',
    pathMatch: 'full'
  },
  {
    path: 'my-drive',
    loadChildren: './my-drive/my-drive.module#MyDriveModule'
  },
  {
    path: 'folder/:id',
    loadChildren: './folders/folder.module#DriveFolderModule'
  }
];

@NgModule({
  imports: [WDriveHeaderModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

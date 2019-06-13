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
    path: 'recents',
    loadChildren: './recents/recents.module#RecentsModule'
  },
  {
    path: 'folders',
    loadChildren: './folders/folders.module#DriveFolderModule'
  },
  {
    path: 'favorites',
    loadChildren: './favorites/favorites.module#FavoritesModule'
  }
];

@NgModule({
  imports: [WDriveHeaderModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

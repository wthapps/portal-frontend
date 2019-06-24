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
    path: 'search',
    loadChildren: './search/search.module#SearchModule'
  },
  {
    path: 'favorites',
    loadChildren: './favorites/favorites.module#FavoritesModule'
  },
  {
    path: 'trashs',
    loadChildren: './trashs/trashs.module#DriveTrashsModule'
  }
];

@NgModule({
  imports: [WDriveHeaderModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

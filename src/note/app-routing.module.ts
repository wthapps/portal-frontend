import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      /* define app module routes here, e.g., to lazily load a module
         (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
       */
      {
        path: 'notifications',
        loadChildren:
          './notifications/notifications.module#NoteNotificationModule'
      },
      {
        path: 'recent',
        loadChildren: './recent/recent.module#ZNoteRecentModule'
      },
      {
        path: 'favourite',
        loadChildren: './favourite/favourite.module#ZNoteFavouriteModule'
      }
      // { path: 'photos', loadChildren: './photo/photo.module#ZNotePhotoModule#ZNotePhotoModule'}
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

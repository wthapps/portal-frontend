import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from '@shared/services';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'profile', loadChildren:
              './profile/profile.module#ZChatProfileModule'
          },
          {
            path: 'search', loadChildren:
              './search/search.module#ZChatSearchModule'
          }
        ]
      }
    ], {
        enableTracing: false, // <-- debugging purposes only
        preloadingStrategy: PreloadAllModules
      })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Page404Component } from './page404.component';
import { Page500Component } from './page500.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '404', component: Page404Component },
      { path: '500', component: Page500Component }
    ])
  ],
  exports: [RouterModule]
})
export class PageErrorsRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedCardPageComponent } from './shared-card-page.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared',
        component: SharedCardPageComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class SharedCardPageRoutingModule {
}

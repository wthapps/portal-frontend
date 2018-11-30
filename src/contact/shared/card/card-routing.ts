import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardListComponent } from './components/card-list.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CardListComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class CardRoutingModule {
}

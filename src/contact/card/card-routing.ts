import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardListComponent } from '@contacts/card/components/card-list.component';
import { CardDetailComponent } from '@contacts/card/components/card-detail.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CardListComponent
      },
      {
        path: ':id/detail',
        component: CardDetailComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class CardRoutingModule {
}

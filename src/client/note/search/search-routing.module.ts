import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZNoteSearchComponent } from './search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search',
        component: ZNoteSearchComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSearchRoutingModule {
}

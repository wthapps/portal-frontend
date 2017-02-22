import { NgModule } from '@angular/core';

import { SharedModule } from '../../core/shared/shared.module';
import { NameListService } from '../../core/shared/name-list/name-list.service';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: [NameListService]
})
export class HomeModule {
}

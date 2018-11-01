import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileModule } from '@wth/shared/user';

@NgModule({
  imports: [
    CommonModule,
    ProfileModule,
    ProfileRoutingModule
  ],
  declarations: [],
  exports: [],
  providers: []
})
export class CProfileModule {}

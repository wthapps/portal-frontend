import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverProfileComponent } from './component/cover-profile.component';
import { ProfileComponent } from './component/profile.component';
import { CoverComponent } from './component/cover.component';
import { InformationComponent } from './component/information.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CoverComponent,
    ProfileComponent,
    InformationComponent,
    CoverProfileComponent
  ],
  exports: [
    CoverComponent,
    ProfileComponent,
    InformationComponent,
    CoverProfileComponent
  ],
  providers: [
  ]
})

export class CoverProfileModule {
}

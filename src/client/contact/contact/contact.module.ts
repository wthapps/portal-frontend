import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZContactSharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZContactRoutingModule } from './contact-routing.module';

import { ZContactListComponent } from './contact-list/contact-list.component';
import { ZContactEditPageComponent } from './contact-edit/contact-edit-page.component';
import { ZContactDetailComponent } from './contact-detail/contact-detail.component';
import { ZContactEditComponent } from './contact-edit/contact-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ZContactRoutingModule,

    ZContactSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZContactListComponent,
    ZContactEditPageComponent,
    ZContactDetailComponent,

    //components
    ZContactEditComponent,
  ],
  exports: [
    ZContactListComponent,
    ZContactEditPageComponent,
    ZContactDetailComponent,

    //components
    ZContactEditComponent
  ],
  providers: []
})
export class ZContactModule {
}

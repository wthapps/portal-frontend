import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZContactSharedModule } from '../shared/shared.module';
import { ZContactHomeModule } from '../home/home.module';
// import { ZNewContactModule } from './new/new-contact.module';
// import { ZContactDetailModule } from './contact-detail/contact-detail.module';
import { ZContactListComponent } from './contact-list/contact-list.component';
import { ZContactListModule } from './contact-list/contact-list.module';
import { ContactRoutingModule } from './contact-routing.module';
// import { ZNewContactComponent } from './new/new-contact.component';
// import { ZContactDetailComponent } from './contact-detail/contact-detail.component';

import {
  ContactEditPageComponent,
  ContactEditComponent
} from './index';
import { FormsModule } from '@angular/forms';
import { ZContactDetailComponent } from './contact-detail/contact-detail.component';
import { SharedModule } from '../../core/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ContactRoutingModule,
    ZContactSharedModule.forRoot(),

    SharedModule.forRoot(),

    ZContactHomeModule,
    // ZContactListModule,
    // ZNewContactComponent,
    // ZContactDetailComponent,
    // ContactEditPageComponent
    ZContactHomeModule,
    // ZContactListModule,
    // ZNewContactModule,
    // ZContactDetailModule

  ],
  declarations: [
    ZContactListComponent,
    ContactEditPageComponent,
    ZContactDetailComponent,

    //components
    ContactEditComponent,
  ],
  exports: [
    ZContactListComponent,
    ContactEditPageComponent,
    ZContactDetailComponent,

    //components
    ContactEditComponent
  ],
  providers: []
})
export class ContactModule {
}

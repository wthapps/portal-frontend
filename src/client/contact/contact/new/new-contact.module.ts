import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZNewContactRoutingModule } from './new-contact-routing.module';
import { ZNewContactComponent } from './new-contact.component';
import { SharedModule } from '../../../core/shared/shared.module';
import { ZContactSharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZNewContactRoutingModule,
    SharedModule.forRoot(),
    ZContactSharedModule.forRoot()
  ],
  declarations: [
    ZNewContactComponent
  ],
  exports: [
    ZNewContactComponent
  ],
  providers: []
})

export class ZNewContactModule {
}

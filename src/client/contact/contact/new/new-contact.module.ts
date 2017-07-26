import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZNewContactRoutingModule } from './new-contact-routing.module';
import { ZNewContactComponent } from './new-contact.component';
import { ZContactSharedModule } from '../../shared/shared.module';
import { CoreSharedModule } from '../../../core/shared/shared.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZNewContactRoutingModule,
    ZContactSharedModule.forRoot(),
    CoreSharedModule.forRoot()
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

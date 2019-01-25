import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalModule } from 'ng2-bs3-modal';
import { IntroductionModalComponent } from './introduction/introduction.component';
import { PasswordConfirmationModalComponent } from '@shared/modals/password-comfirmation';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,
    BsModalModule
  ],
  declarations: [
    IntroductionModalComponent,
    PasswordConfirmationModalComponent,
  ],
  exports: [
    IntroductionModalComponent,
    PasswordConfirmationModalComponent,
  ]
})
export class ModalModule {}

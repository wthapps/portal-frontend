import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WUserComponent } from '@shared/components/w-user/w-user.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WUserComponent
  ],
  exports: [
    WUserComponent
  ]
})
export class WUserModule {
}

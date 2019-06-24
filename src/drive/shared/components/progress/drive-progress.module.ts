import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDockModule } from '@shared/shared/components/modal/dock.module';
import { ZDriveShareProgressComponent } from './drive-progress.component';


@NgModule({
  imports: [
    CommonModule,
    ModalDockModule
  ],
  declarations: [ZDriveShareProgressComponent],
  exports: [CommonModule, ZDriveShareProgressComponent]
})
export class ZDriveShareProgressModule {
}

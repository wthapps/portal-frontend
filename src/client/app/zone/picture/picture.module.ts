import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ZPictureComponent } from "./picture.component";



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    ZPictureComponent
  ],
  exports: [
    ZPictureComponent
  ]
})

export class ZPictureModule {
}

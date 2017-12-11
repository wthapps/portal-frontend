import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NotePhotoDetailComponent } from './photo-detail.component';
import { ZNotePhotoRoutingModule } from './photo-routing.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZNotePhotoRoutingModule,
    SharedModule.forRoot()
  ],
  declarations: [
    NotePhotoDetailComponent
  ],
  exports: [
    NotePhotoDetailComponent
  ],
  providers: []
})

export class ZNotePhotoModule {
}

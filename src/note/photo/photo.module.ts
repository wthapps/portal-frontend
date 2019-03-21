import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NotePhotoDetailComponent } from './photo-detail.component';
import { ZNotePhotoRoutingModule } from './photo-routing.module';
import { PhotoDetailPartialModule } from '@shared/modules/photo/components/detail/photo-detail-partial.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZNotePhotoRoutingModule,
    PhotoDetailPartialModule
  ],
  declarations: [NotePhotoDetailComponent],
  exports: [NotePhotoDetailComponent],
  providers: []
})
export class ZNotePhotoModule { }

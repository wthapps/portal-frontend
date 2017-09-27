import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZNoteService } from '../../services/note.service';

@Component({
  moduleId: module.id,
  selector: 'note-edit-modal',
  templateUrl: 'note-edit-modal.component.html',
  styleUrls: ['note-edit-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class NoteEditModalComponent {
  @ViewChild('modal') modal: ModalComponent;

  titleModal: string = 'New Note';

  form: FormGroup;
  title: AbstractControl;
  content: AbstractControl;
  tags: AbstractControl;

  constructor(private fb: FormBuilder, private noteService: ZNoteService) {
    this.form = fb.group({
      'title': ['', Validators.compose([Validators.required])],
      'content': [''],
      'tags': [''],
    });

    this.title = this.form.controls['title'];
    this.content = this.form.controls['content'];
    this.tags = this.form.controls['tags'];
  }

  open(options?: any) {
    this.modal.open().then();
  }

  onSubmit(value: any) {
    this.noteService.create(value).subscribe(
      (response: any) => {
        console.log('create note successful:::', response);

      },
      (error: any) => {
        console.log('create note error:::', error);
      }
    );
  }
}

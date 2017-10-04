import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZNoteService } from '../../services/note.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../reducers/index';
import * as note from '../../actions/note';
import { Note } from '../../../../core/shared/models/note.model';
import { Constants } from '../../../../core/shared/config/constants';


@Component({
  moduleId: module.id,
  selector: 'note-edit-modal',
  templateUrl: 'note-edit-modal.component.html',
  styleUrls: ['note-edit-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class NoteEditModalComponent {
  @ViewChild('modal') modal: ModalComponent;
  @Input() note: Note = new Note();

  titleModal: string = 'New Note';

  form: FormGroup;
  title: AbstractControl;
  content: AbstractControl;
  tags: AbstractControl;

  private editMode: string = Constants.modal.add;

  constructor(private fb: FormBuilder, private noteService: ZNoteService, private store: Store<fromRoot.State>) {
    // this.form = fb.group({
    //   'title': ['', Validators.compose([Validators.required])],
    //   'content': [''],
    //   'tags': [''],
    // });
    //
    // this.title = this.form.controls['title'];
    // this.content = this.form.controls['content'];
    // this.tags = this.form.controls['tags'];

    this.assignFormValue(this.note);
  }

  open(options: any = {mode: Constants.modal.add, note: Note}) {
    this.modal.open().then();
    this.editMode = options.mode;

    this.assignFormValue(this.note);
  }

  assignFormValue(data: Note) {
    this.form = this.fb.group({
      'title': [data.title, Validators.compose([Validators.required])],
      'content': [data.content],
      'tags': [data.tags],
    });

    this.title = this.form.controls['title'];
    this.content = this.form.controls['content'];
    this.tags = this.form.controls['tags'];
  }


  onSubmit(value: any) {
    if(this.editMode == Constants.modal.add)
      this.store.dispatch(new note.Add(value));
    else
      this.store.dispatch(new note.Update({...value, id: this.note.id}));
    this.modal.close();
  }
  //   this.noteService.create(value).subscribe(
  //     (response: any) => {
  //       console.log('create note successful:::', response);
  //       this.modal.close();
  //
  //     },
  //     (error: any) => {
  //       console.log('create note error:::', error);
  //       this.modal.close();
  //     }
  //   );
  // }
}

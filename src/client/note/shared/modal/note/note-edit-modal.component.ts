import { Component, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZNoteService } from '../../services/note.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../reducers/index';
import * as note from '../../actions/note';
import { Note } from '../../../../core/shared/models/note.model';
import { Constants } from '../../../../core/shared/config/constants';
import { PhotoModalDataService } from '../../../../core/shared/services/photo-modal-data.service';
import { Subject } from 'rxjs/Subject';
import { PhotoUploadService } from '../../../../core/shared/services/photo-upload.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'note-edit-modal',
  templateUrl: 'note-edit-modal.component.html',
  styleUrls: ['note-edit-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class NoteEditModalComponent implements OnDestroy {
  @ViewChild('modal') modal: ModalComponent;
  @Input() note: Note = new Note();

  titleModal: string = 'New Note';

  form: FormGroup;
  title: AbstractControl;
  content: AbstractControl;
  tags: AbstractControl;
  files: Array<any> = new Array<any>();

  private destroySubject: Subject<any> = new Subject<any>();
  private editMode: string = Constants.modal.add;

  constructor(private fb: FormBuilder,
              private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private photoSelectDataService: PhotoModalDataService,
              private photoUploadService: PhotoUploadService
  ) {
    this.assignFormValue(this.note);
  }

  open(options: any = {mode: Constants.modal.add, note: Note}) {
    if (this.note === undefined) {
      this.note = new Note();
    }
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

  /*
  * Ignore if the file is uploading
  * Delete if the file was uploaded
  * */
  cancelUpload(file: any) {

    this.note.attachments = _.pull(this.note.attachments, file);

    console.log('canceling uploading:::', file);
  }

  selectFiles() {
    this.subscribePhotoSelectEvents();

    this.photoSelectDataService.open({return: true});
  }

  onSubmit(value: any) {
    if(this.editMode == Constants.modal.add)
      this.store.dispatch(new note.Add(value));
    else
      this.store.dispatch(new note.Update({...value, id: this.note.id}));
    this.modal.close();
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  private subscribePhotoSelectEvents() {
    let closeObs$ = this.photoSelectDataService.closeObs$.merge(
      // this.photoSelectDataService.openObs$,
      this.photoSelectDataService.dismissObs$, this.destroySubject.asObservable()
    );

    this.photoSelectDataService.nextObs$.takeUntil(closeObs$).subscribe((photos : any) => {
      this.note.attachments.push(...photos);
      console.log('this.attachment:::', this.note.attachments);
    });

    this.photoSelectDataService.uploadObs$.takeUntil(closeObs$).subscribe((files: any) => {
      this.note.attachments.push(...files);
      this.uploadFiles(files);
    });

  }

  private uploadFiles(files: Array<any>) {

    _.forEach(files,(file: any) => {
      this.photoUploadService.uploadPhotos([file])
        .subscribe((response: any) => {
          let index = _.indexOf(this.note.attachments, file);

          console.log('uploaded:::', index, file, response.data);
          this.note.attachments[index] = response.data;

        }, (err: any) => {
          console.log('Error when uploading files ', err);
        });
    });


  }




}

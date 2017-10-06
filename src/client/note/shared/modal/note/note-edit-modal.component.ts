import { Component, Input, ViewChild, AfterViewInit, ViewEncapsulation, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';


import * as fromRoot from '../../reducers/index';
import * as note from '../../actions/note';
import { Note } from '../../../../core/shared/models/note.model';
import { Constants } from '../../../../core/shared/config/constants';
import { ZNoteService } from '../../services/note.service';
import { PhotoModalDataService } from '../../../../core/shared/services/photo-modal-data.service';
import { PhotoUploadService } from '../../../../core/shared/services/photo-upload.service';

const DEBOUNCE_MS = 1000;

declare var _: any;
declare var $: any;
declare var Quill: any;

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

  @HostListener('document:keypress', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    console.debug('on key press', ev);

    if(ev.key == 'z' && ev.ctrlKey ) {
      this.undo();
    }

    if(ev.key == 'y' && ev.ctrlKey ) {
      this.redo();
    }

  }

  titleModal: string = 'New Note';

  form: FormGroup;
  title: AbstractControl;
  content: AbstractControl;
  tags: AbstractControl;
  files: Array<any> = new Array<any>();

  closeSubject: Subject<any> = new Subject<any>();
  private destroySubject: Subject<any> = new Subject<any>();
  private editMode: string = Constants.modal.add;


  constructor(private fb: FormBuilder,
              private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private photoSelectDataService: PhotoModalDataService,
              private photoUploadService: PhotoUploadService) {

    this.store.select(fromRoot.getCurrentNote).takeUntil(this.closeSubject)
      .subscribe((note: Note) => {
        this.assignFormValue(note)
      });
  }

  ngOnDestroy() {
    this.closeSubject.next('');
    this.closeSubject.unsubscribe();
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  registerAutoSave() {

    // Auto save
    this.form.get('content').valueChanges.takeUntil(this.closeSubject).debounceTime(DEBOUNCE_MS)
      .subscribe(() => {
        console.log('Auto save note: ', this.form.value, this.note);
        this.store.dispatch(new note.Update({...this.form.value, id: this.note.id}));
      });
  }

  ngAfterViewInit(): void {
    $(document).on('hidden.bs.modal', '.modal', ()=> {
      if ($('.modal:visible').length) {
        $(document.body).addClass('modal-open');
      }
    });

    // Add custom to whitelist
    let Font = Quill.import('formats/font');
    Font.whitelist = ['sans-serif', 'serif', 'monospace', 'lato'];
    Quill.register(Font, true);

    let Size = Quill.import('attributors/style/size');
    Size.whitelist = [
      '9px', '10px', '11px', '12px', '13px', '14px', '18px', '24px', '36px', '48px', '64px', '72px'
    ];
    Quill.register(Size, true);
  }

  open(options: any = {mode: Constants.modal.add, note: Note}) {
    if (this.note === undefined) {
      this.note = new Note();
    }
    this.modal.open().then();
    this.editMode = options.mode;

    this.assignFormValue(this.note);
    this.registerAutoSave();
  }

  assignFormValue(data: Note) {
    this.form = this.fb.group({
      'title': [_.get(data, 'title', ''), Validators.compose([Validators.required])],
      'content': [_.get(data, 'content', '')],
      'tags': [_.get(data, 'tags', '')],
    });

    this.title = this.form.controls['title'];
    this.content = this.form.controls['content'];
    this.tags = this.form.controls['tags'];
  }

  undo() {
    console.debug('Perform UNDO');
    this.store.dispatch(new note.Undo());
  }

  redo() {
    console.debug('Perform REDO');
    // this.store.dispatch(new note.Redo());
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
    this.photoSelectDataService.open({return: true});
    this.subscribePhotoSelectEvents();
  }

  onSubmit(value: any) {
    if(this.editMode == Constants.modal.add)
      this.store.dispatch(new note.Add(value));
    else
      this.store.dispatch(new note.Update({...value, id: this.note.id}));
    this.modal.close()
      .then(() => { this.closeSubject.next(''); });
  }


  private subscribePhotoSelectEvents() {
    let closeObs$ = this.photoSelectDataService.closeObs$.merge(
      this.photoSelectDataService.openObs$,
      this.photoSelectDataService.dismissObs$, this.destroySubject.asObservable()
    );

    this.photoSelectDataService.nextObs$.takeUntil(closeObs$).subscribe((photos: any) => {
      this.note.attachments.push(...photos);
      console.log('this.attachment:::', this.note.attachments);
    });

    this.photoSelectDataService.uploadObs$.takeUntil(closeObs$).subscribe((files: any) => {
      this.note.attachments.push(...files);
      this.uploadFiles(files);
    });

  }

  private uploadFiles(files: Array<any>) {

    _.forEach(files, (file: any) => {
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

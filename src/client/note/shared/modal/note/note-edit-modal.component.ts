import { Component, Input, ViewChild, AfterViewInit, ViewEncapsulation, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';


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
export class NoteEditModalComponent implements OnDestroy, AfterViewInit {
  @ViewChild('modal') modal: ModalComponent;
  // @Input() note: Note = new Note();

  private note: Note = new Note();

  @HostListener('document:keypress', ['$event'])
  onKeyPress(ev: KeyboardEvent) {
    console.debug('on key press', ev);

    if (ev.key == 'b' && ev.ctrlKey) {
      this.undo();
    }

    if (ev.key == 'n' && ev.ctrlKey) {
      this.redo();
    }

  }

  titleModal: string = 'New Note';

  form: FormGroup;
  title: AbstractControl;
  content: AbstractControl;
  tags: AbstractControl;
  attachments: AbstractControl;
  files: Array<any> = new Array<any>();

  closeSubject: Subject<any> = new Subject<any>();
  private noSaveSubject: Subject<any> = new Subject<any>();
  private destroySubject: Subject<any> = new Subject<any>();
  private editMode: string = Constants.modal.add;
  private parentId: string;
  private noSave$: Observable<any>;

  constructor(private fb: FormBuilder,
              private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private photoSelectDataService: PhotoModalDataService,
              private photoUploadService: PhotoUploadService) {
    this.noSave$ = this.noSaveSubject.asObservable().merge(this.destroySubject, this.closeSubject);

  }

  ngOnDestroy() {
    this.closeSubject.next('');
    this.closeSubject.unsubscribe();
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  registerAutoSave() {
    // Auto save
    this.form.valueChanges
      .takeUntil(this.noSave$)
      .debounceTime(DEBOUNCE_MS)
      .takeUntil(this.noSave$)
      .subscribe(() => {
        if (this.editMode == Constants.modal.add) {
          this.onFirstSave();
        } else {
          let noteObj: any = Object.assign({}, this.note, this.form.value);
          this.store.dispatch(new note.Update(noteObj));
        }
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

  open(options: any = {mode: Constants.modal.add, note: undefined, parent_id: undefined}) {
    this.parentId = _.get(options, 'parent_id');
    this.modal.open().then();
    this.editMode = options.mode;

    this.assignFormValue(this.note);
    this.updateCurrentNote();
    this.registerAutoSave();
  }

  updateCurrentNote(): void {
    this.store.select(fromRoot.getCurrentNote)
      .takeUntil(this.closeSubject.merge(this.destroySubject))
      .subscribe((note: Note) => {
        console.debug('update form value: ', note);
        this.updateFormValue(note);
      });
  }

  assignFormValue(data: Note) {
    this.form = this.fb.group({
      'title': [_.get(data, 'title', ''), Validators.compose([Validators.required])],
      'content': [_.get(data, 'content', '')],
      'tags': [_.get(data, 'tags', [])],
      'attachments': [_.get(data, 'attachments', [])]
    });

    this.title = this.form.controls['title'];
    this.content = this.form.get('content');
    this.tags = this.form.controls['tags'];
    this.attachments = this.form.controls['attachments'];
    this.note = Object.assign({}, new Note(), data);
  }

  updateFormValue(data: Note) {
    this.form.controls['title'].setValue(_.get(data, 'title', ''));
    this.form.controls['content'].setValue(_.get(data, 'content', ''));
    this.form.controls['tags'].setValue(_.get(data, 'tags', []));
    this.form.controls['attachments'].setValue(_.get(data, 'attachments', []));

    this.title = this.form.controls['title'];
    this.content = this.form.get('content');
    this.tags = this.form.controls['tags'];
    this.attachments = this.form.controls['attachments'];
    this.note = Object.assign({}, new Note(), data);
  }

  undo() {
    console.debug('Perform UNDO');
    this.store.dispatch(new note.Undo());

    // Stop and restart auto-save feature
    this.noSaveSubject.next('');
    this.registerAutoSave();
    ;
  }

  redo() {
    console.debug('Perform REDO');
    this.store.dispatch(new note.Redo());

    this.noSaveSubject.next('');
    this.registerAutoSave();
  }

  /*
   * Ignore if the file is uploading
   * Delete if the file was uploaded
   * */
  cancelUpload(file: any) {
    this.note.attachments = _.pull(this.note.attachments, file);
    this.form.controls['attachments'].setValue(this.note.attachments);
  }

  selectFiles() {
    this.photoSelectDataService.open({return: true});
    this.subscribePhotoSelectEvents();
  }

  onSubmit(value: any) {
    if (this.editMode == Constants.modal.add) {
      this.store.dispatch(new note.Add({...value, parent_id: this.parentId}));
    } else {
      this.store.dispatch(new note.Update({...value, id: this.note.id}));
    }
    this.modal.close()
      .then(() => {
        this.closeSubject.next('');
      });
  }

  /**
   * Save post and change to EDIT mode
   */
  onFirstSave() {
    if (this.editMode == Constants.modal.add) {
      this.noteService.create({...this.form.value, parent_id: this.parentId}).toPromise()
        .then((res: any) => {
          this.note = res.data;
          this.editMode = Constants.modal.edit;
          this.store.dispatch(new note.MultiNotesAdded([res['data']]));
        })
    }
  }

  private subscribePhotoSelectEvents() {
    let closeObs$ = this.photoSelectDataService.closeObs$.merge(
      this.photoSelectDataService.openObs$,
      this.photoSelectDataService.dismissObs$, this.destroySubject.asObservable()
    );

    this.photoSelectDataService.nextObs$.takeUntil(closeObs$).subscribe((photos: any) => {
      this.note.attachments.push(...photos);
      this.form.controls['attachments'].setValue(this.note.attachments);
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
          this.note.attachments[index] = response.data;
          this.form.controls['attachments'].setValue(this.note.attachments);
        }, (err: any) => {
          console.log('Error when uploading files ', err);
        });
    });
  }

}

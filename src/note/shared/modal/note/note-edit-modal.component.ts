import { Component, Input, ViewChild, AfterViewInit, ViewEncapsulation, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';

import { Editor } from 'primeng/components/editor/editor';


import * as fromRoot from '../../reducers/index';
import * as note from '../../actions/note';
import { Note } from '@shared/shared/models/note.model';
import { Constants } from '@shared/constant/config/constants';
import { ZNoteService } from '../../services/note.service';
import { PhotoModalDataService } from '@shared/shared/services/photo-modal-data.service';
import { PhotoUploadService } from '@shared/shared/services/photo-upload.service';
import { FileUploadHelper } from '@shared/shared/helpers/file/file-upload.helper';
import { GenericFile } from '@shared/shared/models/generic-file.model';
import { GenericFileService } from '@shared/shared/services/generic-file.service';
import { Router } from '@angular/router';
import { ApiBaseService } from '@shared/shared/services/apibase.service';
import { ClientDetectorService } from '@shared/services/client-detector.service';
import { PhotoService } from '@shared/shared/services/photo.service';
import * as Delta from 'quill-delta/lib/delta';

const DEBOUNCE_MS = 2500;

@Component({
  selector: 'note-edit-modal',
  templateUrl: 'note-edit-modal.component.html',
  styleUrls: ['note-edit-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NoteEditModalComponent implements OnDestroy, OnChanges, AfterViewInit {
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild('editor') editor: Editor;
  @Input() note: Note = new Note();

  customEditor: any;
  public fileUploadHelper: FileUploadHelper;
  tooltip: any = Constants.tooltip;

  titleModal: string = 'New Note';

  buttonControl: string = '';

  form: FormGroup;
  title: AbstractControl;
  content: AbstractControl;
  tags: AbstractControl;
  attachments: AbstractControl;
  files: Array<any> = new Array<any>();

  private closeObs$: Observable<any>;
  private closeSubject: Subject<any> = new Subject<any>();
  private noSaveSubject: Subject<any> = new Subject<any>();
  private destroySubject: Subject<any> = new Subject<any>();
  private editMode: string = Constants.modal.add;
  private parentId: string;
  private noSave$: Observable<any>;
  private defaultImg: string = Constants.img.default;

  constructor(private fb: FormBuilder,
              private noteService: ZNoteService,
              protected router: Router,
              private store: Store<fromRoot.State>,
              private photoSelectDataService: PhotoModalDataService,
              private fileService: GenericFileService,
              private apiBaseService: ApiBaseService,
              private clientDetectorService: ClientDetectorService,
              private photoService: PhotoService,
              private photoUploadService: PhotoUploadService) {
    this.noSave$ = Observable.merge(this.noSaveSubject.asObservable(), this.destroySubject, this.closeSubject);
    this.closeObs$ = Observable.merge(
      this.photoSelectDataService.closeObs$,
      this.photoSelectDataService.openObs$,
      this.photoSelectDataService.dismissObs$, this.destroySubject.asObservable()
    );
    this.fileUploadHelper = new FileUploadHelper();

    // console.log(this.clientDetectorService.getOs());

    let getOs: any = this.clientDetectorService.getOs();
    this.buttonControl = (getOs.name == 7) ? '⌘' : 'ctrl';
  }

  ngOnDestroy() {
    this.closeSubject.next('');
    this.closeSubject.unsubscribe();
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  ngOnChanges() {
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
          this.updateNote();
        }
      });
  }

  ngAfterViewInit(): void {
    $(document).on('hidden.bs.modal', '.modal', () => {
      if ($('.modal:visible').length) {
        $(document.body).addClass('modal-open');
      }
    });

    // Reset content of elemenet div.ql-editor to prevent HTML data loss
    document.querySelector('.ql-editor').innerHTML = this.note.content;
    // this.updateFormValue(this.note);

    $('.ql-editor').attr('tabindex', 1);

    // this.customEditor = this.editor.quill;

    // Add custom to whitelist
    let Font = Quill.import('formats/font');
    Font.whitelist = ['gotham', 'georgia', 'helvetica', 'courier-new', 'times-new-roman', 'trebuchet', 'verdana'];
    Quill.register(Font, true);

    let Size = Quill.import('attributors/style/size');
    Size.whitelist = [
      '8px', '10px', '12px', '14px', '18px', '24px', '36px'
    ];
    Quill.register(Size, true);


    let BlockEmbed = Quill.import('blots/block/embed');

    class DividerBlot extends BlockEmbed {
    }

    DividerBlot.blotName = 'divider';
    DividerBlot.tagName = 'hr';
    Quill.register(DividerBlot);

    this.extendClipboard();
    this.customEditor = new Quill('#editor', {
      modules: {
        toolbar: {
          container: '#toolbar'
        }
      },
      placeholder: 'Say something ...',
      readOnly: false,
      theme: 'snow',
    });

    this.customEditor.options.readOnly = true;

    this.registerIconBlot();
    this.registerImageBlot();
    this.customizeKeyboardBindings();

    this.listenImageChanges();
    this.registerImageClickEvent();

    console.debug('current clipboard: ', this.customEditor);
  }

  extendClipboard() {
    var Clipboard = Quill.import('modules/clipboard');

    class PlainClipboard extends Clipboard {

      onPaste(e: any) {
        console.debug('inside onPaste. Do nothing now');
      }
    }

    Quill.register('modules/clipboard', PlainClipboard, true);
  }

  customizeKeyboardBindings() {
    console.debug('inside customizeKeyboardBindings: ');

    // Remove default binding for spacebar key
    delete this.customEditor.keyboard.bindings[32];

    // Auto detect hyperlink context when typing
    this.customEditor.keyboard.addBinding({
      key: ' ',
      collapsed: true,
      prefix: / (www\.\S*\.\S*|https?:\/\/\S*\.\S*(\.\S*)?)$/,
      handler: function(range, context) {

        let [line, offset] = this.customEditor.getLine(range.index);
        let link = context.prefix.split(' ').pop();
        console.debug('range ', range, context, link);
        console.debug('Delta ', this.delta, line, offset);
        let fullUrl = link.includes('http') ? link : `https://${link}`;

        this.customEditor.updateContents(new Delta().retain(range.index - link.length)
          .insert(link, {link: fullUrl})
          .delete(link.length)
          .insert(' '));
        this.customEditor.setSelection(range.index + 1);
        this.customEditor.format('link', true, Quill.sources.USER);
      }.bind(this)
    });


  };

  onToEditor(e: any) {
    if (e.keyCode == 13) { // enter
      $('.ql-editor').focus();
    }
  }

  registerImageBlot() {
    let BlockEmbed = Quill.import('blots/block/embed');

    class ImageBlot extends BlockEmbed {
      static create(value: any) {
        let node = super.create();
        node.setAttribute('alt', value.alt);
        node.setAttribute('src', value.url);
        node.setAttribute('id', value.id);
        node.setAttribute('data-id', value['data-id']);
        return node;
      }

      static value(node: any) {
        return {
          alt: node.getAttribute('alt'),
          url: node.getAttribute('src'),
          id: node.getAttribute('id'),
          'data-id': node.getAttribute('data-id')
        };
      }

    }

    ImageBlot.blotName = 'image';
    ImageBlot.tagName = 'img';
    Quill.register(ImageBlot);
    var toolbar = this.customEditor.getModule('toolbar');
    toolbar.addHandler('image', () => this.selectInlinePhotos4Note());
  }

  registerIconBlot() {
    let BlockEmbed = Quill.import('blots/block/embed');

    class IconBlot extends BlockEmbed {
      static create(value: any) {
        let node = super.create();
        node.setAttribute('class', value.class);
        node.setAttribute('id', value.id);
        return node;
      }

      static value(node: any) {
        return {
          class: node.getAttribute('class'),
          id: node.getAttribute('id')
        };
      }
    }

    IconBlot.blotName = 'i';
    IconBlot.tagName = 'i';
    Quill.register(IconBlot);

  }

  insertFakeImage(id: any) {
    const range = this.customEditor.getSelection(true);
    this.customEditor.insertText(range.index, '\n', Quill.sources.USER);
    this.customEditor.insertEmbed(range.index + 1, 'i', {
      class: 'fa fa-spinner fa-spin big-icon',
      id: id
    }, Quill.sources.USER);
    this.customEditor.setSelection(range.index + 2, Quill.sources.SILENT);
    // this.insertInlineImage(id);
  }

  // id: placeholder when fake images
  // data-id: real WTH photo id for editing
  insertInlineImage(id: any, url: string = this.defaultImg, dataId: string = null) {
    const range = this.customEditor.getSelection(true);
    this.customEditor.insertText(range.index, '\n', Quill.sources.USER);
    this.customEditor.insertEmbed(range.index + 1, 'image', {
      alt: 'WTH! No Image',
      url: url,
      id: id,
      'data-id': dataId
    }, Quill.sources.USER);
    this.customEditor.setSelection(range.index + 2, Quill.sources.SILENT);

    $(`img[data-id=${dataId}]`).wrap('<p></p>');
  }

  selectInlinePhotos4Note() {
    this.photoSelectDataService.open({return: true, multipleSelect: false});

    this.photoSelectDataService.nextObs$.takeUntil(this.closeObs$).subscribe((photos: any[]) => {
      console.debug('inline photo next: ', photos);
      photos.forEach((photo: any) => this.insertInlineImage(null, photo.url, photo.id));
      this.registerImageClickEvent();
    });

    let ids: string[] = [];
    this.photoSelectDataService.uploadObs$.takeUntil(this.closeObs$)
      .mergeMap((files: any) => {
        const randId = `img_${new Date().getTime()}`;
        this.insertFakeImage(randId);
        ids.push(randId);
        return this.photoUploadService.uploadPhotos(files);
      })
      .subscribe((res: any) => {
        console.debug('inline photo upload: ', res);
        const randId = ids.shift();
        $(`i#${randId}`).after(`<img src="${res.data.url}" data-id="${res.data.id}" />`);
        $(`i#${randId}`).remove();
        this.registerImageClickEvent();
      });
  }

  listenImageChanges() {
    this.photoService.modifiedPhotos$
      .takeUntil(this.destroySubject.asObservable())
      .subscribe((object: any) => {
        console.debug('modifiedPhotos - note: ', object);
        switch (object.action) {
          case 'update':
            let updatedPhoto = object.payload.photo;
            $(`img[data-id=${updatedPhoto.id}]`).attr('src', updatedPhoto.url);
            break;
          case 'delete':
            console.debug('unimplemented DELETE photo in post: ', object);
            let photoId = object.payload.photo.id;
            $(`p > img[data-id=${photoId}]`).remove();
            break;
          default:
            console.warn('unhandle event in photoService modifiedPhotos$: ', object);
        }

        this.updateNote();
      });
  }

  registerImageClickEvent() {
    let imgItems = Array.from(document.querySelector('.ql-editor').getElementsByTagName('img'));
    let photoIds = imgItems.map(item => item.dataset.id);
    console.debug('register image click event: imgIds - ', photoIds);

    imgItems.forEach(i => {
        if (!i.onclick)
          i.onclick = function (event: any) {
            console.debug('event: ', event, event.srcElement.getAttribute('data-id'));
            let photoId: string = event.srcElement.getAttribute('data-id');
            if (photoId && photoId !== 'null') {
              $('#modal-note-edit').css('z-index', '0');
              $('.modal-backdrop').css('z-index', '0');
              this.router.navigate([{
                outlets: {
                  modal: ['photos', photoId, {
                    module: 'note',
                    ids: photoIds
                  }]
                }
              }], {queryParamsHandling: 'preserve', preserveFragment: true});
            }
            else
              console.warn('no photo id for this image: ', event.srcElement);
          }.bind(this);
      }
    );

  }

  open(options: any = {mode: Constants.modal.add, note: undefined, parent_id: undefined}) {
    this.assignFormValue(this.note);
    this.parentId = _.get(options, 'parent_id');
    this.modal.open();
    this.editMode = options.mode;

    this.updateCurrentNote();
    this.registerAutoSave();
  }

  updateCurrentNote(): void {
    this.store.select(fromRoot.getCurrentNote)
      .takeUntil(Observable.merge(this.closeSubject, this.destroySubject))
      .subscribe((note: Note) => {
        this.updateFormValue(note);
      });
  }

  assignFormValue(data: Note) {
    this.form = this.fb.group({
      'title': [_.get(data, 'title', '')],
      'content': [_.get(data, 'content', ''), Validators.compose([Validators.required])],
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
    this.form.controls['content'].setValue(_.get(data, 'title', ''));
    this.form.controls['tags'].setValue(_.get(data, 'tags', []));
    this.form.controls['attachments'].setValue(_.get(data, 'attachments', []));

    this.title = this.form.controls['title'];
    this.content = this.form.get('content');
    this.tags = this.form.controls['tags'];
    this.attachments = this.form.controls['attachments'];
    this.note = Object.assign({}, new Note(), data);
  }

  undo() {
    this.store.dispatch(new note.Undo());

    // Stop and restart auto-save feature
    this.noSaveSubject.next('');
    this.registerAutoSave();
  }

  redo() {
    this.store.dispatch(new note.Redo());

    this.noSaveSubject.next('');
    this.registerAutoSave();
  }

  divider() {
    let range = this.customEditor.getSelection(true);
    this.customEditor.insertText(range.index, '\n', Quill.sources.USER);
    this.customEditor.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
    this.customEditor.setSelection(range.index + 2, Quill.sources.SILENT);
  }

  /*
   * Ignore if the file is uploading
   * Delete if the file was uploaded
   * */
  cancelUpload(file: any) {
    this.note.attachments = _.pull(this.note.attachments, file);
    this.form.controls['attachments'].setValue(this.note.attachments);
  }

  selectFiles(event: any) {
    console.debug('inside SelectFiles: ', event);
    let files = event.target.files;
    if (files.length == 0) {
      return;
    }
    this.fileUploadHelper.allowUpload(files, (filesAllowed: any[], filesNotAllowed: any[]) => {
      console.debug('file allowed: ', filesAllowed, ' - file NOT allowed: ', filesNotAllowed);
      this.note.attachments = [...this.note.attachments, ...filesAllowed];
      // this.form.controls['attachments'].setValue(this.note.attachments);

      this.uploadFiles(filesAllowed);
    });
  }

  selectPhotos() {
    this.photoSelectDataService.open({return: true});
    this.selectPhotos4Attachments();
  }

  onSubmit(value: any) {
    if (this.editMode == Constants.modal.add) {
      this.store.dispatch(new note.Add({...value, parent_id: this.parentId}));
    }
    else {
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

  download(file: any) {
    this.apiBaseService.download('common/files/download', {
      id: file.id,
      object_type: file.object_type
    }).subscribe((res: any) => {
      var blob = new Blob([res.blob()], {type: file.content_type});
      saveAs(blob, file.name);
    });
  }

  fileAttachmentClick(file: any) {
    if (file.object_type == 'photo') {
      $('#modal-note-edit').css('z-index', '0');
      $('.modal-backdrop').css('z-index', '0');
      this.router.navigate([{outlets: {modal: ['photos', file.id, {ids: [file.id]}]}}]);
    }
  }

  pdfDownload() {
    this.apiBaseService.download('note/notes/pdf_download/' + this.note.id).subscribe((res: any) => {
      var blob = new Blob([res.blob()], {type: 'application/pdf'});
      saveAs(blob, this.note.title + '.pdf');
    })
  }

  print() {
    let editor: any = document.querySelector('div.ql-editor');

    if (!document.querySelector('.printable')) {
      $('body').after('<div class="printable ql-container ql-snow"><div class="ql-editor"></div><div/>');
    }
    document.querySelector('.printable > .ql-editor').innerHTML = editor.innerHTML;
    let printable: any = document.querySelector('.printable > .ql-editor');
    printable.innerHTML = editor.innerHTML;
    window.print();
  }

  downloadAttachments() {
    if (this.note.attachments) {
      for (let att of this.note.attachments) {
        this.download(att);
      }
    }
  }

  private uploadFiles(files: any, parent?: any) {
    this.fileUploadHelper.upload(files, (event: any, file: any) => {
      let genericFile = new GenericFile({
        file: event.target['result'],
        name: file.name,
        content_type: file.type,
        parent: file.parent
      });
      // update current message and broadcast on server
      this.fileService.create(genericFile)
        .subscribe((response: any) => {
          let index = _.indexOf(this.note.attachments, file);
          this.note.attachments[index] = {object_type: 'file', ...response.data};
          this.form.controls['attachments'].setValue(this.note.attachments);
        });
    });
  }

  private selectPhotos4Attachments() {
    this.photoSelectDataService.nextObs$.takeUntil(this.closeObs$).subscribe((photos: any) => {
      this.note.attachments.push(...photos);
      this.form.controls['attachments'].setValue(this.note.attachments);
    });

    this.photoSelectDataService.uploadObs$.takeUntil(this.closeObs$).subscribe((files: any) => {
      this.note.attachments.push(...files);
      _.forEach(files, (file: any) => {
        this.photoUploadService.uploadPhotos(files)
          .subscribe((response: any) => {
            let index = _.indexOf(this.note.attachments, file);
            this.note.attachments[index] = response.data;
            this.form.controls['attachments'].setValue(this.note.attachments);
          }, (err: any) => {
            console.log('Error when uploading files ', err);
          });
      });
    });
  }

  private updateNote() {
    let noteObj: any = Object.assign({}, this.note, this.form.value);
    this.store.dispatch(new note.Update(noteObj));
  }
}

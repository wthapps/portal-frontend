import { Component, Input, ViewChild, SimpleChanges, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/take';

import * as fromRoot from '../shared/reducers/index';
import * as context from '../shared/reducers/context';
import * as note from '../shared/actions/note';
import { Note } from '@shared/shared/models/note.model';
import { Constants } from '@shared/constant/config/constants';
import { PhotoModalDataService } from '@shared/services/photo-modal-data.service';
import { PhotoUploadService } from '@shared/services/photo-upload.service';
import { FileUploadHelper } from '@shared/shared/helpers/file/file-upload.helper';
import { GenericFile } from '@shared/shared/models/generic-file.model';
import { GenericFileService } from '@shared/services/generic-file.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiBaseService } from '@shared/services/apibase.service';
import { ClientDetectorService } from '@shared/services/client-detector.service';
import { PhotoService } from '@shared/services/photo.service';
import * as Delta from 'quill-delta/lib/delta';
import { CommonEventService } from '@wth/shared/services';
import { ZNoteService } from '../shared/services/note.service';
import { takeUntil, switchMap, combineLatest } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { noteConstants } from 'note/shared/config/constants';
import { Counter } from '@wth/core/quill/modules/counter';
import { CustomImage } from '@wth/core/quill/modules/custom-image';


const DEBOUNCE_MS = 2500;
declare let _: any;

@Component({
  selector: 'z-note-detail-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ZNoteDetailEditComponent implements OnInit, AfterViewInit {
  @ViewChild(BsModalComponent) modal: BsModalComponent;

  note: Note = new Note();
  currentTab: any = 'note';
  hasShowComment: boolean = false;
  orderDesc: boolean = false;
  hasSortBy: boolean = false;
  noteChanged: boolean = false;
  customEditor: any;
  public fileUploadHelper: FileUploadHelper;
  tooltip: any = Constants.tooltip;

  titleModal: string = 'New Note';
  subPage: string = noteConstants.PAGE_NOTE_EDIT;

  buttonControl: string = '';

  form: FormGroup;
  title: AbstractControl;
  content: AbstractControl;
  tags: AbstractControl;
  attachments: AbstractControl;
  files: Array<any> = new Array<any>();

  private contentChange$: Observable<any>;
  private closeObs$: Observable<any>;
  private closeSubject: Subject<any> = new Subject<any>();
  private noSaveSubject: Subject<any> = new Subject<any>();
  private destroySubject: Subject<any> = new Subject<any>();
  private editMode: string = Constants.modal.add;
  private parentId: string;
  private noSave$: Observable<any>;
  private defaultImg: string = Constants.img.default;
  private editorElement: any;
  private copiedFormat: any = {};
  private isCopied: boolean;
  private timeInterval: any;
  private EXCLUDE_FORMATS: string[] = ['link'];
  resize: any;
  context$: any;

  constructor(private fb: FormBuilder,
              private noteService: ZNoteService,
              protected router: Router,
              private route: ActivatedRoute,
              private store: Store<any>,
              private photoSelectDataService: PhotoModalDataService,
              private fileService: GenericFileService,
              private apiBaseService: ApiBaseService,
              private clientDetectorService: ClientDetectorService,
              private photoService: PhotoService,
              private photoUploadService: PhotoUploadService,
              private commonEventService: CommonEventService) {
    this.noSave$ = Observable.merge(this.noSaveSubject.asObservable(), this.destroySubject, this.closeSubject);
    this.closeObs$ = Observable.merge(
      this.photoSelectDataService.closeObs$,
      this.photoSelectDataService.openObs$,
      this.photoSelectDataService.dismissObs$, this.destroySubject.asObservable()
    );


    this.fileUploadHelper = new FileUploadHelper();

    let getOs: any = this.clientDetectorService.getOs();
    this.buttonControl = (getOs.name == 7) ? '⌘' : 'ctrl';
  }

  ngOnInit() {
    this.assignFormValue(null);
    this.context$ = this.store.select('context');
    this.commonEventService.filter((e: any) => e.channel == 'noteActionsBar').take(1).subscribe((e: any) => {

      switch (e.action) {
        case 'note:note_edit:close':
          this.router.navigate([{outlets: {detail: null}}]);
          break;
        case 'note:note_edit:print':
          this.print();
          break;
      }
    })
  }

  ngAfterViewInit() {
    // Merge with get current folder - this.store.select(fromRoot.getCurrentFolder)
    this.route.paramMap.pipe(
      switchMap((paramMap: any) => {
        let noteId = paramMap.get('id');
        this.editMode = noteId ? Constants.modal.edit : Constants.modal.add;
        if (!!noteId)
          return this.noteService.get(noteId).map(res => res.data);
        else
          return of(new Note());
      }),
      combineLatest(this.store.select(fromRoot.getCurrentFolder)),
      takeUntil(this.destroySubject)
    )
      .subscribe(([noteContent, currentFolder]: any) => {
        this.note = noteContent;
        this.store.dispatch(new note.NoteUpdated(this.note));
        this.initQuill();
        if (currentFolder)
          this.parentId = currentFolder.id;
        this.updateFormValue(this.note);
        // Reset content of elemenet div.ql-editor to prevent HTML data loss
        document.querySelector('.ql-editor').innerHTML = this.note.content;
        if (this.note.permission !== 'view') this.registerAutoSave();
      });

    $('body').on('dblclick', '.ql-editor img', this.doubleClickImage.bind(this));
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges:', changes);
  }

  ngOnDestroy() {
    this.closeSubject.next('');
    this.closeSubject.unsubscribe();
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
    if (this.timeInterval) clearInterval(this.timeInterval);
  }

  registerAutoSave() {
    // Auto save
    Observable.merge(
      this.form.valueChanges.do(() => console.debug('valueChanges...')),
      Observable.fromEvent(this.customEditor, 'text-change').do(() => console.debug('text=change')))
      .do(() => this.noteChanged = true)
      .takeUntil(Observable.merge(this.noSave$, this.closeSubject))
      .debounceTime(DEBOUNCE_MS)
      .takeUntil(Observable.merge(this.noSave$, this.closeSubject))
      .subscribe(() => {
        if (this.editMode == Constants.modal.add && !this.note.id) {
          this.onFirstSave();
        } else {
          this.updateNote();
        }
      });
  }

  initQuill() {
    $(document).on('hide.bs.modal', '.modal', () => {
      if ($('.modal:visible').length) {
        $(document.body).addClass('modal-open');
      }
    });

    var bindings = {
      "enter": {
        key: 13,
        collapsed: true,
        prefix: /\b(www\.\S*\.\S*|https?:\/\/\S*\.\S*(\.\S*)?)\b\/?/,
        handler: function h(range, context) {
          this.addHyperLink(range, context);
          return true;
        }.bind(this)
      }
    };

    this.registerFontSizeBlot();
    this.registerDividerBlot();
    this.extendClipboard(this);
    Quill.register('modules/counter', Counter, true);
    Quill.register('modules/customImage', CustomImage, true);

    let modules: any = {
      modules: {
        toolbar: {
          container: '#quill-toolbar'
        },
        keyboard: {
          bindings: bindings
        },
        counter: {
          container: '#counter',
          unit: 'word'
        },
        customImage: {
          modules: ['CustomResize'],
          handleStyles: {
            backgroundColor: '#F54A59',
            border: '1px',
            color: 'white'
          },
          toolbarStyles: {
            position: 'absolute',
            top: '-30px',
            height: '0',
            minWidth: '100px',
            font: '12px/1.0 Arial, Helvetica, sans-serif',
            textAlign: 'center',
            color: '#333',
            boxSizing: 'border-box',
            cursor: 'default',
          }
        }
      },
      placeholder: 'Say something ...',
      readOnly: false,
      theme: 'snow',
      scrollingContainer: '#scrolling-container'
    };

    if (this.note.permission == 'view') {
      modules.modules.imageResize = null;
      modules.placeholder = '';
    }
    this.customEditor = new Quill('#quill-editor', modules);
    if (this.note.permission == 'view') this.customEditor.disable();
    if (!this.note.permission || this.note.permission != 'view') $('#quill-toolbar').show();

    this.editorElement = document.querySelector('div.ql-editor');

    $('.ql-editor').attr('tabindex', 1);

    this.registerIconBlot();
    this.registerImageBlot();
    this.customizeKeyboardBindings();

    this.listenImageChanges();
    this.registerSelectionChange();
  }

  onSort(name: any) {
    // console.log('name:', name, this.note.attachments);
    this.note.attachments = this.orderDesc ? _.sortBy(this.note.attachments, [name]) : _.sortBy(this.note.attachments, [name]).reverse();
    this.orderDesc = !this.orderDesc;
    this.hasSortBy = true;
  }

  extendClipboard(self: any) {
    var Clipboard = Quill.import('modules/clipboard');

    class PlainClipboard extends Clipboard {

      onPaste(e: any) {
        // super.onPaste(e);
        // fix flash screen while paste into editor
        this.container.style.position = 'fixed';
        this.container.style.zIndex = '-1';

        var dataClipboard1 = e.clipboardData.types;

        if (dataClipboard1[0].match('Files')) {
          if (e.clipboardData.items[0].type.match('image/*')) {
            var fileClipboard = e.clipboardData.items[0].getAsFile();
          }
        }

        if (e.defaultPrevented || !this.quill.isEnabled()) return;
        let range = this.quill.getSelection();
        let delta = new Delta().retain(range.index);
        // let scrollTop = this.quill.scrollingContainer.scrollTop;
        // this.scrollTop = scrollTop;
        this.container.focus(); // comment out to prevent scroll to top
        this.quill.selection.update(Quill.sources.SILENT);
        setTimeout(() => {
          if (dataClipboard1[0].match('text/*')) {
            delta = delta.concat(this.convert()).delete(range.length);
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(delta.length() - range.length, Quill.sources.SILENT);
            this.quill.focus();
            // this.quill.scrollingContainer.scrollTop = scrollTop;
            // this.scrollTop = null;
            // this.quill.selection.scrollIntoView();
          }
          else {
            if (fileClipboard.type.match('image/*')) {
              // var reader = new FileReader();
              // reader.onload = (e: any) => {
              let ids = [];
              const randId = `img_${new Date().getTime()}`;
              self.insertFakeImage(randId);
              ids.push(randId);
              // let file = e.target['result'];
              let files = [fileClipboard];
              self.photoUploadService.uploadPhotos(files).subscribe((res: any) => {
                const randId = ids.shift();
                $(`i#${randId}`).after(`<img src="${res.data.url}" data-id="${res.data.id}" />`);
                $(`i#${randId}`).remove();
              });
              fileClipboard.value = '';
              this.quill.focus();
            }
            ;
          }
        }, 1);
      }
    }

    Quill.register('modules/clipboard', PlainClipboard, true);
  }

  registerFontSizeBlot() {
    // Add custom to whitelist
    let Font = Quill.import('formats/font');
    Font.whitelist = ['gotham', 'georgia', 'helvetica', 'courier-new', 'times-new-roman', 'trebuchet', 'verdana'];
    Quill.register(Font, true);

    let Size = Quill.import('attributors/style/size');
    Size.whitelist = [
      '8px', '10px', '12px', '14px', '18px', '24px', '36px'
    ];
    Quill.register(Size, true);

  }

  registerDividerBlot() {

    let BlockEmbed = Quill.import('blots/block/embed');

    class DividerBlot extends BlockEmbed {
    }

    DividerBlot.blotName = 'divider';
    DividerBlot.tagName = 'hr';
    Quill.register(DividerBlot);
  }

  customizeKeyboardBindings() {
    console.debug('inside customizeKeyboardBindings: ');

    // Remove default binding for spacebar key
    delete this.customEditor.keyboard.bindings[32];

    // Auto detect hyperlink context when typing
    this.customEditor.keyboard.addBinding({
      key: ' ',
      collapsed: true,
      prefix: /\b(www\.\S*\.\S*|https?:\/\/\S*\.\S*(\.\S*)?)\b\/?$/,
      handler: function (range, context) {
        this.addHyperLink(range, context);
      }.bind(this)
    });
  };

  addHyperLink(range, context) {
    console.debug('Delta: ', new Delta());

    let [line, offset] = this.customEditor.getLine(range.index);
    let link = context.prefix.split(' ').pop();
    console.debug('range ', range, context, link);
    let fullUrl = link.includes('http') ? link : `https://${link}`;

    this.customEditor.updateContents(new Delta().retain(range.index - link.length)
      .delete(link.length)
      .insert(link, {link: fullUrl})
      .insert(' '));
    this.customEditor.history.cutoff();
    this.customEditor.setSelection(range.index + 1, Quill.sources.SILENT);
  }

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
        node.setAttribute('style', value.style);
        return node;
      }

      static value(node: any) {
        return {
          alt: node.getAttribute('alt'),
          url: node.getAttribute('src'),
          id: node.getAttribute('id'),
          'data-id': node.getAttribute('data-id'),
          style: node.getAttribute('style')
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
      'data-id': dataId,
    }, Quill.sources.USER);
    this.customEditor.setSelection(range.index + 2, Quill.sources.SILENT);
  }

  selectInlinePhotos4Note() {
    this.photoSelectDataService.open({return: true, multipleSelect: false});

    this.photoSelectDataService.nextObs$.takeUntil(this.closeObs$).subscribe((photos: any[]) => {
      photos.forEach((photo: any) => this.insertInlineImage(null, photo.url, photo.id));
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
      });
  }

  copyFormat() {
    let formats = this.customEditor.getFormat(this.customEditor.selection.savedRange.index, this.customEditor.selection.savedRange.length);
    this.EXCLUDE_FORMATS.forEach(f => {
      delete formats[f]
    });
    this.copiedFormat = formats;
    this.isCopied = true;
    console.debug('copyFormat: ', formats, this.customEditor.selection);
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
            $(`img[data-id=${photoId}]`).remove();
            break;
          default:
            console.warn('unhandle event in photoService modifiedPhotos$: ', object);
        }

        this.updateNote();
      });
  }

  registerSelectionChange() {
    this.customEditor.on('selection-change', (range, oldRange, source) => {
      if (this.isCopied && range) {
        let sIndex, sLength;
        if (range.length == 0) {
          var prefix = this.customEditor.getText(0, range.index).split(/\W/).pop();
          var suffix = this.customEditor.getText(range.index).split(/\W/).shift();
          sIndex = range.index - prefix.length;
          sLength = prefix.length + suffix.length;
        } else {
          sIndex = range.index;
          sLength = range.length;
        }
        this.customEditor.removeFormat(sIndex, sLength);
        this.customEditor.formatText(sIndex, sLength, this.copiedFormat);
        this.customEditor.formatLine(sIndex, sLength, this.copiedFormat);
        this.copiedFormat = {};
        this.isCopied = false;
      } else {
      }
    });
  }

  doubleClickImage(event: any) {
    let photoId: string = event.target.dataset.id;
    if (photoId && photoId !== 'null') {
      // $('#modal-note-edit').css('z-index', '0');
      // $('.modal-backdrop').css('z-index', '0');
      this.router.navigate([{
        outlets: {
          modal: ['photos', photoId, {
            module: 'note',
            ids: [photoId]
          }]
        }
      }], {queryParamsHandling: 'preserve', preserveFragment: true});
    }
    else {
      console.warn('no photo id for this image: ', event.srcElement);
    }

  }

  open(options: any = {mode: Constants.modal.add, note: undefined, parent_id: undefined}) {
    this.assignFormValue(this.note);
    this.parentId = _.get(options, 'parent_id');
    this.modal.open();
    this.noSaveSubject.next('');
    this.editMode = options.mode;

    this.updateCurrentNote();
  }

  updateCurrentNote(): void {
    this.store.select(fromRoot.getCurrentNote)
      .takeUntil(Observable.merge(this.closeSubject, this.destroySubject))
      .subscribe((note: Note) => {
        if (note != undefined) {
          this.updateFormValue(note);
        }
      });
  }

  assignFormValue(data?: Note) {
    this.form = this.fb.group({
      'title': [_.get(data, 'title', '')],
      // 'content': [_.get(data, 'content', ''), Validators.compose([Validators.required])],
      'tags': [_.get(data, 'tags', [])],
      'attachments': [_.get(data, 'attachments', [])]
    });

    this.title = this.form.controls['title'];
    // this.content = this.form.get('content');
    this.tags = this.form.controls['tags'];
    this.attachments = this.form.controls['attachments'];
    this.note = Object.assign({}, new Note(), data);
  }

  updateFormValue(data: Note) {
    this.form.controls['title'].setValue(_.get(data, 'title', ''));
    // this.form.controls['content'].setValue(_.get(data, 'title', ''));
    this.form.controls['tags'].setValue(_.get(data, 'tags', []));
    this.form.controls['attachments'].setValue(_.get(data, 'attachments', []));

    this.title = this.form.controls['title'];
    // this.content = this.form.get('content');
    this.tags = this.form.controls['tags'];
    this.attachments = this.form.controls['attachments'];
    this.note = Object.assign({}, new Note(), data);
  }

  undo() {
    this.customEditor.history.undo();
  }

  redo() {
    this.customEditor.history.redo();
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
    let files = event.target.files;
    if (files.length == 0) {
      return;
    }
    this.fileUploadHelper.allowUpload(files, (filesAllowed: any[], filesNotAllowed: any[]) => {
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
    if (value.title.length > 0 ||
      value.tags.length > 0 ||
      value.attachments.length > 0 ||
      (this.editorElement.innerHTML.length > 0 && this.editorElement.innerHTML != '<p><br></p>')) {

      if (this.editMode == Constants.modal.add) {
        if (this.note.permission !== 'view') {
          this.store.dispatch(new note.Add({
            ...value,
            parent_id: this.parentId,
            content: this.editorElement.innerHTML
          }));
        }
      } else {
        if (this.note.permission != 'view' && this.noteChanged) {
          this.store.dispatch(new note.Update({...value, id: this.note.id, content: this.editorElement.innerHTML}));
        }
      }
    }
    this.onModalClose();
  }

  onModalClose() {
    // this.modal.close()
    //   .then(() => {
    //     this.closeSubject.next('');
    //   });

    this.router.navigate([{outlets: {detail: null}}]);
    this.closeSubject.next('');
  }

  /**
   * Save post and change to EDIT mode
   */
  onFirstSave() {
    if (this.editMode == Constants.modal.add) {
      this.noteService.create({
        ...this.form.value,
        content: this.editorElement.innerHTML,
        parent_id: this.parentId
      }).toPromise()
        .then((res: any) => {
          this.note = res.data;
          this.editMode = Constants.modal.edit;
          this.store.dispatch(new note.MultiNotesAdded([res['data']]));
          this.router.navigate([{outlets: {detail: ['notes', this.note.id]}}]);
        });
    }
  }

  download(file: any) {
    console.log('downloading:::');
    this.apiBaseService.download('common/files/download', {
      id: file.id,
      object_type: file.object_type
    }).subscribe((res: any) => {
      var blob = new Blob([res], {type: file.content_type});
      saveAs(blob, `${file.name}.${file.extension}`);
    });
  }

  fileAttachmentClick(file: any) {
    if (file.object_type == 'photo') {
      $('#modal-note-edit').css('z-index', '0');
      $('.modal-backdrop').css('z-index', '0');
      this.router.navigate([{outlets: {modal: ['photos', file.id, {ids: [file.id]}]}}]);
    }
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
    if (!this.note.id)
      return;
    let noteObj: any = Object.assign({}, this.note, this.form.value, {content: this.editorElement.innerHTML});
    this.store.dispatch(new note.Update(noteObj));
  }
}

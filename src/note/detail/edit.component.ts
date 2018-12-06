import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable ,  Subject ,  Subscription ,  of, fromEvent, merge } from 'rxjs';
import {
  takeUntil,
  switchMap,
  combineLatest,
  filter,
  mergeMap,
  map,
  debounceTime,
  tap
} from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../shared/reducers/index';
import * as context from '../shared/reducers/context';
import * as note from '../shared/actions/note';
import { Note } from '@shared/shared/models/note.model';
import { Constants } from '@shared/constant/config/constants';
import { PhotoUploadService } from '@shared/services/photo-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBaseService } from '@shared/services/apibase.service';
import { ClientDetectorService } from '@shared/services/client-detector.service';
import { PhotoService } from '@shared/services/photo.service';
import * as Delta from 'quill-delta/lib/delta';
import { CommonEventService } from '@wth/shared/services';
import { ZNoteService } from '../shared/services/note.service';
import { noteConstants } from '@notes/shared/config/constants';
import { Counter } from '@wth/core/quill/modules/counter';
import { CustomImage } from '@wth/core/quill/modules/custom-image';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import ImageBlot from '@wth/core/quill/blots/image';
import IconBlot from '@wth/core/quill/blots/icon';
import { FileUploaderService } from '@shared/services/file/file-uploader.service';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';
import { ZNoteSharedModalEditNameComponent } from '@notes/shared/modal/name/edit.component';
import { BlackListPolicy } from '@shared/policies/black-list-policy';
import { SizePolicy } from '@shared/policies/size-policy';

const DEBOUNCE_MS = 2500;
declare let _: any;
const LINK_PATTERN = /\b(www\.\S*\.\S*|https?:\/\/\S*\.\S*(\.\S*)?)\b\/?/im;

@Component({
  selector: 'z-note-detail-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZNoteDetailEditComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(BsModalComponent) modal: BsModalComponent;
  @ViewChild('modalEditName') modalEditName: ZNoteSharedModalEditNameComponent;

  note: Note = new Note();
  currentTab: any = 'note';
  hasShowComment = false;
  orderDesc = false;
  hasSortBy = false;
  noteChanged = false;
  customEditor: any;
  readonly tooltip: any = Constants.tooltip;

  showFormatGroupMobile = false;

  readonly subPage = noteConstants.PAGE_NOTE_EDIT;

  buttonControl = '';

  form: FormGroup;
  name: AbstractControl;
  content: AbstractControl;
  tags: AbstractControl;
  attachments: AbstractControl;
  files: Array<any> = new Array<any>();

  private closeSubject: Subject<any> = new Subject<any>();
  private noSaveSubject: Subject<any> = new Subject<any>();
  private destroySubject: Subject<any> = new Subject<any>();
  private editMode = Constants.modal.add;
  private parentId: string;
  private noSave$: Observable<any>;
  private defaultImg = Constants.img.default;
  private editorElement: any;
  private copiedFormat: any = {};
  private isCopied: boolean;
  private timeInterval: any;
  private EXCLUDE_FORMATS: string[] = ['link'];
  resize: any;
  context$: any;

  private uploadSubscriptions: { [filename: string]: Subscription } = {};

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private noteService: ZNoteService,
    protected router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
    private apiBaseService: ApiBaseService,
    private clientDetectorService: ClientDetectorService,
    private photoService: PhotoService,
    private photoUploadService: PhotoUploadService,
    private mediaSelectionService: WMediaSelectionService,
    private fileUploaderService: FileUploaderService,
    private commonEventService: CommonEventService
  ) {
    this.renderer.addClass(document.body, 'modal-open');
    this.noSave$ = merge(
      this.noSaveSubject.asObservable(),
      this.destroySubject,
      this.closeSubject
    );

    const getOs: any = this.clientDetectorService.getOs();
    this.buttonControl = getOs.name === 7 ? '⌘' : 'ctrl';
  }

  ngOnInit() {
    this.assignFormValue(null);
    this.context$ = this.store.select('context');
    this.commonEventService
      .filter((e: any) => e.channel === 'noteActionsBar')
      .pipe(takeUntil(this.destroySubject))
      .subscribe((e: any) => {
        switch (e.action) {
          case 'note:note_edit:close':
            this.router.navigate([{ outlets: { detail: null } }], {
              queryParamsHandling: 'preserve' , preserveFragment: true
            });
            break;
          case 'note:note_edit:print':
            this.print();
            break;
        }
      });
  }

  ngAfterViewInit() {
    // Merge with get current folder - this.store.select(fromRoot.getCurrentFolder)
    this.route.paramMap
      .pipe(
        combineLatest(this.context$),
        switchMap(([paramMap, ctx]: any) => {
          const noteId = paramMap.get('id');
          this.editMode = noteId ? Constants.modal.edit : Constants.modal.add;
          if (!!noteId) {
            if (ctx.page === noteConstants.PAGE_TRASH) {
              return this.noteService.get(noteId).pipe(map(res => res.data));
            } else {
              return this.noteService
                .getNoteAvailable(noteId)
                .pipe(map(res => res.data));
            }
          } else {
            return of(new Note());
          }
        }),
        combineLatest(this.store.select(fromRoot.getCurrentFolder)),
        takeUntil(this.destroySubject)
      )
      .subscribe(
        ([noteContent, currentFolder]: any) => {
          this.note = noteContent;
          this.store.dispatch(new note.NoteUpdated(this.note));
          this.initQuill();
          if (currentFolder) this.parentId = currentFolder.id;
          this.updateFormValue(this.note);
          // Reset content of elemenet div.ql-editor to prevent HTML data loss
          document.querySelector('.ql-editor').innerHTML = this.note.content;
          if (this.note.permission !== 'view') this.registerAutoSave();
        },
        (error: any) => {
          this.onModalClose({ queryParams: { error: 'file_does_not_exist' } });
        }
      );

    $('body').on(
      'dblclick',
      '.ql-editor img',
      this.doubleClickImage.bind(this)
    );
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
    merge(
      this.form.valueChanges,
      fromEvent(this.customEditor, 'text-change')
    )
      .pipe(
        takeUntil(merge(this.noSave$, this.closeSubject)),
        debounceTime(DEBOUNCE_MS),
        takeUntil(merge(this.noSave$, this.closeSubject))
      )
      .subscribe(() => {
        this.noteChanged = true;
        if (this.editMode === Constants.modal.add && !this.note.id) {
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

    const bindings = {
      custom_enter: {
        key: 'Enter',
        shiftKey: null,
        prefix: LINK_PATTERN,
        handler: (range, ctx) => {
          this.addHyperLink(range, ctx);
          return true;
        }
      }
    };

    const Font = Quill.import('formats/font');
    Font.whitelist = [
      'gotham',
      'georgia',
      'helvetica',
      'courier-new',
      'times-new-roman',
      'trebuchet',
      'verdana'
    ];

    const Size = Quill.import('attributors/style/size');
    Size.whitelist = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
    // Size.whitelist = ['8px', '10px', '12px', '14px', '18px', '24px', '36px'];

    const BlockEmbed = Quill.import('blots/block/embed');

    class DividerBlot extends BlockEmbed {
    }

    DividerBlot.blotName = 'divider';
    DividerBlot.tagName = 'hr';

    Quill.register(Font, true);
    Quill.register(Size, true);
    Quill.register(DividerBlot);
    this.extendClipboard(this);
    Quill.register('modules/counter', Counter, true);
    Quill.register('modules/customImage', CustomImage, true);

    const modules: any = {
      modules: {
        toolbar: '#quill-toolbar',
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
            cursor: 'default'
          }
        }
      },
      placeholder: 'Say something ...',
      readOnly: false,
      theme: 'snow',
      scrollingContainer: '#scrolling-container'
    };

    if (this.note.permission === 'view') {
      modules.modules.imageResize = null;
      modules.placeholder = '';
    }
    this.customEditor = new Quill('#quill-editor', modules);
    if (this.note.permission === 'view') this.customEditor.disable();
    if (!this.note.permission || this.note.permission !== 'view')
      $('#quill-toolbar').show();

    this.editorElement = document.querySelector('div.ql-editor');

    $('.ql-editor').attr('tabindex', 1);

    Quill.register(IconBlot);
    this.registerImageBlot();
    this.customizeKeyboardBindings();

    this.listenImageChanges();
    this.registerSelectionChange();
  }

  onSort(name: any) {
    // console.log('name:', name, this.note.attachments);
    this.note.attachments = this.orderDesc
      ? _.sortBy(this.note.attachments, [name])
      : _.sortBy(this.note.attachments, [name]).reverse();
    this.orderDesc = !this.orderDesc;
    this.hasSortBy = true;
  }

  extendClipboard(self: any) {
    const Clipboard = Quill.import('modules/clipboard');

    class PlainClipboard extends Clipboard {
      onPaste(e: any) {
        try {
          // super.onPaste(e);
          // fix flash screen while paste into editor
          this.container.style.position = 'fixed';
          this.container.style.zIndex = '-1';

          const dataClipboard1 = e.clipboardData.types;
          let fileClipboard: any;
          if (dataClipboard1[0].match('Files')) {
            if (e.clipboardData.items[0].type.match('image/*')) {
              fileClipboard = e.clipboardData.items[0].getAsFile();
            }
          }

          if (e.defaultPrevented || !this.quill.isEnabled()) return;
          const range = this.quill.getSelection();
          let delta = new Delta().retain(range.index);
          const scrollTop = this.quill.scrollingContainer.scrollTop;
          this.container.focus();
          this.quill.selection.update(Quill.sources.SILENT);
          setTimeout(() => {
            if (dataClipboard1[0].match('text/*')) {
              delta = delta.concat(this.convert()).delete(range.length);
              this.quill.updateContents(delta, Quill.sources.USER);
              this.quill.setSelection(
                delta.length() - range.length,
                Quill.sources.SILENT
              );
              this.quill.scrollingContainer.scrollTop = scrollTop;
              this.quill.focus();
            } else {
              if (fileClipboard && fileClipboard.type.match('image/*')) {
                const ids = [];
                let randId = `img_${new Date().getTime()}`;
                self.insertFakeImage(randId);
                ids.push(randId);
                // let file = e.target['result'];
                const files = [fileClipboard];
                self.photoUploadService
                  .uploadPhotos(files)
                  .subscribe((res: any) => {
                    randId = ids.shift();
                    $(`i#${randId}`).after(
                      `<img src="${res.data.url}" data-id="${res.data.id}" />`
                    );
                    $(`i#${randId}`).remove();
                  });
                fileClipboard.value = '';
                this.quill.focus();
              }
            }
          }, 1);
        } catch (err) {
          console.error('A wild bug appear. Watch out!! ', err);
        }
      }
    }

    Quill.register('modules/clipboard', PlainClipboard, true);
  }

  customizeKeyboardBindings() {
    // Remove default binding for spacebar key
    delete this.customEditor.keyboard.bindings[32];

    // Auto detect hyperlink context when typing
    this.customEditor.keyboard.addBinding({
      key: ' ',
      collapsed: true,
      prefix: LINK_PATTERN,
      handler: (range, ctx) => {
        this.addHyperLink(range, ctx);
      }
    });
  }

  addHyperLink(range, ctx) {
    const [line, offset] = this.customEditor.getLine(range.index);
    const link = ctx.prefix.split(' ').pop();
    const fullUrl = link.includes('http') ? link : `https://${link}`;

    this.customEditor.updateContents(
      new Delta()
        .retain(range.index - link.length)
        .delete(link.length)
        .insert(link, { link: fullUrl })
        .insert(' ')
    );
    this.customEditor.history.cutoff();
    this.customEditor.setSelection(range.index + 1, Quill.sources.SILENT);
  }

  onToEditor(e: any) {
    if (e.keyCode === 13) {
      // enter
      $('.ql-editor').focus();
    }
  }

  registerImageBlot() {
    Quill.register(ImageBlot);
    const toolbar = this.customEditor.getModule('toolbar');
    toolbar.addHandler('image', () => this.selectInlinePhotos4Note());
  }

  insertFakeImage(id: any) {
    const range = this.customEditor.getSelection(true);
    this.customEditor.insertText(range.index, '\n', Quill.sources.USER);
    this.customEditor.insertEmbed(
      range.index + 1,
      'i',
      {
        class: 'fa fa-spinner fa-spin big-icon',
        id: id
      },
      Quill.sources.USER
    );
    this.customEditor.setSelection(range.index + 2, Quill.sources.SILENT);
  }

  // id: placeholder when fake images
  // data-id: real WTH photo id for editing
  insertInlineImage(id: any, url = this.defaultImg, dataId = null) {
    const range = this.customEditor.getSelection(true);
    this.customEditor.insertText(range.index, '\n', Quill.sources.USER);
    this.customEditor.insertEmbed(
      range.index + 1,
      'image',
      {
        alt: 'WTH! No Image',
        url: url,
        id: id,
        'data-id': dataId
      },
      Quill.sources.USER
    );
    this.customEditor.setSelection(range.index + 2, Quill.sources.SILENT);
  }

  selectInlinePhotos4Note() {
    this.mediaSelectionService.open();
    this.mediaSelectionService.setMultipleSelection(true);

    const close$: Observable<any> = merge(
      this.mediaSelectionService.open$,
      componentDestroyed(this)
    );
    this.mediaSelectionService.selectedMedias$
      .pipe(takeUntil(close$), filter((items: any[]) => items.length > 0))
      .subscribe(photos => {
        photos.forEach((photo: any) =>
          this.insertInlineImage(null, photo.url, photo.id)
        );
      });

    const ids: string[] = [];
    this.mediaSelectionService.uploadingMedias$
      .pipe(
        takeUntil(close$),
        map(([file, dataUrl]) => [file]),
        mergeMap((files: any[]) => {
          const randId = `img_${new Date().getTime()}`;
          this.insertFakeImage(randId);
          ids.push(randId);
          return this.photoUploadService.uploadPhotos(files);
        })
      )
      .subscribe((res: any) => {
        const randId = ids.shift();
        $(`i#${randId}`).after(
          `<img src="${res.data.url}" data-id="${res.data.id}" />`
        );
        $(`i#${randId}`).remove();
      });
  }

  copyFormat() {
    const formats = this.customEditor.getFormat(
      this.customEditor.selection.savedRange.index,
      this.customEditor.selection.savedRange.length
    );
    this.EXCLUDE_FORMATS.forEach(f => {
      delete formats[f];
    });
    this.copiedFormat = formats;
    this.isCopied = true;
  }

  listenImageChanges() {
    this.photoService.modifiedPhotos$
      .pipe(takeUntil(this.destroySubject.asObservable()))
      .subscribe((object: any) => {
        switch (object.action) {
          case 'update':
            const updatedPhoto = object.payload.photo;
            $(`img[data-id=${updatedPhoto.id}]`).attr('src', updatedPhoto.url);
            break;
          case 'delete':
            const photoId = object.payload.photo.id;
            $(`img[data-id=${photoId}]`).remove();
            break;
          default:
            console.warn(
              'unhandle event in photoService modifiedPhotos$: ',
              object
            );
        }

        this.updateNote();
      });
  }

  registerSelectionChange() {
    this.customEditor.on('selection-change', (range, oldRange, source) => {
      if (this.isCopied && range) {
        let sIndex, sLength;
        if (range.length === 0) {
          const prefix = this.customEditor
            .getText(0, range.index)
            .split(/\W/)
            .pop();
          const suffix = this.customEditor
            .getText(range.index)
            .split(/\W/)
            .shift();
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
    const photoId = event.target.dataset.id;
    if (photoId && photoId !== 'null') {
      this.router.navigate(
        [
          {
            outlets: {
              modal: [
                'photos',
                photoId,
                {
                  module: 'note',
                  ids: [photoId]
                }
              ]
            }
          }
        ],
        { queryParamsHandling: 'preserve', preserveFragment: true }
      );
    } else {
      console.warn('no photo id for this image: ', event.srcElement);
    }
  }

  open(
    options: any = {
      mode: Constants.modal.add,
      note: undefined,
      parent_id: undefined
    }
  ) {
    this.assignFormValue(this.note);
    this.parentId = _.get(options, 'parent_id');
    this.modal.open();
    this.noSaveSubject.next('');
    this.editMode = options.mode;

    this.updateCurrentNote();
  }

  updateCurrentNote(): void {
    this.store
      .select(fromRoot.getCurrentNote)
      .pipe(takeUntil(merge(this.closeSubject, this.destroySubject)))
      .subscribe((note: Note) => {
        if (note !== undefined) {
          this.updateFormValue(note);
        }
      });
  }

  assignFormValue(data?: Note) {
    this.form = this.fb.group({
      name: [_.get(data, 'name', '')],
      // 'content': [_.get(data, 'content', ''), Validators.compose([Validators.required])],
      tags: [_.get(data, 'tags', [])],
      attachments: [_.get(data, 'attachments', [])]
    });

    this.name = this.form.controls['name'];
    // this.content = this.form.get('content');
    this.tags = this.form.controls['tags'];
    this.attachments = this.form.controls['attachments'];
    this.note = Object.assign({}, new Note(), data);
  }

  updateFormValue(data: Note) {
    this.form.controls['name'].setValue(_.get(data, 'name', ''));
    this.form.controls['tags'].setValue(_.get(data, 'tags', []));
    this.form.controls['attachments'].setValue(_.get(data, 'attachments', []));

    this.name = this.form.controls['name'];
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
    const range = this.customEditor.getSelection(true);
    const offset = 0;
    // this.customEditor.insertText(range.index, '\n', Quill.sources.USER);
    this.customEditor.insertEmbed(
      range.index + offset,
      'divider',
      true,
      Quill.sources.USER
    );
    this.customEditor.setSelection(
      range.index + offset + 1,
      Quill.sources.SILENT
    );
  }

  /*
   * Ignore if the file is uploading
   * Delete if the file was uploaded
   * */
  cancelUpload(file: any) {
    this.note.attachments = _.pull(this.note.attachments, file);
    this.form.controls['attachments'].setValue(this.note.attachments);

    if (file.name && this.uploadSubscriptions[file.name]) {
      this.uploadSubscriptions[file.name].unsubscribe();
      delete this.uploadSubscriptions[file.name];
    }
  }

  selectFiles(event: any) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }
    const filesAddedPolicy = FileUploadPolicy.allowMultiple(files, [new BlackListPolicy(), new SizePolicy(35, {only: /video\//g})]);
    this.note.attachments = [
      ...this.note.attachments,
      ...filesAddedPolicy.filter(file => file.allow === true)
    ];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const sub = this.fileUploaderService
        .uploadGenericFile(f)
        .subscribe((response: any) => {
          if (!response.error) {
            this.note.attachments = this.note.attachments.map(att => {
              if (att.name === response.data.full_name && !att.uuid)
                return response.data;
              return att;
            });
            this.form.controls['attachments'].setValue(this.note.attachments);
          }
        });

      this.uploadSubscriptions[f.name] = sub;
    }
    const filesNotAllow = filesAddedPolicy.filter(file => file.allow === false);
    if (filesNotAllow.length > 0)
      this.commonEventService.broadcast({
        channel: 'LockMessage',
        payload: filesNotAllow
      });
  }

  selectPhotos() {
    // this.photoSelectDataService.open({return: true});
    this.mediaSelectionService.open({ allowSelectMultiple: true });

    this.selectPhotos4Attachments();
  }

  onSubmit(value: any) {
    if (
      value.name.length > 0 ||
      value.tags.length > 0 ||
      value.attachments.length > 0 ||
      (this.editorElement.innerHTML.length > 0 &&
        this.editorElement.innerHTML !== '<p><br></p>')
    ) {
      if (this.editMode === Constants.modal.add) {
        if (this.note.permission !== 'view') {
          this.store.dispatch(
            new note.Add({
              ...value,
              parent_id: this.parentId,
              content: this.editorElement.innerHTML
            })
          );
        }
      } else {
        if (this.note.permission !== 'view') {
          this.store.dispatch(
            new note.Update({
              ...value,
              id: this.note.id,
              content: this.editorElement.innerHTML
            })
          );
        }
      }
    }
    this.onModalClose();
  }

  onModalClose(options = null) {
    const qOptions = options
      ? { ...options, queryParamsHandling: 'merge' }
      : { queryParamsHandling: 'merge' };
    this.router.navigate([{ outlets: { detail: null } }], qOptions);
    this.closeSubject.next('');
    this.renderer.removeClass(document.body, 'modal-open');
  }

  /**
   * Save post and change to EDIT mode
   */
  onFirstSave() {
    if (this.editMode === Constants.modal.add) {
      this.noteService
        .create({
          ...this.form.value,
          content: this.editorElement.innerHTML,
          parent_id: this.parentId
        })
        .toPromise()
        .then((res: any) => {
          this.note = res.data;
          this.editMode = Constants.modal.edit;
          this.store.dispatch(new note.MultiNotesAdded([res['data']]));
          return this.router.navigate([
            { outlets: { detail: ['notes', this.note.id] } }
          ]);
        });
    }
  }

  download(file: any) {
    this.apiBaseService
      .download('common/files/download', {
        id: file.id,
        object_type: file.object_type
      })
      .subscribe((res: any) => {
        const blob = new Blob([res], { type: file.content_type });
        saveAs(blob, `${file.name}.${file.extension}`);
      });
  }

  fileAttachmentClick(file: any) {
    if (file.object_type === 'photo') {
      $('#modal-note-edit').css('z-index', '0');
      $('.modal-backdrop').css('z-index', '0');
      this.router.navigate([
        { outlets: { modal: ['photos', file.id, { ids: [file.id] }] } }
      ]);
    }
  }

  print() {
    const editor: any = document.querySelector('div.ql-editor');

    if (!document.querySelector('.printable')) {
      $('body').after(
        '<div class="printable ql-container ql-snow"><div class="ql-editor"></div><div/>'
      );
    }
    document.querySelector('.printable > .ql-editor').innerHTML =
      editor.innerHTML;
    const printable: any = document.querySelector('.printable > .ql-editor');
    printable.innerHTML = editor.innerHTML;
    window.print();
  }

  downloadAttachments() {
    if (this.note.attachments) {
      for (const att of this.note.attachments) {
        this.download(att);
      }
    }
  }

  onSaveName(event: any) {
    this.note.name = event;
    this.form.controls['name'].setValue(event);
  }

  private selectPhotos4Attachments() {
    this.mediaSelectionService.open({ allowSelectMultiple: true });

    let close$: Observable<any> = merge(
      this.mediaSelectionService.open$,
      componentDestroyed(this)
    );
    this.mediaSelectionService.selectedMedias$
      .pipe(takeUntil(close$), filter((items: any[]) => items.length > 0))
      .subscribe(photos => {
        this.note.attachments.push(...photos);
        this.form.controls['attachments'].setValue(this.note.attachments);
      });

    this.mediaSelectionService.uploadingMedias$
      .pipe(takeUntil(close$), map(([file, dataUrl]) => [file]))
      .subscribe((files: any) => {
        this.note.attachments.push(...files);
        _.forEach(files, (file: any) => {
          const sub = this.photoUploadService.uploadPhotos(files).subscribe(
            (response: any) => {
              const index = _.indexOf(this.note.attachments, file);
              this.note.attachments[index] = response.data;
              this.form.controls['attachments'].setValue(this.note.attachments);
            },
            (err: any) => {
              console.log('Error when uploading files ', err);
            }
          );

          this.uploadSubscriptions[file.name] = sub;
        });
      });
  }

  private updateNote() {
    if (!this.note.id) return;
    const noteObj: any = Object.assign({}, this.note, this.form.value, {
      content: this.editorElement.innerHTML
    });
    this.store.dispatch(new note.Update(noteObj));
  }
}

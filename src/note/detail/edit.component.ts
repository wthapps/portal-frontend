import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { fromEvent, interval, merge, Observable, of, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  skip,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
import { Note } from '@shared/shared/models/note.model';
import { Constants } from '@shared/constant/config/constants';
import { PhotoUploadService } from '@shared/services/photo-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBaseService } from '@shared/services/apibase.service';
import { ClientDetectorService } from '@shared/services/client-detector.service';
import { PhotoService } from '@shared/services/photo.service';
// import * as Delta from 'quill-delta/lib/delta';
import Delta, { AttributeMap } from 'quill-delta';
import Parchment from 'parchment';
import DeltaOp from 'quill-delta/lib/op';
import { CommonEventService, UserService } from '@wth/shared/services';
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
import { NoteChannelService } from '@shared/channels/note-channel.service';
import { User } from '@shared/shared/models/user.model';
import { MessageService } from 'primeng/api';
import { WUploader } from './../../shared/services/w-uploader';
import { NoteSetting, ZNoteSharedSettingsService } from '@notes/shared/services/settings.service';

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
  readonly EDIT_STATUS = {
    idle: 1,
    editing: 2,
    saved: 3,
    reloading: 4
  };

  readonly FONTS = noteConstants.FONTS;
  readonly FONT_SIZES = noteConstants.FONT_SIZES;
  readonly HEADINGS = noteConstants.HEADINGS;

  showFormatGroupMobile = false;

  readonly subPage = noteConstants.PAGE_NOTE_EDIT;

  buttonControl = '';

  form: FormGroup;
  name: AbstractControl;
  content: AbstractControl;
  tags: AbstractControl;
  attachments: AbstractControl;
  files: Array<any> = new Array<any>();
  editStatus = this.EDIT_STATUS.idle;
  visibleTab: 'comment' | 'attachment' | undefined = undefined;
  disabled = false;
  noSave = false;

  private closeSubject: Subject<any> = new Subject<any>();
  private noSaveSubject: Subject<any> = new Subject<any>();
  private destroySubject: Subject<any> = new Subject<any>();
  private editMode = Constants.modal.add;
  private parentId: string;
  private defaultImg = Constants.img.default;
  private editorElement: any;
  private copiedFormat: any = {};
  private isCopied: boolean;
  private timeInterval: any;
  private EXCLUDE_FORMATS: string[] = ['link'];
  private timeout;
  private initRetry = 0; // number of times this component will try to init Quill editor, default max tries is 3
  resize: any;
  context$: any;
  // profile$: Observable<User>;
  profile: User;
  setting$: Observable<NoteSetting>;
  setting: NoteSetting;

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
    private noteChannel: NoteChannelService,
    private messageService: MessageService,
    public noteSetting: ZNoteSharedSettingsService,
    public userService: UserService,
    private uploader: WUploader,
    private commonEventService: CommonEventService
  ) {
    this.renderer.addClass(document.body, 'modal-open');
    this.profile = this.userService.getSyncProfile();
    // this.setting$ = this.setting$;
    this.noteSetting.setting$.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(setting => this.setting = setting)
    ;

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
              queryParamsHandling: 'preserve', preserveFragment: true
            });
            break;
          case 'note:note_edit:print':
            this.print();
            break;
        }
      });

    // Lock note if other user are editing ..
    this.noteChannel.lock$.pipe(
      filter(val => !!val),
      distinctUntilChanged((p, q) => p.user_uuid === q.user_uuid),
      takeUntil(this.destroySubject)
    ).subscribe((user) => {
      this.messageService.clear();
      if (!user || Object.keys(user).length === 0) {
        if (this.note.permission !== 'view') {
          this.enable();
          this.customEditor.focus();
        }
        return;
      }
      const { user_uuid, user_name } = user;
      if (user_uuid !== this.userService.getSyncProfile().uuid) {
        this.enable(false);
      }

      if (user_name) {
        this.messageService.add({
          severity: 'warn',
          detail: `<i class="fa fa-lock mr5" aria-hidden="true"></i><strong>${user_name}</strong> is editing`,
          life: 60000,
          closable: false,
          sticky: true
        });
      }
    });

    // Reload note if this note's content is updated by another user
    this.noteChannel.reload$.pipe(
      tap(() => this.editStatus = this.EDIT_STATUS.reloading),
      switchMap(() =>
        this.noteService.getNoteAvailable(this.route.snapshot.paramMap.get('id'))),
      takeUntil(this.destroySubject)
    ).subscribe(res => {
      const noteContent = res.data;
      this.note = noteContent;
      this.store.dispatch(new note.NoteUpdated(this.note));

      this.noSave = true;
      this.updateFormValue(this.note);
      // Reset content of elemenet div.ql-editor to prevent HTML data loss
      if (document.querySelector('.ql-editor')) {
        document.querySelector('.ql-editor').innerHTML = this.note.content;
      }
      _.delay(() => this.editStatus = this.EDIT_STATUS.saved, 400);
    });
  }

  handleActionEvents(event) {
    const { action } = event;

    switch (action) {
      case 'showComments': {
        this.visibleTab = (this.visibleTab === 'comment') ? undefined : 'comment';
        break;
      }
      case 'openAttactments': {
        this.visibleTab = (this.visibleTab === 'attachment') ? undefined : 'attachment';
        break;
      }
      default: {

      }
    }
  }

  ngAfterViewInit() {
    // Merge with get current folder - this.store.select(fromRoot.getCurrentFolder)
    this.route.paramMap
      .pipe(
        withLatestFrom(this.context$),
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
        withLatestFrom(this.store.select(fromRoot.getCurrentFolder)),
        takeUntil(this.destroySubject)
      )
      .subscribe(
        ([noteContent, currentFolder]: any) => {
          if (!noteContent) {
            return;
          }

          // Subscribe user to this note channel
          this.noteChannel.subscribe(noteContent.uuid || this.note.uuid);

          this.note = noteContent;
          this.store.dispatch(new note.NoteUpdated(this.note));
          try {
            this.initQuill();
          } catch (e) {
            if (this.initRetry < 3) {
              this.initQuill();
              this.initRetry++;
            }
            console.warn('exception: ', e);
          }
          if (currentFolder) {
            this.parentId = currentFolder.id;
          }
          this.updateFormValue(this.note);
          // Reset content of elemenet div.ql-editor to prevent HTML data loss
          if (document.querySelector('.ql-editor')) {
            document.querySelector('.ql-editor').innerHTML = this.note.content;
          }

          this.broadcastViewing();
          if (this.note.permission !== 'view') {
            this.registerAutoSave();
          }
        },
        (error: any) => {
          if (error.status === 403) {
            this.onModalClose({ queryParams: { error: 'file_does_not_exist' } });
          }
        }
      );

    $('body').on(
      'dblclick',
      '.ql-editor img',
      this.doubleClickImage.bind(this)
    );
  }

  ngOnDestroy() {
    // Clear lock modal
    this.noteChannel.idle(this.note.uuid);
    this.messageService.clear();

    this.closeSubject.next('');
    this.closeSubject.unsubscribe();
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();


    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }

    // Unsubscribe user from this note channel
    this.noteChannel.unsubscribe(this.note.uuid);
  }

  broadcastViewing() {
    merge(
      // this.form.valueChanges,
      // fromEvent(this.customEditor, 'text-change')
      interval(1000)
    ).pipe(
      // skip(1),
      takeUntil(this.closeSubject)
    ).subscribe(() => {
      if (this.editStatus !== this.EDIT_STATUS.reloading && !this.disabled && this.note.permission !== 'view') {
        this.viewing();
      }
    });
  }

  registerAutoSave() {
    // Auto save
    merge(
      this.form.valueChanges,
      fromEvent(this.customEditor, 'text-change')
    )
      .pipe(
        skip(1),
        tap(() => {
          this.editStatus = this.EDIT_STATUS.editing;
        }),
        debounceTime(DEBOUNCE_MS),
        takeUntil(this.closeSubject)
      )
      .subscribe(() => {
        this.noteChanged = true;
        if (this.editMode === Constants.modal.add && !this.note.id) {
          this.onFirstSave();
        } else {
          if (!this.noSave) {
            this.updateNote();
          }
        }
        _.delay(() => this.noSave = false, 400);
        this.editStatus = this.EDIT_STATUS.saved;
      });
  }

  viewing() {
    if (!this.noteChannel) {
      return;
    }
    this.noteChannel.editing(this.note.uuid);
    this.checkIdle();
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
      },
      tab: {
        key: 'Tab',
        handler(range, context) {
          if (context.format.table) { return true; }
          this.quill.history.cutoff();
          const delta = new Delta()
            .retain(range.index)
            .delete(range.length)
            .insert('\t', context.format);
          this.quill.updateContents(delta, Quill.sources.USER);
          this.quill.history.cutoff();
          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          return false;
        },
      },
      'checklist enter': {
        key: 'Enter',
        collapsed: true,
        format: { list: 'checked' },
        handler(range, ctx) {
          const [line, offset] = this.quill.getLine(range.index);
          console.log('inside checklist enter', range, ctx, line, offset);
          // const formats = extend({}, line.formats(), { list: 'checked' });
          const formats = {...line.formats(), ...ctx.format, list: 'checked'};
          const delta = new Delta()
            .retain(range.index)
            .insert('\n', formats)
            .retain(line.length() - offset - 1)
            .retain(1, { list: 'unchecked' });
          this.quill.updateContents(delta, Quill.sources.USER);
          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          this.quill.scrollIntoView();
        },
      },
      'header enter': {
        key: 'Enter',
        collapsed: true,
        format: ['header'],
        suffix: /^$/,
        handler(range, context) {
          const [line, offset] = this.quill.getLine(range.index);
          const delta = new Delta()
            .retain(range.index)
            .insert('\n', context.format)
            .retain(line.length() - offset - 1)
            .retain(1, { header: null });
          this.quill.updateContents(delta, Quill.sources.USER);
          this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          this.quill.scrollIntoView();
        },
      },
      'list autofill': {
        key: ' ',
        shiftKey: null,
        collapsed: true,
        format: {
          list: false,
          'code-block': false,
          blockquote: false,
          header: false,
          table: false,
        },
        prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
        handler(range, context) {
          if (this.quill.scroll.query('list') == null) { return true; }
          const { length } = context.prefix;
          const [line, offset] = this.quill.getLine(range.index);
          if (offset > length) { return true; }
          let value;
          switch (context.prefix.trim()) {
            case '[]':
            case '[ ]':
              value = 'unchecked';
              break;
            case '[x]':
              value = 'checked';
              break;
            case '-':
            case '*':
              value = 'bullet';
              break;
            default:
              value = 'ordered';
          }
          this.quill.insertText(range.index, ' ', context.format, Quill.sources.USER);
          this.quill.history.cutoff();
          const delta = new Delta()
            .retain(range.index - offset)
            .delete(length + 1)
            .retain(line.length() - 2 - offset)
            .retain(1, { list: value });
          this.quill.updateContents(delta, Quill.sources.USER);
          this.quill.history.cutoff();
          this.quill.setSelection(range.index - length, Quill.sources.SILENT);
          return false;
        },
      },
      custom_backspace: {
        key: 8,
        collapsed: true,
        altKey: null, ctrlKey: null, metaKey: null, shiftKey: null,
        // prefix: /^.?$/,
        handler: (range, ctx) => {
          this.handleBackspace(range, ctx);
          return;
        }
      }, custom_backspace_range: {
        key: 8,
        collapsed: false,
        altKey: null, ctrlKey: null, metaKey: null, shiftKey: null,
        prefix: /^.?$/,
        handler: (range) => {
          this.handleDeleteRange(range);
          return;
        }
      }, custom_delete: {
        key: 46,
        collapsed: true,
        altKey: null, ctrlKey: null, metaKey: null, shiftKey: null,
        // suffix: /^.?$/,
        handler: (range, ctx) => {
          this.handleDelete(range, ctx);
          return;
        }
      }, custom_delete_range: {
        key: 46,
        collapsed: false,
        altKey: null, ctrlKey: null, metaKey: null, shiftKey: null,
        suffix: /^.?$/,
        handler: (range) => {
          this.handleDeleteRange(range);
          return;
        }
      }
    };
    const FontAttributor = Quill.import('attributors/class/font');
    FontAttributor.whitelist = [
      'georgia',
      'helvetica',
      'lato',
      'couriernew',
      'timesnewroman',
      'trebuchet',
      'verdana'
    ];

    const Size = Quill.import('attributors/style/size');
    Size.whitelist = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];

    const BlockEmbed = Quill.import('blots/block/embed');

    class DividerBlot extends BlockEmbed {
    }

    DividerBlot.blotName = 'divider';
    DividerBlot.tagName = 'hr';

    Quill.register(FontAttributor, true);
    Quill.register(Size, true);
    Quill.register(DividerBlot);
    this.extendClipboard(this);
    // this.extendKeyboard(this);
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
    if (this.note.permission === 'view') {
      this.enable(false);
    } else {
      this.enable(true);
    }

    this.editorElement = document.querySelector('div.ql-editor');

    $('.ql-editor').attr('tabindex', 1);

    Quill.register(IconBlot);
    this.registerImageBlot();
    this.customizeKeyboardBindings();

    this.listenImageChanges();
    this.registerSelectionChange();
    //  Format quill based on default setting
    setTimeout(() => this.applyDefaultFormat(), 500);

    // Temporarily hide select components when finish initilize component
    setTimeout(() => $('.vh').removeClass('vh'), 1000);
  }

  enable(enabled = true) {
    if (enabled) {
      this.customEditor.enable();
      $('#quill-toolbar').show();
    } else {
      this.customEditor.disable();
      $('#quill-toolbar').hide();
    }
    this.disabled = !enabled;
  }


  applyDefaultFormat() {
    // Default font, size setting
    const { font, font_size } = this.setting;

    const range = this.customEditor.getSelection(true);
    if (this.customEditor.getLength() <= 1) {
      console.log('this editor is blank', this.customEditor);
      this.customEditor.format('font', font);
      this.customEditor.format('size', font_size);
    } else {
      this.customEditor.setSelection(range, Quill.sources.SILENT);
    }

    this.noSaveSubject.next('');
  }

  onSort(name: any) {
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

          if (e.defaultPrevented || !this.quill.isEnabled()) {
            return;
          }
          const range = this.quill.getSelection();
          const { font, size} = this.quill.getFormat();
          // Filter font, size property only
          const copyFormat = {};
          copyFormat['font'] = font || self.setting.font;
          copyFormat['size'] = size || self.setting.font_size;


          let delta = new Delta().retain(range.index);
          const scrollTop = this.quill.scrollingContainer.scrollTop;
          this.container.focus();
          this.quill.selection.update(Quill.sources.SILENT);
          setTimeout(() => {
            if (dataClipboard1[0].match('text/*')) {
              const conv = this.convert();
              const ops = conv.ops.map( o => {
                const attributes = {...o.attributes, ...copyFormat};
                return {...o, attributes};
              });
              if (Object.keys(copyFormat).length > 0) {
                delta = delta.concat({...conv, ops}).delete(range.length);
              } else {
                delta = delta.concat(conv).delete(range.length);
              }
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

  handleDelete(range, context) {
    const quill = this.customEditor;
    // Check for astral symbols
    const length = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
    if (range.index >= quill.getLength() - length) { return; }
    let formats = {}, nextLength = 0;
    const [line, ] = quill.getLine(range.index);
    if (context.offset >= line.length() - 1) {
      const [next, ] = quill.getLine(range.index + 1);
      if (next) {
        const curFormats = line.formats();
        const nextFormats = quill.getFormat(range.index, 1);
        formats = DeltaOp.attributes.diff(curFormats, nextFormats) || {};
        nextLength = next.length();
      }
    }
    quill.deleteText(range.index, length, Quill.sources.USER);
    if (Object.keys(formats).length > 0) {
      quill.formatLine(range.index + nextLength - 1, length, formats, Quill.sources.USER);
    }

    this.addDefaultFormat();
  }

  handleBackspace(range, context) {
    const quill = this.customEditor;
    if (range.index === 0 || quill.getLength() <= 1) { return; }
    const [line, ] = quill.getLine(range.index);
    let formats = {};
    if (context.offset === 0) {
      const [prev, ] = quill.getLine(range.index - 1);
      if (prev != null && prev.length() > 1) {
        const curFormats = line.formats();
        const prevFormats = quill.getFormat(range.index - 1, 1);
        formats = DeltaOp.attributes.diff(curFormats, prevFormats) || {};
      }
    }
    // Check for astral symbols
    const length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
    quill.deleteText(range.index - length, length, Quill.sources.USER);
    if (Object.keys(formats).length > 0) {
      quill.formatLine(range.index - length, length, formats, Quill.sources.USER);
    }
    quill.focus();

    this.addDefaultFormat();
  }

  handleDeleteRange(range) {
    const quill = this.customEditor;
    const lines = quill.getLines(range);
    let formats = {};
    if (lines.length > 1) {
      const firstFormats = lines[0].formats();
      const lastFormats = lines[lines.length - 1].formats();
      formats = DeltaOp.attributes.diff(lastFormats, firstFormats) || {};
    }
    quill.deleteText(range, Quill.sources.USER);
    if (Object.keys(formats).length > 0) {
      quill.formatLine(range.index, 1, formats, Quill.sources.USER);
    }
    quill.setSelection(range.index, Quill.sources.SILENT);
    quill.focus();

    this.addDefaultFormat();
  }

  addDefaultFormat() {
    // Appy default font, size format after deleting texts
    const { font, font_size } = this.setting;
    const format = this.customEditor.getFormat();
    if (!format.font) {
      this.customEditor.format('font', font);
    }
    if (!format.size) {
      this.customEditor.format('size', font_size);
    }

    console.log('Current format: ', format);
  }

  addHyperLink(range, ctx) {
    const [line, offset] = this.customEditor.getLine(range.index);
    const link = ctx.prefix.split(' ').pop();
    const fullUrl = link.includes('http') ? link : `https://${link}`;

    this.customEditor.updateContents(
      new Delta()
        .retain(range.index - link.length)
        .delete(link.length)
        .insert(link, { ...ctx.format, link: fullUrl })
        .insert(' ', ctx.format)
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
        id: id,
        'data-id': id
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
    this.mediaSelectionService.open({
      allowSelectMultiple: true,
      hiddenTabs: ['videos', 'playlists'], allowCancelUpload: true,
      onBeforeUpload: (files) => {
        Object.keys(files).forEach(f_id => this.insertFakeImage(f_id));
      },
      onAfterUploaded: ({ file, resp, uploadURL }) => {
        const fileId = file.id;
        $(`i[data-id='${fileId}']`).after(
          `<img src="${resp.data.url}" data-id="${resp.data.id}" />`
        );
        $(`i[data-id='${fileId}']`).remove();
      }
    });

    const close$: Observable<any> = merge(
      this.mediaSelectionService.open$,
      componentDestroyed(this)
    );
    this.mediaSelectionService.selectedMedias$
      .pipe(filter((items: any[]) => items.length > 0), takeUntil(close$))
      .subscribe(photos => {
        photos.forEach((photo: any) =>
          this.insertInlineImage(null, photo.url, photo.id)
        );
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
        // const curFormat = this.customEditor.getFormat();
        // if (!curFormat.font) { this.customEditor.format('font', this.setting.font); }
        // if (!curFormat.size) { this.customEditor.format('size', this.setting.font_size); }
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
      .subscribe((note2: Note) => {
        if (note2 !== undefined) {
          this.updateFormValue(note2);
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
    this.addDefaultFormat();
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
    const filesAddedPolicy = FileUploadPolicy.allowMultiple(files, [new BlackListPolicy(), new SizePolicy(35, { only: /video\//g })]);
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
              if (att.name === response.data.full_name && !att.uuid) {
                return response.data;
              }
              return att;
            });
            this.form.controls['attachments'].setValue(this.note.attachments);
          }
        });

      this.uploadSubscriptions[f.name] = sub;
    }
    const filesNotAllow = filesAddedPolicy.filter(file => file.allow === false);
    if (filesNotAllow.length > 0) {
      this.commonEventService.broadcast({
        channel: 'LockMessage',
        payload: filesNotAllow
      });
    }
  }

  selectPhotos() {
    this.mediaSelectionService.open({ allowSelectMultiple: true });

    this.selectPhotos4Attachments();
  }

  onSubmit(value: any) {
    if (
      value.name.length > 0 ||
      value.tags.length > 0 ||
      value.attachments.length > 0 ||
      (this.editorElement && this.editorElement.innerHTML.length > 0 &&
        this.editorElement.innerHTML !== '<p><br></p>')
    ) {
      if (!this.editorElement) {
        return;
      }

      if (this.editMode === Constants.modal.add) {
        if (this.note.permission !== 'view') {
          this.onFirstSave();
          // this.store.dispatch(
          //   new note.Add({
          //     ...value,
          //     parent_id: this.parentId,
          //     content: this.editorElement.innerHTML
          //   })
          // );
        }
      } else {
        if (this.note.permission !== 'view') {
          this.updateNote();
          // this.store.dispatch(
          //   new note.Update({
          //     ...value,
          //     id: this.note.id,
          //     content: this.editorElement.innerHTML
          //   })
          // );
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
  async onFirstSave() {
    const res = await this.noteService
      .create({
        ...this.form.value,
        content: this.getValidHtml(),
        parent_id: this.parentId
      })
      .toPromise();
    this.note = res.data;
    this.editMode = Constants.modal.edit;
    this.store.dispatch(new note.MultiNotesAdded([res['data']]));

    // return await this.router.navigate([
    //   { outlets: { detail: ['notes', this.note.id] } }
    // ]);
  }

  getValidHtml() {
    return this.editorElement.innerHTML.replace(/<span class="ql-cursor">[^<>]*<\/span>/, '');
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

    if (!document.querySelector('.visible-print-block')) {
      $('body').after(
        '<div class="visible-print-block ql-container ql-snow"><div class="ql-editor"></div><div/>'
      );
    }
    document.querySelector('.visible-print-block > .ql-editor').innerHTML =
      editor.innerHTML;
    const printable: any = document.querySelector('.visible-print-block > .ql-editor');
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
    this.mediaSelectionService.open({
      allowSelectMultiple: true,
      hiddenTabs: ['videos', 'playlists'], allowCancelUpload: true,
      onBeforeUpload: (files) => {
        this.note.attachments.push(...Object.values(files));
        this.form.controls['attachments'].setValue(this.note.attachments);
      },
      onAfterUploaded: ({ file, resp, uploadURL }) => {
        const index = _.indexOf(this.note.attachments, file);
        this.note.attachments[index] = resp.data;
        this.form.controls['attachments'].setValue(this.note.attachments);
      }
    });

    const close$: Observable<any> = merge(
      this.mediaSelectionService.open$,
      componentDestroyed(this)
    );
    this.mediaSelectionService.selectedMedias$
      .pipe(filter((items: any[]) => items.length > 0), takeUntil(close$))
      .subscribe(photos => {
        this.note.attachments.push(...photos);
        this.form.controls['attachments'].setValue(this.note.attachments);
      });

  }

  private async updateNote() {
    if (!this.note.id || !this.editorElement) {
      return;
    }
    const noteObj: any = Object.assign({}, this.note, this.form.value, {
      content: this.getValidHtml()
    });
    this.store.dispatch(new note.Update(noteObj));
    return Promise.resolve();
  }

  private checkIdle() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      console.log('Goes idle now for note channel: ', this.note.uuid);
      this.noteChannel.idle(this.note.uuid);
    }, DEBOUNCE_MS);
  }

}

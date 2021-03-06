import { Component, EventEmitter, Output, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import { Observable ,  Subject ,  Subscription, merge } from 'rxjs';

import {
  CommentCreateEvent,
  CommentUpdateEvent,
  CancelEditCommentEvent,
  ReplyCreateEvent,
  ReplyUpdateEvent
} from '../../../../events/social-events';
import { SoComment, User } from '@wth/shared/shared/models';
import { UserService, PhotoUploadService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';
import { Router } from '@angular/router';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { takeUntil, filter, map, mergeMap, take } from 'rxjs/operators';

import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { MiniEditorComponent } from '@wth/shared/shared/components/mini-editor/mini-editor.component';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { WUploader } from '@shared/services/w-uploader';
import TextLengthValidatior from '@social/shared/hooks/validators/text-lenght.validator';
import { htmlTrim } from '@shared/shared/utils/utils';


export enum CommentEditorMode {
  Add,
  Edit,
  Reply,
  EditReply
}

declare let $: any;
declare let _: any;

@Component({
  selector: 'comment-item-editor',
  templateUrl: 'comment-item-editor.component.html',
  styleUrls: ['comment-item-editor.component.scss']
})

export class CommentItemEditorComponent implements OnInit, OnDestroy {
  @Input() parent: any; // parent is able to be Post or Comment or Photo or other object
  @Input() parentType = 'SocialNetwork::Post';  // 'SocialNetwork::Post' or 'SocialNetwork::Comment'
  @Input() originComment = new SoComment();
  @Input() reply: SoComment;
  @Input() mode: any = CommentEditorMode.Add;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('commentContent') commentContent: ElementRef;
  @ViewChild(MiniEditorComponent) editor: MiniEditorComponent;

  comment: SoComment = new SoComment(); // Clone comment
  readonly commentEditorMode = CommentEditorMode;
  hasUploadingPhoto = false;
  hasUpdatedContent = false;
  files: any[];
  user$: Observable<User>;
  showEmoji: boolean;

  commentEditorForm: FormGroup;
  contentCtrl: AbstractControl;
  photosCtrl: AbstractControl;

  readonly tooltip: any = Constants.tooltip;

  textContent = 'Let\'s try 1st sample';
  cancelPhotoSubject: Subject<any> = new Subject<any>();
  destroySubject: Subject<any> = new Subject<any>();
  close$: Observable<any>;
  uploadSubscription: Subscription;
  selectEmojiSub: Subscription;
  editorLimit = 1000;
  editorError = '';
  editorErrorMessage = 'The maximum limit for a comment is ' + this.editorLimit + ' characters. Please make your comment shorter.';
  textValidator: TextLengthValidatior = new TextLengthValidatior(this.editorLimit);

  private uploadingPhoto: any;
  private sub: Subscription;

  constructor(private fb: FormBuilder,
              private router: Router,
              private mediaSelectionService: WMediaSelectionService,
              private photoUploadService: PhotoUploadService,
              public userService: UserService,
              private emojiService: WTHEmojiService,
              private uploader: WUploader) {
    this.user$ = this.userService.getAsyncProfile();
    this.close$ = merge(this.mediaSelectionService.open$, this.cancelPhotoSubject, componentDestroyed(this));
  }

  ngOnInit() {
    if (this.mode === CommentEditorMode.Add) {
    }

    this.comment = _.cloneDeep(this.originComment);
    this.commentEditorForm = this.fb.group({
      'content': [this.comment.content, ''],
      'photo': [this.comment.photo, null]
    });
    this.setCommentContent(this.commentEditorForm.controls['content'].value);
    this.photosCtrl = this.commentEditorForm.controls['photo'];
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
    if (this.sub && !this.sub.closed) {
      this.sub.unsubscribe();
    }
  }

  viewProfile(uuid: string) {
    this.router.navigate([{outlets: {detail: null}}], {queryParamsHandling: 'preserve', preserveFragment: true})
      .then(() => this.router.navigate(['profile', uuid]));
  }

  handleKeyUp(e: any) {
    if (e.keyCode === 13 && this.editorError === '') {
      this.handlePost();
      return;
    } else if (e.keyCode === 27) {
      this.cancel();
      return;
    }
  }

  handlePost() {
    if (this.checkValidForm()) {
      this.post(htmlTrim(this.comment.content));
      this.focus();
    } else {
      this.cancel();
    }
  }

  focus() {
    this.editor.focus();
  }

  onOpenPhotoSelect() {
    this.mediaSelectionService.open({filter: 'photo', allowSelectMultiple: false, allowCancelUpload: true});

    this.mediaSelectionService.selectedMedias$.pipe(
      takeUntil(this.close$),
      filter(items => items.length > 0)
    ).subscribe((items) => {
      this.setPhoto(items[0]);
      this.hasUpdatedContent = true;
    });

    this.uploadSubscription = this.mediaSelectionService.uploadingMedias$.pipe(
      takeUntil(this.close$),
      map(([file, dataUrl]) => [file]),
      mergeMap((files: any[]) => {
        this.hasUploadingPhoto = true;
        this.files = files;
        return this.photoUploadService.uploadPhotos(files);
      })
    ).subscribe((res: any) => {
      this.setPhoto(res.data);
      this.hasUploadingPhoto = false;
      this.hasUpdatedContent = true;
    });

    this.sub = this.uploader.event$.subscribe(event => {
      this.handleUploadFiles(event);
    });
  }

  handleUploadFiles(event: any) {
    switch (event.action) {
      case 'start':
        this.uploadingPhoto = null;
        break;
      case 'progress':
        this.setPhoto(event.payload.file);
        this.uploadingPhoto = event.payload.file;
        this.hasUploadingPhoto = true;
        break;
      case 'success':
        // replace uploading photo by real photo
        this.setPhoto(event.payload.resp);
        this.hasUploadingPhoto = true;
        this.hasUpdatedContent = true;
        break;
    }
  }

  onEmojiClick(e: any) {
    const emoj: any = e.replace(/\\/gi, '');
    this.editor.addEmoj(emoj);
    this.hasUpdatedContent = true;
  }

  cancel() {
    this.setCommentContent('');
    this.setPhoto(null);

    this.cancelUploadPhoto();

    this.hasUpdatedContent = false;
    this.editorError = '';
    if (this.mode === CommentEditorMode.Add) {
      // add new comment/reply to post
      _.set(this.originComment, 'isCreatingNewReply', false);

    } else if (this.mode === CommentEditorMode.Edit) {
      // update current comment/reply
      _.set(this.originComment, 'isEditting', false);
      this.eventEmitter.emit(new CancelEditCommentEvent(this.comment));
    }

  }

  doEvents(event: any) {
    switch (event.action) {
      case 'remove':
        // this.setPhoto(null);
        // this.files = null;
        // this.hasUpdatedContent = (this.comment.content != '');
        // break;
      case 'cancelUploadingPhoto':
      case 'cancelUpload':
        this.setPhoto(null);
        this.cancelUploadPhoto();
        if (this.uploadSubscription) {
          this.uploadSubscription.unsubscribe();
        }
        this.files = null;
        this.hasUpdatedContent = (this.comment.content !== '');
        break;
    }
  }

  checkValidForm(): boolean {
    // remove leading and trailing whitespaces: spaces, tabs, new lines from comment content before saving
    return !!this.comment.content || !!this.comment.photo;
  }

  setCommentContent(value: any) {
    this.comment.content = value;
  }

  showEmojiBtn(event: any) {
    this.emojiService.show(event);

    if (this.selectEmojiSub && !this.selectEmojiSub.closed) {
      this.selectEmojiSub.unsubscribe();
    }
    this.selectEmojiSub = this.emojiService.selectedEmoji$.pipe(
      take(1)
    ).subscribe(data => {
      this.editor.addEmoj(data.shortname);
      this.hasUpdatedContent = true;
    });
  }

  onTextChange(event) {
    if (event.status.error) {
      this.editorError = 'editor-error';
    } else {
      this.editorError = '';
    }
  }

  private post(comment?: any) {
    let event: any = null;

    this.comment.content = comment || this.comment.content || '';
    if (this.mode === CommentEditorMode.Add || this.mode === CommentEditorMode.Reply) {
      // add new comment/reply to post
      this.comment.parent = this.parent;
      this.comment.parentId = this.parent.uuid;
      this.comment.parentType = this.parentType;


      _.set(this.originComment, 'isCreatingNewReply', true);
      if ( this.mode === CommentEditorMode.Add ) {
        event = new CommentCreateEvent({...this.comment});
      }
      if (this.mode === CommentEditorMode.Reply) {
        event = new ReplyCreateEvent({...this.comment});
      }
    } else if (this.mode === CommentEditorMode.Edit || this.mode === CommentEditorMode.EditReply) {

      // update current comment/reply
      event = new CommentUpdateEvent(this.comment);
    }
    this.eventEmitter.emit(event);
    this.comment.content = '';
    this.setPhoto(null);
    this.files = null;
    this.hasUpdatedContent = false;
  }

  private setPhoto(photo: any) {
    this.comment.photo = photo;
    this.commentEditorForm.controls['photo'].setValue(photo);
  }

  private cancelUploadPhoto() {
    this.cancelPhotoSubject.next('');
    if (this.uploadingPhoto) {
      this.uploader.cancel(this.uploadingPhoto);
      this.uploadingPhoto = null;
    }
  }
}

import { Component, EventEmitter, Output, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

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

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { takeUntil, filter, map, mergeMap, take } from 'rxjs/operators';

import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { MiniEditorComponent } from '@wth/shared/shared/components/mini-editor/mini-editor.component';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { WUploader } from '@shared/services/w-uploader';
import TextLengthValidatior from '@social/shared/hooks/validators/text-lenght.validator';


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
  // @Input() item: SoPost;
  @Input() parent: any; // parent is able to be Post or Comment or Photo or other object
  @Input() parentType = 'SocialNetwork::Post';  // 'SocialNetwork::Post' or 'SocialNetwork::Comment'
  @Input() originComment = new SoComment();
  @Input() reply: SoComment;
  @Input() mode: any = CommentEditorMode.Add;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('commentContent') commentContent: ElementRef;
  @ViewChild(MiniEditorComponent) editor: MiniEditorComponent;

  comment: SoComment = new SoComment(); // Clone comment
  commentEditorMode = CommentEditorMode;
  hasUploadingPhoto = false;
  hasUpdatedContent = false;
  files: any[];
  user$: Observable<User>;
  showEmoji: boolean;

  commentEditorForm: FormGroup;
  contentCtrl: AbstractControl;
  photosCtrl: AbstractControl;

  tooltip: any = Constants.tooltip;

  textContent = 'Let\'s try 1st sample';
  cancelPhotoSubject: Subject<any> = new Subject<any>();
  destroySubject: Subject<any> = new Subject<any>();
  close$: Observable<any>;
  uploadSubscription: Subscription;
  selectEmojiSub: Subscription;
  private uploadingPhoto: any;
  private sub: Subscription;
  editorLimit = 2;
  editorError = '';
  editorErrorMessage = 'The maximum limit for a comment is ' + this.editorLimit + ' characters. Please make your comment shorter.';
  textValidator: TextLengthValidatior = new TextLengthValidatior(this.editorLimit);

  constructor(private fb: FormBuilder,
              private router: Router,
              private mediaSelectionService: WMediaSelectionService,
              private photoUploadService: PhotoUploadService,
              public userService: UserService,
              private emojiService: WTHEmojiService,
              private uploader: WUploader) {
    this.user$ = this.userService.getAsyncProfile();
    this.close$ = Observable.merge(this.mediaSelectionService.open$, this.cancelPhotoSubject, componentDestroyed(this));
  }

  ngOnInit() {
    if (this.mode === CommentEditorMode.Add) {
      // this.comment = new SoComment();
    }

    this.comment = _.cloneDeep(this.originComment);
    this.commentEditorForm = this.fb.group({
      'content': [this.comment.content, ''],
      'photo': [this.comment.photo, null]
    });
    // this.contentCtrl = this.commentEditorForm.controls['content'];
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
    if (e.keyCode === 13 && this.editorError == '') {
      if (this.checkValidForm()) {
        // this.comment.content = this.commentEditorForm.value;
        this.post(this.comment.content);
      } else {
        this.cancel();
      }
      return;
    } else if (e.keyCode === 27) {
      this.cancel();
      return;
    }
  }

  commentAction(photos?: any) {
    let commentEvent: any;
    const data: any = {};
    if (photos) data.photo = photos[0].id;
    data.content = this.comment.content;
    if (this.mode === this.commentEditorMode.Add) {
      data.post_uuid = this.parent.uuid;
      commentEvent = new CommentCreateEvent(data);
    }
    if (this.mode === this.commentEditorMode.Edit) {
      data.uuid = this.comment.uuid;
      commentEvent = new CommentUpdateEvent(data);
    }
    if (this.mode === this.commentEditorMode.Reply) {
      data.comment_uuid = this.comment.uuid;
      data.post_uuid = this.parent.uuid;
      commentEvent = new ReplyCreateEvent(data);
    }
    if (this.mode === this.commentEditorMode.EditReply) {
      data.comment_uuid = this.comment.uuid;
      data.reply_uuid = this.reply.uuid;
      commentEvent = new ReplyUpdateEvent(data);
    }
    this.eventEmitter.emit(commentEvent);
    this.comment.content = '';
  }

  onOpenPhotoSelect() {
    this.mediaSelectionService.open({filter: 'photo', allowSelectMultiple: false, allowCancelUpload: true});

    this.mediaSelectionService.selectedMedias$.pipe(
      takeUntil(this.close$),
      filter(items => items.length > 0)
    ).subscribe((items) => {
      // this.comment.photo = items[0];
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
      // this.comment.photo = res.data;
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
    // this.comment.content = this.commentDomValue + emoj;
    this.hasUpdatedContent = true;
  }

  cancel() {
    this.setCommentContent('');
    this.setPhoto(null);
    this.hasUpdatedContent = false;
    this.editorError = '';
    if (this.mode === CommentEditorMode.Add) {
      // add new comment/reply to post
      _.set(this.originComment, 'isCreatingNewReply', false);
      // this.eventEmitter.emit(new CancelAddCommentEvent(this.comment));

    } else if (this.mode === CommentEditorMode.Edit) {
      // update current comment/reply
      _.set(this.originComment, 'isEditting', false);
      this.eventEmitter.emit(new CancelEditCommentEvent(this.comment));
    }
  }

  post(comment?: any) {
    let event: any = null;

    this.comment.content = comment || this.comment.content;
    if (this.mode === CommentEditorMode.Add) {
      // add new comment/reply to post
      this.comment.parent = this.parent;
      this.comment.parentId = this.parent.uuid;
      this.comment.parentType = this.parentType;


      _.set(this.originComment, 'isCreatingNewReply', false);
      event = new CommentCreateEvent({...this.comment});

    } else if (this.mode === CommentEditorMode.Edit) {

      // update current comment/reply
      event = new CommentUpdateEvent(this.comment);
    }
    this.eventEmitter.emit(event);
    this.comment.content = '';
    this.setPhoto(null);
    // this.comment.photo = null;
    // this.commentEditorForm.controls['photo'].setValue(null);
    this.files = null;
    this.hasUpdatedContent = false;
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
        if (this.uploadSubscription)
          this.uploadSubscription.unsubscribe();
        this.files = null;
        this.hasUpdatedContent = (this.comment.content !== '');
        break;
    }
  }

  checkValidForm(): boolean {
    // remove leading and trailing whitespaces: spaces, tabs, new lines from comment content before saving
    // return this.hasUpdatedContent && this.comment.content.replace(/^\s+|\s+$/g, '') !== '';
    return !!this.comment.content || !!this.comment.photo;
  }

  setCommentContent(value: any) {
    this.comment.content = value;
  }

  showEmojiBtn(event: any) {
    this.emojiService.show(event);

    if (this.selectEmojiSub && !this.selectEmojiSub.closed)
      this.selectEmojiSub.unsubscribe();
    this.selectEmojiSub = this.emojiService.selectedEmoji$.pipe(
      take(1)
    ).subscribe(data => {
      this.editor.addEmoj(data.shortname);
      // this.comment.content = this.commentDomValue + emoj;
      this.hasUpdatedContent = true;
    });
  }

  onTextChange(event){
    if (event.status.error) {
      this.editorError = 'editor-error';
    } else {
      this.editorError = "";
    }
  }

  private setPhoto(photo: any) {
    this.comment.photo = photo;
    this.commentEditorForm.controls['photo'].setValue(photo);

    if (photo === null) {
      this.cancelPhotoSubject.next('');
      if (this.uploadingPhoto) {
        this.uploader.cancel(this.uploadingPhoto);
        this.uploadingPhoto = null;
      }
    }
  }
}

import { Component, EventEmitter, Output, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import {
  CommentCreateEvent,
  OpenPhotoModalEvent,
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
import { takeUntil, filter, map, mergeMap } from 'rxjs/operators';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { MiniEditor } from '@wth/shared/shared/components/mini-editor/mini-editor.component';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';


export enum CommentEditorMode {
  Add,
  Edit,
  Reply,
  EditReply
}

declare let $: any;
declare let _: any;
declare let document: any;

@Component({
  selector: 'comment-item-editor',
  templateUrl: 'comment-item-editor.component.html',
  styleUrls: ['comment-item-editor.component.scss']
})

export class CommentItemEditorComponent implements OnInit, OnDestroy {
  // @Input() item: SoPost;
  @Input() parent: any; // parent is able to be Post or Comment or Photo or other object
  @Input() parentType: string = 'SocialNetwork::Post';  // 'SocialNetwork::Post' or 'SocialNetwork::Comment'
  @Input() originComment = new SoComment();
  @Input() reply: SoComment;
  @Input() mode: any = CommentEditorMode.Add;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('commentContent') commentContent: ElementRef;
  @ViewChild(MiniEditor) editor: MiniEditor;

  comment: SoComment = new SoComment(); // Clone comment
  commentEditorMode = CommentEditorMode;
  hasUploadingPhoto: boolean = false;
  hasUpdatedContent: boolean = false;
  files: any[];
  user$: Observable<User>;
  showEmoji: boolean;

  commentEditorForm: FormGroup;
  contentCtrl: AbstractControl;
  photosCtrl: AbstractControl;

  tooltip: any = Constants.tooltip;

  textContent = 'Let\'s try 1st sample';

  constructor(private fb: FormBuilder,
              private router: Router,
              private mediaSelectionService: WMediaSelectionService,
              private photoUploadService: PhotoUploadService,
              public userService: UserService,
              private emojiService: WTHEmojiService) {
    this.user$ = this.userService.getAsyncProfile();
  }

  ngOnInit() {
    if (this.mode == CommentEditorMode.Add) {
      // this.comment = new SoComment();
    }

    this.comment = _.cloneDeep(this.originComment);
    //Init From controls
    this.commentEditorForm = this.fb.group({
      'content': [this.comment.content, ''],
      'photo': [this.comment.photo, null]
    });
    // this.contentCtrl = this.commentEditorForm.controls['content'];
    this.setCommentContent(this.commentEditorForm.controls['content'].value);
    this.photosCtrl = this.commentEditorForm.controls['photo'];
  }

  ngOnDestroy() {

  }

  viewProfile(uuid: string) {
    this.router.navigate([{outlets: {detail: null}}], {queryParamsHandling: 'preserve', preserveFragment: true})
      .then(() => this.router.navigate(['profile', uuid]));
  }

  // onKey(e: any) {
  //   // Create, Update, Reply
  //   if (e.keyCode == 13 && !e.shiftKey) {
  //     e.preventDefault();
  //     this.setCommentContent(e.srcElement.innerHTML);
  //     if (this.checkValidForm()) {
  //       // this.comment.content = this.commentEditorForm.value;
  //       this.post(this.comment.content);
  //     } else {
  //       this.cancel();
  //     }
  //     return;
  //   } else if (e.keyCode == 13 && e.shiftKey) {
  //     return;
  //   } else if (e.keyCode == 27) {
  //     this.cancel();
  //     return;
  //   }
  //
  //   this.showEmoji = false;
  //   this.hasUpdatedContent = true;
  // }

  handleKeyUp(e: any) {
    if (e.keyCode === 13) {
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

  /*
   * Now we just supports ONE photo
   * */
  // editComment(photo: any) {
  //   this.comment.photo = photo;
  //   this.commentEditorForm.controls['photo'].setValue(photo);
  //
  // }

  // setCommentAttributes(attributes: any) {
  //   if ('photo' in attributes) {
  //     this.comment.photo = attributes.photo;
  //     this.commentEditorForm.controls['photo'].setValue(attributes.photo)
  //   }
  //   if ('content' in attributes) {
  //     this.comment.content = attributes.content || '';
  //   }
  //
  //   this.hasUpdatedContent = true;
  // }

  // updateAttributes(options: any) {
  //   if ('hasUploadingPhoto' in options) {
  //     this.hasUploadingPhoto = options.hasUploadingPhoto;
  //   }
  //   if ('files' in options) {
  //     this.files = options.files;
  //   }
  //
  //   this.hasUpdatedContent = true;
  // }

  commentAction(photos?: any) {
    let commentEvent: any;
    let data: any = {};
    if (photos) data.photo = photos[0].id;
    data.content = this.comment.content;
    if (this.mode == this.commentEditorMode.Add) {
      data.post_uuid = this.parent.uuid;
      commentEvent = new CommentCreateEvent(data);
    }
    if (this.mode == this.commentEditorMode.Edit) {
      data.uuid = this.comment.uuid;
      commentEvent = new CommentUpdateEvent(data);
    }
    if (this.mode == this.commentEditorMode.Reply) {
      data.comment_uuid = this.comment.uuid;
      data.post_uuid = this.parent.uuid;
      commentEvent = new ReplyCreateEvent(data);
    }
    if (this.mode == this.commentEditorMode.EditReply) {
      data.comment_uuid = this.comment.uuid;
      data.reply_uuid = this.reply.uuid;
      commentEvent = new ReplyUpdateEvent(data);
    }
    this.eventEmitter.emit(commentEvent);
    this.comment.content = '';
  }

  onOpenPhotoSelect() {
    // this.eventEmitter.emit(new OpenPhotoModalEvent(this));

    this.mediaSelectionService.open();
    this.mediaSelectionService.setMultipleSelection(false);

    let close$: Observable<any> = Observable.merge(this.mediaSelectionService.open$, componentDestroyed(this));
    this.mediaSelectionService.selectedMedias$.pipe(
      takeUntil(close$),
      filter(items => items.length > 0)
    ).subscribe((items) => {
      // this.comment.photo = items[0];
      this.setPhoto(items[0]);
      this.hasUpdatedContent = true;
    });

    this.mediaSelectionService.uploadingMedias$.pipe(
      takeUntil(close$),
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
  }

  onEmojiClick(e: any) {
    let emoj: any = e.replace(/\\/gi, '');
    this.editor.addEmoj(emoj);
    // this.comment.content = this.commentDomValue + emoj;
    this.hasUpdatedContent = true;
  }

  cancel() {
    // this.comment.content = '';
    // this.comment.photo = null;
    // this.commentEditorForm.controls['content'].setValue('');
    // this.commentEditorForm.controls['photo'].setValue(null);
    this.setCommentContent('');
    this.setPhoto(null);
    this.hasUpdatedContent = false;
    if (this.mode == CommentEditorMode.Add) {
      // add new comment/reply to post
      _.set(this.originComment, 'isCreatingNewReply', false);
      // this.eventEmitter.emit(new CancelAddCommentEvent(this.comment));

    } else if (this.mode == CommentEditorMode.Edit) {
      // update current comment/reply
      _.set(this.originComment, 'isEditting', false);
      this.eventEmitter.emit(new CancelEditCommentEvent(this.comment));
    }
  }

  post(comment?: any) {
    let event: any = null;

    this.comment.content = comment || this.comment.content
    if (this.mode == CommentEditorMode.Add) {
      // add new comment/reply to post
      this.comment.parent = this.parent;
      this.comment.parentId = this.parent.uuid;
      this.comment.parentType = this.parentType;


      _.set(this.originComment, 'isCreatingNewReply', false);
      event = new CommentCreateEvent({...this.comment});

    } else if (this.mode == CommentEditorMode.Edit) {

      // update current comment/reply
      // this.comment.content = this.commentEditorForm.value.content;
      // this.commentContent.nativeElement.setInnerHTML(this.commentEditorForm.controls['content']);
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

  doEvents(response: any) {
    switch (response.action) {
      case 'remove':
        // this.comment.photo = null;
        // this.commentEditorForm.controls['photo'].setValue(null);
        this.setPhoto(null);
        this.files = null;
        this.hasUpdatedContent = (this.comment.content != '');
        break;
      case 'cancelUploadingPhoto':
        break;
    }
  }

  checkValidForm(): boolean {
    // remove leading and trailing whitespaces: spaces, tabs, new lines from comment content before saving
    // return this.hasUpdatedContent && this.comment.content.replace(/^\s+|\s+$/g, '') !== '';
    return !!this.comment.content || !!this.comment.photo;
  }

  hasChanged() {
    if (this.comment.content === '' && !this.hasUpdatedContent && !this.comment.photo) {
      return false;
    }
    return true;
  }

  setCommentContent(value: any) {
    this.comment.content = value;
  }

  showEmojiBtn(event: any) {
    console.log(event);
    this.emojiService.show(event);
  }

  private setPhoto(photo: any) {
    this.comment.photo = photo;
    this.commentEditorForm.controls['photo'].setValue(photo);
  }
}

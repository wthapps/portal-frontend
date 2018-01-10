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
import { UserService } from '@wth/shared/services';
import { ZChatEmojiService } from '@wth/shared/shared/emoji/emoji.service';
import { Constants } from '@wth/shared/constant';
import { Router } from '@angular/router';


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

export class CommentItemEditorComponent implements OnInit {
  // @Input() item: SoPost;
  @Input() parent: any; // parent is able to be Post or Comment or Photo or other object
  @Input() parentType: string = 'SocialNetwork::Post';  // 'SocialNetwork::Post' or 'SocialNetwork::Comment'
  @Input() originComment = new SoComment();
  @Input() reply: SoComment;
  @Input() mode: any = CommentEditorMode.Add;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('commentContent') commentContent: ElementRef;

  comment: SoComment = new SoComment(); // Clone comment
  commentEditorMode = CommentEditorMode;
  hasUploadingPhoto: boolean = false;
  hasUpdatedContent: boolean = false;
  files: any;
  emojiData: any[];
  user$: Observable<User>;
  showEmoji: boolean;

  commentEditorForm: FormGroup;
  contentCtrl: AbstractControl;
  photosCtrl: AbstractControl;

  tooltip: any = Constants.tooltip;

  textContent = 'Let\'s try 1st sample';

  constructor(private fb: FormBuilder,
              private router: Router,
              public userService: UserService) {
    this.user$ = this.userService.getAsyncProfile();

    this.emojiData = ZChatEmojiService.emojis;
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
    this.contentCtrl = this.commentEditorForm.controls['content'];
    this.photosCtrl = this.commentEditorForm.controls['photo'];
  }

  viewProfile(uuid: string) {
    this.router.navigate([{outlets: {detail: null}}], {queryParamsHandling: 'preserve' , preserveFragment: true})
      .then(() => this.router.navigate(['profile', uuid]));
  }

  onKey(e: any) {
    // Create, Update, Reply
    if (e.keyCode == 13 && !e.shiftKey) {
      e.preventDefault();
      if (this.checkValidForm()) {
        // this.comment.content = this.commentEditorForm.value;
        this.post(this.commentEditorForm.value);
      } else {
        this.cancel();
      }
      return;
    } else if (e.keyCode == 13 && e.shiftKey) {
      return;
    } else if (e.keyCode == 27) {
      this.cancel();
      return;
    }

    this.showEmoji = false;
    this.hasUpdatedContent = true;
  }

  /*
   * Now we just supports ONE photo
   * */
  editComment(photo: any) {
    this.comment.photo = photo;
    this.commentEditorForm.controls['photo'].setValue(photo);

  }

  setCommentAttributes(attributes: any) {
    if ('photo' in attributes) {
      this.comment.photo = attributes.photo;
      this.commentEditorForm.controls['photo'].setValue(attributes.photo)
    }
    if ('content' in attributes) {
      this.comment.content = attributes.content || '';
    }

    this.hasUpdatedContent = true;
  }

  updateAttributes(options: any) {
    if ('hasUploadingPhoto' in options) {
      this.hasUploadingPhoto = options.hasUploadingPhoto;
    }
    if ('files' in options) {
      this.files = options.files;
    }

    this.hasUpdatedContent = true;
  }

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
    this.eventEmitter.emit(new OpenPhotoModalEvent(this));

  }

  onEmojiClick(e: any) {
    let emoj: any = e.replace(/\\/gi, '');
    this.comment.content += emoj;
    this.hasUpdatedContent = true;
  }

  cancel() {
    this.comment.content = '';
    this.comment.photo = null;
    this.commentEditorForm.controls['content'].setValue('');
    this.commentEditorForm.controls['photo'].setValue(null);
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

  post(comment: any) {
    let event: any = null;

    if (this.mode == CommentEditorMode.Add) {
      // add new comment/reply to post
      this.comment.parent = this.parent;
      this.comment.parentId = this.parent.uuid;
      this.comment.parentType = this.parentType;

      _.set(this.originComment, 'isCreatingNewReply', false);
      event = new CommentCreateEvent(this.comment);

    } else if (this.mode == CommentEditorMode.Edit) {

      // update current comment/reply
      this.comment.content = this.commentEditorForm.value.content;
      event = new CommentUpdateEvent(this.comment);
    }
    this.eventEmitter.emit(event);
    this.comment.content = '';
    this.comment.photo = null;
    this.commentEditorForm.controls['photo'].setValue(null);
    this.files = null;
    this.hasUpdatedContent = false;
  }

  doEvents(response: any) {
    switch (response.action) {
      case 'remove':
        this.comment.photo = null;
        this.commentEditorForm.controls['photo'].setValue(null);
        this.files = null;
        if (this.comment.content != '')
          this.hasUpdatedContent = true;
        else
          this.hasUpdatedContent = false;

        break;
      case 'cancelUploadingPhoto':
        break;
    }
  }

  checkValidForm(): boolean {
    // remove leading and trailing whitespaces: spaces, tabs, new lines from comment content before saving
    return this.hasUpdatedContent && this.comment.content.replace(/^\s+|\s+$/g, '') !== '';
  }

  hasChanged() {
    if (this.commentEditorForm.controls['content'].value == '' &&
      this.commentEditorForm.controls['photo'].value == null) {
      return false;
    }
    return true;
  }

}

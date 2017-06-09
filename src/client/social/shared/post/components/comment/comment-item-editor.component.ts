import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import {
  CommentCreateEvent,
  OpenPhotoModalEvent,
  CommentUpdateEvent,
  CancelEditCommentEvent,
  CancelReplyCommentEvent,
  ReplyCreateEvent,
  ReplyUpdateEvent,
  CancelEditReplyCommentEvent, DeleteCommentEvent, DeleteReplyEvent, CancelAddCommentEvent
} from '../../../../events/social-events';
import { SoPost } from '../../../../../core/shared/models/social_network/so-post.model';
import { SoComment } from '../../../../../core/shared/models/social_network/so-comment.model';
export enum CommentEditorMode {
  Add,
  Edit,
  Reply,
  EditReply
}

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'comment-item-editor',
  templateUrl: 'comment-item-editor.component.html',
  styleUrls: ['comment-item-editor.component.css']
})

export class CommentItemEditorComponent implements OnInit {
  // @Input() item: SoPost;
  @Input() parent: any; // parent is able to be Post or Comment or Photo or other object
  @Input() parentType: string = 'SocialNetwork::Post';  // 'SocialNetwork::Post' or 'SocialNetwork::Comment'
  @Input() originComment = new SoComment();
  @Input() reply: SoComment;
  @Input() mode: any = CommentEditorMode.Add;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  comment: SoComment = new SoComment(); // Clone comment
  commentEditorMode = CommentEditorMode;
  hasUploadingPhoto: boolean = false;
  files: any;

  commentEditorForm: FormGroup;
  contentCtrl: AbstractControl;
  photosCtrl: AbstractControl;

  constructor(private fb: FormBuilder,) {

  }

  ngOnInit() {

    // console.log('mode::', this.comment);
    if (this.mode == CommentEditorMode.Add) {
      // this.comment = new SoComment();
    }

    this.comment = _.cloneDeep(this.originComment);
    //Init From controls
    this.commentEditorForm = this.fb.group({
      'content': [this.comment.content, null],
      'photo': [this.comment.photo, null]
    });
    this.contentCtrl = this.commentEditorForm.controls['content'];
    this.photosCtrl = this.commentEditorForm.controls['photo'];

    $('.js-textarea-autoheight').each(function () {
      this.setAttribute('style', 'height: 34px; overflow:hidden; word-wrap: break-word; resize: none; padding-right: 50px;');
    }).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }


  onKey(e: any) {
    // Create, Update, Reply
    if (e.keyCode == 13 && this.comment.content != '') {

      // this.comment.content = this.commentEditorForm.value.content;
      // this.comment.photo = this.commentEditorForm.value.photo;
      // this.post(this.comment);

      this.post(this.commentEditorForm.value);
    }
    // Cancel comment
    if (e.keyCode == 27) {
      this.cancel();
    }
  }
  /*
  * Now we just supports ONE photo
  * */
  editComment(photo: any) {
    this.comment.photo = photo;
  }

  setCommentAttributes(attributes: any) {
    if ('photo' in attributes) {
      this.comment.photo = attributes.photo;
    }
    if ('content' in attributes) {
      this.comment.content = attributes.content || '';
    }
  }

  updateAttributes(options: any) {
    if('hasUploadingPhoto' in options) {
      this.hasUploadingPhoto = options.hasUploadingPhoto;
    }
    if('files' in options) {
      this.files = options.files;
    }
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

  cancel() {
    // if (this.type == this.commentEditorMode.Edit) {
    //   this.eventEmitter.emit(new CancelEditCommentEvent(this.comment));
    //   this.commentContent = this.comment.content;
    // }
    // if (this.type == this.commentEditorMode.Reply) {
    //   this.eventEmitter.emit(new CancelReplyCommentEvent(this.comment));
    // }
    // if (this.type == this.commentEditorMode.EditReply) {
    //   this.eventEmitter.emit(new CancelEditReplyCommentEvent(this.reply));
    // }


    this.comment.content = '';
    this.comment.photo = null;
    this.commentEditorForm.value.content = '';
    this.commentEditorForm.value.photo = null;
    if (this.mode == CommentEditorMode.Add) {
      // add new comment/reply to post
      console.log('canceling add...........', this.comment);

      _.set(this.originComment, 'isCreatingNewReply', false);
      // this.eventEmitter.emit(new CancelAddCommentEvent(this.comment));

    } else if(this.mode == CommentEditorMode.Edit) {
      // update current comment/reply
      console.log('canceling edit...........');
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

    } else if(this.mode == CommentEditorMode.Edit) {

      // update current comment/reply
      this.comment.content = this.commentEditorForm.value.content;
      event = new CommentUpdateEvent(this.comment);
    }
    this.eventEmitter.emit(event);
    this.comment.content = '';
    this.comment.photo = null;
  }

  doEvents(response: any) {
    switch (response.action) {
      case 'remove':
        this.comment.photo = null;
        // _.remove(this.comment.photos, (photo: any) =>{
        //   return photo.uuid == response.data.uuid;
        // });
        break;
      case 'cancelUploadingPhoto':
        break;
    }
  }

  checkValidForm(): boolean {
    return true;
    // if (this.mode == CommentEditorMode.Add) {
    //   return (this.comment.content.length > 0 || this.comment.photo != null);
    // } else if (this.mode == CommentEditorMode.Edit) {
    //   return (this.commentEditorForm.dirty || this.comment.photo != null);
    // }
    // return false;
  }
}

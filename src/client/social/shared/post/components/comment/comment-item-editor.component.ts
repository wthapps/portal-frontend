import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import {
  CommentCreateEvent,
  OpenPhotoModalEvent,
  CommentUpdateEvent,
  CancelEditCommentEvent,
  CancelReplyCommentEvent,
  ReplyCreateEvent,
  ReplyUpdateEvent,
  CancelEditReplyCommentEvent, DeleteCommentEvent, DeleteReplyEvent
} from '../../../../events/social-events';
import { SoPost } from '../../../../../core/shared/models/social_network/so-post.model';
import { SoComment } from '../../../../../core/shared/models/social_network/so-comment.model';
export enum ZSocialCommentBoxType {
  Add,
  Edit,
  Reply,
  EditReply,
}

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'comment-item-editor',
  templateUrl: 'comment-item-editor.component.html',
})

export class CommentItemEditorComponent implements OnInit {
  @Input() item: SoPost;
  @Input() comment: SoComment;
  @Input() reply: SoComment;
  @Input() type: any = ZSocialCommentBoxType.Add;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  commentContent: string = '';
  commentBoxType = ZSocialCommentBoxType;
  hasUploadingPhoto: boolean = false;
  files: any;
  mode: string = 'add'; // 'add' or 'edit'


  constructor() {

  }

  ngOnInit() {
    if (this.type == this.commentBoxType.Edit) {
      this.commentContent = this.comment.content;
    }
    if (this.type == this.commentBoxType.EditReply) {
      this.commentContent = this.reply.content;
    }
    $('.js-textarea-autoheight').each(function () {
      this.setAttribute('style', 'height: 40px; overflow:hidden; word-wrap: break-word; resize: none; padding-right: 50px;');
    }).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }


  onKey(e: any) {
    // Create, Update, Reply
    if (e.keyCode == 13 && this.commentContent != '') {
      this.commentAction();
    }
    // Cancel comment
    if (e.keyCode == 27) {
      this.cancel();
    }
  }
  /*
  * Now we just support ONE photo
  * */
  addPhoto(photo: any) {
    this.comment.photos.push(photo);
  }

  createComment(params: any) {

    let comment: any = {};
    if ('photo' in params) {
      comment.photo = params.photo;
    }
    if ('content' in params) {
      comment.content = params.content || '';
    }
    console.log('comment:: before:::', this.comment, comment);
    this.comment = comment;
    console.log('comment:: after:::', this.comment, comment);
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
    data.content = this.commentContent;
    if (this.type == this.commentBoxType.Add) {
      data.post_uuid = this.item.uuid;
      commentEvent = new CommentCreateEvent(data);
    }
    if (this.type == this.commentBoxType.Edit) {
      data.uuid = this.comment.uuid;
      commentEvent = new CommentUpdateEvent(data);
    }
    if (this.type == this.commentBoxType.Reply) {
      data.comment_uuid = this.comment.uuid;
      data.post_uuid = this.item.uuid;
      commentEvent = new ReplyCreateEvent(data);
    }
    if (this.type == this.commentBoxType.EditReply) {
      data.comment_uuid = this.comment.uuid;
      data.reply_uuid = this.reply.uuid;
      commentEvent = new ReplyUpdateEvent(data);
    }
    this.eventEmitter.emit(commentEvent);
    this.commentContent = '';
  }

  onOpenPhotoSelect() {
    this.eventEmitter.emit(new OpenPhotoModalEvent(this));

  }

  cancel() {
    // if (this.type == this.commentBoxType.Edit) {
    //   this.eventEmitter.emit(new CancelEditCommentEvent(this.comment));
    //   this.commentContent = this.comment.content;
    // }
    // if (this.type == this.commentBoxType.Reply) {
    //   this.eventEmitter.emit(new CancelReplyCommentEvent(this.comment));
    // }
    // if (this.type == this.commentBoxType.EditReply) {
    //   this.eventEmitter.emit(new CancelEditReplyCommentEvent(this.reply));
    // }
    if (this.mode == 'add') {
      // add new comment/reply to post
      console.log('canceling add...........');

    } else if(this.mode == 'edit') {
      // update current comment/reply
      console.log('canceling edit...........');

    }

  }

  post() {
    if (this.mode == 'add') {
      // add new comment/reply to post
      console.log('adding add...........');


    } else if(this.mode == 'edit') {
      // update current comment/reply
      console.log('canceling edit...........');

    }
  }
}

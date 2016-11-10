import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommentCreateEvent, OpenPhotoModalEvent, CommentUpdateEvent, CancelEditCommentEvent, CancelReplyCommentEvent, ReplyCreateEvent, ReplyUpdateEvent, CancelEditReplyCommentEvent } from '../../../events/social-events';
import { SoPost } from '../../../../../shared/models/social_network/so-post.model';
import { SoComment } from '../../../../../shared/models/social_network/so-comment.model';

export enum ZSocialCommentBoxType {
  Add,
  Edit,
  Reply,
  EditReply,
}

@Component({
  moduleId: module.id,
  selector: 'comment-box',
  templateUrl: 'comment-box.component.html',
})

export class ZSocialCommentBoxComponent implements OnInit{
  @Input() item: SoPost;
  @Input() comment: SoComment;
  @Input() reply: SoComment;
  @Input() type: any = ZSocialCommentBoxType.Add;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  commentContent: string = '';
  commentBoxType = ZSocialCommentBoxType;

  ngOnInit() {
    if (this.type == this.commentBoxType.Edit) {
      this.commentContent = this.comment.content
    }
    if (this.type == this.commentBoxType.EditReply) {
      this.commentContent = this.reply.content
    }
  }

  onKey(e:any) {
    // Create, Update, Reply
    if(e.keyCode == 13 && this.commentContent != "") {
      this.commentAction();
    }
    // Cancel comment
    if(e.keyCode == 27) {
      this.cancel();
    }
  }

  commentAction(photos?:any) {
    let commentEvent:any;
    let data:any = {};
    if (photos) data.photo = photos[0].id;
    data.content = this.commentContent;
    if (this.type == this.commentBoxType.Add) {
      commentEvent = new CommentCreateEvent(data);
    }
    if (this.type == this.commentBoxType.Edit) {
      data.uuid = this.comment.uuid;
      commentEvent = new CommentUpdateEvent(data);
    }
    if (this.type == this.commentBoxType.Reply) {
      data.comment_uuid = this.comment.uuid;
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
    if (this.type == this.commentBoxType.Edit) {
      this.eventEmitter.emit(new CancelEditCommentEvent(this.comment));
      this.commentContent = this.comment.content;
    }
    if (this.type == this.commentBoxType.Reply) {
      this.eventEmitter.emit(new CancelReplyCommentEvent(this.comment));
    }
    if (this.type == this.commentBoxType.EditReply) {
      this.eventEmitter.emit(new CancelEditReplyCommentEvent(this.reply));
    }
  }
}

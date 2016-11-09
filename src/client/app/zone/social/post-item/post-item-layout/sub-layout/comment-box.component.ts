import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommentCreateEvent, OpenPhotoModalEvent, CommentUpdateEvent, CancelEditCommentEvent, CancelReplyCommentEvent, ReplyCreateEvent } from '../../../events/social-events';
import { SoPost } from '../../../../../shared/models/social_network/so-post.model';
import { SoComment } from '../../../../../shared/models/social_network/so-comment.model';

@Component({
  moduleId: module.id,
  selector: 'comment-box',
  templateUrl: 'comment-box.component.html',
})

export class ZSocialCommentBoxComponent implements OnInit{
  @Input() item: SoPost;
  @Input() comment: SoComment;
  @Input() type: number;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  newComment: string = '';
  editComment: string = '';
  newReply: string = '';
  commentData: SoComment;

  ngOnInit() {
    if (this.comment) {
      this.editComment = this.comment.content
    }
  }

  onKey(e:any) {
    // Create
    if(e.keyCode == 13 && this.newComment != "") {
      let createCommentEvent = new CommentCreateEvent({content: this.newComment});
      this.eventEmitter.emit(createCommentEvent);
    }
    // Update
    if(e.keyCode == 13 && this.editComment != "") {
      let commentUpdateEvent = new CommentUpdateEvent({content: this.editComment, uuid: this.comment.uuid});
      this.eventEmitter.emit(commentUpdateEvent);
    }
    if(e.keyCode == 13 && this.newReply != "") {
      let replyCreateEvent = new ReplyCreateEvent({content: this.newReply, comment_uuid: this.comment.uuid});
      this.eventEmitter.emit(replyCreateEvent);
    }
    // Cancel comment
    if(e.keyCode == 27 && this.type == 2) {
      this.cancelComment()
    }
    // Cancel reply
    if(e.keyCode == 27 && this.type == 3) {
      this.cancelReply();
    }
  }

  onOpenPhotoSelect() {
    this.eventEmitter.emit(new OpenPhotoModalEvent({comment: this.comment, type: this.type}));
  }

  cancelComment() {
    this.eventEmitter.emit(new CancelEditCommentEvent(this.comment));
    this.editComment = this.comment.content;
  }

  cancelReply() {
    this.eventEmitter.emit(new CancelReplyCommentEvent(this.comment));
  }
}

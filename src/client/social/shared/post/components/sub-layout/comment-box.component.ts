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
import { PhotoModalDataService } from '../../../services/photo-modal-data.service';
import { BaseZoneSocialItem } from '../../../../base/base-social-item';
import { Subscription } from 'rxjs';

export enum ZSocialCommentBoxType {
  Add,
  Edit,
  Reply,
  EditReply,
}

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'comment-box',
  templateUrl: 'comment-box.component.html',
})

export class ZSocialCommentBoxComponent implements OnInit, OnDestroy {
  @Input() item: SoPost;
  @Input() comment: SoComment;
  @Input() reply: SoComment;
  @Input() type: any = ZSocialCommentBoxType.Add;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  commentContent: string = '';
  commentBoxType = ZSocialCommentBoxType;

  // Subscription objects
  // photoSelectDataSubscription : Subscription;
  nextPhotoSubscription : Subscription;

  constructor(private photoSelectDataService : PhotoModalDataService) {

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

  ngOnDestroy() {

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

  // onActions(event: BaseEvent) {
  //   // Create a comment
  //   if (event instanceof CommentCreateEvent) {
  //     this.createComment(event.data).subscribe(
  //       (res: any) => {
  //         // this.item = new SoPost().from(res.data);
  //         // this.mapDisplay();
  //         let post = new SoPost().from(res.data);
  //         _.uniqBy(this.item.comments.unshift(...post.comments),'uuid');
  //         this.mapDisplay();
  //       }
  //     );
  //   }
  //   // Update a comment
  //   if (event instanceof CommentUpdateEvent) {
  //     this.updateComment(event.data).subscribe(
  //       (res: any) => {
  //         this.item = new SoPost().from(res.data);
  //         this.mapDisplay();
  //       }
  //     );
  //   }
  //   // Delete a comment
  //   if (event instanceof DeleteCommentEvent) {
  //     this.deleteComment(event.data.uuid).subscribe(
  //       (res: any) => {
  //         this.item = new SoPost().from(res.data);
  //         this.mapDisplay();
  //       }
  //     );
  //   }
  //   // Create a reply
  //   if (event instanceof ReplyCreateEvent) {
  //     this.createReply(event.data).subscribe(
  //       (res: any) => {
  //         this.item = new SoPost().from(res.data);
  //         this.mapDisplay();
  //       }
  //     );
  //   }
  //
  //   // Update a reply
  //   if (event instanceof ReplyUpdateEvent) {
  //     this.updateReply(event.data).subscribe(
  //       (res: any) => {
  //         this.item = new SoPost().from(res.data);
  //         this.mapDisplay();
  //       }
  //     );
  //   }
  //
  //   // Delete a reply
  //   if (event instanceof DeleteReplyEvent) {
  //     this.deleteReply(event.data).subscribe(
  //       (res: any) => {
  //         this.item = new SoPost().from(res.data);
  //         this.mapDisplay();
  //       }
  //     );
  //   }
  //
  // }

  onOpenPhotoSelect() {
    this.eventEmitter.emit(new OpenPhotoModalEvent(this));
    console.log("inside onOpenPhotoSelect");
    // this.photoSelectDataService.open(new OpenPhotoModalEvent(this));

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

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit, OnDestroy, ChangeDetectionStrategy
} from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import {
  DeleteCommentEvent,
  CancelEditCommentEvent,
  CancelReplyCommentEvent,
  DeleteReplyEvent,
  ViewMoreCommentsEvent
} from '../../../events/social-events';
import { CommentEditorMode } from './comment/comment-item-editor.component';
import { PostComponent } from '../post.component';
import { PostService } from '../shared/post.service';
import { SoComment, SoPost } from '@wth/shared/shared/models';
import { PhotoService, UserService } from '@shared/services';
import { Constants, MODEL_TYPE } from '@wth/shared/constant';
import { WTHEmojiCateCode } from '@wth/shared/components/emoji/emoji';

declare var _: any;

@Component({
  selector: 'so-post-footer',
  templateUrl: 'post-footer.component.html'
})
export class PostFooterComponent implements OnInit, OnDestroy {
  @Input() user: any;
  @Input() item: SoPost;
  @Input() type: string;
  @Input() emojiMap: { [name: string]: WTHEmojiCateCode };
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  readonly commentEditorMode = CommentEditorMode;

  readonly actions = {
    onDeleteComment: 1,
    onEditComment: 2,
    onDeleteReply: 3,
    onCreateComment: 4,
    openLikeDislike: 6,
    onShowPhotoDetail: 7
  };

  commentPageIndex = 0;
  readonly commentLimit: number = Constants.soCommentLimit;
  readonly tooltip: any = Constants.tooltip;
  readonly MODEL = MODEL_TYPE;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(private router: Router,
              private postService: PostService,
              public photoService: PhotoService,
              public userService: UserService,
              public postItem: PostComponent) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  viewProfile(uuid: string) {
    this.router.navigate([{outlets: {detail: null}}], {queryParamsHandling: 'preserve' , preserveFragment: true})
      .then(() => this.router.navigate(['profile', uuid]));
  }

  hasLike(comment: any) {
    return _.findIndex(comment.likes, ['owner.uuid', this.userService.getSyncProfile().uuid] ) > -1;
  }

  hasDislike(comment: any) {
    return _.findIndex(comment.dislikes, ['owner.uuid', this.userService.getSyncProfile().uuid] ) > -1;
  }

  onActions(action: any, params?: any) {
    console.log('action::::', action, params);
    const { data, comment, parent, commentType } = params;
    switch (action) {
      case this.actions.onDeleteComment:
        this.eventEmitter.emit(new DeleteCommentEvent(data));
        break;
      case this.actions.onEditComment:
        const currentComment = data;
        currentComment.isEditting = true;
        break;
      case this.actions.onDeleteReply:
        this.eventEmitter.emit(new DeleteReplyEvent({reply_uuid: data.uuid}));
        break;
      case this.actions.onCreateComment:
        _.set(parent, 'isCreatingNewReply', true);
        break;
      case this.actions.openLikeDislike:
        this.postItem.openLikeDislike(data, commentType);
        break;
      case this.actions.onShowPhotoDetail:
        // this.router.navigate([{outlets: {modal: ['photos', type, {ids: [type], post_uuid: this.item.uuid}]}}]);
        this.router.navigate([{
          outlets: {
            modal: [
              'preview',
              comment.photo.uuid || data,
              {
                object: 'comment',
                parent_uuid: comment.uuid,
                only_preview: true
              }
            ]
          }
        }], { queryParamsHandling: 'preserve', preserveFragment: true });
        break;
    }
  }


  onCallBack(event: any) {
    if (event instanceof CancelEditCommentEvent) {
      event.data.isEditting = false;
      return;
    }
    if (event instanceof CancelReplyCommentEvent) {
      event.data.isEditting = false;
      return;
    }

    this.eventEmitter.emit(event);
  }

  mapComment(comment: any) {
    return new SoComment().from(comment);
  }

  trackItem(index: any, item: any) {
    return item ? item.id : undefined;
  }

  getMoreComments() {
    const body = {'post_uuid': this.item.uuid, 'page_index': this.commentPageIndex, 'limit': this.commentLimit};
    this.postService.loadComments(body)
      .toPromise().then((result: any) => {
          if (this.commentPageIndex === 0) {
            // this.item.comments.length = 0; // Clear comments data in the first loading
            this.item.comments = _.map(result.data.comments, this.mapComment);
          } else {
            const cloneItem = this.item.comments.push(..._.map(result.data.comments, this.mapComment));
            this.item = _.clone(cloneItem); // clone this item to notify parent components
          }

          this.commentPageIndex += 1;

          //  Update comments for (parent) post component
          this.eventEmitter.emit(new ViewMoreCommentsEvent(this.item));

        },
        (error: any) => {
          console.error('Cannot get more comments: ' + error);
        });

  }

  totalRepliesInWords(replies: any) {
    const repCount = replies.length > 1 ? 'replies' : 'reply';
    return `${replies.length} ${repCount}`;
  }

}

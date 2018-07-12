import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges, OnInit, OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';

import { filter } from 'rxjs/operators/filter';
import { Subject } from 'rxjs/Subject';
import { take } from 'rxjs/operators/take';

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
import { Constants } from '@wth/shared/constant';
import { WTHEmojiService } from '@wth/shared/components/emoji/emoji.service';
import { WTHEmojiPipe } from '@wth/shared/components/emoji/emoji.pipe';

declare var _: any;

@Component({
  selector: 'so-post-footer',
  templateUrl: 'post-footer.component.html',
})
export class PostFooterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() user: any;
  @Input() item: SoPost;
  @Input() type: string;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();
  commentEditorMode = CommentEditorMode;

  actions = {
    onDeleteComment: 1,
    onEditComment: 2,
    onDeleteReply: 3,
    onCreateComment: 4,
    openLikeDislike: 6,
    onShowPhotoDetail: 7
  };

  showInfo: boolean = false;
  totalComment: number = 1;
  commentPageIndex: number = 0;
  loadingDone: boolean = false;
  readonly commentLimit: number = Constants.soCommentLimit;
  readonly tooltip: any = Constants.tooltip;

  private emojiPipe: WTHEmojiPipe;
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(private router: Router,
              private postService: PostService,
              private wthEmojiService: WTHEmojiService,
              public photoService: PhotoService,
              public userService: UserService,
              public postItem: PostComponent) {
    this.emojiPipe = new WTHEmojiPipe(this.wthEmojiService);
  }

  ngOnInit() {
    this.emojifyData();
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  ngOnChanges(data: any) {
    if (this.type == 'info') {
      this.showInfo = true;
    }
    this.totalComment = +this.item.comment_count;
    this.loadingDone = (this.totalComment === 0 ) || (this.totalComment <= _.get(this.item, 'comments.length', 0));
    this.emojifyData();
  }

  emojifyData() {
    this.wthEmojiService.name2baseCodeMap$.pipe(
      filter(map => Object.keys(map).length > 0),
      take(1)
    ).subscribe(map => {
      this.item.comments.forEach(comment => {
        comment.transformedContent = this.emojiPipe.transform(comment.content);

        comment.comments.forEach(reply => {
          reply.transformedContent = this.emojiPipe.transform(reply.content);
        });
      })
    });
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
    let type = params.commentType;
    let data = params.data;
    let comment = params.comment;
    switch (action) {
      case this.actions.onDeleteComment:
        this.eventEmitter.emit(new DeleteCommentEvent(data));
        break;
      case this.actions.onEditComment:
        let currentComment = data;
        let commentType = type;
        currentComment.isEditting = true;
        break;
      case this.actions.onDeleteReply:
        this.eventEmitter.emit(new DeleteReplyEvent({reply_uuid: data.uuid}));
        break;
      case this.actions.onCreateComment:
        let parent = params.parent;
        let parentType = params.parentType;
        _.set(parent, 'isCreatingNewReply', true);
        break;
      case this.actions.openLikeDislike:
        this.postItem.openLikeDislike(data, type);
        break;
      case this.actions.onShowPhotoDetail:
        // this.router.navigate([{outlets: {modal: ['comments', data, 'photos', type, {ids: [type]}]}}]);
        this.router.navigate([{outlets: {modal: ['photos', type, {ids: [type], post_uuid: this.item.uuid}]}}]);
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
    // this.viewAllComments();
  }

  mapComment(comment: any) {
    return new SoComment().from(comment);
  }

  trackItem(index: any, item: any) {
    return item ? item.id : undefined;
  }

  getMoreComments() {
    let body = {'post_uuid': this.item.uuid, 'page_index': this.commentPageIndex, 'limit': this.commentLimit};
    this.postService.loadComments(body)
      .toPromise().then((result: any) => {
          if (this.commentPageIndex == 0) {
            // this.item.comments.length = 0; // Clear comments data in the first loading
            this.item.comments = _.map(result.data.comments, this.mapComment);
          } else {
            let cloneItem = this.item.comments.push(..._.map(result.data.comments, this.mapComment));
            this.item = _.clone(cloneItem); // clone this item to notify parent components
          }
          if (result.loading_done)
            this.loadingDone = result.loading_done;

          this.commentPageIndex += 1;

          //  Update comments for (parent) post component
          this.eventEmitter.emit(new ViewMoreCommentsEvent(this.item));

        },
        (error: any) => {
          console.error('Cannot get more comments: ' + error);
        });

  }

  totalRepliesInWords(replies: any) {
    let repCount = replies.length > 1 ? 'replies' : 'reply';
    return `${replies.length} ${repCount}`;
  }

}

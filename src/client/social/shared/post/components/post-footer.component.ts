import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { ConfirmationService } from 'primeng/components/common/api';
import {
  DeleteCommentEvent,
  CancelEditCommentEvent,
  CancelReplyCommentEvent,
  DeleteReplyEvent,
  CancelEditReplyCommentEvent, ViewMoreCommentsEvent, ReplyCreateEvent
} from '../../../events/social-events';
import { CommentEditorMode } from './comment/comment-item-editor.component';
import { PostComponent } from '../post.component';
import { SoPost } from '../../../../core/shared/models/social_network/so-post.model';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';
import { LoadingService } from '../../../../core/shared/components/loading/loading.service';
import { ToastsService } from '../../../../core/shared/components/toast/toast-message.service';
import { UserService } from '../../../../core/shared/services/user.service';
import { PostService } from '../shared/post.service';
import { Constants } from '../../../../core/shared/config/constants';
import { SoComment } from '../../../../core/shared/models/social_network/so-comment.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-footer',
  templateUrl: 'post-footer.component.html',
})

export class PostFooterComponent implements OnChanges {

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

  hasLike: boolean = false;
  hasDislike: boolean = false;
  showInfo: boolean = false;
  // showComments: boolean = false;
  totalComment: number = 1;
  commentPageIndex: number = 0;
  loadingDone: boolean = false;
  user$: Observable<any>;
  readonly commentLimit: number = Constants.soCommentLimit;

  constructor(private apiBaseService: ApiBaseService,
              private loading: LoadingService,
              private confirmation: ConfirmationService,
              private toast: ToastsService,
              private router: Router,
              private postService: PostService,
              public userService: UserService,
              public postItem: PostComponent) {
    this.user$ = this.userService.profile$;
  }

  ngOnChanges(data: any) {
    if (this.type == 'info') {
      this.showInfo = true;
    }
    this.totalComment = this.item.comment_count;
    if(this.totalComment === 0 || this.totalComment <= this.item.comments.length)
      this.loadingDone = true;
  }

  onActions(action: any, params?: any) {
    let type = params.commentType;
    let data = params.data;
    switch (action) {
      case this.actions.onDeleteComment:
        this.eventEmitter.emit(new DeleteCommentEvent(data));
        break;
      case this.actions.onEditComment:
        let currentComment = data;
        let commentType = type;

        console.log('editing..........:', data);
        // show edit comment form
        // $('#editComment-' + currentComment.uuid).show();

        // hide current comment content
        // $('#comment-' + currentComment.uuid).hide();

        currentComment.isEditting = true;
        break;
      case this.actions.onDeleteReply:
        this.eventEmitter.emit(new DeleteReplyEvent({reply_uuid: data.uuid}));
        break;
      case this.actions.onCreateComment:
        let parent = params.parent;
        let parentType = params.parentType;

        console.log('replying..........:', parent);

        // this.eventEmitter.emit(new ReplyCreateEvent(data));
        // $('#reply-' + parent.uuid).show();
        _.set(parent, 'isCreatingNewReply', true);
        break;
      case this.actions.openLikeDislike:
        this.postItem.openLikeDislike(data, type);
        break;
      case this.actions.onShowPhotoDetail:
        // this.router.navigate(['/photos', this.item.uuid, {index: data}]);

        this.router.navigate(['/comments',  data, 'photos', type, {ids: [type]}]);
        break;
    }
  }


  onCallBack(event: any) {
    // console.log('data:::::::', event);
    if (event instanceof CancelEditCommentEvent) {
      // $('#editComment-' + event.data.uuid).hide();
      // $('#comment-' + event.data.uuid).show();

      event.data.isEditting = false;
      return;
    }
    if (event instanceof CancelReplyCommentEvent) {
      // $('#reply-' + event.data.uuid).hide();
      event.data.isEditting = false;
      return;
    }

    this.eventEmitter.emit(event);
    // this.viewAllComments();
  }

  notAllCommentsLoaded() {
    return ( this.totalComment > 0  && !this.loadingDone);
    // return ( this.totalComment > 0  && !this.loadingDone) || ( this.item.comments.length < this.item.total_comments);
  }

  mapComment(comment: any) {
    return new SoComment().from(comment);
  }

  getMoreComments() {
    // if (this.loadingDone) {
    //   console.error('All comments are loaded!')
    //   return;
    // }

    let body = { 'post_uuid' : this.item.uuid, 'page_index' : this.commentPageIndex, 'limit' : this.commentLimit };
    this.postService.loadComments(body)
      .subscribe((result: any) => {
          console.log('Get more comments successfully');
          if ( this.commentPageIndex == 0 ) {
            // this.item.comments.length = 0; // Clear comments data in the first loading
            this.item.comments = _.map(result.data.comments, this.mapComment);
          } else {
            let cloneItem = this.item.comments.push(..._.map(result.data.comments, this.mapComment));
            this.item = _.clone(cloneItem); // clone this item to notify parent components
          }
          if(result.loading_done)
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

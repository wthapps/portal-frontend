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
  CancelEditReplyCommentEvent, ViewMoreCommentsEvent
} from '../../../events/social-events';
import { ZSocialCommentBoxType } from './sub-layout/comment-box.component';
import { PostComponent } from '../post.component';
import { SoPost } from '../../../../core/shared/models/social_network/so-post.model';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';
import { LoadingService } from '../../../../core/partials/loading/loading.service';
import { ToastsService } from '../../../../core/partials/toast/toast-message.service';
import { UserService } from '../../../../core/shared/services/user.service';
import { PostService } from '../shared/post.service';
import { Constants } from '../../../../core/shared/config/constants';
import { SoComment } from '../../../../core/shared/models/social_network/so-comment.model';

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
  commentBoxType = ZSocialCommentBoxType;

  actions = {
    onDeleteComment: 1,
    onEditComment: 2,
    onDeleteReply: 3,
    onReply: 4,
    openLikeDislike: 6
  };

  hasLike: boolean = false;
  hasDislike: boolean = false;
  showInfo: boolean = false;
  // showComments: boolean = false;
  totalComment: number = 1;
  commentPageIndex: number = 0;
  loadingDone: boolean = false;
  readonly commentLimit: number = Constants.soCommentLimit;

  constructor(private apiBaseService: ApiBaseService,
              private loading: LoadingService,
              private confirmation: ConfirmationService,
              private toast: ToastsService,
              private userService: UserService,
              private postService: PostService,
              public postItem: PostComponent) {
  }

  ngOnChanges() {
    if (this.type == 'info') {
      this.showInfo = true;
    }
    this.totalComment = this.item.total_comments;
  }

  onActions(action: any, data: any, type?: any) {
    switch (action) {
      case this.actions.onDeleteComment:
        this.eventEmitter.emit(new DeleteCommentEvent(data));
        break;
      case this.actions.onEditComment:
        $('#editComment-' + data.uuid).show();
        $('#comment-' + data.uuid).hide();
        break;
      case this.actions.onDeleteReply:
        this.eventEmitter.emit(new DeleteReplyEvent({reply_uuid: data.uuid}));
        break;
      case this.actions.onReply:
        $('#reply-' + data.uuid).show();
        break;
      case this.actions.openLikeDislike:
        this.postItem.openLikeDislike(data, type);
        break;
    }
  }

  onCallBack(event: any) {
    if (event instanceof CancelEditCommentEvent || event instanceof CancelEditReplyCommentEvent) {
      $('#editComment-' + event.data.uuid).hide();
      $('#comment-' + event.data.uuid).show();
      return;
    }
    if (event instanceof CancelReplyCommentEvent) {
      $('#reply-' + event.data.uuid).hide();
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

}

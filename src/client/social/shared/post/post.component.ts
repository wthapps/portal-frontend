import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter
} from '@angular/core';
import {
  PostActivitiesComponent
} from './index';
import { ZSocialCommentBoxType, ZSocialCommentBoxComponent } from './components/sub-layout/comment-box.component';
import { PostLikeDislikeComponent } from './post-likedislike.component';
import { SoPost } from '../../../core/shared/models/social_network/so-post.model';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { ToastsService } from '../../../core/partials/toast/toast-message.service';
import { Constants } from '../../../core/shared/config/constants';
import {
  CommentCreateEvent, CommentUpdateEvent, ReplyCreateEvent, ReplyUpdateEvent,
  DeleteReplyEvent, OpenPhotoModalEvent, DeleteCommentEvent, ViewMoreCommentsEvent
} from '../../events/social-events';
import { BaseZoneSocialItem } from '../../base/base-social-item';
import { PhotoModalDataService } from '../../../core/shared/services/photo-modal-data.service';
import { Subscription } from 'rxjs';
import { SoComment } from '../../../core/shared/models/social_network/so-comment.model';
import { BaseEvent } from '../../../core/shared/event/base-event';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post',
  templateUrl: 'post.component.html'
})

export class PostComponent extends BaseZoneSocialItem implements OnInit, OnChanges {
  @ViewChild('postActivities') postActivities: PostActivitiesComponent;
  @ViewChild('postLikeDislike') postLikeDislike: PostLikeDislikeComponent;

  @Input() item: SoPost = new SoPost();
  @Input() type: string = '';
  @Output() onEdited: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();

  @Output() modalOpened: EventEmitter<any> = new EventEmitter<any>();
  @Output() photoModalOpened: EventEmitter<any> = new EventEmitter<any>();

  // @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;
  commentBox: ZSocialCommentBoxComponent;
  commentBoxType = ZSocialCommentBoxType;

  itemDisplay: any;
  typeLikeDislike: any;
  dataLikeDislike: any;

  // Subscription list
  closePhotoSubscription : Subscription;
  nextPhotoSubscription: Subscription;
  dismissPhotoSubscription: Subscription;


  constructor(public apiBaseService: ApiBaseService,
              private loading: LoadingService,
              private confirmation: ConfirmationService,
              private photoSelectDataService: PhotoModalDataService,
              private toast: ToastsService) {
    super();
  }

  ngOnInit() {
    // this.photoModal.action = 'DONE';
    // this.photoModal.photoList.multipleSelect = false;
    this.photoSelectDataService.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'].currentValue.id != undefined) {
    }
    if (!this.item) {
      this.item = new SoPost();
    }
    this.mapDisplay();
    // if(changes['item'].currentValue.parent) {
    //   this.parentItem = changes['item'].currentValue.parent;
    // }
  }

  mapDisplay(): any {
    // Clone object to display
    this.itemDisplay = _.cloneDeep(this.item);
    this.itemDisplay.tags = this.item['tags_json'];
    // handle css
    this.addCarouselCss();
    // handle photo remain
    this.getRemainPhotos();
    // Right Photos than 6 will be remove for display
    this.removeRightPhotos();
    // handle user privacy
    this.privacyDisplay();
    // classify reaction
    // this.classifyReactions();
  }

  addCarouselCss() {
    this.itemDisplay.displayCss = 'carousel-thumb-style-' + this.itemDisplay.photos.length;
    if (this.itemDisplay.photos.length > 6) {
      this.itemDisplay.displayCss = 'carousel-thumb-style-6';
    }
    if (this.itemDisplay.parent != null && this.itemDisplay.parent != undefined) {
      this.itemDisplay.parent.displayCss = 'carousel-thumb-style-' + this.itemDisplay.parent.photos.length;
      if (this.itemDisplay.parent.photos.length > 6) {
        this.itemDisplay.parent.displayCss = 'carousel-thumb-style-6';
      }
    }
  }

  getRemainPhotos() {
    if (this.itemDisplay.photos.length > 6) {
      this.itemDisplay.remainPhotos = this.itemDisplay.photos.length - 6;
    }
  }

  removeRightPhotos() {
    while (this.itemDisplay.photos.length > 6) {
      this.itemDisplay.photos = _.dropRight(this.itemDisplay.photos);
    }
  }

  classifyReactions() {
    this.itemDisplay.reactions_dislike = new Array<any>();
    this.itemDisplay.reactions_like = new Array<any>();
    this.itemDisplay.reactions_share = new Array<any>();
    this.itemDisplay.reactions.forEach((reaction: any) => {
      switch (reaction.reaction) {
        case 'dislike':
          this.itemDisplay.reactions_dislike.push(reaction);
          break;
        case 'like':
          this.itemDisplay.reactions_like.push(reaction);
          break;
        case 'share':
          this.itemDisplay.reactions_share.push(reaction);
          break;
      }
    });
  }

  privacyDisplay() {
    switch (this.itemDisplay.privacy.toLowerCase()) {
      case Constants.soPostPrivacy.public.data:
        this.itemDisplay.privacyDisplay = Constants.soPostPrivacy.public;
        break;
      case Constants.soPostPrivacy.personal.data:
        this.itemDisplay.privacyDisplay = Constants.soPostPrivacy.personal;
        break;
      case Constants.soPostPrivacy.friends.data:
        this.itemDisplay.privacyDisplay = Constants.soPostPrivacy.friends;
        break;
      case Constants.soPostPrivacy.customFriend.data:
        this.itemDisplay.privacyDisplay = Constants.soPostPrivacy.customCommunity;
        break;
      default:
        this.itemDisplay.privacyDisplay = Constants.soPostPrivacy.unknown;
    }
  }

  /**
   * Post actions
   */

  viewDetail() {
    console.log('viewing details..........');
    // this.posts.viewDetail();
  }

  edit() {
    this.modalOpened.emit({mode: 'edit', post: this.itemDisplay});
  }

  update(attr: any = {}) {
    console.log('attt ', attr);
    this.apiBaseService.put(`${Constants.urls.zoneSoPosts}/${this.item['uuid']}`, attr)
      .subscribe((result: any) => {
          // this.item = result['data'];
          _.merge(this.item, new SoPost().from(result['data']).excludeComments());
          this.mapDisplay();
        },
        ( error : any ) => {

        }
      );
  }

  delete() {
    this.confirmation.confirm({
      message: 'Are you sure you want to delete this Post?',
      header: 'Delete Post',
      accept: () => {
        this.loading.start();
        this.apiBaseService.delete(`${Constants.urls.zoneSoPosts}/${this.item['uuid']}`)
          .subscribe((result: any) => {
              this.toast.success('Deleted post successfully', 'Delete Post');
              this.loading.stop();
              this.onDeleted.emit(result);
            },
            error => {
              this.toast.danger('Deleted post error\n' + error, 'Delete Post');
              this.loading.stop();
            }
          );
      }
    });
  }

  editedPost(newPost: any) {
    this.itemDisplay.description = newPost.description;
    this.itemDisplay.tags = newPost.tags_json;
    this.itemDisplay.photos = newPost.photos;
    this.onUpdated.emit(newPost);
  }

  onActions(event: BaseEvent) {
    // Create a comment
    if (event instanceof CommentCreateEvent) {
      this.createComment(event.data).subscribe(
        (res: any) => {
          // this.item = new SoPost().from(res.data);
          // this.mapDisplay();
          let comment = new SoComment().from(res.data);
          _.uniqBy(this.item.comments.unshift(comment),'uuid');
          this.item.total_comments += 1;
          this.mapDisplay();
        }
      );
    }
    // Update a comment
    if (event instanceof CommentUpdateEvent) {
      this.updateComment(event.data).subscribe(
        (res: any) => {
          // let updatedComment = new SoComment().from(res.data);
          // _.forEach(this.item.comments, (comment: SoComment, index : any) => {
          //   if (comment.uuid == updatedComment.uuid)
          //     this.item.comments[index] = updatedComment;
          // });
          this.updateItemComments(res.data);

          this.mapDisplay();
        }
      );
    }
    // Delete a comment
    if (event instanceof DeleteCommentEvent) {
      this.deleteComment(event.data.uuid).subscribe(
        (res: any) => {
          // this.item = new SoPost().from(res.data);
          _.remove(this.item.comments, {uuid: event.data.uuid});
          this.mapDisplay();
        }
      );
    }
    // Create a reply
    if (event instanceof ReplyCreateEvent) {
      this.createReply(event.data).subscribe(
        (res: any) => {
          // this.item = new SoPost().from(res.data);
          this.updateItemComments(res.data);
          this.mapDisplay();
        }
      );
    }

    // Update a reply
    if (event instanceof ReplyUpdateEvent) {
      this.updateReply(event.data).subscribe(
        (res: any) => {
          // this.item = new SoPost().from(res.data);
          this.updateItemComments(res.data);
          this.mapDisplay();
        }
      );
    }

    // Delete a reply
    if (event instanceof DeleteReplyEvent) {
      this.deleteReply(event.data).subscribe(
        (res: any) => {
          // this.item = new SoPost().from(res.data);
          this.updateItemComments(res.data);
          this.mapDisplay();
        }
      );
    }

    // Open photo modal
    if (event instanceof OpenPhotoModalEvent) {
      this.commentBox = event.data;
      // this.photoModalOpened.emit(this.commentBox);
      this.openPhotoModal(this.commentBox);

    }

    // View more comments
    if (event instanceof ViewMoreCommentsEvent) {
      this.syncComments(event.data);
    }

  }

  syncComments(post: any) {
    _.merge(this.item, post);
    console.log('Synced comments', this.item);
  }


  mapPost(post: any) {
    return new SoPost().from(post);
  }

  mapComment(comment: any) {
    return new SoComment().from(comment);
  }

  openPhotoModal(data: any) {
    this.photoSelectDataService.open(data);

    this.subscribePhotoEvents();
  }


  onSelectPhotoComment(photos: any) {
    if (this.commentBox) {
      this.commentBox.commentAction(photos);
    }
    // this.photoModal.close();
  }

  openShare() {
    this.modalOpened.emit({mode: 'add', parent: this.item, isShare: true});
  }

  openActivities() {
    this.postActivities.open({item: this.item});
  }

  openLikeDislike(data: any, type: any) {
    this.typeLikeDislike = type;
    this.dataLikeDislike = data;
    this.postLikeDislike.modal.open();
  }

  save(post: any) {
    this.item = post;
  }

  // createReaction(data:any) {
  //   this.apiBaseServiceV2.post(this.apiBaseServiceV2.urls.zoneSoReactions, data).subscribe(
  //     (res:any) => {
  //       this.item = new SoPost().from(res.data);
  //       this.mapDisplay();
  //     }
  //   );
  // }

  createReaction(event: any, reaction: string, object: string, uuid: string) {
    if ($(event.target).hasClass('active')) {
      $(event.target).removeClass('active');
    } else {
      $(event.target).closest('ul').find('.fa').removeClass('active');
      $(event.target).addClass('active');
    }

    let data = {reaction: reaction, reaction_object: object, uuid: uuid};
    this.apiBaseService.post(this.apiBaseService.urls.zoneSoReactions, data).subscribe(
      (res: any) => {
        // this.item = new SoPost().from(res.data);
        _.merge(this.item, new SoPost().from(res.data).excludeComments());
        this.mapDisplay();
      }
    );
  }

  private updateItemComments(data: any) {
    let updatedComment = new SoComment().from(data);
    _.forEach(this.item.comments, (comment: SoComment, index : any) => {
      if (comment.uuid == updatedComment.uuid)
        this.item.comments[index] = updatedComment;
    });
  }


  private subscribePhotoEvents() {
    // Subscribe actions corresponding with photo modal actions

    if (!this.nextPhotoSubscription || this.nextPhotoSubscription.closed) {
      this.nextPhotoSubscription = this.photoSelectDataService.nextObs$.subscribe(
        (photos: any) => {
          this.commentBox.commentAction(photos);
        },
        (error : any) => { console.error(error); }
      );
    }

    if (!this.dismissPhotoSubscription || this.dismissPhotoSubscription.closed) {
      this.dismissPhotoSubscription = this.photoSelectDataService.dismissObs$.subscribe(
        () => {
          this.unsubscribePhotoEvents();
        },
        (error : any) => { console.error(error); }
      );
    }

    if (!this.closePhotoSubscription || this.closePhotoSubscription.closed) {
      this.closePhotoSubscription = this.photoSelectDataService.closeObs$.subscribe(
        () => {
          this.unsubscribePhotoEvents();
        },
        (error : any) => { console.error(error); }
      );
    }
  }

  private unsubscribePhotoEvents() {
    [this.closePhotoSubscription, this.nextPhotoSubscription, this.dismissPhotoSubscription].forEach((sub : Subscription) => {
      if(sub && !sub.closed)
        sub.unsubscribe();
    });
  }
}


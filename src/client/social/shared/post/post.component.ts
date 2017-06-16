import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter, OnDestroy, ViewContainerRef, ComponentFactoryResolver, Type
} from '@angular/core';
import {
  PostActivitiesComponent
} from './index';
import { CommentEditorMode, CommentItemEditorComponent } from './components/comment/comment-item-editor.component';
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
import { Subscription, Observable } from 'rxjs';
import { SoComment } from '../../../core/shared/models/social_network/so-comment.model';
import { BaseEvent } from '../../../core/shared/event/base-event';
import { PhotoUploadService } from '../../../core/shared/services/photo-upload.service';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/from';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post',
  templateUrl: 'post.component.html'
})

export class PostComponent extends BaseZoneSocialItem implements OnInit, OnChanges, OnDestroy {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;


  @Input() item: SoPost = new SoPost();
  @Input() type: string = '';
  @Output() onEdited: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();

  @Output() modalOpened: EventEmitter<any> = new EventEmitter<any>();
  @Output() photoModalOpened: EventEmitter<any> = new EventEmitter<any>();

  commentEditor: CommentItemEditorComponent;
  commentBoxType = CommentEditorMode;

  itemDisplay: any;
  typeLikeDislike: any;
  dataLikeDislike: any;
  showComments: boolean = true;
  modal: any;

  // Subscription list
  nextPhotoSubscription: Subscription;
  uploadPhotoSubscription: Subscription;


  constructor(public apiBaseService: ApiBaseService,
              private loading: LoadingService,
              private confirmation: ConfirmationService,
              private photoSelectDataService: PhotoModalDataService,
              private photoUploadService: PhotoUploadService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private toast: ToastsService) {
    super();
  }

  ngOnInit() {
    // this.photoModal.action = 'DONE';
    // this.photoModal.photoList.multipleSelect = false;
    this.photoSelectDataService.init({multipleSelect: false});
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

  ngOnDestroy() {
    this.unsubscribePhotoEvents();
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
        (error: any) => {

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
    // console.log('create post', event);
    // return;


    if (event instanceof CommentCreateEvent) {
      let self: any = this;
      this.createComment(event.data).subscribe(
        (res: any) => {
          console.log('response data', res.data);

          if (res.data.parent_type == 'SocialNetwork::Post') {
            let comment = new SoComment().from(res.data);
            _.uniqBy(this.item.comments.unshift(comment), 'uuid');
            this.item.comment_count += 1;

          } else if (res.data.parent_type == 'SocialNetwork::Comment') {
            // this.updateItemComments(res.data);
            let newReply: any = res.data;
            let commentIndex = _.findIndex(this.item.comments, (comment: SoComment) => {
              return newReply.parent.uuid == comment.uuid;
            });
            this.item.comments[commentIndex].comments.push(newReply);
          }

          this.mapDisplay();
        }
      );
    }
    // Update a comment
    if (event instanceof CommentUpdateEvent) {
      this.updateComment(event.data).subscribe(
        (res: any) => {
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
          let deletedReply: any = res.data;
          let commentIndex = _.findIndex(this.item.comments, (comment: SoComment) => {
            return deletedReply.parent.uuid == comment.uuid;
          });

          _.remove(this.item.comments[commentIndex].comments, {uuid: deletedReply.uuid});
          this.mapDisplay();

        }
      );
    }

    // Open photo modal
    if (event instanceof OpenPhotoModalEvent) {
      this.commentEditor = event.data;
      Object.assign(this.commentEditor, {multipleSelect: false});
      this.openPhotoModal(event.data);

      this.subscribePhotoEvents();
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
    if (this.commentEditor) {
      this.commentEditor.commentAction(photos);
    }
    // this.photoModal.close();
  }

  openShare() {
    this.modalOpened.emit({mode: 'add', parent: this.item, isShare: true});
  }

  openActivities() {
    this.createModalComponent(PostActivitiesComponent);
    this.modal.open({item: this.item});
  }

  openLikeDislike(data: any, type: any) {
    this.createModalComponent(PostLikeDislikeComponent);
    this.modal.open({item: data, type: type});
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  save(post: any) {
    this.item = post;
  }

  createModalComponent(component: any) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(componentFactory);
    this.modal = this.modalComponent.instance;
  }


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
        // _.merge(this.item, new SoPost().from(res.data).excludeComments());
        this.updateItemReactions(object, res.data);
        this.mapDisplay();
      }
    );
  }

  private updateItemReactions(object: string, data: any) {

    // // update reactions for comment
    if (object == 'post') {
      this.updateReactionsSet(this.item, data);
    } else if (object == 'comment') {
      // update reaction for reply
      let done: boolean = false;
      _.forEach(this.item.comments, (comment: SoComment, index: any) => {
        if (comment.uuid == data.self.uuid) {
          this.updateReactionsSet(this.item.comments[index], data);
          return;
        }
        // TODO: Handle multi-level replies case
        _.forEach(this.item.comments[index].comments, (reply: SoComment, i2: any) => {
          if (reply.uuid == data.self.uuid) {
            this.updateReactionsSet(this.item.comments[index].comments[i2], data);
            done = true;
            return;
          }
          if (done)
            return;
        })
        ;
      });
    }
  }

  private updateReactionsSet(srcObj: any, data: any) {
    srcObj.reactions = data.reactions;
    srcObj.likes = data.likes;
    srcObj.dislikes = data.dislikes;
    srcObj.shares = data.shares;
  }

  private updateItemComments(data: any) {
    let updatedComment = new SoComment().from(data);

    _.forEach(this.item.comments, (comment: SoComment, index: any) => {
      // Update comment items
      if (data.parent_type !== 'SocialNetwork::Comment' && (comment.uuid == updatedComment.uuid))
      {
        this.item.comments[index] = updatedComment;
        return;
      }
      // Update the reply items
      else if (data.parent_type === 'SocialNetwork::Comment' && comment.uuid === _.get(updatedComment, 'parent.uuid')) {
        _.forEach(this.item.comments[index].comments, (reply: SoComment, j: any) => {
          if (reply.uuid === _.get(updatedComment, 'uuid')) {
            this.item.comments[index].comments[j] = updatedComment;
            return;
          }
        })
      }
    });


  }


  private subscribePhotoEvents() {
    // Subscribe actions corresponding with photo modal actions

    // let closeObs$ = this.photoSelectDataService.dismissObs$.merge(this.photoSelectDataService.closeObs$, this.photoSelectDataService.openObs$);
    let closeObs$ = this.photoSelectDataService.dismissObs$.merge(this.photoSelectDataService.closeObs$);

    if (this.notAssignedSubscription(this.nextPhotoSubscription)) {
      this.nextPhotoSubscription = this.photoSelectDataService.nextObs$.takeUntil(closeObs$).subscribe(
        (photos: any) => {
          this.commentEditor.setCommentAttributes({photo: photos[0]});
          // this.commentEditor.commentAction(photos);
        },
        (error: any) => {
          console.error(error);
        }
      );
    }

    if (this.notAssignedSubscription(this.uploadPhotoSubscription)) {
      this.uploadPhotoSubscription = this.photoSelectDataService.uploadObs$.takeUntil(closeObs$)
        .mergeMap((files: any) => {
          this.commentEditor.updateAttributes({hasUploadingPhoto: true, files: files});
          return this.photoUploadService.uploadPhotos(files);
          // return Observable.from(['']);
        }).subscribe(
          (response: any) => {
            console.log('response data: ', response.data);
            // this.commentEditor.commentAction([res['current_photo']]);
            this.commentEditor.setCommentAttributes({photo: response.data});
            this.commentEditor.updateAttributes({hasUploadingPhoto: false});
            // this.commentEditor.commentAction([res['data']]);
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  private notAssignedSubscription(sub: Subscription) {
    return !sub || sub.closed;
  }

  private unsubscribePhotoEvents() {
    [this.nextPhotoSubscription, this.uploadPhotoSubscription].forEach((sub: Subscription) => {
      if (sub && !sub.closed)
        sub.unsubscribe();
    });
  }
}


import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter, OnDestroy, ViewContainerRef, ComponentFactoryResolver
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { SoStorageService } from './../../services/social-storage.service';
import { CommentItemEditorComponent } from './components/comment/comment-item-editor.component';
import { PostLikeDislikeComponent } from './post-likedislike.component';

import {
  CommentCreateEvent, CommentUpdateEvent, ReplyCreateEvent, ReplyUpdateEvent,
  DeleteReplyEvent, DeleteCommentEvent, ViewMoreCommentsEvent
} from '../../events/social-events';
import { BaseZoneSocialItem } from '../../base/base-social-item';
import { SoComment, SoPost } from '@wth/shared/shared/models';
import { ApiBaseService, PhotoService } from '@wth/shared/services';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@shared/constant';
import { BaseEvent } from '@shared/shared/event/base-event';
import { PostActivitiesComponent } from './post-activities.component';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';

@Component({
  selector: 'so-post',
  templateUrl: 'post.component.html'
})

export class PostComponent extends BaseZoneSocialItem implements OnInit, OnChanges, OnDestroy {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  @Input() user: any;
  @Input() item: SoPost = new SoPost();
  @Input() type = '';
  @Input() showComments = true;
  @Input() emojiMap: { [name: string]: WTHEmojiCateCode };
  @Output() onDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();

  @Output() modalOpened: EventEmitter<any> = new EventEmitter<any>();
  @Output() photoModalOpened: EventEmitter<any> = new EventEmitter<any>();

  itemDisplay: any;
  privacyName: string;
  commentLoadingDone = false;
  modal: any;

  private destroySubject: Subject<any> = new Subject<any>();


  constructor(public apiBaseService: ApiBaseService,
              private soStorageService: SoStorageService,
              private photoService: PhotoService,
              private loading: LoadingService,
              private mediaSelectionService: WMediaSelectionService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private toast: ToastsService,
              private wthConfirmService: WthConfirmService) {
    super();

    this.photoService.modifiedPhotos$
      .pipe(
        filter((object: any) =>
        _.get(object, 'payload.post_uuid', -99) === this.item.uuid
        || _.get(object, 'payload.post_uuid', -99) === _.get(this.item, 'parentItem.uuid')),
        takeUntil(this.destroySubject.asObservable())
      )
      .subscribe((object: any) => {
        const post: SoPost = _.get(object, 'payload.post');
        switch (object.action) {
          case 'update':
            const updatedPhoto = object.payload.photo;
            let tempItem = _.cloneDeep(this.item);
            // Update post photos
            tempItem = this.updatePhotoForPost(tempItem, updatedPhoto);

            // Update parentPost as well
            if (tempItem.parent_post) {
              tempItem.parent_post = this.updatePhotoForPost(tempItem.parent_post, updatedPhoto);
            }

            this.item = tempItem;
            this.mapDisplay();
            break;
          case 'delete':
            console.log('unimplemented DELETE photo in post: ', object);
            break;
        }
      });
  }

  ngOnInit() {
    this.mediaSelectionService.setMultipleSelection(false);
    this.mapDisplay();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.item) {
      this.item = new SoPost();
    }
    this.mapDisplay();
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  updatePhotoForPost(post: any, updatedPhoto: any): any {
    post.photos = this.updatePhoto(post.photos, updatedPhoto);

    for (let i = 0; i < post.comments.length; i++) {
      if (post.comments[i].photo) {
        post.comments[i].photo = _.get(this.updatePhoto([post.comments[i].photo], updatedPhoto), '0');
      }
    }
    return post;
  }

  updatePhoto(currentPhotos: any[], updatedPhoto: any): any[] {
    return _.map(currentPhotos, (photo: any) => (( photo.id === updatedPhoto.id ) ? updatedPhoto : photo)
    );
  }

  edit() {
    this.modalOpened.emit({mode: 'edit', post: this.item});
  }

  update(attr: any = {}) {
    this.apiBaseService.put(`${Constants.urls.zoneSoPosts}/${this.item['uuid']}`, attr)
      .toPromise().then((result: any) => {
          // this.item = result['data'];
          _.merge(this.item, new SoPost().from(result['data']).excludeComments());
          this.updateStoragePost();
          this.mapDisplay();
        }
      );
  }

  delete() {
    this.wthConfirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      message: 'Are you sure you want to delete this Post?',
      header: 'Delete Post',
      accept: () => {
        this.loading.start();
        this.apiBaseService.delete(`${Constants.urls.zoneSoPosts}/${this.item['uuid']}`)
          .toPromise().then((result: any) => {
              this.toast.success('Deleted post successfully');
              this.loading.stop();
              this.onDeleted.emit(result);
            },
            error => {
              this.toast.danger('Deleted post error\n' + error);
              this.loading.stop();
            }
          );
      }
    });
  }

  onActions(event: BaseEvent) {
    if (event instanceof CommentCreateEvent) {
      const self: any = this;
      this.createComment(event.data).toPromise().then(
        (res: any) => {
          if (res.data.parent_type === 'SocialNetwork::Post') {
            const comment = new SoComment().from(res.data);
            _.uniqBy(this.item.comments.unshift(comment), 'uuid');
            this.item.comment_count += 1;

          } else if (res.data.parent_type === 'SocialNetwork::Comment') {
            const newReply: any = res.data;
            const commentIndex = _.findIndex(this.item.comments, (comment: SoComment) => {
              return newReply.parent.uuid === comment.uuid;
            });
            this.item.comments[commentIndex].comments.unshift(newReply);
          }

          this.updateStoragePost();
          this.mapDisplay();
        }
      );
    }
    // Update a comment
    if (event instanceof CommentUpdateEvent) {
      this.updateComment(event.data).toPromise().then(
        (res: any) => {
          this.updateItemComments(res.data);

          this.mapDisplay();
        }
      );
    }
    // Delete a comment
    if (event instanceof DeleteCommentEvent) {
      this.deleteComment(event.data.uuid).toPromise().then(
        (res: any) => {
          // this.item = new SoPost().from(res.data);
          _.remove(this.item.comments, {uuid: event.data.uuid});
          this.updateStoragePost();
          this.mapDisplay();
        }
      );
    }
    // Create a reply
    if (event instanceof ReplyCreateEvent) {
      this.createReply(event.data).toPromise().then(
        (res: any) => {
          // this.item = new SoPost().from(res.data);
          this.updateItemComments(res.data);
          this.mapDisplay();
        }
      );
    }

    // Update a reply
    if (event instanceof ReplyUpdateEvent) {
      this.updateReply(event.data).toPromise().then(
        (res: any) => {
          // this.item = new SoPost().from(res.data);
          this.updateItemComments(res.data);
          this.mapDisplay();
        }
      );
    }

    // Delete a reply
    if (event instanceof DeleteReplyEvent) {
      this.deleteReply(event.data).toPromise().then(
        (res: any) => {
          const deletedReply: any = res.data;
          const commentIndex = _.findIndex(this.item.comments, (comment: SoComment) => {
            return deletedReply.parent.uuid === comment.uuid;
          });

          _.remove(this.item.comments[commentIndex].comments, {uuid: deletedReply.uuid});
          this.updateStoragePost();
          this.mapDisplay();

        }
      );
    }

    // View more comments
    if (event instanceof ViewMoreCommentsEvent) {
      this.syncComments(event.data);
      this.updateStoragePost();
    }
  }

  syncComments(post: any) {
    _.merge(this.item, post);
    this.mapDisplay();
  }


  openShare() {
    this.modalOpened.emit({mode: 'add', parent: this.item.parent_post || this.item, isShare: true});
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
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
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

    const data = {reaction: reaction, reaction_object: object, uuid: uuid};
    this.apiBaseService.post(this.apiBaseService.urls.zoneSoReactions, data).toPromise().then(
      (res: any) => {
        this.updateItemReactions(object, Object.assign({}, data, res.data));
        this.mapDisplay();
      }
    );
  }

  private updateStoragePost() {
    // this.soStorageService.updatePost(_.cloneDeep(this.item));
  }

  private mapDisplay(): any {
    // Clone object to display
    this.itemDisplay = _.cloneDeep(this.item);
    this.itemDisplay.tags = this.item['tags_json'];
    this.privacyName = this.getPrivacyName(this.item);
    const totalComment = this.item.comment_count;
    this.itemDisplay.commentLoadingDone = (totalComment === 0)
    || (totalComment <= _.get(this.item, 'comments.length', 0));
    // handle css
    this.addCarouselCss();
    // handle photo remain
    this.getRemainPhotos();
    // Right Photos than 6 will be remove for display
    this.removeRightPhotos();
    // // handle user privacy
    // this.privacyDisplay();
    // classify reaction
    // this.classifyReactions();
  }

  private addCarouselCss() {
    this.itemDisplay.displayCss = 'carousel-thumb-style-' + this.itemDisplay.photos.length;
    if (this.itemDisplay.photos.length > 6) {
      this.itemDisplay.displayCss = 'carousel-thumb-style-6';
    }
    if (this.itemDisplay.parent != null && this.itemDisplay.parent !== undefined) {
      this.itemDisplay.parent.displayCss = 'carousel-thumb-style-' + this.itemDisplay.parent.photos.length;
      if (this.itemDisplay.parent.photos.length > 6) {
        this.itemDisplay.parent.displayCss = 'carousel-thumb-style-6';
      }
    }
  }

  private getRemainPhotos() {
    if (this.itemDisplay.photos.length > 6) {
      this.itemDisplay.remainPhotos = this.itemDisplay.photos.length - 6;
    }
  }

  private removeRightPhotos() {
    this.itemDisplay.photos.splice(6);
  }

  private getPrivacyName(post: SoPost): string {
    if (post.privacy === Constants.soPostPrivacy.customCommunity.data && post.custom_objects.length === 1) {
      return post.custom_objects[0].name;
    }
    return (post.privacy ? post.privacy.replace('_', ' ') : '');
  }


  private updateItemReactions(object: string, data: any) {

    // // update reactions for comment
    if (object === 'post') {
      this.updateReactionsSet(this.item, data);
    } else if (object === 'comment') {
      // update reaction for reply
      let done = false;
      _.forEach(this.item.comments, (comment: SoComment, index: any) => {
        if (comment.uuid === data.uuid) {
          this.updateReactionsSet(this.item.comments[index], data);
          return;
        }
        _.forEach(this.item.comments[index].comments, (reply: SoComment, i2: any) => {
          if (reply.uuid === data.uuid) {
            this.updateReactionsSet(this.item.comments[index].comments[i2], data);
            done = true;
            return;
          }
          if (done) {
            return;
          }
        })
        ;
      });
    }
    this.updateStoragePost();

  }

  private updateReactionsSet(srcObj: any, data: any) {
    srcObj.reactions = _.get(data, 'reactions', []);
    srcObj.likes = _.get(data, 'likes', []);
    srcObj.dislikes = _.get(data, 'dislikes', []);
    srcObj.shares = _.get(data, 'shares', []);
  }

  private updateItemComments(data: any) {
    const updatedComment = new SoComment().from(data);

    _.forEach(this.item.comments, (comment: SoComment, index: any) => {
      // Update comment items
      if (data.parent_type !== 'SocialNetwork::Comment' && (comment.uuid === updatedComment.uuid)) {
        this.item.comments[index] = updatedComment;
        return;
      }
      // Update the reply items
      if (data.parent_type === 'SocialNetwork::Comment' && comment.uuid === _.get(updatedComment, 'parent.uuid')) {
      _.forEach(this.item.comments[index].comments, (reply: SoComment, j: any) => {
        if (reply.uuid === _.get(updatedComment, 'uuid')) {
          this.item.comments[index].comments[j] = updatedComment;
          return;
        }
        });
      }
    });
    this.updateStoragePost();
  }
}

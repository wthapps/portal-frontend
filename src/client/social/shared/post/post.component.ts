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

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/merge';

import {
  PostActivitiesComponent
} from './index';
import { CommentEditorMode, CommentItemEditorComponent } from './components/comment/comment-item-editor.component';
import { PostLikeDislikeComponent } from './post-likedislike.component';
import { SoPost } from '../../../core/shared/models/social_network/so-post.model';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { ToastsService } from '../../../core/shared/components/toast/toast-message.service';
import { Constants } from '../../../core/shared/config/constants';
import {
  CommentCreateEvent, CommentUpdateEvent, ReplyCreateEvent, ReplyUpdateEvent,
  DeleteReplyEvent, OpenPhotoModalEvent, DeleteCommentEvent, ViewMoreCommentsEvent
} from '../../events/social-events';
import { BaseZoneSocialItem } from '../../base/base-social-item';
import { PhotoModalDataService } from '../../../core/shared/services/photo-modal-data.service';
import { SoComment } from '../../../core/shared/models/social_network/so-comment.model';
import { BaseEvent } from '../../../core/shared/event/base-event';
import { PhotoUploadService } from '../../../core/shared/services/photo-upload.service';
import { PhotoService } from '../../../core/shared/services/photo.service';
import { WTHConfirmService } from '../../../core/shared/services/wth-confirm.service';


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

  private destroySubject: Subject<any> = new Subject<any>();


  constructor(public apiBaseService: ApiBaseService,
              private photoService: PhotoService,
              private loading: LoadingService,
              private confirmation: ConfirmationService,
              private photoSelectDataService: PhotoModalDataService,
              private photoUploadService: PhotoUploadService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private toast: ToastsService,
              private wthConfirmService: WTHConfirmService) {
    super();

    this.photoService.modifiedPhotos$
      .filter((object: any) => _.get(object, 'payload.post_uuid', -99) == this.item.uuid || _.get(object, 'payload.post_uuid', -99) == _.get(this.item, 'parentItem.uuid'))
      .takeUntil(this.destroySubject.asObservable())
      .subscribe((object: any) => {
        console.debug('modifiedPhotos - post: ', object);
        let post: SoPost = _.get(object, 'payload.post');
        switch(object.action) {
          case 'update':
            let updatedPhoto = object.payload.photo;
            let tempItem = _.cloneDeep(this.item);
            // Update post photos
            console.debug('item before update: ', tempItem, this.item);
            tempItem = this.updatePhotoForPost(tempItem, updatedPhoto);

            // Update parentPost as well
            if(tempItem.parent_post) {
              tempItem.parent_post = this.updatePhotoForPost(tempItem.parent_post, updatedPhoto);
            }

            this.item = tempItem;
            this.mapDisplay();
            console.debug('item after update: ', tempItem);
            break;
          case 'delete':
            console.debug('unimplemented DELETE photo in post: ', object);
            break;
        }
      });
  }

  ngOnInit() {
    this.photoSelectDataService.init({multipleSelect: false});
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['item'].currentValue.id != undefined) {
    // }
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

    for(let i = 0; i < post.comments.length; i++) {
      if(post.comments[i].photo) {
        post.comments[i].photo = _.get(this.updatePhoto([post.comments[i].photo], updatedPhoto), '0');
      }
    }
    return post;
  }

  updatePhoto(currentPhotos: any[], updatedPhoto: any): any[] {
    return _.map(currentPhotos, (photo: any) => {
        if( photo.id === updatedPhoto.id )
          return updatedPhoto
        else
          return photo
      }
    );
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
    // // handle user privacy
    // this.privacyDisplay();
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
    // while (this.itemDisplay.photos.length > 6) {
    //   this.itemDisplay.photos = _.dropRight(this.itemDisplay.photos);
    // }
    this.itemDisplay.photos.splice(6);
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

  edit() {
    this.modalOpened.emit({mode: 'edit', post: this.item});
  }

  update(attr: any = {}) {
    console.log('attt ', attr);
    this.apiBaseService.put(`${Constants.urls.zoneSoPosts}/${this.item['uuid']}`, attr)
      .toPromise().then((result: any) => {
          // this.item = result['data'];
          _.merge(this.item, new SoPost().from(result['data']).excludeComments());
          this.mapDisplay();
        }
      );
  }

  delete() {
    // this.wthConfirmService.updateConfirmDialog({
    //   label: {
    //     accept: 'Delete',
    //     reject: 'Cancel',
    //   }
    // });

    this.confirmation.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      message: 'Are you sure you want to delete this Post?',
      header: 'Delete Post',
      accept: () => {
        this.loading.start();
        this.apiBaseService.delete(`${Constants.urls.zoneSoPosts}/${this.item['uuid']}`)
          .toPromise().then((result: any) => {
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
    if (event instanceof CommentCreateEvent) {
      let self: any = this;
      this.createComment(event.data).toPromise().then(
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
    this.apiBaseService.post(this.apiBaseService.urls.zoneSoReactions, data).toPromise().then(
      (res: any) => {
        this.updateItemReactions(object, Object.assign({}, data, res.data));
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
        if (comment.uuid == data.uuid) {
          this.updateReactionsSet(this.item.comments[index], data);
          return;
        }
        _.forEach(this.item.comments[index].comments, (reply: SoComment, i2: any) => {
          if (reply.uuid == data.uuid) {
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
    srcObj.reactions = _.get(data, 'reactions', []);
    srcObj.likes = _.get(data, 'likes', []);
    srcObj.dislikes = _.get(data, 'dislikes', []);
    srcObj.shares = _.get(data, 'shares', []);
  }

  private updateItemComments(data: any) {
    let updatedComment = new SoComment().from(data);

    _.forEach(this.item.comments, (comment: SoComment, index: any) => {
      // Update comment items
      if (data.parent_type !== 'SocialNetwork::Comment' && (comment.uuid == updatedComment.uuid)) {
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
      };
    });
  }


  private subscribePhotoEvents() {
    // Subscribe actions corresponding with photo modal actions
    let closeObs$ = this.photoSelectDataService.dismissObs$.merge(this.photoSelectDataService.openObs$, this.photoSelectDataService.closeObs$, this.destroySubject.asObservable());

    this.photoSelectDataService.nextObs$.takeUntil(closeObs$).subscribe(
        (photos: any) => {
          this.commentEditor.setCommentAttributes({photo: photos[0]});
        },
        (error: any) => {
          console.error(error);
        }
      );

    this.photoSelectDataService.uploadObs$.takeUntil(closeObs$)
      .mergeMap((files: any) => {
        this.commentEditor.updateAttributes({hasUploadingPhoto: true, files: files});
        return this.photoUploadService.uploadPhotos(files);
      }).subscribe(
        (response: any) => {
          console.log('response data: ', response.data);
          this.commentEditor.setCommentAttributes({photo: response.data});
          this.commentEditor.updateAttributes({hasUploadingPhoto: false});
        },
        (error: any) => {
          console.error(error);
        }
      );
  }
}


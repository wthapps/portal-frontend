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
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { BaseZoneSocialItem } from '../base/base-social-item';
import { ConstantsSocial } from '../base/constants-social';
import { ApiBaseService } from '../../../shared/services/apibase.service';
import { Constants } from '../../../shared/config/constants';
import { LoadingService, ToastsService, ConfirmationService } from '../../../shared/index';
import {
  CommentCreateEvent, OpenPhotoModalEvent, DeleteCommentEvent,
  CommentUpdateEvent, ReplyCreateEvent, ReplyUpdateEvent, DeleteReplyEvent
} from '../events/social-events';
import {
  PostPhotoSelectComponent,
  PostActivitiesComponent
} from './index';
import { ZSocialCommentBoxType, ZSocialCommentBoxComponent } from './components/sub-layout/comment-box.component';
import { PostLikeDislikeComponent } from './post-likedislike.component';

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

  @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;
  commentBox: ZSocialCommentBoxComponent;
  commentBoxType = ZSocialCommentBoxType;

  itemDisplay: any;
  typeLikeDislike: any;
  dataLikeDislike: any;


  constructor(public apiBaseService: ApiBaseService,
              private loading: LoadingService,
              private confirmation: ConfirmationService,
              private toast: ToastsService) {
    super();
  }

  ngOnInit() {
    this.photoModal.action = 'DONE';
    this.photoModal.photoList.multipleSelect = false;
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
      case ConstantsSocial.userPrivacy.public.data:
        this.itemDisplay.privacyDisplay = ConstantsSocial.userPrivacy.public;
        break;
      case ConstantsSocial.userPrivacy.private.data:
        this.itemDisplay.privacyDisplay = ConstantsSocial.userPrivacy.private;
        break;
      case ConstantsSocial.userPrivacy.friends.data:
        this.itemDisplay.privacyDisplay = ConstantsSocial.userPrivacy.friends;
        break;
      case ConstantsSocial.userPrivacy.custom_friend.data:
        this.itemDisplay.privacyDisplay = ConstantsSocial.userPrivacy.custom_friend;
        break;
      default:
        this.itemDisplay.privacyDisplay = ConstantsSocial.userPrivacy.unknow;
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
          this.item = result['data'];
          this.mapDisplay();
        },
        error => {

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
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }
    // Update a comment
    if (event instanceof CommentUpdateEvent) {
      this.updateComment(event.data).subscribe(
        (res: any) => {
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }
    // Delete a comment
    if (event instanceof DeleteCommentEvent) {
      this.deleteComment(event.data.uuid).subscribe(
        (res: any) => {
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }
    // Create a reply
    if (event instanceof ReplyCreateEvent) {
      this.createReply(event.data).subscribe(
        (res: any) => {
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }

    // Update a reply
    if (event instanceof ReplyUpdateEvent) {
      this.updateReply(event.data).subscribe(
        (res: any) => {
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }

    // Delete a reply
    if (event instanceof DeleteReplyEvent) {
      this.deleteReply(event.data).subscribe(
        (res: any) => {
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }

    // Open photo modal
    if (event instanceof OpenPhotoModalEvent) {
      this.commentBox = event.data;
      this.photoModal.open(true);
    }
  }

  onSelectPhotoComment(photos: any) {
    if (this.commentBox) {
      this.commentBox.commentAction(photos);
    }
    this.photoModal.close();
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
        this.item = new SoPost().from(res.data);
        this.mapDisplay();
      }
    );
  }
}


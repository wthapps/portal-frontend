import { Component, ElementRef, ViewChild, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { SoPost } from "../../../shared/models/social_network/so-post.model";
import { BaseZoneSocialItem } from "../base/base-social-item";
import { ConstantsSocial } from "../base/constants-social";
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';
import { Constants } from '../../../shared/config/constants';
import { LoadingService, ToastsService, ConfirmationService } from '../../../shared/index';
import { PostEditComponent } from '../post/post-edit.component';

import {
  CommentCreateEvent, OpenPhotoModalEvent, DeleteCommentEvent,
  CommentUpdateEvent, ReplyCreateEvent, ReplyUpdateEvent, DeleteReplyEvent
} from '../events/social-events';
import { PostPhotoSelectComponent } from '../post/post-photo-select.component';

import { ZSocialPostItemFooterComponent } from './post-item-layout/post-item-footer.component';
import { PostPhotoSelectComponent, PostShareComponent, PostEditComponent, PostActivitiesComponent } from '../post/index';
import { ZSocialCommentBoxType, ZSocialCommentBoxComponent } from './post-item-layout/sub-layout/comment-box.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item',
  templateUrl: 'post-item.component.html'
})

export class ZSocialPostItemComponent extends BaseZoneSocialItem implements OnInit, OnChanges {
  @ViewChild('postEdit') postEdit: PostEditComponent;
  @ViewChild('postShare') postShare: PostShareComponent;
  @ViewChild('postActivities') postActivities: PostActivitiesComponent;

  @Input() item: SoPost = new SoPost();
  @Input() type: string = '';
  @Output() onEdited: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;
  commentBox: ZSocialCommentBoxComponent;
  commentBoxType = ZSocialCommentBoxType;

  itemDisplay: any;

  constructor(
    public apiBaseServiceV2: ApiBaseServiceV2,
    private loading: LoadingService,
    private confirmation: ConfirmationService,
    private toast: ToastsService
  ) {
    super();
  }

  ngOnInit() {
    this.photoModal.action = "DONE";
    this.photoModal.photoList.multipleSelect = false;
  }

  ngOnChanges() {
    if (!this.item) {
      this.item = new SoPost();
    }
    this.mapDisplay();
  }

  mapDisplay() {
    // Clone object to display
    this.itemDisplay = _.cloneDeep(this.item);
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
      default:
        this.itemDisplay.privacyDisplay = ConstantsSocial.userPrivacy.public;
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
    this.postEdit.open({mode: 'edit', post: this.itemDisplay});
  }

  update(attr: any={}) {
    this.apiBaseServiceV2.put(`${Constants.urls.zoneSoPosts}/${this.item['uuid']}`, {post: attr})
      .subscribe((result: any) => {
        this.item = result['data'];
        this.mapDisplay();
        this.postEdit.post = this.itemDisplay;
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
        this.apiBaseServiceV2.delete(`${Constants.urls.zoneSoPosts}/${this.item['uuid']}`)
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
    this.itemDisplay.tags = newPost.tags;
    this.itemDisplay.photos = newPost.photos;
  }

  onActions(event:BaseEvent) {
    // Create a comment
    if (event instanceof CommentCreateEvent) {
      this.createComment(event.data).subscribe(
        (res:any) => {
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }
    // Update a comment
    if (event instanceof CommentUpdateEvent) {
      this.updateComment(event.data).subscribe(
        (res:any) => {
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }
    // Delete a comment
    if (event instanceof DeleteCommentEvent) {
      this.deleteComment(event.data.uuid).subscribe(
        (res:any) => {
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }
    // Create a reply
    if (event instanceof ReplyCreateEvent) {
      this.createReply(event.data).subscribe(
        (res:any) => {
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }

    // Update a reply
    if (event instanceof ReplyUpdateEvent) {
      this.updateReply(event.data).subscribe(
        (res:any) => {
          this.item = new SoPost().from(res.data);
          this.mapDisplay();
        }
      );
    }

    // Delete a reply
    if (event instanceof DeleteReplyEvent) {
      this.deleteReply(event.data).subscribe(
        (res:any) => {
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

  onSelectPhotoComment(photos:any) {
    if (this.commentBox) {
      this.commentBox.commentAction(photos);
    }
    this.photoModal.close();
  }

  openShare() {
    this.postShare.modal.open();
  }

  openActivities() {
    this.postActivities.modal.open();
  }

  // createReaction(data:any) {
  //   this.apiBaseServiceV2.post(this.apiBaseServiceV2.urls.zoneSoReactions, data).subscribe(
  //     (res:any) => {
  //       this.item = new SoPost().from(res.data);
  //       this.mapDisplay();
  //     }
  //   );
  // }

  createReaction(reaction:string, object:string, uuid:string) {
    let data = {reaction: reaction, reaction_object: object, uuid: uuid};
    this.apiBaseServiceV2.post(this.apiBaseServiceV2.urls.zoneSoReactions, data).subscribe(
      (res:any) => {
        this.item = new SoPost().from(res.data);
        this.mapDisplay();
      }
    );
  }
}


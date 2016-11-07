import { Component, ElementRef, ViewChild, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { SoPost } from "../../../shared/models/social_network/so-post.model";
import { BaseZoneSocialItem } from "../base/base-social-item";
import { ConstantsSocial } from "../base/constants-social";
import { ZSocialPostListComponent } from '../post-list/post-list.component';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';
import { Constants } from '../../../shared/config/constants';
import { LoadingService, ToastsService, ConfirmationService } from '../../../shared/index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item',
  templateUrl: 'post-item.component.html'
})

export class ZSocialPostItemComponent extends BaseZoneSocialItem implements OnInit, OnChanges {
  @Input() item: SoPost = new SoPost();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEdited: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();

  itemDisplay: any;

  constructor(
    private api: ApiBaseServiceV2,
    private loading: LoadingService,
    private confirmation: ConfirmationService,
    private toast: ToastsService
  ) {
    super();
  }

  ngOnInit() {
    //
  }
  ngOnChanges() {
    if (!this.item) {
      this.item = new SoPost();
    }
    this.itemDisplay = _.cloneDeep(this.item);
    this.mapDisplay();
  }

  mapDisplay() {
    // handle css
    this.addCarouselCss();
    // handle photo remain
    this.getRemainPhotos();
    // Right Photos than 6 will be remove for display
    this.removeRightPhotos();
    // handle user privacy
    this.privacyDisplay();
    // classify reaction
    this.classifyReactions();
  }

  addCarouselCss() {
    this.itemDisplay.displayCss = 'carousel-thumb-style-' + this.itemDisplay.photos.length;
    if (this.itemDisplay.photos.length > 6) {
      this.itemDisplay.displayCss = 'carousel-thumb-style-6';
    }
  }

  getRemainPhotos() {
    if (this.itemDisplay.photos.length > 5) {
      this.itemDisplay.remainPhotos = this.itemDisplay.photos.length - 6 + 1;
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
    this.itemDisplay.reactions.forEach((reaction:any) => {
      switch(reaction.reaction_type) {
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
    switch(this.itemDisplay.privacy) {
      case ConstantsSocial.userPrivacy.public.data:
        this.itemDisplay.privacyDisplay = ConstantsSocial.userPrivacy.public;
        break;
      case ConstantsSocial.userPrivacy.private.data:
        this.itemDisplay.privacyDisplay = ConstantsSocial.userPrivacy.private;
        break;
      case ConstantsSocial.userPrivacy.share.data:
        this.itemDisplay.privacyDisplay = ConstantsSocial.userPrivacy.share;
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
    console.log('editing..................');
    // this.posts.edit();
  }

  update(atts: any) {
    console.log('updating.................');
    // this.posts.update(atts);
  }

  delete() {
    this.confirmation.confirm({
      message: 'Are you sure to delete this Post?',
      header: 'Delete Post',
      accept: () => {
        this.loading.start();
        this.api.delete(`${Constants.urls.zoneSoPosts}/${this.item['uuid']}`)
          .subscribe((result: any) => {
            this.toast.success('Deleted post successfully','Delete Post');
            this.loading.stop();
            this.onDeleted.emit(result);
            },
            error => {
              this.toast.danger('Deleted post error\n' + error,'Delete Post');
              this.loading.stop();
            }
          );
      }
    });
  }

}

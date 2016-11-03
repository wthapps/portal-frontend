import {Component, ElementRef, ViewChild, OnInit, Input, OnChanges} from '@angular/core';
import {SoPost} from "../../../shared/models/social_network/so-post.model";
import {BaseZoneSocialItem} from "../base/base-social-item";
import {ConstantsSocial} from "../base/constants-social";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item',
  templateUrl: 'post-item.component.html'
})

export class ZSocialPostItemComponent extends BaseZoneSocialItem implements OnInit, OnChanges{
  @Input() item: SoPost;
  itemDisplay: any;


  ngOnInit() {
  //
  }
  ngOnChanges() {
    this.itemDisplay = _.cloneDeep(this.item);
    this.mapDisplay();
    console.log(this.itemDisplay);
  }

  mapDisplay() {
    // handle css
    this.addCssDisplayStyle();
    // handle photo remain
    this.getRemainPhotos();
    // Right Photos than 6 will be remove for display
    this.removeRightPhotos();
    // handle user privacy
    this.privacyDisplay();
    // classify reaction
    this.classifyReactions();
  }

  addCssDisplayStyle() {
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
        this.itemDisplay.privacyDisplay =ConstantsSocial.userPrivacy.share;
        break;
      default:
        this.itemDisplay.privacyDisplay = ConstantsSocial.userPrivacy.public;
    }
  }

}

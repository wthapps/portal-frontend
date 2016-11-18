import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  QueryList,
  ViewChildren
} from '@angular/core';
import { BaseZoneSocialItem } from "../../base/base-social-item";
import { SoPost } from "../../../../shared/models/social_network/so-post.model";
import { ToastsService } from '../../../../partials/toast/toast-message.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { LoadingService } from '../../../../partials/loading/loading.service';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import {
  DeleteCommentEvent,
  CancelEditCommentEvent,
  CancelReplyCommentEvent,
  DeleteReplyEvent,
  CancelEditReplyCommentEvent
} from '../../events/social-events';
import { SoComment } from '../../../../shared/models/social_network/so-comment.model';
import { ZSocialCommentBoxComponent, ZSocialCommentBoxType } from './sub-layout/comment-box.component';
import { UserService } from '../../../../shared/services/user.service';
import { ZSocialPostItemComponent } from '../post-item.component';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'post-item-footer',
  templateUrl: 'post-item-footer.component.html',
})

export class ZSocialPostItemFooterComponent extends BaseZoneSocialItem implements OnChanges {

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

  currentUUID: string = '';
  hasLike: boolean = false;
  hasDislike: boolean = false;
  arrDislike: any = [];
  arrLike: any = [];


  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loading: LoadingService,
              private confirmation: ConfirmationService,
              private toast: ToastsService,
              private userService: UserService,
              private postItem: ZSocialPostItemComponent) {
    super();
  }

  showInfo: boolean = false;

  ngOnChanges() {

    /*let _this = this;
     _this.arrLike.length = 0;
     _this.arrDislike.length = 0;

     _.map(this.item.comments, function (v) {
     _.map(v.dislikes, function (v) {
     _this.arrDislike.push(v.owner.uuid);
     });
     console.log("_this.arrDislike:", _this.arrDislike);
     _this.hasDislike = (_this.arrDislike.indexOf(_this.userService.profile.uuid) >= 0) ? true : false;


     _.map(v.likes, function (v) {
     _this.arrLike.push(v.owner.uuid);
     });
     console.log("_this.arrLike:", _this.arrLike);

     _this.hasLike = (_this.arrLike.indexOf(_this.userService.profile.uuid) >= 0) ? true : false;

     });*/


    //this.hasDislike = (this.arrDislike.indexOf(this.userService.profile.uuid) >= 0) ? true : false;

    /*_.map(this.item.dislikes, function (v) {
     _this.arrDislike.push(v.owner.uuid);
     });
     this.hasDislike = (this.arrDislike.indexOf(this.userService.profile.uuid) >= 0) ? true : false;

     _.map(this.item.likes, function (v) {
     _this.arrLike.push(v.owner.uuid);
     });
     this.hasLike = (this.arrLike.indexOf(this.userService.profile.uuid) >= 0) ? true : false;*/


    if (this.type == 'info') {
      this.showInfo = true;
    }
  }

  onActions(action: any, data: any, type?: any) {
    switch (action) {
      case this.actions.onDeleteComment:
        this.eventEmitter.emit(new DeleteCommentEvent(data));
        break;
      case this.actions.onEditComment:
        $("#editComment-" + data.uuid).show();
        $("#comment-" + data.uuid).hide();
        break;
      case this.actions.onDeleteReply:
        this.eventEmitter.emit(new DeleteReplyEvent({reply_uuid: data.uuid}));
        break;
      case this.actions.onReply:
        $("#reply-" + data.uuid).show();
        break;
      case this.actions.openLikeDislike:
        this.postItem.openLikeDislike(data, type);
        break;
    }
  }

  onCallBack(event: any) {
    if (event instanceof CancelEditCommentEvent || event instanceof CancelEditReplyCommentEvent) {
      $("#editComment-" + event.data.uuid).hide();
      $("#comment-" + event.data.uuid).show();
      return;
    }
    if (event instanceof CancelReplyCommentEvent) {
      $("#reply-" + event.data.uuid).hide();
      return;
    }

    this.eventEmitter.emit(event);
  }

}

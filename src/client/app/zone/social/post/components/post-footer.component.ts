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
import { PostComponent } from '../post.component';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-footer',
  templateUrl: 'post-footer.component.html',
})

export class PostFooterComponent extends BaseZoneSocialItem implements OnChanges {

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


  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loading: LoadingService,
              private confirmation: ConfirmationService,
              private toast: ToastsService,
              private userService: UserService,
              private postItem: PostComponent) {
    super();
  }

  showInfo: boolean = false;

  ngOnChanges() {
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

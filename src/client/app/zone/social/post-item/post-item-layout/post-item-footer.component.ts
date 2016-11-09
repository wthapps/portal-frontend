import { Component, ViewChild, OnInit, Input, Output, EventEmitter, OnChanges, QueryList, ViewChildren } from '@angular/core';
import {BaseZoneSocialItem} from "../../base/base-social-item";
import {SoPost} from "../../../../shared/models/social_network/so-post.model";
import { ToastsService } from '../../../../partials/toast/toast-message.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { LoadingService } from '../../../../partials/loading/loading.service';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { DeleteCommentEvent, CancelEditCommentEvent, CancelReplyCommentEvent } from '../../events/social-events';
import { SoComment } from '../../../../shared/models/social_network/so-comment.model';
import { ZSocialCommentBoxComponent } from './sub-layout/comment-box.component';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'post-item-footer',
  templateUrl: 'post-item-footer.component.html',
})

export class ZSocialPostItemFooterComponent extends BaseZoneSocialItem implements OnChanges{

  @Input() item: SoPost;
  @Input() type: string;
  @ViewChild('commentBox') commentBox: ZSocialCommentBoxComponent;
  @Output() eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public apiBaseServiceV2: ApiBaseServiceV2,
    public loading: LoadingService,
    public confirmation: ConfirmationService,
    public toast: ToastsService
  ) {
    super();
  }

  showInfo: boolean = false;

  ngOnChanges() {
    if (this.type == 'info') {
      this.showInfo = true;
    }
  }

  onAction(event:any) {
    if (event instanceof CancelEditCommentEvent) {
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

  onDeleteComment(comment: SoComment) {
    this.eventEmitter.emit(new DeleteCommentEvent(comment));
  }

  onEditComment(comment: SoComment) {
    $("#editComment-" + comment.uuid).show();
    $("#comment-" + comment.uuid).hide();
  }

  onReply(e:any, comment: SoComment) {
    $("#reply-" + comment.uuid).show();
  }
}

import { Component, ViewChild, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {BaseZoneSocialItem} from "../../base/base-social-item";
import {SoPost} from "../../../../shared/models/social_network/so-post.model";
import { ToastsService } from '../../../../partials/toast/toast-message.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { LoadingService } from '../../../../partials/loading/loading.service';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { CommentCreateEvent, PhotoModalEvent } from '../../events/social-events';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item-footer',
  templateUrl: 'post-item-footer.component.html',
})

export class ZSocialPostItemFooterComponent extends BaseZoneSocialItem implements OnChanges{

  @Input() item: SoPost;
  @Input() type: string;
  newComment: string = '';

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

  onKey(e:any) {
    if(e.keyCode == 13 && e.target.value != "") {
      let createCommentEvent = new CommentCreateEvent(e.target.value);
      this.eventEmitter.emit(createCommentEvent);
      e.target.value = ""
    }
  }

  onOpenPhotoSelect() {
    this.eventEmitter.emit(new PhotoModalEvent());
  }
}

import { UserService } from './../../shared/services/user.service';
import { ZMediaPreviewComponent } from './../../shared/components/w-media-preview/media-preview.component';
import { Component, ViewChild } from '@angular/core';
import { Constants } from '@shared/constant';
import { User } from '@shared/shared/models';
import { MessageEventService } from '@chat/shared/message';

@Component({
  selector: 'chat-media-preview',
  templateUrl: 'chat-media-preview.component.html'
})
export class ChatMediaPreviewComponent {
  @ViewChild(ZMediaPreviewComponent) mediaPreview: ZMediaPreviewComponent;
  parent;

  readonly tooltip = Constants.tooltip;
  user: User;

  constructor(
    private userService: UserService,
    private messageEventService: MessageEventService,

  ) {
      this.user = userService.getSyncProfile();
  }

  download() {
    this.mediaPreview.download({module: 'chat', object_id: this.parent.id, object_type: this.parent.object_type});
  }

  removeMessage() {
    this.messageEventService.delete({ data: this.parent });
    this.mediaPreview.back();
  }
}

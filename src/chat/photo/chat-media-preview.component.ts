import { UserService } from './../../shared/services/user.service';
import { ZMediaPreviewComponent } from './../../shared/components/w-media-preview/media-preview.component';
import { Component, ViewChild, Input } from '@angular/core';
import { Constants } from '@shared/constant';
import { ConversationService } from '@chat/shared/services';
import { ChatMessageService } from '@chat/shared/services/chat-message.service';
import { User } from '@shared/shared/models';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';

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
    private chatMessageService: ChatMessageService,
    private toastsService: ToastsService,
    private userService: UserService
  ) {
      this.user = userService.getSyncProfile();
  }

  download() {
    this.mediaPreview.download();
  }

  removeMessage() {
    const { group_id, id} = this.parent;
    this.chatMessageService.deleteMessage(group_id, id).toPromise()
    .then(() => {
        this.toastsService.success('You have removed this message successfully');
        this.mediaPreview.back();
    });

  }
}

import { UserService } from './../../shared/services/user.service';
import { ZMediaPreviewComponent } from './../../shared/components/w-media-preview/media-preview.component';
import { Component, ViewChild } from '@angular/core';
import { Constants } from '@shared/constant';
import { ConversationService } from '@chat/shared/services';
import { ChatMessageService } from '@chat/shared/services/chat-message.service';
import { User } from '@shared/shared/models';

@Component({
  selector: 'chat-media-preview',
  templateUrl: 'chat-media-preview.component.html'
})
export class ChatMediaPreviewComponent {
  @ViewChild(ZMediaPreviewComponent) mediaPreview: ZMediaPreviewComponent;
  readonly tooltip = Constants.tooltip;
  user: User;

  constructor(
    private chatMessageService: ChatMessageService,
    private userService: UserService
  ) {
      this.user = userService.getSyncProfile();
  }

  download() {
    console.log('download message');
    this.mediaPreview.download();
  }

  removeMessage() {
    const {parent} = this.mediaPreview.object;
    const { group_id, id} = parent;
    console.log('remove message and return back', parent);
    this.chatMessageService.deleteMessage(group_id, id).toPromise()
    .then(() => this.mediaPreview.back());

  }
}

import { Injectable }     from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/shared/services/user.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { StorageService } from '../../../core/shared/services/storage.service';
import { HandlerService } from '../../../core/shared/services/handler.service';
import { FileUploadHelper } from '../../../core/shared/helpers/file/file-upload.helper';
import { ChatConstant } from '../../../core/shared/constant/chat-constant';
import { ChatCommonService } from '../../../core/shared/services/chat.common.service';
import { PhotoUploadService } from '../../../core/shared/services/photo-upload.service';
import { Observable } from 'rxjs/Observable';

declare var _: any;

@Injectable()
export class ChatContactService {

  constructor(public storage: StorageService,
              public apiBaseService: ApiBaseService,
              public user: UserService,
              public chatCommonService: ChatCommonService,
              public router: Router) {

  }

  addContact(ids: any, text?: any) {
    this.apiBaseService.post('zone/chat/create_contact', {user_id: ids, text: text}).subscribe(
      (res: any) => {
        this.chatCommonService.updateConversationBroadcast(res.data.group_id);
      }
    );
  }

  cancelContactRequest(contact: any) {
    let groupId = contact.group_id;
    this.apiBaseService.post('zone/chat/contact/cancel', {group_id: groupId}).subscribe(
      (res: any) => {
        this.chatCommonService.setDefaultSelectContact();
      }
    );
  }
}

import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';

import { ChatService } from '../services/chat.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { AbstractClassPart } from '@angular/compiler/src/output/output_ast';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { ApiBaseService, CommonEventService } from '@shared/services';

@Component({
  selector: 'z-chat-share-edit-conversation',
  templateUrl: 'edit-conversation.component.html',
  styleUrls: ['edit-conversation.component.scss']
})
export class ZChatShareEditConversationComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @Input() conversation: any;
  usersOnlineItem$: Observable<any>;
  form: FormGroup;
  allow_add: any = true;
  name: any;
  imageUpdated: any;
  destroy$ = new Subject();

  constructor(private chatService: ChatService,
    private mediaSelectionService: WMediaSelectionService,
    private apiBaseService: ApiBaseService,
    private commonEventService: CommonEventService,
    private fb: FormBuilder)  {

  }

  ngOnInit() {
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.chatService.updateDisplay(this.conversation, {display: {name: this.name}, allow_add: this.allow_add, image: this.imageUpdated});
    this.modal.close();
  }

  open() {
    this.modal.open().then(e => {
      this.allow_add = (this.conversation.group_json.allow_add || this.conversation.group_json.allow_add == 'true');
      this.name = this.conversation.group_json.name;
    });
  }

  openMediaSelection() {
    this.mediaSelectionService.open({
      hiddenTabs: ['videos', 'playlists'],
      selectedTab: 'photos',
      filter: 'photo',
      allowCancelUpload: true,
      allowedFileTypes: ['image/*']
    });
    this.mediaSelectionService.setMultipleSelection(false);
    this.mediaSelectionService.selectedMedias$.pipe(
      filter(photos => photos.length > 0)
    ).pipe(takeUntil(this.destroy$)).subscribe(photos => {
      this.imageUpdated = photos[0].url;
      this.conversation.group_json.image = this.imageUpdated;
      // detect to update
      this.conversation = {...this.conversation};
    });
  }

  startCrop(photo: any){
    console.log(photo);

    this.commonEventService.broadcast({
      channel: 'SELECT_CROP_EVENT', action: 'SELECT_CROP:OPEN',
      payload: { currentImage: photo }
    });
    this.modal.close();
    this.commonEventService.filter((event: any) => event.channel === 'SELECT_CROP_EVENT')
      .pipe(take(1))
      .subscribe((event: any) => {
        // this.doEvent(event);
        console.log(event);
        if (event.action == "SELECT_CROP:DONE") {

        }
      });
  }
}

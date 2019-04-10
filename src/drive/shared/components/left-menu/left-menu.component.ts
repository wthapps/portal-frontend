import {
  Component,
  OnDestroy, Renderer2, OnInit
} from '@angular/core';
import { take } from 'rxjs/operators';
import { Constants } from '@shared/constant/config/constants';
import { Store } from '@ngrx/store';

import { ApiBaseService } from '@shared/services/apibase.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { FileUploadService } from '@shared/services/file-upload.service';

declare let $: any;
declare let _: any;

@Component({
  selector: 'z-drive-shared-left-menu',
  templateUrl: 'left-menu.component.html',
  styleUrls: ['left-menu.component.scss']
})
export class ZDriveSharedLeftMenuComponent implements OnInit {
  noteMenu: any[] = [];
  myNoteMenu: any;
  settingMenu;
  sub: any;
  sub2: any;
  noteFoldersTree: any[] = [];
  showFolderTree: boolean;

  constructor(
    private apiBaseService: ApiBaseService,
    private fileUploadService: FileUploadService,
    private commonEventService: CommonEventService,
  ) {
    [this.myNoteMenu, this.settingMenu, ...this.noteMenu] = Constants.noteMenuItems;


  }
  ngOnInit() {

  }

  onpenFileUpload() {
    this.fileUploadService.open();
  }
}

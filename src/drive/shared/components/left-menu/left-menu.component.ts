import {
  Component, OnInit
} from '@angular/core';

import { ApiBaseService } from '@shared/services/apibase.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import { DriveFolderService } from 'drive/shared/services/drive-folder.service';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import { MenuItem } from 'primeng/api';

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
  showFolderTree = true;

  constructor(
    private apiBaseService: ApiBaseService,
    private folderService: DriveFolderService,
    private fileDriveUploadService: FileDriveUploadService,
    private commonEventService: CommonEventService,
  ) {
    // [this.myNoteMenu, this.settingMenu, ...this.noteMenu] = Constants.noteMenuItems;


  }
  ngOnInit() {
    this.loadRootFolders().then();
  }

  async loadRootFolders() {
    const res = await this.folderService.getAll().toPromise();
    this.noteFoldersTree = this.mapToMenuItem(res['data']);
    this.showFolderTree = true;
  }

  onpenFileUpload() {
    this.fileDriveUploadService.open();
  }

  private mapToMenuItem(folders: DriveFolder[]): MenuItem[] {
    return folders.map((f: DriveFolder) => ({label: f.name, icon: 'fa fa-folder-o', items: []}));
  }
}

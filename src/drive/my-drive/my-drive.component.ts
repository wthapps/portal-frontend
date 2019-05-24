import { Component, HostBinding, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { DriveService } from 'drive/shared/services/drive.service';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import DriveFile from '@shared/modules/drive/models/drive-file.model';

@Component({
  selector: 'my-drive-list',
  templateUrl: './my-drive.component.html',
  styleUrls: ['./my-drive.component.scss']
})
export class MyDriveComponent implements OnInit {
  @HostBinding('class') class = 'main-page-body';
  data$: Observable<Array<DriveFolder | DriveFile>>;
  readonly apiUrl = 'drive/drive';

  constructor(
    private driveService: DriveService,
    private fileDriveUploadService: FileDriveUploadService, ) {
    this.data$ = driveService.data$;
  }

  ngOnInit(): void {
    this.driveService.resetCurrentFolder();
    this.fileDriveUploadService.onDone.subscribe(res => {
      this.driveService.appendData([DriveFile.from(res)]);
    });
    this.fileDriveUploadService.onChange.subscribe(event => {
      this.fileDriveUploadService.upload(event.target.files);
    });
  }

}

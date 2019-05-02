import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { Constants } from '@shared/constant';
import { WDataViewComponent } from 'sample/shared/components/w-dataView/w-dataView.component';
import { DriveService } from 'drive/shared/services/drive.service';
import { ApiBaseService, CommonEventService } from '@shared/services';
import DriveFileList from '@shared/modules/drive/models/functions/drive-file-list';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import { DriveBreadcrumb } from 'drive/shared/components/breadcrumb/breadcrumb';


@Component({
  selector: 'my-drive-list',
  templateUrl: './my-drive.component.html',
  styleUrls: ['./my-drive.component.scss']
})
export class MyDriveComponent implements OnInit {
  @HostBinding('class') class = 'main-page-body';

  @ViewChild('dataView') dataView: WDataViewComponent;

  tooltip: any = Constants.tooltip;
  data$: Observable<any>;
  objects: any;
  files: any = [];
  next: string;
  breadcrumbs: Array<DriveBreadcrumb> = [{ name: "My Drive", label: "My Drive" }]
  menuActions = [
    {
      active: true,
      icon: 'fa fa-share-alt',
      text: this.tooltip.share,
      action: 'share'
    },
    {
      active: true,
      icon: 'fa fa-star-o',
      text: this.tooltip.favourite,
      action: 'favorite'
    },
    {
      active: true,
      icon: 'fa fa-trash-o',
      text: this.tooltip.delete,
      action: 'delete'
    }
  ];

  otherActions = [
    {
      active: true,
      icon: 'fa fa-pencil',
      text: 'Edit',
      action: 'edit'
    },
    {
      active: true,
      icon: 'fa fa-download',
      text: 'Move to folder',
      action: 'move_to_folder'
    }
  ];

  constructor(
    private dataService: DriveService,
    private apiBaseService: ApiBaseService,
    private fileDriveUploadService: FileDriveUploadService,
  ) {
    this.data$ = this.dataService.data$;
  }

  ngOnInit(): void {
    this.loadObjects();
    this.fileDriveUploadService.onDone.subscribe(res => {
      this.objects = [...DriveFileList.map([res]), ...this.objects]
    });
    this.fileDriveUploadService.onChange.subscribe(event => {
      this.fileDriveUploadService.upload(event.target.files);
    });
  }

  loadObjects() {
    this.apiBaseService.get('drive/files').subscribe(res => {
      this.objects = DriveFileList.map(res.data);
      this.next = res.meta.links.next;
    });
  }

  loadMoreObjects(event: any) {
    if (this.next) {
      this.apiBaseService.get(this.next).subscribe(res => {
        this.objects = [...this.objects, ...DriveFileList.map(res.data)];
        this.next = res.meta.links.next;
      });
    }
  }

  onSelectCompleted() {

  }

  onBreadcrumbEvent(event: any) {
    this.fileDriveUploadService.open();
  }
}

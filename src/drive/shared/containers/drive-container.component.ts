import { Component, HostBinding, OnInit, ViewChild, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { Constants } from '@shared/constant';
import { DriveService } from 'drive/shared/services/drive.service';
import { ApiBaseService } from '@shared/services';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import { DriveBreadcrumb } from 'drive/shared/components/breadcrumb/breadcrumb';
import { WDataViewComponent } from 'drive/shared/components/w-dataView/w-dataView.component';
import { Router } from '@angular/router';


@Component({
  selector: 'drive-container',
  templateUrl: './drive-container.component.html',
  styleUrls: ['./drive-container.component.scss']
})
export class DriveContainerComponent implements OnInit {
  @ViewChild('dataView') dataView: WDataViewComponent;
  @Input() breadcrumbs: Array<DriveBreadcrumb> = [{ name: "My Drive", label: "My Drive" }];
  @Input() next: string;

  readonly tooltip: any = Constants.tooltip;
  readonly OBJECT_TYPE = {
    FILE: 'Common::GenericFile',
    FOLDER: 'Drive::Folder'
  };
  data$: Observable<any>;
  files: any = [];

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
    private router: Router,
    private fileDriveUploadService: FileDriveUploadService,
  ) {
    this.data$ = this.dataService.data$;
  }

  ngOnInit() {

  }


  loadMoreObjects(event: any) {
    this.dataService.loadMoreObjects();
  }

  onView(item) {
    console.log('on View: ', item);

    if (item.model === this.OBJECT_TYPE.FILE) {
// TODO: Preview file
    }
    if (item.model === this.OBJECT_TYPE.FOLDER) {
      this.router.navigate(['folder', item.id]);
    }
  }

  onSelectCompleted() {

  }

  onSortComplete(event: any) {

  }

  onViewComplete(event: any) {

  }

  onBreadcrumbEvent(event: any) {
    this.fileDriveUploadService.open();
  }
}

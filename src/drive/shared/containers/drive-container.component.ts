import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Constants } from '@shared/constant';
import { DriveService } from 'drive/shared/services/drive.service';
import { ApiBaseService } from '@shared/services';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import { DriveBreadcrumb } from 'drive/shared/components/breadcrumb/breadcrumb';
import { WDataViewComponent } from 'drive/shared/components/w-dataView/w-dataView.component';
import { driveConstants } from './../config/drive-constants';



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
  readonly OBJECT_TYPE = driveConstants.OBJECT_TYPE;
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
    private driveService: DriveService,
    private router: Router,
    private fileDriveUploadService: FileDriveUploadService,
  ) {
    this.data$ = this.driveService.data$;
  }

  ngOnInit() {

  }


  loadMoreObjects(event: any) {
    this.driveService.loadMoreObjects();
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

  onMenuAction(action) {
    switch (action) {
      case 'share': {

      }
      break;
      case 'favorite': {

      }
      break;
      case 'delete': {
        this.driveService.deleteMany(this.selectedObjects);
      }
      break;
      case 'edit': {

      }
      break;
      case 'move_to_folder': {

      }
      break;
      default: {

      };
    }
  }

  onBreadcrumbEvent(event: any) {
    const {action, payload} = event;
    switch (action) {
      case 'drive:open_drive_add_modal': {
        this.fileDriveUploadService.open();
      }
      break;
      case 'drive:mixed_entity:delete': {
        this.driveService.deleteMany(this.selectedObjects);
      }
      break;
      case 'drive:folder:create': {
        this.driveService.modalEvent({action: 'drive:folder:create', payload});
      }
      break;
      case 'drive:folder:edit': {
      }
      break;
      case 'drive:mixed_entity:open_sharing_modal': {
      }
      break;
      case 'drive:mixed_entity:open_move_to_folder_modal': {
      }
      break;
      default: {
        console.warn('unhandled action: ', action);
      }
      break;
    }
  }

  private get selectedObjects() { return this.dataView.selectedDocuments} ;
}

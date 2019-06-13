import { Component, Input, OnDestroy, EventEmitter, Output, OnInit } from '@angular/core';
import { DriveBreadcrumb } from './breadcrumb';
import { Router } from '@angular/router';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';

@Component({
  selector: 'z-drive-shared-breadcrumb',
  templateUrl: 'breadcrumb.component.html',
  styleUrls: ['breadcrumb.component.scss']
})
export class ZDriveharedBreadcrumbComponent implements OnInit, OnDestroy {

  @Input() model: Array<DriveBreadcrumb>;

  @Input() style: any;

  @Input() styleClass: string;

  @Output() breadcrumbEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() permissions: any;

  constructor(private router: Router,
    private fileDriveUploadService: FileDriveUploadService
    ) {
  }

  ngOnInit() {
  }

  itemClick(event: any, item: DriveBreadcrumb) {
    if (!item.url || item.routerLink) {
      event.preventDefault();
    }

    if (item.command) {
      if (!item.eventEmitter) {
        item.eventEmitter = new EventEmitter();
        item.eventEmitter.subscribe(item.command);
      }

      item.eventEmitter.emit(event);
    }

    if (item.routerLink) {
      this.router.navigate(item.routerLink);
    }
  }

  onMenu(event: string) {
    this.breadcrumbEvent.emit(event);
  }

  onOpenFileUpload() {
    this.fileDriveUploadService.open();
  }

  onOpenFolderUpload() {
    this.fileDriveUploadService.open({folderOnly: true});
  }

  ngOnDestroy() {
    if (this.model && this.model.length > 0) {
      for (const item of this.model) {
        if (item.eventEmitter) {
          item.eventEmitter.unsubscribe();
        }
      }
    }
  }
}

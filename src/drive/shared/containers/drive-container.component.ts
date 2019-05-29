import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { Router } from '@angular/router';

import { Constants } from '@shared/constant';
import { DriveService } from 'drive/shared/services/drive.service';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import { DriveBreadcrumb } from 'drive/shared/components/breadcrumb/breadcrumb';
import { WDataViewComponent } from 'drive/shared/components/w-dataView/w-dataView.component';
import { driveConstants, DriveType } from './../config/drive-constants';
import { DriveStorageService } from '../services/drive-storage.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'drive-container',
  templateUrl: './drive-container.component.html',
  styleUrls: ['./drive-container.component.scss']
})
export class DriveContainerComponent implements OnInit {
  @ViewChild('dataView') dataView: WDataViewComponent;
  @Input() breadcrumbs: Array<DriveBreadcrumb> = [{ name: "My Drive", label: "My Drive" }];
  @Input() next: string;
  @Input() apiUrl = '';
  @Input() list: Array<DriveType> = [];

  readonly tooltip: any = Constants.tooltip;
  readonly OBJECT_TYPE = driveConstants.OBJECT_TYPE;
  sortBy = 'updated_at';
  orderBy: 'asc' | 'desc' = 'desc';
  files: any = [];
  loaded = true;

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
      text: 'Download',
      action: 'download'
    }
  ];

  viewMode$: Observable<string>;

  constructor(
    private driveService: DriveService,
    private dataStorage: DriveStorageService,
    private router: Router,
    private fileDriveUploadService: FileDriveUploadService,
  ) {
    // this.data$ = this.driveService.data$;
    this.viewMode$ = this.driveService.viewMode$;
  }

  ngOnInit() {
    // this.loadObjects(this.apiUrl);
    this.dataStorage.sortOption = {sortBy: this.sortBy, orderBy: this.orderBy};
  }


  async loadMoreObjects(event: any) {
    try {
      await this.driveService.loadMoreObjects();
    } catch (err) {
      console.warn(err);
    }
  }

  async loadObjects(url) {
    try {
      if (!url) return;
      this.loaded = false;
      const sortedUrl = this.urlWithSort({url, sortBy: this.sortBy, orderBy: this.orderBy});
      this.driveService.loadObjects(sortedUrl);
    } catch (err) {
      console.warn(err);
    } finally {
      this.loaded = true;
    }
  }

  onView(item) {
    console.log('on View: ', item);

    if (item.model === this.OBJECT_TYPE.FILE) {
      // TODO: Preview file
    }
    if (item.model === this.OBJECT_TYPE.FOLDER) {
      this.router.navigate(['folders', item.id]);
    }
  }

  onSelectCompleted() {
    // menu favorite
    if (this.selectedObjects) {
      const allFavorite = this.selectedObjects.every(ob => {
        return ob.favorite;
      });
      if (allFavorite) {
        this.menuActions = this.menuActions.map(menu => {
          if (menu.action === 'favorite') {
            menu.icon = 'fa fa-star';
          }
          return menu;
        });
      } else {
        this.menuActions = this.menuActions.map(menu => {
          if (menu.action === 'favorite') {
            menu.icon = 'fa fa-star-o';
          }
          return menu;
        });
      }
    }
    // end menu favorite
  }

  async onSortComplete({sortBy, orderBy}) {
    this.dataStorage.sortOption = {sortBy, orderBy};
    const url = this.urlWithSort({url: this.apiUrl, sortBy, orderBy});
    try {
      this.loaded = false;
      await this.driveService.loadObjects(url);
    } catch (err) {
      console.warn(err);
    } finally {
      this.loaded = true;
    }
  }

  onViewComplete(event: any) {
    this.driveService.changeView(event);
    this.dataView.container.update();
    this.dataView.updateView();
  }

  onMenuAction(action) {
    switch (action) {
      case 'share': {

      }
        break;
      case 'favorite': {
        this.driveService.toggleFavorite(this.selectedObjects).subscribe(res => {
          this.driveService.updateMany(res.data);
          setTimeout(() => {
            this.onSelectCompleted();
          }, 500);
        });
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
      case 'download': {
        this.selectedObjects.forEach(f => {
          this.fileDriveUploadService.download(f);
        });
      }
        break;
      default: {

      };
    }
  }

  onBreadcrumbEvent(event: any) {
    const { action, payload } = event;
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
        this.driveService.modalEvent({ action: 'drive:folder:edit', payload: { ...payload, mode: 'add' } });
      }
        break;
      case 'drive:folder:edit': {
        const { id, name } = payload;
        const folder = { id, name };
        this.driveService.modalEvent({ action: 'drive:folder:edit', payload: { ...payload, folder, mode: 'edit' } });
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

  download(file: any) {
    this.fileDriveUploadService.download({});
  }

  private urlWithSort({url, sortBy, orderBy}) {
    const sortOption = `sort=${orderBy}&sort_name=${sortBy}`;
    return url.includes('?') ? `${url}&${sortOption}` : `${url}?${sortOption}`;
  }

  private get selectedObjects() { return this.dataView.selectedObjects };
}

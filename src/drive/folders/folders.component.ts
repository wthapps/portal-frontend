import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { DriveService } from './../shared/services/drive.service';
import { UrlService } from './../../shared/services/url.service';
import { DriveBreadcrumb } from 'drive/shared/components/breadcrumb/breadcrumb';
import { DriveFolderService } from 'drive/shared/services/drive-folder.service';
import { DriveStorageService } from 'drive/shared/services/drive-storage.service';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';

const PAGES = {
  MY_DRIVE: 'MY_DRIVE',
  SHARED_WITH_ME: 'SHARED_WITH_ME',
  SHARED_BY_ME: 'SHARED_BY_ME'
};
@Component({
  selector: 'drive-folder',
  templateUrl: './folders.component.html'
})
export class DriveFolderListComponent implements OnInit, OnDestroy {
  currentPath: string;
  breadcrumbs: DriveBreadcrumb[] = [];
  initRoute = '/';
  currentUrl = '';
  breadcrumbsInit: any = {
    id: null,
    name: null,
    label: 'My notes',
    routerLink: '/'
  };
  @HostBinding('class') class = 'main-page-body';

  private destroySubject: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private driveService: DriveService,
    private driveStorage: DriveStorageService,
    private folderService: DriveFolderService,
    private urlService: UrlService,
    ) {
      this.breadcrumbs = [this.breadcrumbsInit];
    }

  ngOnInit() {
    // Update breadcrumbs in case current folder get updated
    this.driveStorage.currentFolder$.pipe(
      filter(f => !!f ),
      takeUntil(this.destroySubject))
    .subscribe((folder: DriveFolder) => {
      this.breadcrumbs.pop();
      this.breadcrumbs.push(this.mapBreadcrumbItem(folder));
    }
    );

    this.route.params.forEach((params: Params) => {
      const urlData = this.urlService.parse();
      const id = params['id'];
      switch (urlData.paths[0]) {
        case 'shared-by-me': {
          this.currentPath = PAGES.SHARED_BY_ME;
          this.initRoute = '/shared-by-me';
          this.currentUrl = `drive/shared-by-me/folders/${id}`;
          this.breadcrumbsInit = {
            id: null,
            name: null,
            label: 'Shared by me',
            routerLink: '/shared-by-me'
          };
        }
        break;
        case 'shared-with-me': {
          this.currentPath = PAGES.SHARED_WITH_ME;
          this.initRoute = '/shared-with-me';
          this.currentUrl = `drive/shared-with-me/folders/${id}`;
          this.breadcrumbsInit = {
            id: null,
            name: null,
            label: 'Shared with me',
            routerLink: '/shared-with-me'
          };
        }
        break;
        default: {
          this.currentPath = PAGES.MY_DRIVE;
          this.initRoute = '';
          this.currentUrl = `drive/drive?parent_id=${id}`;
          this.breadcrumbsInit = {
            id: null,
            name: null,
            label: 'My drive',
            routerLink: '/'
          };
        }
      }

      ( async() => {
        await this.driveService.loadObjects(this.currentUrl);
        const folderPath = await this.getFolderPath({id, page: this.currentPath});
        this.driveService.currentFolder = [...folderPath].pop();
      }) ();
    });
    }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private async getFolderPath(options) {
    const res = await this.folderService.getFolderPath(options).toPromise();
    this.breadcrumbs = res.data ? [this.breadcrumbsInit, ...res.data.map((f) => this.mapBreadcrumbItem(f))] : [this.breadcrumbsInit];
    return res.data;
  }

  private mapBreadcrumbItem = f => ({name: f.name, label: f.name, id: f.id,
    routerLink: this.initRoute + '/folders/' + f.id});
}

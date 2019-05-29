import { Component, HostBinding, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { DriveService } from './../shared/services/drive.service';
import { UrlService } from './../../shared/services/url.service';
import { DriveBreadcrumb } from 'drive/shared/components/breadcrumb/breadcrumb';
import { DriveFolderService } from 'drive/shared/services/drive-folder.service';
import { DriveStorageService } from 'drive/shared/services/drive-storage.service';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import { DriveContainerComponent } from 'drive/shared/containers/drive-container.component';
import { DriveType } from 'drive/shared/config/drive-constants';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';

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
  @HostBinding('class') class = 'main-page-body';
  @ViewChild(DriveContainerComponent) container: DriveContainerComponent;
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
  data$: Observable<Array<DriveType>>;

  private destroySubject: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private driveService: DriveService,
    private driveStorage: DriveStorageService,
    private folderService: DriveFolderService,
    private fileDriveUploadService: FileDriveUploadService,
    private urlService: UrlService,
    ) {
      this.breadcrumbs = [this.breadcrumbsInit];
    }

  ngOnInit() {
    this.data$ = this.driveService.data$;
    // Update breadcrumbs in case current folder get updated
    this.driveStorage.currentFolder$.pipe(
      filter(f => !!f ),
      takeUntil(this.destroySubject))
    .subscribe((folder: DriveFolder) => {
      this.breadcrumbs.pop();
      this.breadcrumbs.push(this.mapBreadcrumbItem(folder));
    }
    );


    // Upload files with parent_id
    this.fileDriveUploadService.onDone.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(res => {
      // TODO: Skip addOne action if current page is not MY DRIVE
      this.driveService.addOne(res);
    });
    this.fileDriveUploadService.onChange.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(event => {
      // TODO: set parent_id is null if current page is not MY DRive
      this.fileDriveUploadService.upload(event.target.files, {parent_id: this.route.snapshot.paramMap.get('id')});
    });

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
        await this.container.loadObjects(this.currentUrl);
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

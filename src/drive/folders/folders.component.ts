import { DriveService } from './../shared/services/drive.service';
import { UrlService } from './../../shared/services/url.service';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DriveBreadcrumb } from 'drive/shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'drive-folder',
  templateUrl: './folders.component.html'
})
export class DriveFolderListComponent implements OnInit {
  currentPath: any;
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

  constructor(
    private route: ActivatedRoute,
    private driveService: DriveService,
    private urlService: UrlService,
    ) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      const urlData = this.urlService.parse();
      const id = params['id'];
      switch (urlData.paths[0]) {
        case 'shared-by-me': {
          // this.currentPath = noteConstants.PAGE_SHARED_BY_ME;
          // this.initRoute = '/shared-by-me';
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
          // this.currentPath = noteConstants.PAGE_SHARED_WITH_ME;
          // this.initRoute = '/shared-with-me';
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
          // this.currentPath = noteConstants.PAGE_MY_NOTE;
          // this.initRoute = '';
          this.currentUrl = `drive/drive?parent_id=${id}`;
          this.breadcrumbsInit = {
            id: null,
            name: null,
            label: 'My drive',
            routerLink: '/'
          };
        }
      }

      this.driveService.loadObjects(this.currentUrl);
    });
    }
}

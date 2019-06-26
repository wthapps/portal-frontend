import { Component, HostBinding, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { DriveService } from 'drive/shared/services/drive.service';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import { DriveContainerComponent } from 'drive/shared/containers/drive-container.component';
import { DriveType } from 'drive/shared/config/drive-constants';
import { UserService } from '@shared/services';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UrlConverterUtil } from '@shared/shared/utils/converters/url-converter.util';

@Component({
  selector: 'drive-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'main-page-body';
  @ViewChild(DriveContainerComponent) container: DriveContainerComponent;
  data$: Observable<Array<DriveType>>;
  readonly page: string = 'search';
  breadcrumbs: any = [{ name: "Search results", label: "Search results" }];
  public apiUrl = '';
  public apiBaseUrl = 'drive/search';
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(
    private driveService: DriveService,
    private userService: UserService,
    private route: ActivatedRoute,
    private fileDriveUploadService: FileDriveUploadService, ) {
    this.data$ = driveService.data$;
  }

  ngOnInit(): void {
    this.driveService.resetCurrentFolder();
    
    this.route.queryParams.subscribe(params => {
      this.apiUrl = `${this.apiBaseUrl}${UrlConverterUtil.objectToUrl(params)}`;
      this.container.loadObjects(`${this.apiUrl}`);
    })
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}

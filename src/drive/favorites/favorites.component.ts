import { Component, HostBinding, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { DriveService } from 'drive/shared/services/drive.service';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import { DriveContainerComponent } from 'drive/shared/containers/drive-container.component';
import { DriveType } from 'drive/shared/config/drive-constants';
import { UserService } from '@shared/services';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'drive-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'main-page-body';
  @ViewChild(DriveContainerComponent) container: DriveContainerComponent;
  data$: Observable<Array<DriveType>>;
  page: string = 'favorite';
  breadcrumbs: any = [{ name: "Favorite", label: "Favorite" }];
  public readonly apiUrl = 'drive/drive?favorite=true';
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(
    private driveService: DriveService,
    private userService: UserService,
    private fileDriveUploadService: FileDriveUploadService, ) {
    this.data$ = driveService.data$;
  }

  ngOnInit(): void {
    this.driveService.resetCurrentFolder();
    this.container.loadObjects(`${this.apiUrl}`);

    // this.fileDriveUploadService.onDone.pipe(
    //   takeUntil(this.destroySubject)
    // ).subscribe(res => {
    //   console.log(res);
    //   this.driveService.addOne(res);
    // });
    // this.fileDriveUploadService.onChange.pipe(
    //   takeUntil(this.destroySubject)
    // ).subscribe(event => {
    //   this.fileDriveUploadService.upload(event.target.files);
    // });
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}

import { Component, ViewChild, OnDestroy, ViewEncapsulation, OnInit, AfterViewInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { DriveService } from 'drive/shared/services/drive.service';
import { IDriveProgress, DEFAULT_PROGRESS } from 'drive/shared/config/drive-constants';
import { ModalDockComponent } from '@shared/shared/components/modal/dock.component';

@Component({
  selector: 'z-drive-share-progress',
  templateUrl: 'drive-progress.component.html',
  styleUrls: ['drive-progress.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ZDriveShareProgressComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('modalDock') modalDock: ModalDockComponent;
  progress: IDriveProgress = DEFAULT_PROGRESS;
  callback: any;
  timeout: any;
  sub: Subscription;
  constructor(
    private driveService: DriveService
  ) {
  }

  ngOnChanges() {
  }

  ngAfterViewInit() {
    this.sub =  this.driveService.progress$.subscribe((progress: IDriveProgress) => {
      this.progress = progress;

      if (progress.open) {
        clearTimeout(this.timeout);
        this.modalDock.open('dock-merge-contact');
        this.timeout = setTimeout(() => {
          this.modalDock.close();
        }, 7000);
      } else {
        this.modalDock.close();
      }
      if(progress.callback) {
        this.callback = progress.callback;
      }
    });
  }

  doEvent() {
    if (this.callback) this.callback();
  }

  ngOnDestroy() {
    if (this.sub && !this.sub.closed)
      this.sub.unsubscribe();
  }
}

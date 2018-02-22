import { Component, ViewChild, OnDestroy, ViewEncapsulation, OnInit, AfterViewInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ModalDockComponent } from '../../../shared/shared/components/modal/dock.component';
import { LoadingService } from '../../../shared/shared/components/loading/loading.service';
import { CommonEventService } from '../../../shared/services/common-event/common-event.service';
import { CommonEvent } from '../../../shared/services/common-event/common-event';
import { FileUploadHelper } from '../../../shared/shared/helpers/file/file-upload.helper';
import { Store } from "@ngrx/store";
import * as progressContext from "../reducers/progress-context";

@Component({
  selector: 'z-note-share-progress',
  templateUrl: 'note-progress.component.html',
  styleUrls: ['note-progress.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ZNoteShareProgressComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('modalDock') modalDock: ModalDockComponent;
  progess$: any;
  callback: any;
  timeout: any;
  sub: any;
  constructor(private store: Store<any>, private cdr: ChangeDetectorRef) {
    this.progess$ = this.store.select(progressContext.getProgressContext);
  }

  ngOnChanges() {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.sub = this.progess$.subscribe((progress: any) => {
      if(progress.open) {
        clearTimeout(this.timeout);
        this.modalDock.open('dock-merge-contact');
        this.timeout = setTimeout(() => {
          this.modalDock.close();
        }, 7000)
      } else {
        this.modalDock.close();
      }
      if(progress.callback) {
        this.callback = progress.callback
      }
    });
  }

  doEvent() {
    if(this.callback) this.callback();
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}

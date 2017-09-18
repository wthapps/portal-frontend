import { Component, ViewChild, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Subscription } from 'rxjs/Subscription';

import { SoPhotoListComponent } from '../photo-list/photo-list.component';
import { PhotoModalDataService } from '../../../../services/photo-modal-data.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-photo-select',
  templateUrl: 'post-photo-select.component.html'
})

export class PostPhotoSelectComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('photoList') photoList: SoPhotoListComponent;
  @Input() selectedItems: Array<any>;
  @Output() onUpload: EventEmitter<any> = new EventEmitter<any>();
  action: string = 'NEXT';

  postPhotos: Array<any> = new Array<any>();
  uploadPhotos: Array<any> = new Array<any>();
  hasBack: boolean = false;
  files: Array<any> = new Array<any>();

  // Subscription list
  initSubscription: Subscription;
  openSubscription: Subscription;
  closeSubscription: Subscription;

  constructor(private photoDataService: PhotoModalDataService) {
  }

  ngOnInit(): void {

    this.initSubscription = this.photoDataService.initObs$.subscribe((options: any) => {
        this.init(options);
      }
    );

    this.openSubscription = this.photoDataService.openObs$.subscribe(
      (options: any) => {
        console.log('open: options: ', options);
        this.open(options);
      }
    );

    // this.closeSubscription = this.photoDataService.closeObs$.subscribe(
    //   () => { this.close(); }
    // );

  }

  ngOnDestroy() {
    this.unsubscribeAll([this.initSubscription, this.openSubscription, this.closeSubscription]);
  }

  init(options: any) {
    this.action = 'DONE';
    if (_.get(options, 'multipleSelect', true) === true)
      this.photoList.multipleSelect = true;
    else
      this.photoList.multipleSelect = false;
  }

  open(options: any = {return: false}) {
    console.log('Post Photo Select Component OPENED', options);

    if (options.return == true) {
      this.hasBack = true;
    }
    if (_.get(options, 'multipleSelect', true) === true)
      this.photoList.multipleSelect = true;
    else
      this.photoList.multipleSelect = false;

    console.debug('this.photoList.multipleSelect: ', this.photoList.multipleSelect);
    this.photoList.loadPhotos();
    this.modal.open();
  }

  close() {
    this.modal.close();
    // this.photoDataService.close();
  }

  next(event: any) {
    console.log('Post Photo Select Component CLOSED', this.photoList.selectedItems);
    // this.onNext.emit(_.reverse(this.photoList.selectedItems));
    this.photoDataService.next(_.reverse(this.photoList.selectedItems));
    this.close();
  }

  dismiss(event: any): void {
    console.log('Post Photo Select Component DISMISSED', this.hasBack);
    if (this.hasBack) {
      // this.onDismiss.emit(null);
      this.photoDataService.dismiss(null);
    } else {
      this.photoList.clearSelection();
    }
  }

  chooseFiles(files: any) {
    this.files = files;
    // this.onUpload.emit(files);
    this.close();
    this.photoDataService.upload(files);
  }

  private unsubscribeAll(subs: Array<Subscription>) {
    _.each(subs, (s: Subscription) => {
      if (s) s.unsubscribe();
    });
  }

}

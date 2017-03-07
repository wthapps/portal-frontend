import { Component, ViewChild, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
// import { HdModalComponent } from '../../shared/ng2-hd/modal/index';
import { SoPhotoListComponent } from './index';
import { HdModalComponent } from '../../shared/ng2-hd/modal/components/modal';
import { PhotoModalDataService } from '../services/photo-modal-data.service';
import { Subscription } from 'rxjs';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'social-post-photo-select',
  templateUrl: 'post-photo-select.component.html'
})

export class PostPhotoSelectComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: HdModalComponent;
  @ViewChild('photoList') photoList: SoPhotoListComponent;
  @Input() selectedItems: Array<any>;
  // @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  // @Output() onDismiss: EventEmitter<any> = new EventEmitter<any>();
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

    this.initSubscription = this.photoDataService.initObs$.subscribe( () => {
        this.init();
      }
    );

    this.openSubscription = this.photoDataService.openObs$.subscribe(
      (options: any ) => {
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

  public init() {
    this.action = 'DONE';
    this.photoList.multipleSelect = true;
  };

  open(options: any = {return: false}) {
    console.log('Post Photo Select Component OPENED');

    if (options.return == true) {
      this.hasBack = true;
    }
    this.photoList.loadPhotos();
    this.modal.open();
  }

  close() {
    this.modal.close();
    // this.photoDataService.close();
  }

  next(event: any) {
    // this.onNext.emit(_.reverse(this.photoList.selectedItems));
    this.photoDataService.next(_.reverse(this.photoList.selectedItems));
    this.close();
  }

  dismiss(event: any): void {
    if (this.hasBack) {
      // this.onDismiss.emit(null);
      this.photoDataService.dismiss(null);
    } else {
      this.photoList.clearSelection();
    }
  }

  chooseFiles(files: any) {
    this.files = files;
    this.onUpload.emit(files);
    // this.photoDataService.upload(files);
  }

  private unsubscribeAll(subs: Array<Subscription>){
    _.each(subs, (s: Subscription) => {if (s) s.unsubscribe();});
  }

}

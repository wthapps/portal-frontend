import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/hd-modal';
import { ApiBaseService } from '../../../shared/index';
import { SoPhotoListComponent } from './index';

@Component({
  moduleId: module.id,
  selector: 'so-photo-selection',
  templateUrl: 'photo-selection.component.html'
})

export class SoPhotoSelectionComponent implements OnInit{
  @ViewChild('fileselection') fileSelection: ElementRef;
  @ViewChild('photoModal') photoModal: HdModalComponent;
  @ViewChild('postModal') postModal: HdModalComponent;
  @ViewChild('photoList') photoList: SoPhotoListComponent;
  // photos: Array<any>;

  constructor(private apiService: ApiBaseService) {
  }

  ngOnInit(): void {
    // this.photos = new Array<any>();
    // this.apiService.get(`zone/photos`).subscribe(
    //   (response: any) => {
    //     this.photos = response['data'];
    //     console.log('photos', response['data']);
    //     // this.loadingService.stop('#photodata-loading');
    //   },
    //   error => {
    //     // this.errorMessage = <any>error;
    //     // this.loadingService.stop('#photodata-loading');
    //   }
    // );
  }

  open(event: any) {
    this.photoModal.open();

  }

  next(event: any) {
    console.log('next');
    this.postModal.open();
  }

  closePhotoSelectionModel(event: any): void {
    this.photoList.clearSelection();
  }

}

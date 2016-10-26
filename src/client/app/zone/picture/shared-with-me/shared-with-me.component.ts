import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { ZPictureGridComponent, ZPictureListComponent } from '../../shared/index';

// import {ZPhotoDetailComponent} from './photo-detail.component';
import { Photo } from '../../../shared/models/photo.model';
import { BaseMediaComponent } from '../../shared/index';
import {
  ApiBaseService,
  MediaType,
  LoadingService,
  ToastsService,
  ConfirmationService
} from '../../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-share-with-me',
  templateUrl: 'shared-with-me.component.html',
  styleUrls: ['shared-with-me.component.css']
})

export class ZoneSharedWithMeComponent extends BaseMediaComponent implements OnInit {

  showImg: boolean = false;
  imgId: number;

  @Input() resetSelected: boolean;
  @Input() preview: boolean;
  @Input() viewInfo: boolean;
  @Input() hasUploadedItem: boolean;
  // @Input() deletedItems: Array<number> = [];

  @Output() selectedPhotos: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() selectedPhotoFull: EventEmitter<Array<Photo>> = new EventEmitter<Array<Photo>>();
  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalAction: EventEmitter<string> = new EventEmitter<string>();

  constructor(private apiService: ApiBaseService,
              // these are using for BaseMediaComponent
              // tslint:disable-next-line
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private confirmationService: ConfirmationService) {
    super(MediaType.sharedWithMe, this.apiService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}

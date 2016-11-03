import { Component, ViewChild, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, AfterViewInit} from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/hd-modal';
import { ApiBaseService, LoadingService } from '../../../shared/index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-edit',
  templateUrl: 'post-edit.component.html'
})

export class PostEditComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('modal') modal: HdModalComponent;
  @Input() files: Array<any> = new Array<any>();
  @Input() photos: Array<any> = new Array<any>();

  @Output() onMoreAdded: EventEmitter<any> = new EventEmitter<any>();

  constructor(private apiService: ApiBaseService, private loading: LoadingService) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    let currentFiles: Array<any> = changes['files']['currentValue'];
    if(currentFiles.length > 0) {
      this.uploadFiles(currentFiles);
    }
  }

  ngAfterViewInit() {
    // this.loading.start('.photo-item-uploading');
  }

  open() {
    this.modal.open();
  }
 
  close() {
    this.modal.close();
  }

  addMorePhoto(event: any) {
    this.onMoreAdded.emit(true);
  }

  post(event: any) {
    console.log('doing posting');
  }

  uploadFiles(files: Array<any>) {

      this.photos = event['data'];
      let files: Array<any> = this.photos;
      let i = 0;
      let reader: FileReader;
      let body: string;
      let fileName: string;
      console.log('upoading........');

      // do {
      //   reader = new FileReader();
      //   reader.onload = (data: any) => {
      //     body = JSON.stringify({photo: {name: fileName, image: data.target['result']}});
      //
      //     // this.apiService.post(`zone/photos`, body)
      //     //   .map(res => res.json())
      //     //   .subscribe((result: any) => {
      //     //
      //     //     },
      //     //     error => {
      //     //
      //     //     }
      //     //   );
      //   };
      //   fileName = files[i].name;
      //   reader.readAsDataURL(files[i]);
      //   i++;
      //
      // } while (i < files.length);

  }
}

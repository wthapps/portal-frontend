import { Component, ViewChild, OnInit, Input, Output,
  EventEmitter } from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/hd-modal';
import { ApiBaseService, LoadingService } from '../../../shared/index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-edit',
  templateUrl: 'post-edit.component.html',
  styleUrls: ['post-edit.component.css']
})

export class PostEditComponent implements OnInit {

  @ViewChild('modal') modal: HdModalComponent;
  @Input() files: Array<any> = new Array<any>();
  @Input() photos: Array<any> = new Array<any>();

  @Output() onMoreAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPostAdded: EventEmitter<any> = new EventEmitter<any>();
  description: string = '';
  tags: Array<string>= new Array<string>();

  constructor(private apiService: ApiBaseService, private loading: LoadingService) {
  }

  ngOnInit(): void {
    // this.description = '';
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
    let body = JSON.stringify({post: {description: this.description, photos: this.photos, tags: this.tags}});
    this.apiService.post(`zone/social_network/posts`, body)
      .map(res => res.json())
      .subscribe((result: any) => {
          this.onPostAdded.emit(result['data']);
          this.modal.close();
        },
        error => {
          console.log('error', error);
        }
      );
  }

  uploadFiles(files: Array<any>) {

      // this.photos = event['data'];
      let i = 0;
      let reader: FileReader;
      let body: string;
      let fileName: string;
      this.loading.start('.photo-item-uploading');

      do {
        reader = new FileReader();
        reader.onload = (data: any) => {

          body = JSON.stringify({photo: {name: fileName, image: data.target['result']}});
          this.apiService.post(`zone/social_network/photos/upload`, body)
            .map(res => res.json())
            .subscribe((result: any) => {
              this.photos.unshift(result['data']);
              },
              error => {

              }
            );
        };
        fileName = files[i].name;
        reader.readAsDataURL(files[i]);
        i++;

      } while (i < files.length);

  }

  cancelUploading(file: any) {
    _.pull(this.files, file);
  }

  validPost(): boolean {
    if(this.description == '' && this.photos.length <= 0) {
      return false;
    }
    return true;
  }
}

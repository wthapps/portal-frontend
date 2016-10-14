import { Component, Input, Output, OnInit, OnChanges, EventEmitter, SimpleChanges} from '@angular/core';
import { ApiBaseService } from '../../../shared/index';


@Component({
  moduleId: module.id,
  selector: 'zone-uploading',
  templateUrl: 'uploading.component.html',
  styleUrls: ['uploading.component.css'],
})
export class ZoneUploadingComponent implements OnInit, OnChanges {
  current_photo: any;
  step: number;
  files_num: number;
  uploaded_num: number;
  stopped_num: number;
  pending_request: any;
  photoIds: Array<number>;
  @Input() files: any;
  @Output() photoEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() showModalAddToAlbumEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() createNewAlbum: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() needToReload: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private apiService: ApiBaseService) {

  }

  ngOnInit() {
    this.step = 0;
    console.log('step', this.step);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['files'].currentValue && changes['files'].currentValue.length > 0) {
      this.uploadImages(changes['files'].currentValue);
      this.files_num = this.files.length;
      this.photoIds = new Array<number>();
    }


    // console.log('step changed', this.step, changes);

  }

  close() {
    if (this.step == 2 || this.step == 4) {
      console.log('testing ...............');
      this.needToReload.emit(true);
    }
    this.step = -1;
  }

  stop(event) {
    event.preventDefault();
    if (this.pending_request) {
      this.pending_request.unsubscribe();
    }
    this.stopped_num = this.files_num - this.uploaded_num;
    this.step = 4;
    if(this.uploaded_num > 0) {
      this.needToReload.emit(true);
    }
  }

  uploadImages(files) {
    var i: number;
    var file_name: string;
    var reader: FileReader;
    var body: string;

    this.step = 1;
    this.uploaded_num = 0;
    this.stopped_num = 0;
    i = 0;

    do {
      reader = new FileReader();
      reader.onload = (data:any) => {
      this.current_photo = data.target['result'];
      body = JSON.stringify({ photo: {name: file_name, image: this.current_photo }});

      this.pending_request =  this.apiService.post(`zone/photos`, body)
        .map(res => res.json())
        .map((res) => {
          if (res) {
            return res;
          }
        })
        .subscribe((result: any) => {
            this.uploaded_num++;
            if (this.uploaded_num == this.files_num) {
              this.step = 2;
            }
            this.photoIds.push(result.data.id);
          },
          error => {
            this.step = 3;
          }
        );
      };
      file_name = files[i].name;
      reader.readAsDataURL(files[i]);
      i++;

    } while (i < files.length);
  }

  onAddToAlbum(): void {
    this.showModalAddToAlbumEvent.emit(true);
    this.photoEvent.emit(this.photoIds);
  }

  onCreateNewAlbum() {
    this.photoEvent.emit(this.photoIds);
    this.createNewAlbum.emit(true);
  }
}

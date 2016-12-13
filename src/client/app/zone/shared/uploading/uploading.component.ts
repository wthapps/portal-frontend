import {
  Component,
  Output,
  OnInit,
  AfterViewInit,
  OnChanges,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  ElementRef,
  Renderer
} from '@angular/core';
import { ApiBaseService } from '../../../shared/index';
import { Photo } from '../../../shared/models/photo.model';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'zone-uploading',
  templateUrl: 'uploading.component.html',
  styleUrls: ['uploading.component.css'],
})
export class ZoneUploadingComponent implements OnInit, OnChanges, AfterViewInit {
  current_photo: any;
  step: number;
  files_num: number;
  uploaded_num: number;
  stopped_num: number;
  pending_request: any;
  photos: Array<Photo> = [];
  files: Array<any>;
  @Output() createNewAlbum: EventEmitter<any> = new EventEmitter<any>();
  @Output() addToAlbum: EventEmitter<any> = new EventEmitter<any>();
  @Output() needToReload: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('inputfiles') inputFiles: ElementRef;


  constructor(private apiService: ApiBaseService, private renderer: Renderer) {
    this.dragleave();
  }

  ngOnInit() {
    this.step = 0;
    this.files = new Array<any>();
  }

  ngAfterViewInit() {
    let _thisPicture = this;
    $('body').bind('dragover', _thisPicture.dragover);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['files'].currentValue && changes['files'].currentValue.length > 0) {
      this.uploadImages(changes['files'].currentValue);
      this.files_num = this.files.length;
      this.photos = [];
    }
  }

  close() {
    if (this.step == 2 || this.step == 4) {
      this.needToReload.emit(true);
    }
    this.step = -1;
  }

  stop(event: any) {
    event.preventDefault();
    if (this.pending_request) {
      this.pending_request.unsubscribe();
    }
    this.stopped_num = this.files_num - this.uploaded_num;
    this.step = 4;
    if (this.uploaded_num > 0) {
      this.needToReload.emit(true);
    }
  }

  uploadImages(files: any) {
    var i: number;
    var file_name: string;
    var reader: FileReader;
    var body: string;

    this.step = 1;
    this.uploaded_num = 0;
    this.stopped_num = 0;
    this.files_num = this.files.length;
    i = 0;

    do {
      reader = new FileReader();
      reader.onload = (data: any) => {
        this.current_photo = data.target['result'];
        body = JSON.stringify({photo: {name: file_name, image: this.current_photo}});

        this.pending_request = this.apiService.post(`zone/photos`, body)
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
              this.photos.push(new Photo(result.data));
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
    this.addToAlbum.emit(this.photos);
  }

  onCreateNewAlbum() {
    this.createNewAlbum.emit(this.photos);
  }

  browseFiles(event: any) {
    this.renderer.invokeElementMethod(this.inputFiles.nativeElement, 'click');
  }

  chooseFiles(event: any) {
    this.files = event.target.files;
    if (this.files.length == 0) {
      return;
    }
    this.uploadImages(this.files);
  }

  onDrop(event: any) {
    $('body').removeClass('drag-active');
    event.stopPropagation();
    event.preventDefault();
    this.files = event.dataTransfer.files;
    if (this.files.length == 0) return;
    this.uploadImages(this.files);
  }

  dragleave() {
    $('body').removeClass('drag-active');
  }

  dragover(event: any) {
    $('body').addClass('drag-active');
    event.preventDefault();
  }

  dragenter() {
    $('body').addClass('drag-active');
  }

}
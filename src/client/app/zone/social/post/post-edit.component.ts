import { Component, ViewChild, OnInit, Input, Output, OnChanges, SimpleChanges,
  EventEmitter } from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/hd-modal';
import { ApiBaseService, LoadingService } from '../../../shared/index';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { PostPhotoSelectComponent } from './post-photo-select.component';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-edit',
  templateUrl: 'post-edit.component.html',
  styleUrls: ['post-edit.component.css']
})

export class PostEditComponent implements OnInit, OnChanges {

  @ViewChild('modal') modal: HdModalComponent;
  @ViewChild('photoSelectModal') photoSelectModal: PostPhotoSelectComponent;

  @Input() openMode: string = 'add'; // add or edit
  @Input() photos: Array<any> = new Array<any>()
  post: SoPost;

  @Output() onMoreAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEdited: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();

  files: Array<any> = new Array<any>();
  tags: Array<string>= new Array<string>();
  form: FormGroup;
  descCtrl: AbstractControl;
  tagsCtrl: AbstractControl;
  photosCtrl: AbstractControl;
  backupPhotos: Array<any> = new Array<any>();
  uploadedPhotos: Array<any> = new Array<any>();

  constructor(
    private apiService: ApiBaseService,
    private loading: LoadingService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.post = new SoPost();
    this.form = this.fb.group({
      'description': [this.post.description, Validators.compose([Validators.required])],
      'tags': [this.post.tags, null],
      'photos': [this.post.photos, null]
    });
    this.descCtrl = this.form.controls['description'];
    this.tagsCtrl = this.form.controls['tags'];
    this.photosCtrl = this.form.controls['photos'];
  }

  ngOnChanges(changes: SimpleChanges) {
    // if(changes['post']) {
    //   // this.form       = this.fb.group({
    //   //   'description': [this.post.description, Validators.compose([Validators.required])],
    //   //   'tags': [_.map(this.post.tags, 'name'), null],
    //   //   'photos': [this.post.photos, null]
    //   // });
    //   // this.descCtrl   = this.form.controls['description'];
    //   // this.tagsCtrl   = this.form.controls['tags'];
    //   // this.photosCtrl = this.form.controls['photos'];
    // }
  }

  open(options: any={mode:'add', addingPhotos: false, post: null}) {
    this.post = new SoPost();
    if(options.post != null) {
      this.post = options.post;
    }
    this.form       = this.fb.group({
      'description': [this.post.description, Validators.compose([Validators.required])],
      'tags': [_.map(this.post.tags, 'name'), null],
      'photos': [this.post.photos, null]
    });
    this.descCtrl   = this.form.controls['description'];
    this.tagsCtrl   = this.form.controls['tags'];
    this.photosCtrl = this.form.controls['photos'];
    if(options.addingPhotos) {
      this.photoSelectModal.open();
    }else {
      this.modal.open();
    }
  }
 
  close() {
    this.modal.close();
  }

  addMorePhoto(event: any) {
    // this.photoSelectModal.open({return: true});
    this.onMoreAdded.emit(true);
  }

  done(item: any) {
    let body: string;
    let url: string = 'zone/social_network/posts';
    body = JSON.stringify({
      post: {
        description: item.description,
        photos: this.post.photos, // TODO refactor on view formControl=photosCtrl
        tags: item.tags,
        privacy: this.post.privacy,
        adult: this.post.adult,
        disable_comment: this.post.disable_comment,
        disable_share: this.post.disable_share,
        mute: this.post.mute
      }
    });

    if(this.openMode == 'add') {
      this.apiService.post(url, body)
          .map(res => res.json())
          .subscribe((result: any) => {
              this.onEdited.emit(result['data']);
              this.modal.close();
            },
            error => {
              console.log('error', error);
            }
          );

    } else if(this.openMode == 'edit') {
      url += `/${this.post.uuid}`;
      this.apiService.put(url, body)
          .map(res => res.json())
          .subscribe((result: any) => {
              this.onEdited.emit(result['data']);
              this.modal.close();
            },
            error => {
              console.log('error', error);
            }
          );
    }

  }

  uploadFiles(files: Array<any>) {

      // this.photos = event['data'];
      let i = 0;
      let reader: FileReader;
      let body: string;
      let fileName: string;
      // this.loading.start('.photo-item-uploading');
      do {
        reader = new FileReader();
        reader.onload = (data: any) => {

          body = JSON.stringify({photo: {name: fileName, image: data.target['result']}});
          this.apiService.post(`zone/social_network/photos/upload`, body)
            .map(res => res.json())
            .subscribe((result: any) => {
              this.post.photos.unshift(result['data']);
              this.uploadedPhotos.push(result['data']);
              files.shift(); // remove file was uploaded
              },
              error => {

              }
            );
        };
        fileName = files[i].name;
        reader.readAsDataURL(files[i]);
        i++;
        // } while (files.length > 0);
      } while (i < files.length);

  }

  cancelUploading(file: any) {
    _.pull(this.files, file);
  }

  validPost(): boolean {
    if(this.post.description == '' && this.photos.length <= 0) {
      return false;
    }
    return true;
  }

  removePhoto(photo: any, event: any) {
    console.log('removing........');
    this.backupPhotos = this.post.photos;
    this.post.photos = _.pull(this.post.photos, photo);
  }

  next(selectedPhotos: any) {
    this.post.photos = _.concat(this.post.photos, selectedPhotos);
    this.photoSelectModal.close();
    this.modal.open();
  }

  addMorePhoto(event: any) {
    this.modal.close();
    this.photoSelectModal.open({return: true})
  }

  dismiss(photos: any) {
    if(photos == null) {
      this.modal.open();
    }

    // restore photos after we cancelled editing
    if(this.openMode == 'edit' && this.backupPhotos.length > 0) {
      this.post.photos = this.backupPhotos;
    }
    if(this.uploadedPhotos.length > 0) {
      // delete uploaded files form uploaded photos
      this.post.photos = _.pullAll(this.post.photos, this.uploadedPhotos);
      this.files = [];
    }
  }

  upload(files: Array<any>) {
    _.forEach(files, (file: any) => {
      this.files.push(file);
    });
    // this.files = files;
    this.photoSelectModal.close();
    this.modal.open();
    this.uploadFiles(this.files);
  }

  closeSelectPhoto(event: any) {
    console.log('closing.........');
  }

  /**
   * Tagging
   */
  addTag(event: any) {

  }

  removeTag(event: any) {

  }

  /**
   * Privacy
   */

  update(attr: any={}, event: any) {
    event.preventDefault();
    if(this.openMode == 'add') {
      this.post = _.assignIn(this.post, attr);
    } else {
      this.onUpdated.emit(attr);
    }
  }
}

import { Component, ViewChild, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
// import { HdModalComponent } from '../../shared/ng2-hd/modal/index';
// import { ApiBaseService, LoadingService } from '../../../shared/index';
// import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
// import { UserService } from '../../../shared/index';
import { PostPhotoSelectComponent, PostPrivacyCustomComponent } from './index';
import { HdModalComponent } from '../../shared/ng2-hd/modal/components/modal';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { UserService } from '../../../core/shared/services/user.service';
import { SoPost } from '../../../core/shared/models/social_network/so-post.model';
import { User } from '../../../core/shared/models/user.model';
import { Constants } from '../../../core/shared/config/constants';
import { SocialService } from '../services/social.service';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-edit',
  templateUrl: 'post-edit.component.html',
  styleUrls: ['post-edit.component.css']
})

export class PostEditComponent implements OnInit, OnChanges {

  @ViewChild('modal') modal: HdModalComponent;
  @ViewChild('photoSelectModal') photoSelectModal: PostPhotoSelectComponent;
  @ViewChild('privacyCustomModal') privacyCustomModal: PostPrivacyCustomComponent;

  // For share
  // @Input() isShare: boolean = false;

  mode: string = 'add'; // add or edit
  isShare: boolean = false; // if we are creating a new share that means isShare's value is 'true'
  @Input() photos: Array<any> = new Array<any>();
  @Input() community: any;

  @Output() onMoreAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEdited: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() saved: EventEmitter<any> = new EventEmitter<any>();
  @Output() dismissed: EventEmitter<any> = new EventEmitter<any>();

  post: SoPost;
  files: Array<any> = new Array<any>();
  tags: Array<string> = new Array<string>();
  objTags: Array<any> = new Array<any>();
  originalTags: Array<any> = new Array<any>();
  custom_objects: Array<any> = new Array<any>();

  form: FormGroup;
  descCtrl: AbstractControl;
  tagsCtrl: AbstractControl;
  photosCtrl: AbstractControl;
  backupPhotos: Array<any> = new Array<any>();
  uploadedPhotos: Array<any> = new Array<any>();

  parent: any = null;
  currentUser: User;
  readonly soPostPrivacy : any = Constants.soPostPrivacy;

  constructor(private apiService: ApiBaseService,
              private loading: LoadingService,
              private fb: FormBuilder,
              private socialService: SocialService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.post = new SoPost();
    this.form = this.fb.group({
      'description': [this.post.description, null],
      'tags': [this.post.tags, null],
      'photos': [this.post.photos, null]
    });
    this.descCtrl = this.form.controls['description'];
    this.tagsCtrl = this.form.controls['tags'];
    this.photosCtrl = this.form.controls['photos'];
    this.currentUser = this.userService.profile;
  }

  ngOnChanges() {

  }

  open(options: any = {mode: 'add', isShare: false, addingPhotos: false, post: null, parent: null}) {
    // load tags
    this.apiService.get(`zone/tags`)
      .subscribe((result: any) => {
          this.objTags = result['data'];
          this.tags = _.map(result['data'], 'name');
        },
        error => {
          console.log('error', error);
        });


    this.post = new SoPost();
    if(this.socialService.community.currentCommunity) {
      this.post.privacy = Constants.soPostPrivacy.customCommunity.data;
      this.custom_objects.length = 0; //
      this.custom_objects.push(this.socialService.community.currentCommunity); // Default share new post to current community
    }

    this.mode = options.mode;
    this.isShare = options.isShare;

    if (options.post != null) {
      this.post = options.post;
      this.originalTags = this.post.tags;
    }
    if (options.parent != null) {
      this.parent = options.parent;
    }


    this.form = this.fb.group({
      'description': [this.post.description, Validators.compose([Validators.required])],
      'tags': [_.map(this.post.tags, 'name'), null],
      'photos': [this.post.photos, null]
    });
    this.descCtrl = this.form.controls['description'];
    this.tagsCtrl = this.form.controls['tags'];
    this.photosCtrl = this.form.controls['photos'];
    if (options.addingPhotos) {
      this.photoSelectModal.open();
    } else {
      this.modal.open();
    }
  }

  close() {
    this.modal.close();
  }

  done(item: any) {

    let options: any = {
      mode: this.mode,
      item: {
        uuid: this.post.uuid,
        description: item.description,
        photos_json: this.post.photos, // TODO refactor on view formControl=photosCtrl
        tags_json: this.post.tags,
        privacy: this.post.privacy,
        adult: this.post.adult,
        disable_comment: this.post.disable_comment,
        disable_share: this.post.disable_share,
        mute: this.post.mute,
        parent_id: this.parent != null ? this.parent['id'] : null, // get parent post id
        custom_objects: this.custom_objects
      },
      isShare: this.isShare
    };
    console.log('adding................', options);
    this.saved.emit(options);


    // let body: string;
    // let url: string = 'zone/social_network/posts';
    // body = JSON.stringify({
    //   post: {
    //     description: item.description,
    //     photos_json: this.post.photos, // TODO refactor on view formControl=photosCtrl
    //     tags_json: this.post.tags,
    //     privacy: this.post.privacy,
    //     adult: this.post.adult,
    //     disable_comment: this.post.disable_comment,
    //     disable_share: this.post.disable_share,
    //     mute: this.post.mute
    //   },
    //   parent_id: this.parent != null ? this.parent['id'] : null, // get parent post id
    //   custom_objects: this.custom_objects
    // });
    //
    // if(this.mode == 'add') {
    //   this.apiService.post(url, body)
    //       .map(res => res.json())
    //       .subscribe((result: any) => {
    //           this.onEdited.emit(result['data']);
    //           this.modal.close();
    //         },
    //         error => {
    //           console.log('error', error);
    //         }
    //       );
    //
    // } else if(this.mode == 'edit') {
    //   url += `/${this.post.uuid}`;
    //   this.apiService.put(url, body)
    //       .map(res => res.json())
    //       .subscribe((result: any) => {
    //           this.onEdited.emit(result['data']);
    //           this.modal.close();
    //         },
    //         error => {
    //           console.log('error', error);
    //         }
    //       );
    // }

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
    if (this.post.description == '' && this.photos.length <= 0) {
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
    this.onMoreAdded.emit(true);
    this.photoSelectModal.open({return: true});
  }

  dismiss(photos: any) {
    // if(photos == null) {
    //   this.modal.open();
    // }
    //
    // // restore photos after we cancelled editing
    // if(this.mode == 'edit' && this.backupPhotos.length > 0) {
    //   this.post.photos = this.backupPhotos;
    // }
    // if(this.uploadedPhotos.length > 0) {
    //   // delete uploaded files form uploaded photos
    //   this.post.photos = _.pullAll(this.post.photos, this.uploadedPhotos);
    //   this.files = [];
    // }
    this.dismissed.emit(photos);
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

  customPrivacy(type: string, event: any) {
    event.preventDefault();
    this.privacyCustomModal.open({type: type});
  }

  selectedItems(response: any) {
    this.update({privacy: response.type}, null);
    this.custom_objects = response.items;
  }

  privacyName(post: any): string {
    return post.privacy.replace('_', ' ');
  }

  privacyClassIcon(post: any): string {
    switch (post.privacy) {
      case Constants.soPostPrivacy.friends.data:
        return 'fa-users';
      case  Constants.soPostPrivacy.public.data:
        return 'fa-globe';
      case  Constants.soPostPrivacy.personal.data:
        return 'fa-lock';
      case  Constants.soPostPrivacy.customFriend.data:
        return 'fa-user-times';
      case  Constants.soPostPrivacy.customCommunity.data:
        return 'fa-group';
    }
    return '';
    // return `Constants.soPostPrivacy.${post.privacy}.class`;
  }

  /**
   * Tagging
   */
  addTag(tag: any) {
    let tagObj = _.find(this.objTags, ['name', tag]);
    if (tagObj == undefined) {
      tagObj = {
        id: null,
        name: tag,
        user_id: this.userService.profile.id
      };
    }
    this.post.tags.push(tagObj);
    console.log('tag add', tag, this.post.tags);
  }


  removeTag(tag: any) {

    this.post.tags = _.pull(this.post.tags, _.find(this.post.tags, ['name', tag]));
    console.log('tag remove', tag, this.post.tags);
  }

  /**
   * Privacy
   */

  update(attr: any = {}, event: any) {
    if (event != null) {
      event.preventDefault();
    }

    if (this.mode == 'add') {
      this.post = _.assignIn(this.post, attr);
    } else {
      this.onUpdated.emit(attr);
    }
  }
}

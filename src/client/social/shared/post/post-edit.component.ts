import {
  Component, ViewChild, OnInit, Input, Output, OnChanges, EventEmitter, OnDestroy,
  Renderer, ElementRef
} from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { HdModalComponent } from '../../../core/shared/ng2-hd/modal/components/modal';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';
import { SoPost } from '../../../core/shared/models/social_network/so-post.model';
import { User } from '../../../core/shared/models/user.model';
import { Constants } from '../../../core/shared/config/constants';
import { SocialService } from '../services/social.service';
import { PhotoModalDataService } from '../../../core/shared/services/photo-modal-data.service';
import { Subscription } from 'rxjs';
import { PhotoUploadService } from '../../../core/shared/services/photo-upload.service';
import { EntitySelectComponent } from '../../../core/partials/entity-select/entity-select.component';


declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-edit',
  templateUrl: 'post-edit.component.html',
  styleUrls: ['post-edit.component.css']
})

export class PostEditComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('modal') modal: HdModalComponent;
  // @ViewChild('privacyCustomModal') privacyCustomModal: PostPrivacyCustomComponent;
  @ViewChild('privacyCustomModal') privacyCustomModal: EntitySelectComponent;


  // For share
  // @Input() isShare: boolean = false;

  mode: string = 'add'; // add or edit
  isShare: boolean = false; // if we are creating a new share that means isShare's value is 'true'
  @Input() photos: Array<any> = new Array<any>();
  @Input() community: any;
  @ViewChild('textarea') textarea: ElementRef;

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

  // Subscription list
  nextSubscription : Subscription;
  dismissSubscription : Subscription;
  uploadSubscription : Subscription;

  constructor(private apiService: ApiBaseService,
              // private loading: LoadingService,
              private fb: FormBuilder,
              private socialService: SocialService,
              private photoSelectDataService : PhotoModalDataService,
              private photoUploadService: PhotoUploadService,
              private renderer: Renderer,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.post = new SoPost();
    this.form = this.fb.group({
      'description': [this.post.description, null],
      'tags': [this.post.tags],
      'photos': [this.post.photos, null]
    });
    this.descCtrl = this.form.controls['description'];
    this.tagsCtrl = this.form.controls['tags'];
    this.photosCtrl = this.form.controls['photos'];
    this.currentUser = this.userService.profile;

  }

  ngOnChanges(data: any) {

  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }


  open(options: any = {mode: 'add', isShare: false, addingPhotos: false, post: null, parent: null}) {

  console.log('opening............:');
    // load tags
    // this.apiService.get(`media/tags`)
    //   .subscribe((result: any) => {
    //       this.objTags = result['data'];
    //       this.tags = _.map(result['data'], 'name');
    //     },
    //     error => {
    //       console.log('error', error);
    //     });

    this.post = new SoPost();
    if(this.socialService.community.currentCommunity) {
      this.post.privacy = Constants.soPostPrivacy.customCommunity.data;
      this.post.custom_objects.length = 0;
      this.post.custom_objects.push(this.socialService.community.currentCommunity); // Default share new post to current community
    }

    this.mode = options.mode;
    this.isShare = options.isShare;

    if (options.post != null) {
      this.post = _.cloneDeep(options.post);
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
      this.photoSelectDataService.open({return: false});
    } else {
      this.modal.open();
    }

    // Clear pending files in case of failure
    this.files.length = 0;

    this.subscribePhotoSelectEvents();
  }

  close() {
    this.modal.close();
    this.unsubscribeAll();
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
        custom_objects: this.post.custom_objects
      },
      isShare: this.isShare
    };
    console.log('adding................', options);
    this.saved.emit(options);
    $('.modal-backdrop').remove();
    this.unsubscribeAll();
  }

  uploadFiles(files: Array<any>) {
    this.photoUploadService.uploadPhotos(files)
      .subscribe((res: any) => {
          this.files.shift(); // remove file was uploaded
          // Only add distinct photos into post edit
          this.post.photos.unshift(res.data);
          this.uploadedPhotos.push(res.data);

    }, (err: any) => {
        console.log('Error when uploading files ', err);
    });
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
    console.log('on next ...........:', selectedPhotos);
    // Create union of selected photos and add to post
    this.post.photos = _.uniqBy(_.flatten([this.post.photos, selectedPhotos]), 'id');
    this.photoSelectDataService.close();
    this.modal.open();
  }

  addMorePhoto(event: any) {
    this.onMoreAdded.emit(true);
    this.photoSelectDataService.open({return: true, selectingPhotos: this.post.photos});
    this.subscribePhotoSelectEvents();
  }

  dismiss(photos: any) {
    // this.photos.length = 0;
    this.dismissed.emit(photos);
    this.modal.open();
    this.unsubscribeAll();
  }

  upload(files: Array<any>) {
    // Filter valid image type
    let valid_images = this.photoUploadService.getValidImages(files);

    _.forEach(valid_images, (file: any) => {
      this.files.push(file);
    });
    // this.files = files;
    this.photoSelectDataService.close();
    this.modal.open();
    this.uploadFiles(this.files);
  }

  closeSelectPhoto(event: any) {
    console.log('closing.........');
  }

  customPrivacy(type: string, event: any) {
    event.preventDefault();
    let mode: string = 'edit';
    if (this.post.privacy !== type)
      mode = 'add';

    this.privacyCustomModal.open({type: type, data: this.post.custom_objects}, mode);
  }

  selectedItems(response: any) {
    this.update({privacy: response.type, custom_objects: response.items}, null);
    // this.custom_objects = response.items;
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
    // let tagObj = _.find(this.objTags, ['name', tag]);
    // if (tagObj == undefined) {
    //   tagObj = {
    //     id: null,
    //     name: tag,
    //     user_id: this.userService.profile.id
    //   };
    // }
    // this.post.tags.push(tagObj);
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
      this.post = _.assignIn(this.post, attr);
      // this.onUpdated.emit(attr);
    }
  }

  private subscribePhotoSelectEvents() {
    let closeObs$ = this.photoSelectDataService.closeObs$.merge(this.photoSelectDataService.dismissObs$).do(() => {
      console.log('next sub: ', this.nextSubscription);
    });

    if (this.needInitSubscription(this.nextSubscription)) {
      this.nextSubscription = this.photoSelectDataService.nextObs$.takeUntil(closeObs$).subscribe((photos : any) => {
        this.next(photos);
      });
    }

    if (this.needInitSubscription(this.dismissSubscription)) {

      this.dismissSubscription = this.photoSelectDataService.dismissObs$.subscribe((photos: any) => {
        this.dismiss(photos);
      });
    }

    if (this.needInitSubscription(this.uploadSubscription)) {
      this.uploadSubscription = this.photoSelectDataService.uploadObs$.takeUntil(closeObs$).subscribe((files: any) => {
        this.upload(files);
      });
    }
  }

  private needInitSubscription(sub : Subscription) {
    return !sub || sub.closed;
  }

  private unsubscribeAll() {
    _.forEach([this.nextSubscription, this.dismissSubscription, this.uploadSubscription], (sub: Subscription) => {
      if (sub && !sub.closed)
        sub.unsubscribe();
    });
  }
}

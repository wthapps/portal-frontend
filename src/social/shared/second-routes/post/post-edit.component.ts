import {
  Component, ViewChild, OnInit, Input, Output, EventEmitter, OnDestroy,
  ElementRef
} from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';


import { SocialService } from '../../services/social.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import { EntitySelectComponent } from '@wth/shared/shared/components/entity-select/entity-select.component';
import { SoPost } from '@shared/shared/models';
import { Constants } from '@wth/shared/constant';
import { PhotoModalDataService, PhotoUploadService, UserService } from '@wth/shared/services';
import { LoadingService } from "@shared/shared/components/loading/loading.service";
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';


@Component({
  selector: 'so-post-edit',
  templateUrl: 'post-edit.component.html',
  styleUrls: ['post-edit.component.scss']
})

export class PostEditComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('privacyCustomModal') privacyCustomModal: EntitySelectComponent;


  mode: string = 'add'; // add or edit
  isShare: boolean = false; // if we are creating a new share that means isShare's value is 'true'
  @Input() photos: Array<any> = new Array<any>();
  @Input() community: any;
  @Input() soProfile: any;
  @Input() showTag: boolean = true;
  @Input() showAddPhotosButton: boolean = true;
  @Input() link: any = null;

  @ViewChild('textarea') textarea: ElementRef;

  @Output() onMoreAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() saved: EventEmitter<any> = new EventEmitter<any>();
  @Output() dismissed: EventEmitter<any> = new EventEmitter<any>();

  tooltip: any = Constants.tooltip;

  post: SoPost;
  files: Array<any> = new Array<any>();
  tags: Array<string> = new Array<string>();
  originalTags: Array<any> = new Array<any>();
  custom_objects: Array<any> = new Array<any>();

  form: FormGroup;
  descCtrl: AbstractControl;
  tagsCtrl: AbstractControl;
  photosCtrl: AbstractControl;

  backupPhotos: Array<any> = new Array<any>();
  uploadedPhotos: Array<any> = new Array<any>();

  parent: any = null;
  privacyClassIcon: string;
  privacyName: string;
  profile$: Observable<any>;

  readonly soPostPrivacy: any = Constants.soPostPrivacy;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(private fb: FormBuilder,
              private router: Router,
              private loadingService: LoadingService,
              private socialService: SocialService,
              private mediaSelectionService: WMediaSelectionService,
              private photoSelectDataService: PhotoModalDataService,
              private photoUploadService: PhotoUploadService,
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
    // this.currentUser = this.userService.getSyncProfile();
    this.profile$ = this.userService.getAsyncProfile();


    this.mediaSelectionService.selectedMedias$.subscribe((items) => {
      console.debug(items);
      // this.post = {...this.post};
      this.post.photos = items;
    });

  }

  ngOnChanges() {
    this.privacyClassIcon = this.getPrivacyClassIcon(this.post);
    this.privacyName = this.getPrivacyName(this.post);
  }

  viewProfile(uuid: string = this.userService.getSyncProfile().uuid) {
    this.router.navigate([{outlets: {detail: null}}], {queryParamsHandling: 'preserve', preserveFragment: true})
      .then(() => this.router.navigate(['profile', uuid]));
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }


  open(options: any = {mode: 'add', isShare: false, addingPhotos: false, post: null, parent: null}) {
    this.post = new SoPost();
    if (this.socialService.community.currentCommunity) {
      this.post.privacy = Constants.soPostPrivacy.customCommunity.data;
      this.post.custom_objects.length = 0;
      this.post.custom_objects.push(this.socialService.community.currentCommunity); // Default share new post to current community
    } else {
      let defaultPrivacy: string = _.get(this.soProfile, 'settings.viewable_post.value');
      if (options.mode === 'add' && defaultPrivacy) {
        this.post.privacy = defaultPrivacy;
      }

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
    this.privacyClassIcon = this.getPrivacyClassIcon(this.post);
    this.privacyName = this.getPrivacyName(this.post);


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
  }

  close() {
    this.modal.close();
    this.photoSelectDataService.close();
    // $('.modal-backdrop').remove();
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
        custom_objects: this.post.custom_objects,
        link: this.link
      },
      isShare: this.isShare
    };
    this.saved.emit(options);
    this.photoSelectDataService.close();

    this.modal.close();

    // this.textarea.nativeElement.style.heigth = '50px';
    // console.log(this.textarea.nativeElement.style.heigth);
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

  removePhoto(photo: any, event: any) {
    this.backupPhotos = this.post.photos;
    this.post.photos = _.pull(this.post.photos, photo);
  }

  next(selectedPhotos: any) {
    // Create union of selected photos and add to post
    this.post.photos = _.uniqBy(_.flatten([this.post.photos, selectedPhotos]), 'id');
    this.photoSelectDataService.close();
    this.modal.open();
  }

  addMorePhoto(event: any) {
    this.onMoreAdded.emit(true);
    this.mediaSelectionService.open();
    // this.photoSelectDataService.open({return: true, selectingPhotos: this.post.photos});
    // this.subscribePhotoSelectEvents();
  }

  dismiss(photos: any) {
    // this.photos.length = 0;
    this.dismissed.emit(photos);
    this.modal.close(null).then();
    this.photoSelectDataService.close();
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

  /**
   * Tagging
   */
  addTag(tag: any) {
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

    this.post = {...this.post, ...attr};
    this.privacyName = this.getPrivacyName(this.post);
    console.debug('updating... ', this.post);
  }

  private getPrivacyClassIcon(post: any): string {
    let privacy = (!post || post.privacy == '') ? 'public' : post.privacy;
    switch (privacy) {
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

  loading() {
    this.loadingService.start('#loading');
  }

  stopLoading() {
    this.loadingService.stop('#loading');
  }

  private getPrivacyName(post: any): string {
    let privacy = (!post || post.privacy == '') ? 'public' : post.privacy;
    if (privacy === Constants.soPostPrivacy.customCommunity.data && post.custom_objects.length === 1)
      return post.custom_objects[0].name;
    return privacy.replace('_', ' ');
  }

  private subscribePhotoSelectEvents() {
    let closeObs$ = Observable.merge(this.photoSelectDataService.closeObs$, this.photoSelectDataService.openObs$, this.photoSelectDataService.dismissObs$, this.destroySubject.asObservable());

    this.photoSelectDataService.nextObs$.takeUntil(closeObs$).subscribe((photos: any) => {
      this.next(photos);
    });

    this.photoSelectDataService.uploadObs$.takeUntil(closeObs$).subscribe((files: any) => {
      this.upload(files);
    });

  }
}

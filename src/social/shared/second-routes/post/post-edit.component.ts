import {
  Component,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { takeUntil, filter, map, tap, take } from 'rxjs/operators';

import { SocialService } from '../../services/social.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import { EntitySelectComponent } from '@wth/shared/shared/components/entity-select/entity-select.component';
import { SoPost } from '@shared/shared/models';
import { Constants } from '@wth/shared/constant';
import { PhotoUploadService, UserService } from '@wth/shared/services';
import { LoadingService } from '@shared/shared/components/loading/loading.service';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { WTHEmojiService } from '@wth/shared/components/emoji/emoji.service';
import { MiniEditorComponent } from '@wth/shared/shared/components/mini-editor/mini-editor.component';

@Component({
  selector: 'so-post-edit',
  templateUrl: 'post-edit.component.html',
  styleUrls: ['post-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
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


  @ViewChild(MiniEditorComponent) editor: MiniEditorComponent;
  // @ViewChild('editor') editor: MiniEditorComponent; // Replaced by MiniEditor

  @Output() onMoreAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() saved: EventEmitter<any> = new EventEmitter<any>();
  @Output() dismissed: EventEmitter<any> = new EventEmitter<any>();

  readonly tooltip: any = Constants.tooltip;
  readonly postPrivacy: any = Constants.soPostPrivacy;

  post: SoPost;
  files: Array<any> = new Array<any>();
  tags: Array<string> = new Array<string>();
  originalTags: Array<any> = new Array<any>();
  custom_objects: Array<any> = new Array<any>();
  description: any;
  hasChange: boolean;

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
  selectEmojiSub: Subscription;

  readonly soPostPrivacy: any = Constants.soPostPrivacy;

  private destroySubject: Subject<any> = new Subject<any>();
  private uploadSubscriptions: { [filename: string]: Subscription } = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingService: LoadingService,
    private socialService: SocialService,
    private mediaSelectionService: WMediaSelectionService,
    private photoUploadService: PhotoUploadService,
    private emojiService: WTHEmojiService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.post = new SoPost();
    this.form = this.fb.group({
      description: [this.post.description, null],
      tags: [this.post.tags],
      photos: [this.post.photos, null]
    });
    // this.descCtrl = this.form.controls['description'];
    this.tagsCtrl = this.form.controls['tags'];
    this.photosCtrl = this.form.controls['photos'];
    // this.currentUser = this.userService.getSyncProfile();
    this.profile$ = this.userService.getAsyncProfile();
  }

  ngOnChanges() {
    // this.privacyClassIcon = this.getPrivacyClassIcon(this.post);
    this.privacyName = this.getPrivacyName(this.post);
  }

  handleKeyUp(event: any) {
    this.hasChange = true;
  }

  viewProfile(uuid: string = this.userService.getSyncProfile().uuid) {
    this.router
      .navigate([{outlets: {detail: null}}], {
        queryParamsHandling: 'preserve',
        preserveFragment: true
      })
      .then(() => this.router.navigate(['profile', uuid]));
  }

  showEmojiBtn(event: any) {
    this.emojiService.show(event);

    if(this.selectEmojiSub && !this.selectEmojiSub.closed)
      this.selectEmojiSub.unsubscribe();
    this.selectEmojiSub = this.emojiService.selectedEmoji$
      .pipe(
      take(1))
      .subscribe(data => {
      this.editor.addEmoj(data.shortname);
      this.hasChange = true;
    });
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  open(
    options: any = {
      mode: 'add',
      isShare: false,
      addingPhotos: false,
      post: null,
      parent: null
    }
  ) {
    this.hasChange = false;
    this.post = new SoPost();
    if (this.socialService.community.currentCommunity) {
      this.post.privacy = Constants.soPostPrivacy.customCommunity.data;
      this.post.custom_objects.length = 0;
      this.post.custom_objects.push(
        this.socialService.community.currentCommunity
      ); // Default share new post to current community
    } else {
      let defaultPrivacy: string = _.get(
        this.soProfile,
        'settings.viewable_post.value'
      );
      if (options.mode === 'add' && defaultPrivacy) {
        this.post.privacy = defaultPrivacy;
      }
    }

    this.mode = options.mode;
    this.isShare = options.isShare;

    if (options.post != null) {
      this.post = _.cloneDeep(options.post);
      this.originalTags = this.post.tags;
      this.setItemDescription(options.post.description);
    } else {
      this.setItemDescription('');
    }

    if (options.parent != null) {
      this.parent = options.parent;
    }
    // this.privacyClassIcon = this.getPrivacyClassIcon(this.post);
    this.privacyName = this.getPrivacyName(this.post);

    this.form = this.fb.group({
      // 'description': [this.post.description, Validators.compose([Validators.required])],
      tags: [_.map(this.post.tags, 'name'), null],
      photos: [this.post.photos, null]
    });
    // this.descCtrl = this.form.controls['description'];
    this.setItemDescription(this.post.description);

    this.editor.focus();
    this.tagsCtrl = this.form.controls['tags'];
    this.photosCtrl = this.form.controls['photos'];
    if (options.addingPhotos) {
      this.mediaSelectionService.setMultipleSelection(true);
      this.mediaSelectionService.open();
    } else {
      this.modal.open();
    }

    // Clear pending files in case of failure
    this.files.length = 0;
  }

  close() {
    this.modal.close();
    this.mediaSelectionService.close();
  }

  done(item: any) {
    // this.setItemDescriptionFromDom();
    let options: any = {
      mode: this.mode,
      item: {
        uuid: this.post.uuid,
        description: this.description,
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
    this.mediaSelectionService.close();

    this.modal.close();
  }

  uploadFiles(files: Array<any>) {
    if (files.length <= 0) return;
    let subscription = this.photoUploadService.uploadPhotos(files).subscribe(
      (res: any) => {
        this.files.shift(); // remove file was uploaded
        // Only add distinct photos into post edit
        this.post.photos.unshift(res.data);
        this.uploadedPhotos.push(res.data);
      },
      (err: any) => {
        console.log('Error when uploading files ', err);
      }
    );

    this.uploadSubscriptions[files[0].name] = subscription;
  }

  cancelUploading(file: any) {
    _.pull(this.files, file);
    if (file.name && this.uploadSubscriptions[file.name]) {
      this.uploadSubscriptions[file.name].unsubscribe();
      delete this.uploadSubscriptions[file.name];
    }
  }

  doEvents(response: any) {
    switch (response.action) {
      case 'remove':
        this.backupPhotos = this.post.photos;
        this.post.photos = _.pull(this.post.photos, response.data);
        break;
    }
  }

  removePhoto(photo: any, event: any) {
    this.backupPhotos = this.post.photos;
    this.post.photos = _.pull(this.post.photos, photo);
  }

  next(selectedPhotos: any) {
    // Create union of selected photos and add to post
    this.post.photos = _.uniqBy(
      _.flatten([this.post.photos, selectedPhotos]),
      'id'
    );
    this.mediaSelectionService.close();
    this.modal.open();
  }

  addMorePhoto(event: any) {
    this.onMoreAdded.emit(true);
    this.mediaSelectionService.open();
    this.mediaSelectionService.setMultipleSelection(true);

    let close$: Observable<any> = Observable.merge(
      this.mediaSelectionService.open$,
      componentDestroyed(this)
    );
    this.mediaSelectionService.selectedMedias$
      .pipe(takeUntil(close$), filter(items => items.length > 0))
      .subscribe(items => {
        this.post.photos = _.uniqBy(_.flatten([this.post.photos, items]), 'id');
      });

    this.mediaSelectionService.uploadingMedias$
      .pipe(
        takeUntil(close$),
        map(([file, dataUrl]) => file),
        filter(file => this.photoUploadService.isValidImage(file)),
        tap(file => {
          this.files.push(file);
          this.modal.open();
        })
      )
      .subscribe((item: any[]) => {
        this.uploadFiles([item]);
      });
  }

  dismiss(photos: any) {
    this.dismissed.emit(photos);
    this.modal.close(null).then();
    this.mediaSelectionService.close();
  }

  customPrivacy(type: string, event: any) {
    event.preventDefault();
    let mode: string = 'edit';
    if (this.post.privacy !== type) mode = 'add';

    this.privacyCustomModal.open(
      {type: type, data: this.post.custom_objects},
      mode
    );
  }

  selectedItems(response: any) {
    this.update(
      {privacy: response.type, custom_objects: response.items},
      null
    );
  }

  /**
   * Tagging
   */
  addTag(tag: any) {
    console.log('tag add', tag, this.post.tags);
  }

  removeTag(tag: any) {
    this.post.tags = _.pull(
      this.post.tags,
      _.find(this.post.tags, ['name', tag])
    );
  }

  update(attr: any = {}, event: any) {
    if (event != null) {
      event.preventDefault();
    }

    this.post = {...this.post, ...attr};
    this.privacyName = this.getPrivacyName(this.post);
  }

  // private getPrivacyClassIcon(post: any): string {
  //   let privacy = !post || post.privacy == '' ? 'public' : post.privacy;
  //   switch (privacy) {
  //     case Constants.soPostPrivacy.friends.data:
  //       return 'fa-users';
  //     case Constants.soPostPrivacy.public.data:
  //       return 'fa-globe';
  //     case Constants.soPostPrivacy.personal.data:
  //       return 'fa-lock';
  //     case Constants.soPostPrivacy.customFriend.data:
  //       return 'fa-user-times';
  //     case Constants.soPostPrivacy.customCommunity.data:
  //       return 'fa-group';
  //   }
  //   return '';
  //   // return `Constants.soPostPrivacy.${post.privacy}.class`;
  // }

  loading() {
    this.loadingService.start('#loading');
  }

  stopLoading() {
    this.loadingService.stop('#loading');
  }

  private setItemDescription(value: any) {
    this.description = value;
  }

  private getPrivacyName(post: any): string {
    let privacy = !post || post.privacy == '' ? 'public' : post.privacy;
    if (
      privacy === Constants.soPostPrivacy.customCommunity.data &&
      post.custom_objects.length === 1
    )
      return post.custom_objects[0].name;
    return privacy.replace('_', ' ');
  }

}

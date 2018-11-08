import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { WUploader } from '@shared/services/w-uploader';
import { LoadingService } from '@shared/shared/components/loading/loading.service';
import { SoPost } from '@shared/shared/models';
import TextLengthValidatior from '@social/shared/hooks/validators/text-lenght.validator';
import { ZSocialSharedPrivacyComponent } from '@social/shared/modal-privacy/privacy.component';
import { WTHEmojiService } from '@wth/shared/components/emoji/emoji.service';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { Constants } from '@wth/shared/constant';
import { UserService } from '@wth/shared/services';
import { EntitySelectComponent } from '@wth/shared/shared/components/entity-select/entity-select.component';
import { MiniEditorComponent } from '@wth/shared/shared/components/mini-editor/mini-editor.component';
import { BsModalComponent } from 'ng2-bs3-modal';

import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { Observable } from 'rxjs/Observable';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { SocialService } from '../../services/social.service';
import { MODEL_TYPE } from './../../../../shared/constant/config/constants';

@Component({
  selector: 'so-post-edit',
  templateUrl: 'post-edit.component.html',
  styleUrls: ['post-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostEditComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('privacyCustomModal') privacyCustomModal: EntitySelectComponent;
  @ViewChild('privacyModal') privacyModal: ZSocialSharedPrivacyComponent;

  mode = 'add'; // add or edit
  editorLimit = 3000;
  editorError = '';
  editorErrorMessage = 'The maximum limit for a post is ' + this.editorLimit + ' characters. Please make your post shorter.';
  isShare = false; // if we are creating a new share that means isShare's value is 'true'
  @Input() photos: Array<any> = new Array<any>();
  @Input() community: any;
  @Input() soProfile: any;
  @Input() showTag = true;
  @Input() showAddPhotosButton = true;
  @Input() link: any = null;


  @ViewChild(MiniEditorComponent) editor: MiniEditorComponent;

  @Output() onMoreAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() saved: EventEmitter<any> = new EventEmitter<any>();
  @Output() dismissed: EventEmitter<any> = new EventEmitter<any>();

  readonly tooltip: any = Constants.tooltip;
  readonly postPrivacy: any = Constants.soPostPrivacy;
  readonly SEARCH_PLACEHOLDER = {
    customFriend: 'Search for friends',
    custom_friend: 'Search for friends',
    customCommunity: 'Search for community',
    custom_community: 'Search for community'
  };

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
  textValidator: TextLengthValidatior = new TextLengthValidatior(this.editorLimit);

  readonly MODEL = MODEL_TYPE;
  readonly soPostPrivacy: any = Constants.soPostPrivacy;

  private uploadingPhotos: Array<any> = [];
  private destroySubject: Subject<any> = new Subject<any>();
  private sub: Subscription;
  private close$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingService: LoadingService,
    private socialService: SocialService,
    private mediaSelectionService: WMediaSelectionService,
    private emojiService: WTHEmojiService,
    private userService: UserService,
    private uploader: WUploader
  ) {
  }

  ngOnInit(): void {
    this.post = new SoPost();
    this.form = this.fb.group({
      description: [this.post.description, null],
      tags: [this.post.tags],
      photos: [this.post.photos, null]
    });
    this.tagsCtrl = this.form.controls['tags'];
    this.photosCtrl = this.form.controls['photos'];
    this.profile$ = this.userService.getAsyncProfile();
    this.sub = this.uploader.event$.subscribe(event => {
      this.handleUploadFiles(event);
    });

    this.close$ = Observable.merge(
      this.mediaSelectionService.open$,
      componentDestroyed(this)
    );
  }

  ngOnChanges() {
    this.privacyName = this.getPrivacyName(this.post);
  }

  viewProfile(uuid: string = this.userService.getSyncProfile().uuid) {
    this.router
      .navigate([{ outlets: { detail: null } }], {
        queryParamsHandling: 'preserve',
        preserveFragment: true
      })
      .then(() => this.router.navigate(['profile', uuid]));
  }

  showEmojiBtn(event: any) {
    this.emojiService.show(event);

    if (this.selectEmojiSub && !this.selectEmojiSub.closed)
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
    if (this.sub && !this.sub.closed)
      this.sub.unsubscribe();
  }

  open(
    options: any = {
      mode: 'add',
      isShare: false,
      addingPhotos: false,
      showEmoji: false,
      post: null,
      parent: null
    }
  ) {
    this.hasChange = false;
    this.post = new SoPost();
    if (this.socialService.community.currentCommunity) {
      this.post.privacy = Constants.soPostPrivacy.customCommunity.data;
      this.post.custom_objects = [this.socialService.community.currentCommunity];
    } else {
      const defaultPrivacy: string = _.get(
        this.soProfile,
        'settings.viewable_post.value'
      );
      if (options.mode === 'add' && defaultPrivacy) {
        this.post.privacy = defaultPrivacy;
      }
    }

    this.mode = options.mode;
    this.isShare = options.isShare;
    this.editorError = '';

    if (options.post != null) {
      this.post = _.cloneDeep(options.post);
      this.originalTags = this.post.tags;
      this.setItemDescription(options.post.description);
    } else {
      this.setItemDescription('');
    }

    this.parent = options.parent;
    this.privacyName = this.getPrivacyName(this.post);

    this.form = this.fb.group({
      tags: [_.map(this.post.tags, 'name'), null],
      photos: [this.post.photos, null]
    });
    this.setItemDescription(this.post.description);

    this.editor.focus();
    this.tagsCtrl = this.form.controls['tags'];
    this.photosCtrl = this.form.controls['photos'];

    this.modal.open()
      .then(_ => {
        if (options.addingPhotos)
          this.addMorePhoto();
        if (options.showEmoji)
          this.showEmojiBtn(null);
      });

    // Clear pending files in case of failure
    this.files.length = 0;
  }

  close() {
    this.modal.close();
    this.mediaSelectionService.close();
  }

  done(item: any) {
    // Exclude unfinished uploading videos / photos from creating / updating a post
    const photos = this.post.photos.filter(p => p.uuid).map(p => ({ ...p, model: p.model || MODEL_TYPE[p.object_type] }));
    const options: any = {
      mode: this.mode,
      item: {
        uuid: this.post.uuid,
        description: this.description,
        photos_json: photos, // TODO refactor on view formControl=photosCtrl
        resources_attributes: [],
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

    this.uploadingPhotos = [];
    this.saved.emit(options);
    this.mediaSelectionService.close();

    this.modal.close();
  }

  doEvents(response: any) {
    switch (response.action) {
      case 'remove':
        this.backupPhotos = this.post.photos;
        this.post.photos = _.pull(this.post.photos, response.data);
        break;
    }
  }

  handleUploadFiles(event: any) {
    let file;
    let photo;
    let index = -1;
    switch (event.action) {
      case 'start':
        this.uploadingPhotos = [];
        this.files = [];
        break;
      case 'progress':
        file = event.payload.file;
        this.post.photos.unshift(file);
        break;
      case 'success':
        // replace uploading photo by real photo
        file = event.payload.file;
        photo = event.payload.resp;
        index = this.post.photos.findIndex(p => p.id === file.id);
        if (index >= 0) {
          this.post.photos[index] = photo;
        }
        this.uploadingPhotos.push(photo);
        this.files.push(file);

        break;
    }
  }

  removePhoto(photo: any, event: any) {
    this.backupPhotos = this.post.photos;

    // cancel uploading photo/video or delete selected photo
    const index = this.uploadingPhotos.findIndex(p => p.id === photo.id);
    if (index >= 0) {
      this.uploader.cancel(this.files[index]);
      this.uploadingPhotos.splice(index, 1);
      this.files.splice(index, 1);
    } else if (photo.meta) {
      this.uploader.cancel(photo);
      this.uploadingPhotos.splice(index, 1);
      this.files.splice(index, 1);
    }
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

  addMorePhoto(event?: any) {
    this.onMoreAdded.emit(true);
    // this.mediaSelectionService.setMultipleSelection(true);
    this.mediaSelectionService.open({ filter: 'photo', allowSelectMultiple: true, allowCancelUpload: true });

    this.mediaSelectionService.selectedMedias$
      .pipe(takeUntil(this.close$), filter(items => items.length > 0))
      .subscribe(items => {
        this.post.photos = _.uniqBy(_.flatten([this.post.photos, items]), 'uuid');
      });
  }

  dismiss(photos: any) {
    if (this.uploadingPhotos.length > 0) {
      this.uploader.cancelAll(true);
    }
    this.dismissed.emit(photos);
    this.modal.close(null).then();
    this.mediaSelectionService.close();
  }

  customPrivacy(type: string, event: any) {
    event.preventDefault();
    let mode = 'edit';
    if (this.post.privacy !== type) mode = 'add';

    this.privacyCustomModal.placeholder = this.SEARCH_PLACEHOLDER[type] || 'Search';
    this.privacyCustomModal.open(
      { type: type, data: this.post.custom_objects },
      mode
    );
  }

  selectedItems(response: any) {
    console.log(response);
    this.update(
      { privacy: response.type, custom_objects: response.items },
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

    this.post = { ...this.post, ...attr };
    this.privacyName = this.getPrivacyName(this.post);
  }

  loading() {
    this.loadingService.start('#loading');
  }

  stopLoading() {
    this.loadingService.stop('#loading');
  }

  onTextChange(event) {
    this.hasChange = true;
    if (event.status.error) {
      this.editorError = 'editor-error';
    } else {
      this.editorError = '';
    }
  }

  onOpenPrivacyModal(type: string) {
    this.privacyModal.open(type);
  }

  private setItemDescription(value: any) {
    this.description = value;
  }

  private getPrivacyName(post: any): string {
    const privacy = !post || post.privacy === '' ? 'public' : post.privacy;
    if (
      privacy === Constants.soPostPrivacy.customCommunity.data &&
      post.custom_objects.length === 1
    )
      return post.custom_objects[0].name;
    return privacy.replace('_', ' ');
  }

}

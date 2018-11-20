import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subject ,  Observable } from 'rxjs';
import { combineLatest, takeUntil } from 'rxjs/operators';


import { SoStorageService } from './../../services/social-storage.service';
import { PostEditComponent } from './post-edit.component';
import { SocialService } from '../../services/social.service';
import { SoPost } from '@wth/shared/shared/models';
import { ApiBaseService } from '@wth/shared/services';
import { PostService } from './shared/post.service';
import { getSoProfile, SO_PROFILE_SETTING_PRIVACY_UPDATE_DONE } from '../../reducers/index';
import { Constants } from '@wth/shared/constant';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';

const DEFAULT_PRIVACY_SETTINGS = ['public', 'personal', 'friends'];

@Component({
  selector: 'so-post-list',
  templateUrl: 'post-list.component.html'
})

export class PostListComponent implements OnInit, OnDestroy {
  @ViewChild('postEditModal') postEditModal: PostEditComponent;

  @Input() type: string = undefined;
  @Input() community: any = undefined;
  @Input() canCreatePost = true;
  @Input() showComments = true;

  @Input() posts: Array<SoPost>;
  @Input() user: any;
  uuid: string;
  commentBox: any;
  page_index = 0;
  loading = false;
  nextLink: any;

  postIsEmpty = false;
  showLoading = true;
  readonly tooltip: any = Constants.tooltip;

  soProfile$: Observable<any>;
  emojiMap$: Observable<{ [name: string]: WTHEmojiCateCode }>;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(public apiBaseService: ApiBaseService,
    public socialService: SocialService,
    private soStorageService: SoStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private wthEmojiService: WTHEmojiService,
    private postService: PostService,
    private store: Store<any>,
    private mediaSelectionService: WMediaSelectionService
  ) {
    this.soProfile$ = store.select(getSoProfile);
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnInit() {
    // Support get route params from parent route as well as current route. Ex: Profile post page
    const parentRouteParams = this.route.parent.paramMap;
    const reloadQueryParam = this.route.queryParamMap; // .filter(queryParamM => !!queryParamM.get('r'));

    this.route.paramMap
      .pipe(
        combineLatest(parentRouteParams, reloadQueryParam, (paramMap, parentParamMap) => {
          this.startLoading();
          return paramMap.get('id') || parentParamMap.get('id');
        }),
        takeUntil(this.destroySubject)
      )
      .subscribe((id: any) => {
        this.uuid = id;
        // Load if items empty
        if (this.type !== 'search') {
          this.loadPosts();
        } else {
          this.stopLoading();
        }
      }, (err: any) => this.stopLoading());
  }

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
  }

  viewProfile(uuid: string) {
    this.router.navigate([{ outlets: { detail: null } }], { queryParamsHandling: 'preserve', preserveFragment: true })
      .then(() => this.router.navigate(['profile', uuid]));
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  mapPost(post: any) {
    return new SoPost().from(post);
  }

  mapPostNoComments(post: any) {
    const mappedPost = new SoPost().from(post).excludeComments();
    return mappedPost;
  }

  loadPosts() {
    if (!this.type) {
      console.error('type params should be assigned: ', this.type);
      this.stopLoading();
      return;
    }
    this.socialService.post.getList(this.uuid, this.type)
      .toPromise().then(
        (res: any) => {
          this.stopLoading();
          // this.posts = _.map(res.data, this.mapPost);
          this.soStorageService.savePostList(_.map(res.data, this.mapPost));
          this.nextLink = res.meta.links.next;
          if (res.data.length === 0) {
            this.postIsEmpty = true;
          }
        },
        (error: any) => {
          this.stopLoading();
          console.log('loading posts errors: ', error);
        }
      );
  }

  /**
   * Post actions
   */

  openEditModal(options: any) {
    this.postEditModal.open(options);
  }

  save(options: any = { mode: 'add', item: null, isShare: false }) {
    if (options.mode === 'add') {
      this.postService.add(options.item)
        .toPromise().then((response: any) => {
          // this.posts.unshift(..._.map([response.data], this.mapPost)); // Adding new post at the beginning of posts array
          const newPost = this.mapPost(response.data);
          this.soStorageService.createPost(newPost);
          this.postEditModal.close();
          this.postIsEmpty = false;
          if (DEFAULT_PRIVACY_SETTINGS.includes(response.data.privacy)) {
            this.store.dispatch({ type: SO_PROFILE_SETTING_PRIVACY_UPDATE_DONE, payload: response.data.privacy });
          }
        },
          (error: any) => {
            console.log('error', error);
          }
        );
    } else if (options.mode === 'edit') {
      // Update post content only, not reload comments
      this.postEditModal.close();
      this.postService.update(options.item)
        .toPromise().then((response: any) => {
          const editedItem = _.map([response.data], this.mapPostNoComments)[0];
          const idx = _.findIndex(this.posts, (i: SoPost) => {
            return i.uuid === editedItem.uuid;
          });
          if (idx >= 0) {
            editedItem.comments = this.posts[idx].comments;
            // this.posts[idx] = editedItem;
          }
          this.soStorageService.updatePost(editedItem);

          if (DEFAULT_PRIVACY_SETTINGS.includes(response.data.privacy)) {
            this.store.dispatch({ type: SO_PROFILE_SETTING_PRIVACY_UPDATE_DONE, payload: response.data.privacy });
          }

        },
          (error: any) => {
            console.log('error', error);
          }
        );
    }
  }

  updateUserSettings(privacy: string) {
    // this.store.dispatch({type: SO_PROFILE_UPDATE_DONE, payload: res.data});
  }

  dismiss(item: any) {
    console.log('dismiss item...............', item);
  }

  viewDetail() {
    console.log('list viewing details..........');
  }

  edit() {
    console.log('list editing..................');
  }

  update(att: any) {
    console.log('list updating.................');
  }

  delete() {
    console.log('list deleting.................');
  }

  updatedPost(event: any, post: any) {
    this.posts = _.map(this.posts, (item: any) => {
      return (item.id === post.id) ? post : item;
    });
    // this.soStorageService.updatePost(post);
  }

  deletedPost(event: any, post: any) {
    // _.remove(this.posts, { id: post.id });
    this.soStorageService.removePosts([post.uuid]);
  }


  openPhotoModal(e: any) {
    this.commentBox = e;
  }

  onSelectPhotoComment(photos: any) {
    if (this.commentBox) {
      this.commentBox.commentAction(photos);
    }
  }

  viewMorePosts() {
    if (this.nextLink) {
      this.apiBaseService.get(this.nextLink)
        .toPromise().then((res: any) => {
          // _.map(res.data, (v: any) => {
          //   this.posts.push(this.mapPost(v));
          // });
          this.soStorageService.appendPosts(res.data.map(v => this.mapPost(v)));
          this.nextLink = res.meta.links.next;
        });
    }
  }

  openSelectPhotosModal() {
    this.mediaSelectionService.open({ allowSelectMultiple: true });
  }
}

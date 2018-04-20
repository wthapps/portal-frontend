import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { combineLatest, takeUntil } from 'rxjs/operators';


import { PostEditComponent } from './post-edit.component';
import { SocialService } from '../../services/social.service';
import { SoPost } from '@wth/shared/shared/models';
import { ApiBaseService } from '@wth/shared/services';
import { LoadingService } from '@shared/shared/components/loading/loading.service';
import { PostService } from './shared/post.service';
import { getSoProfile, SO_PROFILE_SETTING_PRIVACY_UPDATE_DONE } from '../../reducers/index';

@Component({
  selector: 'so-post-list',
  templateUrl: 'post-list.component.html'
})

export class PostListComponent implements OnInit, OnDestroy {
  @ViewChild('postEditModal') postEditModal: PostEditComponent;

  @Input() type: string = undefined;
  @Input() community: any = undefined;
  @Input() canCreatePost: boolean = true;
  @Input() showComments: boolean = true;

  @Input() items: Array<SoPost>;
  @Input() user: any;
  uuid: string;
  commentBox: any;
  page_index: number = 0;
  loading_done: boolean = false;
  nextLink: any;

  // Subscription
  postIsEmpty: boolean = false;
  showLoading: boolean = true;

  soProfile$: Observable<any>;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(public apiBaseService: ApiBaseService,
              public socialService: SocialService,
              private loadingService: LoadingService,
              private route: ActivatedRoute,
              private router: Router,
              private postService: PostService,
              private store: Store<any>
  ) {
    this.soProfile$ = store.select(getSoProfile);
  }

  ngOnInit() {
    // Support get route params from parent route as well as current route. Ex: Profile post page
    let parentRouteParams = this.route.parent.paramMap;
    let reloadQueryParam = this.route.queryParamMap; // .filter(queryParamM => !!queryParamM.get('r'));
    this.showLoading = document.getElementById('post-list-loading') !== null;

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
        if (this.type != 'search') {
          this.loadPosts();
        } else {
          this.stopLoading();
        }
    }, (err: any) => this.stopLoading());
  }

  startLoading() {
    if(this.showLoading)
      this.loadingService.start('#post-list-loading');
  }

  stopLoading() {
    if(this.showLoading)
      this.loadingService.stop('#post-list-loading');
  }

  viewProfile(uuid: string) {
    this.router.navigate([{outlets: {detail: null}}], {queryParamsHandling: 'preserve' , preserveFragment: true})
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
    let mappedPost = new SoPost().from(post).excludeComments();
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
          this.items = _.map(res.data, this.mapPost);
          this.nextLink = res.page_metadata.links.next;
          if (res.data.length == 0) {
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

  save(options: any = {mode: 'add', item: null, isShare: false}) {
    if (options.mode == 'add') {
      this.postService.add(options.item)
        .toPromise().then((response: any) => {
            this.items.unshift(..._.map([response.data], this.mapPost)); // Adding new post at the beginning of posts array
            this.postEditModal.close();
            this.postIsEmpty = false;
            this.store.dispatch({type: SO_PROFILE_SETTING_PRIVACY_UPDATE_DONE, payload: response.data.privacy });
          },
          (error: any) => {
            console.log('error', error);
          }
        );
    } else if (options.mode == 'edit') {
      // Update post content only, not reload comments
      this.postEditModal.close();
      this.postService.update(options.item)
        .toPromise().then((response: any) => {
            let editedItem = _.map([response.data], this.mapPostNoComments)[0];
            let idx = _.findIndex(this.items, (i: SoPost) => {
              return i.uuid == editedItem.uuid;
            });
            if (idx >= 0) {
              editedItem.comments = this.items[idx].comments;
              this.items[idx] = editedItem;
            }

            this.store.dispatch({type: SO_PROFILE_SETTING_PRIVACY_UPDATE_DONE, payload: response.data.privacy });

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
    this.items = _.map(this.items, (item: any) => {
      if (item.id == post.id)
        return post;
      else
        return item;
    });
  }

  deletedPost(event: any, post: any) {
    _.remove(this.items, {id: post.id});
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
        .toPromise().then((res: any)=> {
        _.map(res.data, (v: any)=> {
          this.items.push(this.mapPost(v));
        });
        this.nextLink = res.page_metadata.links.next;
      });
    }
  }
}

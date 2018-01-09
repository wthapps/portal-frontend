import { Component, OnInit, ViewChild, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/finally';


import { PostEditComponent } from './post-edit.component';
import { SocialService } from '../../services/social.service';
import { SocialDataService } from '../../services/social-data.service';
import { SoPost, User } from '@wth/shared/shared/models';
import { Constants } from '@wth/shared/constant';
import { ApiBaseService, UserService } from '@wth/shared/services';
import { LoadingService } from '@shared/shared/components/loading/loading.service';
import { PhotoModalDataService } from '@shared/services/photo-modal-data.service';
import { PostService } from './shared/post.service';




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
  uuid: string;
  currentUser: User;
  commentBox: any;
  page_index: number = 0;
  loading_done: boolean = false;
  nextLink: any;
  readonly post_limit: number = Constants.soPostLimit;
  // type: string = 'user';

  // Subscription
  nextPhotoSubscription: Subscription;
  postIsEmpty: boolean = false;
  showLoading: boolean = true;

  profile$: Observable<any>;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(public apiBaseService: ApiBaseService,
              public socialService: SocialService,
              private loadingService: LoadingService,
              private route: ActivatedRoute,
              private router: Router,
              private postService: PostService,
              private photoSelectDataService: PhotoModalDataService,
              private userService: UserService,
              private socialDataService: SocialDataService
              // private comDataService: CommunitiesDataService
  ) {
  }

  ngOnInit() {
    this.currentUser = this.socialService.user.profile;
    this.profile$ = this.userService.profile$;
    // Support get route params from parent route as well as current route. Ex: Profile post page
    let parentRouteParams = this.route.parent.params;
    this.showLoading = document.getElementById('post-list-loading') !== null;

    this.route.params
      .combineLatest(parentRouteParams)
      .takeUntil(this.destroySubject)
      .map((paramsPair: any) => {
        this.startLoading();
        return _.find(paramsPair, (params: any) => _.get(params, 'id') != undefined);})
      .subscribe((params: any) => {
        this.uuid = _.get(params, 'id');  // this can be user uuid or community uuid
        // Load if items empty
        if (this.type != 'search') {
          this.loadPosts();
        } else {
          this.stopLoading();
        }
    }, (err: any) => this.stopLoading());

    // Subscribe photo select events
    this.photoSelectDataService.init('');

    let closeObs$ = this.photoSelectDataService.closeObs$.merge(this.photoSelectDataService.dismissObs$, this.destroySubject);

    this.photoSelectDataService.nextObs$
      .takeUntil(closeObs$).subscribe(
      (photos: any) => {
        this.onSelectPhotoComment(photos);
      });
  }

  startLoading() {
    if(this.showLoading)
      this.loadingService.start('#post-list-loading');
  }

  stopLoading() {
    if(this.showLoading)
      this.loadingService.stop('#post-list-loading');
  }

  viewProfile(uuid: string = this.userService.getProfileUuid()) {
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
    console.debug('inside loadPosts');
    if (!this.type) {
      console.error('type params should be assigned: ', this.type);
      this.stopLoading();
      return;
    }
    this.socialService.post.getList(this.uuid, this.type)
      // .finally(() => this.loadingService.stop('#post-list-loading'))
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
    // _.assign(options.item, {tags_json: options.item.tags, photos_json: options.item.photos});
    if (options.mode == 'add') {
      this.postService.add(options.item)
        .toPromise().then((response: any) => {
            console.log('response', response);
            this.items.unshift(..._.map([response.data], this.mapPost)); // Adding new post at the beginning of posts array
            // this.loadPosts();
            this.postEditModal.close();
            this.postIsEmpty = false;
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
            // this.loadPosts();
            let editedItem = _.map([response.data], this.mapPostNoComments)[0];
            let idx = _.findIndex(this.items, (i: SoPost) => {
              return i.uuid == editedItem.uuid;
            });
            if (idx >= 0) {
              editedItem.comments = this.items[idx].comments;
              this.items[idx] = editedItem;
            }

          },
          (error: any) => {
            console.log('error', error);
          }
        );
    }
  }

  dismiss(item: any) {
    // this.postEditModal.dismiss(item);
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
    // this.loadPosts();
    this.items = _.map(this.items, (item: any) => {
      if (item.id == post.id)
        return post;
      else
        return item;
    });
  }

  deletedPost(event: any, post: any) {
    // this.loadPosts();
    _.remove(this.items, {id: post.id});
  }


  openPhotoModal(e: any) {
    this.commentBox = e;
    // this.photoModal.open();
  }

  onSelectPhotoComment(photos: any) {
    if (this.commentBox) {
      this.commentBox.commentAction(photos);
    }
    // this.photoModal.close();
    // this.photoSelectDataService.close();
  }

  viewMorePosts() {
    if (this.nextLink) {
      this.apiBaseService.get(this.nextLink).take(1)
        .toPromise().then((res: any)=> {
        _.map(res.data, (v: any)=> {
          this.items.push(this.mapPost(v));
        });
        // let items = _.map(res.data, this.mapPost);
        // for(let i=0; i <items.length; i++) {
        //   this.items.push(items[0]);
        // }
        this.nextLink = res.page_metadata.links.next;
      });
    }
  }

  trackItems(index: any, item: any) {
    return item ? item.id : undefined;
  }

  focusSearchFriends() {
    $('#searchTopHeader').focus();
  }
}

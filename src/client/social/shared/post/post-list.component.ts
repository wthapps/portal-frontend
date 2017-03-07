import { Component, OnInit, ViewChild, Input, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PostEditComponent } from './post-edit.component';
import { PostService } from './index';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { SocialService } from '../../shared/services/social.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { SoPost } from '../../../core/shared/models/social_network/so-post.model';
import { User } from '../../../core/shared/models/user.model';
import { Constants } from '../../../core/shared/config/constants';
import { SocialDataService } from '../services/social-data.service';
import { Subscription } from 'rxjs';
import { PhotoModalDataService } from '../services/photo-modal-data.service';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-list',
  templateUrl: 'post-list.component.html'
})

export class PostListComponent implements OnInit, OnDestroy {
  @ViewChild('postEditModal') postEditModal: PostEditComponent;
  // @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;

  @Input() type: string = undefined;
  @Input() community: any = undefined;

  items: Array<SoPost>;
  uuid: string;
  currentUser: User;
  commentBox:any;
  page_index:number = 0;
  loading_done:boolean = false;
  readonly post_limit: number = Constants.soPostLimit;
  // type: string = 'user';

  // Subscription
  loadSubscription : Subscription;
  nextPhotoSubscription : Subscription;

  constructor(public apiBaseService: ApiBaseService,
              public socialService: SocialService,
              private loadingService: LoadingService,
              private route: ActivatedRoute,
              private router: Router,
              private postService: PostService,
              private photoSelectDataService : PhotoModalDataService,
              private socialDataService: SocialDataService
              // private comDataService: CommunitiesDataService
  ) {
  }

  ngOnInit() {
    this.currentUser = this.socialService.user.profile;
    this.route.params.subscribe(params => {
      this.uuid = params['id'];  // this can be user uuid or community uuid
      this.reloadPosts();
    });
    // this.photoModal.action = 'DONE';
    // this.photoModal.photoList.multipleSelect = false;

    // Subscribe photo select events
    this.photoSelectDataService.init();

    this.nextPhotoSubscription = this.photoSelectDataService.nextObs$.subscribe(
      (photos: any) => {this.onSelectPhotoComment(photos);
    });

    this.loadSubscription = this.socialDataService.itemObs$.subscribe(() => {
      this.loadPosts();
      console.log('Loading more posts');
    });
  }

  ngOnDestroy() {
    if(this.loadSubscription)
      this.loadSubscription.unsubscribe();

    this.nextPhotoSubscription.unsubscribe();
  }

  mapPost(post: any) {
    return new SoPost().from(post);
  }

  mapPostNoComments(post: any) {
    let mappedPost =  new SoPost().from(post).excludeComments();
    return mappedPost;
  }

  loadPosts() {
    this.loadingService.start('#post-list-component');
    this.postService.list({uuid: this.uuid, type: this.type, page_index: this.page_index, limit: this.post_limit})
      .subscribe(
        (res: any) => {
          this.loadingService.stop('#post-list-component');
          // if(this.items === undefined)
          //   this.items = _.map(res.data, this.mapPost);
          // else {
          //   // this.items.push(..._.map(res.data, this.mapPost));
          //   this.items = _.extend(this.items, ..._.map(res.data, this.mapPost));
          //   _.orderBy(this.items, ['created_at'], ['desc']);
          //
          // }
          this.items = _.map(res.data, this.mapPost);
          this.loading_done = res.loading_done;
          this.socialDataService.loadingDone = this.loading_done;
          if(!this.loading_done)
            this.page_index += 1;
        },
        (error: any) => {
          console.log('loading posts errors: ', error);
        }
      );
  }

  reloadPosts() {
    this.page_index = 0;
    this.loading_done = false;
    this.socialDataService.loadingDone = this.loading_done;
    this.loadPosts();
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
        .subscribe((response: any) => {
            console.log('response', response);
            this.items.unshift(..._.map([response.data], this.mapPost)); // Adding new post at the beginning of posts array
            // this.loadPosts();
            this.postEditModal.close();
          },
          (error: any) => {
            console.log('error', error);
          }
        );
    } else if (options.mode == 'edit') {
            // Update post content only, not reload comments
            this.postEditModal.close();
        this.postService.update(options.item)
          .subscribe((response: any) => {
            // this.loadPosts();
            let editedItem = _.map([response.data], this.mapPostNoComments)[0];
            let idx = _.findIndex(this.items, ( i:SoPost ) => { return  i.uuid == editedItem.uuid; });
            if(idx >= 0) {
              editedItem.comments = this.items[idx].comments;
              this.items[idx] = editedItem;
            }

    },
          (error: any) => {
            console.log('error', error);
          }
        );
    }
    // console.log('save item...............', item);
    //
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

  updatedPost(event: any) {
    this.loadPosts();
  }

  deletedPost(event: any) {
    this.loadPosts();
  }


  openPhotoModal(e:any) {
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
    this.loadPosts();
  }

}


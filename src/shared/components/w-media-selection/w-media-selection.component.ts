
import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BsModalComponent } from 'ng2-bs3-modal';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { Media } from '@shared/shared/models/media.model';

import { componentDestroyed } from 'ng2-rx-componentdestroyed';

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { WUploader } from '@shared/services/w-uploader';

@Component({
  selector: 'w-media-selection',
  templateUrl: 'w-media-selection.component.html',
  styleUrls: ['w-media-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WMediaSelectionComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;

  // @Output() onInsertEvent: EventEmitter<any> = new EventEmitter<any>();

  tabs: WTab[] = [
    {
      name: 'Upload',
      link: 'upload',
      icon: 'fa fa-cloud-upload',
      number: null,
      type: 'tab'
    },
    {
      name: 'Photos',
      link: 'photos',
      icon: 'fa fa-photo',
      number: null,
      type: 'tab'
    },
    {
      name: 'Albums',
      link: 'albums',
      icon: 'fa fa-file-photo-o',
      number: null,
      type: 'tab'
    },
    {
      name: 'Videos',
      link: 'videos',
      icon: 'fa fa-video-camera',
      number: null,
      type: 'tab'
    },
    {
      name: 'Playlists',
      link: 'playlists',
      icon: 'fa fa-file-video-o',
      number: null,
      type: 'tab'
    },
    {
      name: 'Favourites',
      link: 'favourites',
      icon: 'fa fa-star',
      number: null,
      type: 'tab'
    },
    {
      name: 'Shared with me',
      link: 'shared_with_me',
      icon: 'fw fw-shared-with-me',
      number: null,
      type: 'tab'
    }
  ];

  medias$: Observable<Media[]>;
  tabsFilter: any = [];
  mediaParent: Media;
  selectedMedias$: Observable<Media[]>;
  multipleSelection$: Observable<boolean>;
  view$: Observable<string>;

  currentTab: string; // upload, photos, albums, albums_detail, favourites, shared_with_me

  nextLink: string;
  isLoading: boolean;

  dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: null, // 1
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  dropzoneDisabled: Boolean = false;

  // search
  searchShow: Boolean = false;
  searchText: string;

  // end search

  allowCancelUpload: boolean;
  uploadButtonText: string;
  dragdropText: string;
  filter = 'all';
  private allowedFileTypes: any;
  private sub: any;

  constructor(
    private mediaSelectionService: WMediaSelectionService,
    private objectListService: WObjectListService,
    private uploader: WUploader
  ) {
    this.medias$ = this.mediaSelectionService.medias$;
    this.multipleSelection$ = this.mediaSelectionService.multipleSelection$;
    this.selectedMedias$ = this.objectListService.selectedObjects$;
    this.view$ = this.objectListService.view$;

    this.mediaSelectionService.mediaParent$
      .pipe(takeUntil(componentDestroyed(this)))
      .subscribe((res: Media) => this.mediaParent = res);


    this.objectListService.multipleSelection$
      .pipe(takeUntil(componentDestroyed(this)))
      .subscribe(res => this.dropzoneConfig.maxFiles = (!res ? 1 : null));
  }

  ngOnInit(): void {
    this.mediaSelectionService.open$
      .pipe(takeUntil(componentDestroyed(this)))
      .subscribe((res: any) => {
        if (res) {
          // this.initialState(res);
          this.open(res);
          this.getObjects(true);
        }
      });
  }

  ngOnDestroy(): void {
  }

  open(options: any = {return: false}) {
    console.log('open media select modal:::', options);
    this.currentTab = options.selectedTab; // 'upload', 'photos';
    this.tabsFilter = this.tabs.filter((t: any) => {
      if (options.hiddenTabs.includes(t.link)) {
        return false;
      }
      return true;
    });
    this.allowCancelUpload = options.allowCancelUpload;
    this.uploadButtonText = options.uploadButtonText;
    this.dragdropText = options.dragdropText;

    // set content type depend on open options
    if (options.hiddenTabs.includes('photos')) {
      this.allowedFileTypes = ['video/*'];
    } else if (options.hiddenTabs.includes('videos')) {
      this.allowedFileTypes = ['image/*'];
    } else {
      this.allowedFileTypes = options.allowedFileTypes;
    }

    if (options.filter) {
      this.filter = options.filter;
    } else {
      this.filter = 'all';
    }

    this.nextLink = this.buildNextLink(); // 'media/photos'
    this.isLoading = false;
    this.modal.open().then();
  }

  close(options: any = {return: false}) {
    this.mediaSelectionService.close();
    this.modal.close().then();
  }

  dismiss(event: any): void {
    console.log('Post Photo Select Component DISMISSED', event);
  }

  getObjects(override?: boolean) {
    if (this.nextLink && !this.isLoading) {
      this.isLoading = true;
      this.mediaSelectionService.getMedias(this.nextLink, override).toPromise().then(
        (res: ResponseMetaData) => {
          this.nextLink = res.meta.links.next;
          this.isLoading = false;
        }
      );
    }
  }

  tabAction(event: any) {
    this.mediaSelectionService.clear();
    this.currentTab = event.link;

    if (this.currentTab !== 'upload') {
      this.nextLink = this.buildNextLink();
      this.getObjects(true);

      if (this.currentTab === 'albums' || this.currentTab === 'playlists'
        || this.currentTab === 'favourites' || this.currentTab === 'shared_with_me'
        || this.currentTab === 'search') {
        this.objectListService.setObjectsDisabled(['album', 'Media::Playlist', 'Common::Sharing']);
      } else {
        this.objectListService.setObjectsDisabled([]);
      }
    }
  }

  onTabBack() {
    const all = ['album', 'Common::Sharing', 'Media::Playlist'];
    if (this.currentTab === 'albums_detail') {
      this.currentTab = 'albums';
      this.objectListService.setObjectsDisabled(all);
    } else if (this.currentTab === 'favourites_detail') {
      this.currentTab = 'favourites';
      this.objectListService.setObjectsDisabled(all);
    } else if (this.currentTab === 'shared_with_me_detail') {
      this.currentTab = 'shared_with_me';
      this.objectListService.setObjectsDisabled(all);
    } else if (this.currentTab === 'search') {
      this.currentTab = 'photos';
    } else if (this.currentTab === 'playlist_detail') {
      this.currentTab = 'playlists';
      this.objectListService.setObjectsDisabled(all);
    } else if (this.currentTab === 'search_detail') {
      this.currentTab = 'search';
      this.objectListService.setObjectsDisabled(all);
    }
    this.mediaSelectionService.clear();
    this.nextLink = this.buildNextLink();
    this.getObjects(true);
  }

  onCompleteLoadMore(event: boolean) {
    if (event) {
      this.getObjects();
    }
  }

  onInsert() {
    this.mediaSelectionService.setSelectedMedias(this.objectListService.getSelectedObjects());
    // this.onInsertEvent.emit(this.objectListService.getSelectedObjects());
    this.close();
    this.objectListService.clear();
  }

  onCompleteDoubleClick(item: Media) {
    if (item.object_type === 'album' || item.object_type === 'Media::Playlist' || item.model === 'Common::Sharing') {
      if (this.currentTab === 'albums') {
        this.currentTab = 'albums_detail';
      } else if (this.currentTab === 'favourites') {
        this.currentTab = 'favourites_detail';
      } else if (this.currentTab === 'playlists') {
        this.currentTab = 'playlist_detail';
      } else if (this.currentTab === 'shared_with_me') {
        this.currentTab = 'shared_with_me_detail';
      } else if (this.currentTab === 'search') {
        this.currentTab = 'search_detail';
      }
      this.mediaSelectionService.clear();
      this.mediaSelectionService.setMediaParent(item);

      this.nextLink = this.buildNextLink();
      this.objectListService.setObjectsDisabled([]);

      this.getObjects(true);
    } else {
      this.onInsert();
    }
  }

  onCompleteSort(event: any) {
    if (event) {
      this.nextLink = this.buildNextLink() + `&sort=${event.sortOrder}&sort_name=${event.sortBy}`;
      const mediaParent = this.mediaParent;
      this.mediaSelectionService.clear();
      this.mediaSelectionService.setMediaParent(mediaParent);
      this.getObjects();
    }
  }

  /**
   * Search
   * @param e
   */
  onSearchEnter(e: any) {
    this.searchText = e.search;
    this.tabAction({
      link: 'search'
    });
  }

  onSearchEscape(e?: any) {
    if (e) {
      this.searchShow = false;
      this.searchText = null;
      if (this.currentTab === 'search') {
        this.onTabBack();
      }
    }
  }

  /**
   * end Search
   */


  /**
   * Dropzone
   * @param args
   */
  onUploadError(args: any) {
    console.log('onUploadError:', args);
  }

  onUploadSuccess(args: any) {
    console.log('onUploadSuccess:', args);
  }

  onUploadThumbnail(args: any) {
    this.mediaSelectionService.upload(args);
    this.modal.close().then();
  }

  upload() {
    this.uploader.open('FileInput', '.w-uploader-file-input-container', {
      allowedFileTypes: this.allowedFileTypes
    });

    this.sub = this.uploader.event$.subscribe(event => {
      if (event.action === 'start') {
        this.modal.close().then();
        this.sub.unsubscribe();
      }
    });
  }

  private buildNextLink() {
    let urlAPI = '';
    console.log(this.currentTab);

    switch (this.currentTab) {
      case 'photos':
        urlAPI = `media/photos?active=1`;
        break;
      case 'albums':
        urlAPI = `media/albums?active=1`;
        break;
      case 'videos':
        urlAPI = `media/videos?active=1`;
        break;
      case 'playlists':
        urlAPI = `media/playlists?active=1`;
        break;
      case 'playlist_detail':
        urlAPI = `media/playlists/${this.mediaParent.id}/videos?active=1`;
        break;
      case 'albums_detail':
        urlAPI = `media/photos?active=1&album=${this.mediaParent.id}`;
        break;
      case 'favourites':
        if (this.filter === 'all') urlAPI = `media/favorites?active=1`;
        if (this.filter === 'photo')
        urlAPI = `media/favorites?filter[where][object_type]=Media::Photo&filter[or][object_type]=Media::Album&filter[or][sharing_type]=Media::Album&filter[or][sharing_type]=Media::Photo`;
        if (this.filter === 'video')
        urlAPI = `media/favorites?filter[where][object_type]=Media::Video&filter[or][object_type]=Media::Playlist&filter[or][sharing_type]=Media::Video&filter[or][sharing_type]=Media::Playlist`;
        break;
      case 'favourites_detail':
        switch (this.mediaParent.model) {
          case 'Media::Playlist':
            urlAPI = `media/playlists/${this.mediaParent.uuid}/videos`;
            break;
          case 'Media::Album':
            urlAPI = `media/media/${this.mediaParent.uuid}/objects?model=Media::Album`;
            break;
          case 'Common::Sharing':
            urlAPI = `media/sharings/${this.mediaParent.uuid}/objects`;
            break;
          default:
            urlAPI = `media/photos?active=1&album=${this.mediaParent.id}`;
            break;
        }
        break;
      case 'shared_with_me':
        if (this.filter === 'all') urlAPI = `media/sharings/shared_with_me?active=1`;
        if (this.filter === 'photo')
        urlAPI = `media/sharings/shared_with_me?filter[where][sharing_type]=Media::Photo&filter[or][sharing_type]=Media::Album`;
        if (this.filter === 'video')
        urlAPI = `media/sharings/shared_with_me?filter[where][sharing_type]=Media::Video&filter[or][sharing_type]=Media::Playlist`;
        break;
      case 'shared_with_me_detail':
        urlAPI = `media/sharings/${this.mediaParent.uuid}/objects`;
        break;
      case 'search':
        urlAPI = `media/search?active=1&q=${this.searchText}&filter=${this.filter}`;
        break;
      case 'search_detail':
        switch (this.mediaParent.model) {
          case 'Media::Playlist':
            urlAPI = `media/playlists/${this.mediaParent.uuid}/videos`;
            break;
          case 'Media::Album':
            urlAPI = `media/media/${this.mediaParent.uuid}/objects?model=Media::Album`;
            break;
          case 'Common::Sharing':
            urlAPI = `media/sharings/${this.mediaParent.uuid}/objects`;
            break;
          default:
            urlAPI = `media/photos?active=1&album=${this.mediaParent.id}`;
            break;
        }
        break;
      default:
        urlAPI = null;
        break;
    }
    return urlAPI;
  }

}

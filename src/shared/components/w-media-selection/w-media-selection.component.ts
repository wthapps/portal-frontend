import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { Observable } from 'rxjs/Observable';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { Media } from '@shared/shared/models/media.model';

import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import 'rxjs/add/operator/takeUntil';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';

@Component({
  selector: 'w-media-selection',
  templateUrl: 'w-media-selection.component.html',
  styleUrls: ['w-media-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WMediaSelectionComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;

  tabs: WTab[] = [
    {
      name: 'Upload',
      link: 'upload',
      icon: 'fa fa-cloud-upload',
      type: 'tab'
    },
    {
      name: 'Photos',
      link: 'photos',
      icon: 'fa fa-photo',
      type: 'tab'
    },
    {
      name: 'Albums',
      link: 'albums',
      icon: 'fa fa-file-photo-o',
      type: 'tab'
    },
    {
      name: 'Favourites',
      link: 'favourites',
      icon: 'fa fa-star',
      type: 'tab'
    },
    {
      name: 'Shared with me',
      link: 'shared_with_me',
      icon: 'fw fw-shared-with-me',
      type: 'tab'
    }
  ];

  medias$: Observable<Media[]>;
  mediaParent: Media;
  selectedMedias$: Observable<Media[]>;
  multipleSelection$: Observable<boolean>;

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

  constructor(private mediaSelectionService: WMediaSelectionService,
              private objectListService: WObjectListService) {
    this.medias$ = this.mediaSelectionService.medias$;
    this.multipleSelection$ = this.mediaSelectionService.multipleSelection$;
    this.selectedMedias$ = this.objectListService.selectedObjects$;

    this.mediaSelectionService.mediaParent$
      .takeUntil(componentDestroyed(this))
      .subscribe((res: Media) => this.mediaParent = res);


    this.objectListService.multipleSelection$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => this.dropzoneConfig.maxFiles = (!res ? 1 : null));
  }

  ngOnInit(): void {
    this.mediaSelectionService.open$
      .takeUntil(componentDestroyed(this))
      .subscribe((res: any) => {
        if (res) {
          this.initialState(res);
          this.open();
          this.getObjects();
        }
      });
  }

  ngOnDestroy(): void {
  }

  initialState(initialState: any) {
    this.mediaSelectionService.clear();
    this.currentTab = initialState.currentTab; // 'upload', 'photos';
    this.nextLink = this.buildNextLink(); // 'media/photos'
    this.isLoading = false;
  }

  open(options: any = {return: false}) {
    this.modal.open().then();
  }

  close(options: any = {return: false}) {
    this.mediaSelectionService.close();
    this.modal.close().then();
  }

  dismiss(event: any): void {
    console.log('Post Photo Select Component DISMISSED', event);
  }

  getObjects() {
    if (this.nextLink && !this.isLoading) {
      this.isLoading = true;
      this.mediaSelectionService.getMedias(this.nextLink).subscribe(
        (res: ResponseMetaData) => {
          this.nextLink = res.page_metadata.links.next;
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
      this.getObjects();

      if (this.currentTab === 'albums' || this.currentTab === 'favourites' || this.currentTab === 'shared_with_me') {
        this.objectListService.setObjectsDisabled(['album']);
      } else {
        this.objectListService.setObjectsDisabled([]);
      }
    }
  }

  onTabBack() {
    if (this.currentTab === 'albums_detail') {
      this.currentTab = 'albums';
      this.objectListService.setObjectsDisabled(['album']);
    } else if (this.currentTab === 'favourites_detail') {
      this.currentTab = 'favourites';
      this.objectListService.setObjectsDisabled(['album']);
    } else if (this.currentTab === 'shared_with_me_detail') {
      this.currentTab = 'shared_with_me';
      this.objectListService.setObjectsDisabled(['album']);
    } else if (this.currentTab === 'search') {
      this.currentTab = 'photos';
    }
    this.mediaSelectionService.clear();
    this.nextLink = this.buildNextLink();
    this.getObjects();
  }

  onCompleteLoadMore(event: boolean) {
    if (event) {
      this.getObjects();
    }
  }

  onInsert() {
    this.mediaSelectionService.setSelectedMedias(this.objectListService.getSelectedObjects());
    this.close();
    this.objectListService.clear();
  }

  onCompleteDoubleClick(item: Media) {
    if (item.object_type === 'album') {
      if (this.currentTab === 'albums') {
        this.currentTab = 'albums_detail';
      } else if (this.currentTab === 'favourites') {
        this.currentTab = 'favourites_detail';
      }
      this.mediaSelectionService.clear();
      this.mediaSelectionService.setMediaParent(item);

      this.nextLink = this.buildNextLink();
      this.objectListService.setObjectsDisabled([]);

      this.getObjects();
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
    console.log(e);
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
    console.log('onUploadThumbnail:', args);
    // console.log('onUploadThumbnail:', args[0]['dataURL']);
    this.mediaSelectionService.upload(args);
    this.modal.close().then();
    // this.close();
  }


  private buildNextLink() {
    let urlAPI = '';
    switch (this.currentTab) {
      case 'photos':
        urlAPI = `media/photos?active=1`;
        break;
      case 'albums':
        urlAPI = `media/albums?active=1`;
        break;
      case 'albums_detail':
        urlAPI = `media/photos?active=1&album=${this.mediaParent.id}`;
        break;
      case 'favourites':
        urlAPI = `media/favorites?active=1`;
        break;
      case 'favourites_detail':
        urlAPI = `media/photos?active=1&album=${this.mediaParent.id}`;
        break;
      case 'shared_with_me':
        urlAPI = `media/sharings/shared_with_me?active=1`;
        break;
      case 'shared_with_me_detail':
        urlAPI = `media/photos?active=1&album=${this.mediaParent.id}`;
        break;
      case 'search':
        urlAPI = `media/search?active=1&q=${this.searchText}`;
        break;
      default:
        urlAPI = null;
        break;
    }
    return urlAPI;
  }

}
import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BsModalComponent } from 'ng2-bs3-modal';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { Observable } from 'rxjs/Observable';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { Media } from '@shared/shared/models/media.model';

import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'w-media-selection',
  templateUrl: 'w-media-selection.component.html',
  styleUrls: ['w-media-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WMediaSelectionComponent implements OnInit, OnDestroy {

  @ViewChild('modal') modal: BsModalComponent;

  medias$: Observable<Media[]>;
  mediaParent$: Observable<Media>;
  selectedMedias$: Observable<Media[]>;
  multipleSelection$: Observable<boolean>;

  currentTab: String = 'photos'; // photos, albums, albums_detail, favourites, shared_with_me

  nextLink: String = 'media/photos';
  isLoading: boolean;

  constructor(private mediaSelectionService: WMediaSelectionService,
              private objectListService: WObjectListService) {
    this.medias$ = this.mediaSelectionService.medias$;
    this.mediaParent$ = this.mediaSelectionService.mediaParent$;
    this.multipleSelection$ = this.mediaSelectionService.multipleSelection$;

    this.selectedMedias$ = this.objectListService.selectedObjects$;
  }

  ngOnInit(): void {
    this.mediaSelectionService.open$
      .takeUntil(componentDestroyed(this))
      .subscribe((res: any) => {
        this.open();
        this.getObjects();
      });
  }

  ngOnDestroy(): void {
  }

  open(options: any = {return: false}) {
    this.modal.open().then();
  }

  dismiss(event: any): void {
    console.log('Post Photo Select Component DISMISSED', event);
  }

  tabAction(action: string) {
    this.currentTab = action;
    this.buildLink(action);
    this.mediaSelectionService.clearMediaParent();
    this.mediaSelectionService.clear();
    this.objectListService.clear();
    this.getObjects();

    if (this.currentTab === 'albums' || this.currentTab === 'favourites' || this.currentTab === 'shared_with_me') {
      this.objectListService.setObjectsDisabled(['album']);
    } else {
      this.objectListService.setObjectsDisabled([]);
    }
  }

  getObjects() {
    if (this.nextLink && !this.isLoading) {
      this.isLoading = true;
      this.mediaSelectionService.getMedias(this.nextLink).subscribe(
        (res: ResponseMetaData) => {
          this.buildLink(res.page_metadata.links.next);
          this.isLoading = false;
        }
      );
    }
  }

  onCompleteLoadMore(event: boolean) {
    if (event) {
      this.getObjects();
    }
  }

  onCompleteSort(event: any) {
    if (event) {
      console.log(event);
      this.buildLink(this.currentTab, event.sortOrder, event.sortBy);
      this.mediaSelectionService.clear();
      this.getObjects();
    }
  }

  onInsert() {
    this.mediaSelectionService.setSelectedMedias(this.objectListService.getSelectedObjects());
    this.modal.close().then();
    // this.objectListService.clear();
  }

  onTabBack() {
    if (this.currentTab === 'albums_detail') {
      this.currentTab = 'albums';
      this.objectListService.setObjectsDisabled(['album']);
    } else if (this.currentTab === 'favourites_detail') {
      this.currentTab = 'favourites';
    }
    this.buildLink(this.currentTab);
    this.mediaSelectionService.clearMediaParent();
    this.mediaSelectionService.clear();
    this.objectListService.clear();
    this.getObjects();
  }

  onCompleteDoubleClick(item: Media) {
    if (item.object_type === 'album') {
      if (this.currentTab === 'albums') {
        this.currentTab = 'albums_detail';
      } else if (this.currentTab === 'favourites') {
        this.currentTab = 'favourites_detail';
      }
      this.buildLink('photos', item.id);

      this.objectListService.setObjectsDisabled([]);

      this.mediaSelectionService.setMediaParent(item);
      this.mediaSelectionService.clear();
      this.objectListService.clear();
      this.getObjects();
    } else {
      this.onInsert();
    }
  }

  private buildLink(type: String, id?: number, sortOrder?: string, sortBy?: string) {
    let urlAPI = '';
    switch (type) {
      case 'photos':
        urlAPI = `media/photos`;
        if (id) {
          urlAPI = urlAPI + `?album=${id}`;
        }
        if (sortOrder && sortBy) {
          if (id) {
            urlAPI = urlAPI + `&sort=${sortOrder}&sort_name=${sortBy}`;
          } else {
            urlAPI = urlAPI + `?sort=${sortOrder}&sort_name=${sortBy}`;
          }
        }
        break;
      case 'albums':
        urlAPI = `media/albums`;
        if (sortOrder && sortBy) {
          urlAPI = urlAPI + `?sort=${sortOrder}&sort_name=${sortBy}`;
        }
        break;
      case 'favourites':
        urlAPI = `media/media?list_type=favorites`;
        if (sortOrder && sortBy) {
          urlAPI = urlAPI + `&sort=${sortOrder}&sort_name=${sortBy}`;
        }
        break;
      case 'shared_with_me':
        urlAPI = `media/shared-with-me`;
        if (sortOrder && sortBy) {
          urlAPI = urlAPI + `&sort=${sortOrder}&sort_name=${sortBy}`;
        }
        break;
    }

    this.nextLink = urlAPI;
  }
}

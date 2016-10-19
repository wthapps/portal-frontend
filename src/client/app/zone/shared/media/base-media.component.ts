import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import {
  MediaType,
  ApiBaseService,
  LoadingService,
  ToastsService,
  ConfirmationService
} from "../../../shared/index";


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'media',
  template: `<zone-photo *ngIf="category=='photo'"></zone-photo>
  <div *ngIf="category=='album'"> album </div>
  <div *ngIf="category=='playlist'"> playlist</div>
  
`
})

export abstract class BaseMediaComponent implements OnInit, OnChanges, OnDestroy {

  // @Input()
  category: string;
  selectedItems: Array<any> = new Array<any>();
  previewItems: Array<any> = new Array<any>();
  items: Array<any> = new Array<any>();
  currentPage: number = 1;
  perPage: number = 1;
  total: number = 1;
  isGridView: boolean;
  isListView: boolean;
  pageView: string = 'grid';
  hasSelectedItem: boolean = false;
  needToReload: boolean = false;

  errorMessage: string;

  private apiService: ApiBaseService;
  private loadingService: LoadingService;
  private toastsService: ToastsService;
  private confirmationService: ConfirmationService;


  constructor(private type: string,
              private apiService?: ApiBaseService) {
    this.category = type;
    // console.log('BaseMediaComponent', this);
  }

  ngOnInit() {
    if (this.pageView == 'grid') {
      this.isGridView = true;
      this.isListView = false;
    } else if (this.pageView == 'list') {
      this.isGridView = false;
      this.isListView = true;
    }
    this.loadItems(this.currentPage)
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changed', changes);
  }

  ngOnDestroy() {
    this.items = [];
  }

  changeView(view: any) {
    this.pageView = view;
    if (this.pageView == 'grid') {
      this.isGridView = true;
      this.isListView = false;
    } else if (this.pageView == 'list') {
      this.isGridView = false;
      this.isListView = true;
    }
  }

  addFavourite(event: any) {
    this.needToReload = false;
    if (event) {
      let body = JSON.stringify({
        ids: _.map(this.selectedItems, 'id'),
        isToggle: false
      });
      this.loadingService.start();
      this.apiService.post(`${this.buildPathByCat()}/favourite`, body)
        .subscribe((result: any) => {
            // stop loading
            this.needToReload = true;
            this.loadItems(this.currentPage);
            this.loadingService.stop();
            this.toastsService.success(result.message);
          },
          error => {
            // stop loading
            this.loadingService.stop();
            this.toastsService.danger(error);
            console.log(error);
          }
        );
    }
  }

  delete(event: any) {
    this.needToReload = false;
    if (event) {
      this.confirmationService.confirm({
        message: 'Are you sure to delete ' + this.selectedItems.length + ' item' + (this.selectedItems.length > 1 ? 's' : '') + ' ?',
        accept: () => {
          let body = JSON.stringify({ids: _.map(this.selectedItems, 'id')});
          this.loadingService.start();
          this.apiService.post(`${this.buildPathByCat()}/delete`, body)
            .map(res => res.json())
            .subscribe((result: any) => {
                // stop loading
                this.needToReload = true;
                this.loadItems(this.currentPage);
                this.loadingService.stop();

                this.toastsService.success(result.message);
              },
              error => {
                // stop loading
                this.loadingService.stop();
                this.toastsService.danger(error);
                console.log(error);
              }
            );
        }
      });
    }
  }

  public loadItems(page: number) {
    if (page <= Math.ceil(this.total / this.perPage)) {
      this.loadingService.start('#photodata-loading');
      this.currentPage = page;
      this.apiService.get(`${this.buildPathByCat()}?page=${page}`).subscribe(
        (response: any) => {
          console.log('page-', page, ':', response);
          this.perPage = response['per_page'];
          this.total = response['total'];
          if (page==1) {
            this.items = response['data'];
          }
          if (!_.isEqual(this.items, response['data'])) {
            this.items = _.concat(this.items, response['data']);
          }
          this.loadingService.stop('#photodata-loading');
        },
        error => {
          // this.errorMessage = <any>error;
          this.loadingService.stop('#photodata-loading');
        }
      );

    }
  }

  public loadItemsByUrl(url: string) {
    if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
      this.apiService.get(url).subscribe(
        (response: any) => {
          // console.log(response);
          this.perPage = response['per_page'];
          this.total = response['total'];
          this.items = response['data'];
        },
        error => {
          // this.errorMessage = <any>error;
          // this.loadingService.stop('#photodata-loading');
        }
      );
    }
  }

  private buildPathByCat(): string {
    if (this.category == MediaType.photo) {
      return 'zone/photos'
    }
    if (this.category == MediaType.album) {
      return 'zone/albums'
    }
    if (this.category == MediaType.albumDetail) {
      return 'zone/photos'
    }

  }
}

import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MediaType, ApiBaseService } from '../../../shared/index';


declare var $: any;''
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'media',
  template: `<zone-photo *ngIf="category=='photo'"></zone-photo>
  <div *ngIf="category=='album'"> album </div>
  <div *ngIf="category=='playlist'"> playlist</div>
  
`
})

export abstract class BaseMediaComponent implements OnInit, OnChanges {
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


  constructor(private type: string, private apiService: ApiBaseService){
    this.category = type;
  }

  ngOnInit(){
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
      // this.loadingService.start();
      this.apiService.post(`${this.buildPathByCat()}/favourite`, body)
        .subscribe((result: any) => {
            // stop loading
            this.needToReload = true;
            this.loadItems(this.currentPage);
            // this.loadingService.stop();
            //this.toastsService.success(result.message);
          },
          error => {
            // stop loading
            // this.loadingService.stop();
            //this.toastsService.danger(error);
            console.log(error);
          }
        );
    }
  }

  delete(event: any) {
    this.needToReload = false;
    if (event) {
      // this.dialogService.activate('Are you sure to delete ' + this.selectedItems.length + ' item' + (this.selectedItems.length > 1 ? 's' : '') + ' ?', 'Confirmation', 'Yes', 'No').then((responseOK) => {
      //   if (responseOK) {
          let body = JSON.stringify({ids: _.map(this.selectedItems, 'id')});
          // this.loadingService.start();
          this.apiService.post(`${this.buildPathByCat()}/delete`, body)
            .subscribe((result: any) => {
                // stop loading
                this.needToReload = true;
                this.loadItems(this.currentPage);
                // this.loadingService.stop();

                //this.toastsService.success(result.message);
              },
              error => {
                // stop loading
                // this.loadingService.stop();
                //this.toastsService.danger(error);
                console.log(error);
              }
            );
        // }
      // });
    }
  }

  public loadItems(page: number) {

    if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
      // this.loadingService.start('#photodata-loading');
      this.apiService.get(`${this.buildPathByCat()}?page=${page}`).subscribe(
        (response: any) => {
          this.perPage = response['per_page'];
          this.total = response['total'];
          this.items = response['data'];
          // this.items = _.concat(this.items, response['data']);
          // this.loadingService.stop('#photodata-loading');
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
  }
}

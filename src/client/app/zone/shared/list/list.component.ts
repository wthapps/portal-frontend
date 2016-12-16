import {
  Component, Input, Output,
  EventEmitter, OnChanges,
  HostListener
}                          from '@angular/core';

import {
  LoadingService,
  ApiBaseService,
  ToastsService
} from '../../../shared/index';

declare var $: any;
declare var _: any;

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-listview',
  templateUrl: 'list.component.html'
})

export class ZPictureListComponent implements OnChanges {
  @Input() items: any;
  @Input() resetSelected: boolean;
  @Input() category: string;

  @Output() preview: EventEmitter<string> = new EventEmitter<string>();
  @Output() imgsSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadMore: EventEmitter<number> = new EventEmitter<number>();


  selectedPhotos: Array<any> = [];

  keyCtrl: boolean = false;
  reset: boolean;

  sortName: any = false;
  sortDate: any = false;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) {
      this.keyCtrl = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) {
      this.keyCtrl = false;
    }
  }


  constructor(private apiService?: ApiBaseService,
              private loadingService?: LoadingService,
              private toastsService?: ToastsService) {
  }


  ngOnChanges() {
    if (this.reset != this.resetSelected) {
      this.removeSelectedItems();
    }
    this.reset = this.resetSelected;
  }

  onDbClick(e: any, id: number) {
    let parent = $(e.target).parents('.row-img');
    let el = $(e.target).parents('.photo-box-img');
    parent.find('.photo-box-img').removeClass('selected');
    el.addClass('selected');

    this.selectedPhotos = [];
    this.selectedPhotos.push(id);

    this.imgsSelected.emit(this.selectedPhotos);
    this.preview.emit('preview');

  }

  removeSelectedItems() {
    let el = $('.photo-box-img');
    if (el.hasClass('selected')) {
      el.removeClass('selected');
    }
    this.selectedPhotos = [];
  }

  onLoadMore(even: any) {
    this.loadMore.emit(even.first);
  }

  /**
   *
   * @param event
   * @param column
   */
  sort(event: any, column: any) {
    console.log(event);
    if (column == 'name') {
      this.sortName = (this.sortName == false || this.sortName == 'asc' ? 'desc' : 'asc');
      console.log(this.sortName, this.items);
      this.items = _.orderBy(this.items, [column], [this.sortName]);
      console.log('after', this.items);
      this.sortDate = false;
    } else {
      this.sortDate = (this.sortDate == false || this.sortDate == 'asc' ? 'desc' : 'asc');
      this.items = _.orderBy(this.items, [column], [this.sortDate]);
      this.sortName = false;
    }
  }

  /**
   *
   * @param e
   * @param id of Image
   */
  public onSelected(e: any, id: number) {
    let parent = $(e.target).parents('.row-img');
    let el = $(e.target).parents('.photo-box-img');

    if (!this.keyCtrl) {
      if (this.selectedPhotos.length > 1) {
        this.selectedPhotos = [];
        parent.find('.photo-box-img').removeClass('selected');
        el.addClass('selected');
        this.selectedPhotos.push(id);
      } else {
        this.selectedPhotos = [];
        if (el.hasClass('selected')) {
          el.removeClass('selected');
        } else {
          parent.find('.photo-box-img').removeClass('selected');
          el.addClass('selected');
          this.selectedPhotos.push(id); // add
        }
      }
    } else {
      el.toggleClass('selected');
      if (_.indexOf(this.selectedPhotos, id) >= 0) {
        _.pull(this.selectedPhotos, id); // remove
      } else {
        this.selectedPhotos.push(id); // add
      }
    }
    this.imgsSelected.emit(this.selectedPhotos);
  }

  addFavourite(e: any, item: any) {
    this.outEvent.emit({
      action: 'favourite',
      item: item
    });

    //this.onAddFavourite_type(e, item);

    console.log(this.onAddFavourite_type(e, item));

  }

  private onAddFavourite_type(event: any, item: any = null) {

    this.loadingService.start();

    let newFavourite = [item];

    let hasFavourite = _.find(newFavourite, {'favorite': false});

    let setFavourite = false; // if current item's favorite is true

    if (hasFavourite) { // if there is one item's favorite is false
      setFavourite = true;
    }
    let body = JSON.stringify({
      ids: _.map(newFavourite, 'id'),
      setFavourite: setFavourite
    });


    this.apiService.post(`zone/${this.category}/favourite`, body)
      .map(res => res.json())
      .subscribe((result: any) => {
          // stop loading
          _.map(newFavourite, (v: any)=> {
            let vitem = _.find(this.items, ['id', v.id]);
            vitem.favorite = setFavourite;
          });
          // this.items =

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

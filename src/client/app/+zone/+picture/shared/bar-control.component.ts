import {Component, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'page-zone-bar',
  templateUrl: 'bar-control.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZPictureBarComponent implements AfterViewInit {

  advSearch: boolean = false;
  listFilter: string = '';
  currentView: string = 'grid';
  @Output() pageView: EventEmitter<string> = new EventEmitter<string>();

  ngAfterViewInit() {
    let _this = this;
    $('body').on('click', function () {
      _this.advSearch = false;
    });

    $('body').on('click', '.advSearch', function (e) {
      e.stopPropagation();
    });
  }

  toggleShowSearch(e): void {
    e.stopPropagation();
    this.advSearch = (this.advSearch == true ? false : true);
  }

  view(view: string) {
    this.currentView = view;
    this.pageView.emit(view);
  }
}

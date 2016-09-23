import {Component, AfterViewInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'page-zone-picture',
  templateUrl: 'picture.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZPictureComponent implements AfterViewInit {

  advSearch: boolean = false;
  listFilter: string = '';

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
}

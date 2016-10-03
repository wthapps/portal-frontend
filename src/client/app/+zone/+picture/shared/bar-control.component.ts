import {Component, AfterViewInit, OnInit, Output, EventEmitter, ElementRef} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

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
  items = [
    {name: "Photos", css: 'fa fa-picture-o', link: '/zone/picture/photo'},
    {name: "Albums", css: 'fa fa-files-o', link: '/zone/picture/album'},
  ];
  title: any;


  @Output() pageView: EventEmitter<string> = new EventEmitter<string>();

  @Output() selectedFiles: EventEmitter<any> = new EventEmitter<any>();
  @Output() openWindow: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router) {
    this.router.events.subscribe((navigation: any) => {
      for (var item of this.items) {
        if (item.link == navigation.url) {
          this.title = item.name;
        }
      }
    });
  }

  ngAfterViewInit() {
    let _thisBar = this;
    $('body').on('click', function () {
      _thisBar.advSearch = false;
    });

    $('body').on('click', '.advSearch', function (e: any) {
      e.stopPropagation();
    });
  }

  toggleShowSearch(e: any): void {
    e.stopPropagation();
    this.advSearch = (this.advSearch == true ? false : true);
  }

  view(view: string) {
    this.currentView = view;
    this.pageView.emit(view);
  }

  openFileWindow(event: any) {
    this.openWindow.emit(event);
  }

  handleFileUpload(event: any) {
    this.selectedFiles.emit(event);
  }

}

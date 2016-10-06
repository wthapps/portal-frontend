import {Component, AfterViewInit, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
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

export class ZPictureBarComponent implements AfterViewInit, OnInit, OnChanges {

  advSearch: boolean = false;
  listFilter: string = '';
  currentView: string = 'grid';

  items = [
    {name: "Photos", css: 'fa fa-picture-o', link: '/zone/picture/photo'},
    {name: "Albums", css: 'fa fa-files-o', link: '/zone/picture/album'},
    {name: "Video", css: 'fa fa-files-o', link: '/zone/picture/video'},
  ];
  selectedEl: any;

  @Input() hasSelectedItem: boolean;
  @Input() hasMultiSelectedItem: boolean;
  @Input() hasFavourite: boolean = false;

  @Output() pageView: EventEmitter<string> = new EventEmitter<string>();

  @Output() selectedFiles: EventEmitter<any> = new EventEmitter<any>();
  @Output() openWindow: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPreview: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShare: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDownload: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFavourite: EventEmitter<any> = new EventEmitter<any>();
  @Output() onTag: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onViewInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() onViewChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() showModalAddToAlbumEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router) {

  }

  ngOnInit(){
    if (this.hasSelectedItem == undefined) this.hasSelectedItem = false;
    this.selectedEl = {name: "Photos", css: 'fa fa-picture-o', link: '/zone/picture/photo'};

    this.router.events.subscribe((navigation: any) => {
      for (var item of this.items) {
      if (item.link == navigation.url) {
      this.selectedEl = item;
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

  ngOnChanges(changes: SimpleChanges) {
    // console.log(" has selected item change", changes['hasSelectedItem'].currentValue);
    // if (changes['hasSelectedItem'].currentValue) {
    //   var view = changes['hasSelectedItem'].currentValue;
    //   // console.log(" has selected item change", view);
    // }
  }

  toggleShowSearch(e: any): void {
    e.stopPropagation();
    this.advSearch = (this.advSearch == true ? false : true);
  }

  openFileWindow(event: any) {
    this.openWindow.emit(event);
  }

  handleFileUpload(event: any) {
    this.selectedFiles.emit(event);
  }

  preview(event: any){
    event.preventDefault();
    this.onPreview.emit(event);
  }

  download(event: any){
    event.preventDefault();
    this.onDownload.emit(event);
  }

  delete(event: any){
    event.preventDefault();
    this.onDelete.emit(event);
  }

  share(event: any){
    event.preventDefault();
    this.onShare.emit(event);
  }

  addFavourite(event: any){
    event.preventDefault();
    this.onFavourite.emit(event);
  }

  tag(event: any){
    event.preventDefault();
    this.onTag.emit(event);
  }

  add(event: any){
    event.preventDefault();
    this.onAdd.emit(event);
  }

  viewInfo(event: any){
    event.preventDefault();
    this.onViewInfo.emit(event);
  }

  edit(event: any){
    event.preventDefault();
    this.onEdit.emit(event);
  }

  changeView(view: string, event: any){
    event.preventDefault();
    this.currentView = view;
    this.onViewChanged.emit(view);
  }

  showModalAddToAlbum() {
    this.showModalAddToAlbumEvent.emit(true);
  }
}

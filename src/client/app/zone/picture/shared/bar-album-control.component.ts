import { Component, AfterViewInit, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { AlbumService } from "../../../shared/services/picture/album.service";
import { Album } from "../../../shared/models/album.model";

declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'page-zone-bar-album',
  templateUrl: 'bar-album-control.component.html',
})

export class ZPictureBarAlbumComponent implements AfterViewInit, OnInit, OnChanges {

  @Input() album: Album;
  @Input() selectedItems: any;

  currentView: string = 'grid';
  @Output() viewChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() editAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeAction: EventEmitter<any> = new EventEmitter<any>();

  constructor(private albumService: AlbumService) {

  }

  ngOnInit() {
    // this.album = this.albumService.getAlbum();
    // console.log(this.album);
    // if (this.hasSelectedItem == undefined) this.hasSelectedItem = false;
    this.album = new Album(null);
  }

  ngAfterViewInit() {
    // let _thisBar = this;
    // $('body').on('click', function () {
    //   _thisBar.advSearch = false;
    // });
    //
    // $('body').on('click', '.advSearch', function (e: any) {
    //   e.stopPropagation();
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.album = changes['album'].currentValue;
  }

  changeView(view: string, event: any) {
    event.preventDefault();
    this.currentView = view;
    this.viewChanged.emit(view);
  }

  viewInfoAction() {
    this.viewInfo.emit(true);
  }

  deleteAlbumAction() {
    this.deleteAction.emit();
  }

  onEditAction() {
    this.editAction.emit()
  }

  onRemoveAction() {
    this.removeAction.emit()
  }
}

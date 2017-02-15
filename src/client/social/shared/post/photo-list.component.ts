import { Component, ElementRef, ViewChild, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import {ApiBaseService} from "../../../core/shared/services/apibase.service";
import {LoadingService} from "../../../core/partials/loading/loading.service";
// import { ApiBaseService, LoadingService } from '../../../shared/index';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'so-photo-list',
  templateUrl: 'photo-list.component.html'
})

export class SoPhotoListComponent implements OnInit {
  @ViewChild('filesSelection') fileSelection: ElementRef;
  @Input() showUpload: boolean = false;
  @Input() showFavourite: boolean = false;
  multipleSelect: boolean = true;

  @Output() onAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFilesChanged: EventEmitter<any> = new EventEmitter<any>();

  photos: Array<any> = new Array<any>();
  selectedItems: Array<any> = new Array<any>();
  pressingCtrl: boolean = false;


  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.keyCode == 17 && this.multipleSelect) {
      this.pressingCtrl = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 17) {
      this.pressingCtrl = false;
    }
  }

  constructor(private apiService: ApiBaseService, private loading: LoadingService) {
  }

  ngOnInit(): void {
    // this.loading.start('.photo-grid-list');
    // this.apiService.get(`zone/photos`).subscribe(
    //   (response: any) => {
    //     this.photos = response['data'];
    //     this.loading.stop('.photo-grid-list');
    //   },
    //   error => {
    //     // this.errorMessage = <any>error;
    //     this.loading.stop('.photo-grid-list');
    //   }
    // );
  }

  loadPhotos() {
    this.loading.start('.photo-grid-list');
    this.apiService.get(`zone/photos`).subscribe(
      (response: any) => {
        this.photos = response['data'];
        this.loading.stop('.photo-grid-list');
      },
      error => {
        // this.errorMessage = <any>error;
        this.loading.stop('.photo-grid-list');
      }
    );
  }

  toggleSelectedItem(e: any, item: any) {
    let parent = $(e.target).parents('.row-img');
    let el = $(e.target).parents('.photo-box-img');
    let selectedClass = 'selected';

    e.stopPropagation();  // stop events on parent element

    if (this.pressingCtrl) {
      el.toggleClass(selectedClass);
      if (_.find(this.selectedItems, _.matchesProperty('id', item['id'])) == undefined) {
        this.selectedItems.push(item); // add
        return;
      }
      _.pull(this.selectedItems, item); // remove
      return;
    }
    this.selectedItems = [];
    parent.find('.photo-box-img').removeClass(selectedClass);
    el.toggleClass(selectedClass);
    this.selectedItems.push(item);
  }

  clickParent(event: any) {
    this.clearSelection();
  }

  toggleSelectedClass(event: any): void {
    // this.selectedClass = '';

  }

  clearSelection() {
    // TODO refactor jquery
    $('div.photo-box-img').removeClass('selected');
    this.selectedItems = [];
  }

  changeFiles(files: Array<any>) {
    this.onFilesChanged.emit(files);
  }
}

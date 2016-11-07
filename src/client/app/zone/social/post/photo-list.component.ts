import { Component, ElementRef, ViewChild, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ApiBaseService, LoadingService } from '../../../shared/index';

declare var _ :any;
declare var $ :any;

@Component({
  moduleId: module.id,
  selector: 'so-photo-list',
  templateUrl: 'photo-list.component.html',
  host: {
    '(document:keydown)': 'onDocumentKeyDown($event)',
    '(document:keyup)': 'onDocumentKeyUp($event)'
  }
})

export class SoPhotoListComponent implements OnInit {
  @ViewChild('filesSelection') fileSelection: ElementRef;
  @Input('show-upload') showUpload: boolean = false;
  @Input('show-favourite') showFavourite: boolean = false;
  multipleSelect: boolean = true;

  @Output() onAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFilesChanged: EventEmitter<any> = new EventEmitter<any>();

  photos: Array<any>;
  selectedItems: Array<any>;
  pressingCtrl: boolean = false;

  constructor(private apiService: ApiBaseService, private loading: LoadingService) {
  }

  ngOnInit(): void {
    this.photos = new Array<any>();
    this.selectedItems = new Array<any>();

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

  onDocumentKeyDown(ev: KeyboardEvent) {
    if (ev.keyCode == 17 && this.multipleSelect) {
      this.pressingCtrl = true;
    }
  }

  onDocumentKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 17) {
      this.pressingCtrl = false;
    }
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

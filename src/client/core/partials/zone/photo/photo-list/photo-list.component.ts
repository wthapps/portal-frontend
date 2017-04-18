import { Component, ElementRef, ViewChild, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ApiBaseService } from '../../../../shared/services/apibase.service';
import { LoadingService } from '../../../loading/loading.service';

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
  }

  loadPhotos() {
    this.loading.start();
    console.log('photo list loadPhotos: ');
    this.apiService.get(`media/photos`).subscribe(
      (response: any) => {
        this.photos = response['data'];
        this.loading.stop();
      },
      (error: any) => {
        console.error('loadPhotos error: ', error);
        // this.loading.stop('.photo-grid-list');
      },
      () => {
        console.log('loadPhotos completed');
        this.loading.stop();
      }  // Complete the get observable
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

  addFavourite(event: any, item: any) {
    console.log('addFavourite event:', event, item);
  }

  toggleSelectedClass(event: any): void {
    // this.selectedClass = '';
    console.log('toggleSelectedClass event:', event);
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

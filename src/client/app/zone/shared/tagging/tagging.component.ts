import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit} from '@angular/core';
import {ApiBaseService} from '../../../shared/index';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-tagging',
  templateUrl: 'tagging.component.html',
  styleUrls: ['tagging.component.css']
})
export class ZoneTaggingComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() modalShow;
  @Input() selectedItems: Array<any>;

  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  tags: Array<any>;
  selectedTags: Array<any>;
  currentTags: Array<any>;
  newTags: Array<any>;
  addedTags: Array<any>;
  removedTags: Array<any>;
  hasChanged: boolean;

  constructor(private apiService: ApiBaseService) {

  }

  ngOnInit() {
    this.hasChanged = false;
    this.tags = new Array<any>();
    this.currentTags = new Array<any>();
    this.selectedTags = new Array<any>();
    this.newTags = new Array<any>();
    this.addedTags = new Array<any>();
    this.removedTags = new Array<any>();
    this.selectedTags  = new Array<any>();
  }

  ngAfterViewInit() {
    let _this = this;


    $('#taggingModal').on('hidden.bs.modal', () => {
      _this.modalHide.emit(false);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('tag model', this.modalShow);
    if (this.modalShow) {
      $('#taggingModal').modal({
        backdrop: 'static'
      });
      // $('#taggingModal').modal('show');
    }
    if (changes['modalShow'] && changes['modalShow'].currentValue) {
      this.apiService.get(`zone/tags`)
        .subscribe((result: any) => {
          this.tags = _.map(result['data'], 'name');
        },
        error => {
          console.log('error', error);
        });
    }

    if (changes['selectedItems'] && changes['selectedItems'].currentValue['length'] > 0) {
      let body = JSON.stringify({ objects: _.map(this.selectedItems, 'id'), type: 1 });
      this.apiService.post(`zone/tags/get_tags`, body)
        .map(res => res.json())
        .subscribe((result: any) => {
          this.selectedTags = result['data'];
          this.currentTags = result['data'];
        },
        error => {
          console.log('error', error);
        });
    }
  }

  onItemAdded(tag: string) {
    if (this.currentTags.indexOf(tag) == -1 && this.addedTags.indexOf(tag) == -1) {
      this.addedTags.push(tag);
    } else if (this.currentTags.indexOf(tag) != -1 && this.removedTags.indexOf(tag) != -1) {
      this.removedTags = _.pull(this.removedTags, tag);
    }
    if (this.tags.indexOf(tag) == -1 && this.newTags.indexOf(tag) == -1) {
      this.newTags.push(tag)
    }
    this.checkIfHasChanged();
  }

  onItemRemoved (tag: string) {
    if(this.currentTags.indexOf(tag) != -1 && this.removedTags.indexOf(tag) == -1) {
      this.removedTags.push(tag);
    }

    if (this.addedTags.indexOf(tag) != -1) {
      this.addedTags = _.pull(this.addedTags, tag);
    }

    if (this.newTags.indexOf(tag) != -1) {
      this.newTags = _.pull(this.newTags, tag);
    }
    this.checkIfHasChanged();
  }

  save(event: any) {
    let body = JSON.stringify({
      objects: _.map(this.selectedItems, 'id'),
      type: 1,
      newTags: this.newTags,
      addedTags: this.addedTags,
      removedTags: this.removedTags
    });

    this.apiService.put(`zone/tags/update`, body)
      .subscribe((result: any) => {
        this.hasChanged = false;
      },
      error => {
        console.log('error', error);
      });
  }

  private checkIfHasChanged() {
    this.hasChanged = (this.removedTags.length > 0 || this.addedTags.length > 0) ? true : false;
  }
}

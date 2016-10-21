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
    this.removedTags = new Array<any>();
    this.selectedTags  = new Array<any>();
  }

  ngAfterViewInit() {
    let _this = this;
    $('#taggingModal').on('hidden.bs.modal', function (e) {
      _this.modalHide.emit(false);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.modalShow) {
      $('#taggingModal').modal('show');
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
        },
        error => {
          console.log('error', error);
        });
    }
  }

  onItemAdded(event: any) {
    if (this.tags.indexOf(event) == -1) {
      // let body = JSON.stringify({name: event});
      // this.apiService.post(`zone/tags`, body)
      //   .map(result => result.json())
      //   .subscribe((result: any) => {
      //     this.newTags.push(event);
      //   },
      //   error => {
      //     console.log('error', error);
      //   })
      this.newTags.push(event);
      this.removedTags = _.omit(this.removedTags, event);
    }
    this.checkIfHasChanged();
  }

  onItemRemoved (tag: string) {
    // this.removedTags.push(tag);
    // this.newTags = _.omit(this.newTags, tag);
    // this.selectedTags = _.omit(this.selectedTags, tag);
    // this.checkIfHasChanged();
  }

  onSelected(event: any) {
    console.log('selected', event);
  }

  onInputBlurred(event: any) {
    console.log('blurred', event);
  }

  onInputFocused(event: any) {
    console.log('focused', event);
  }

  save(event: any) {
    // add tags
    // if (this.currentTags.length == 0) {
    //   let body = JSON.stringify({});
    //   this.apiService.post(`zone/tags`, body)
    //     .subscribe((result: any) => {
    //       this.hasChanged = false;
    //     },
    //     error => {
    //       console.log('error', error);
    //     });
    //   return;
    // }
    let body = JSON.stringify({
      objects: _.map(this.selectedItems, 'id'),
      type: 1,
      tags: this.selectedTags,
      newTags: this.newTags
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
    this.hasChanged = (this.removedTags.length > 0 || this.newTags.length > 0) ? true : false;
  }
}

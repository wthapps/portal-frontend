import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'zone-tagging',
  templateUrl: 'tagging.component.html'
})
export class ZoneTaggingComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() modalShow;
  @Input() selectedItems: Array<any>;

  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    let _this = this;
    $('#taggingModal').on('hidden.bs.modal', function (e) {
      _this.modalHide.emit(false);
    });
  }

  ngOnChanges() {
    if (this.modalShow) {
      $('#taggingModal').modal('show');
    }
  }
}

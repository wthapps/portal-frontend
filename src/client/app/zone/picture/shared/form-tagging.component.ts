import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-tagging',
  templateUrl: 'form-tagging.component.html'
})
export class ZPictureTaggingComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() modalShow:boolean;
  @Input() data: Array<any>;

  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    let _this = this;
    $('#taggingModal').on('hidden.bs.modal', function (e:any) {
      _this.modalHide.emit(false);
    });
  }

  ngOnChanges() {
    if (this.modalShow) {
      $('#taggingModal').modal('show');
    }
  }
}

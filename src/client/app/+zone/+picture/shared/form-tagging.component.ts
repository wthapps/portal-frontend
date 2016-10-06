import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';
import {ApiBaseService} from '../../../shared/services/apibase.service';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-formTagging',
  templateUrl: 'form-tagging.component.html'
})
export class ZPictureTaggingComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() modalShow;
  @Input() data: Array<any>;

  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private apiBaseService: ApiBaseService) {

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

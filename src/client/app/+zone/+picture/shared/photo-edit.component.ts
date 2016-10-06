import {Component, OnChanges, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-photo-edit',
  templateUrl: 'photo-edit.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZPhotoEditComponent implements OnChanges, AfterViewInit {

  @Input() showModal: boolean;
  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngAfterViewInit() {
    
  }

  ngOnChanges(): void {
    if (this.showModal) {
      $('body').addClass('fixed-hidden').css('padding-right', this.getBarwidth());
      $('#photo-box-edit').addClass('active');
    }
  }

  hideModal(): void {
    this.showModal = false;
    $('body').removeClass('fixed-hidden').css('padding-right', 0);
    $('#photo-box-edit').removeClass('active');
    this.modalHide.emit(false);
  }


  private getBarwidth(): number {
    // Create the measurement node
    let scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);

    // Get the scrollbar width
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    //console.warn(scrollbarWidth); // Mac:  15

    // Delete the DIV
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }
}

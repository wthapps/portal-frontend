import {Component, AfterViewInit, OnDestroy, Output, Input, EventEmitter, OnChanges, SimpleChange} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

declare var wheelzoom: any;
declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-photo-detail',
  templateUrl: 'photo-detail.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZPhotoDetailComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() imgSrc: string;
  @Input() showImg: boolean;
  @Input() imgAll: Array<any>;
  @Output() hideModalClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  changeLog: string[] = [];
  imgSrcData: string;
  imgAllData: Array<any>;

  imgIndex: number = 0;

  showModal: boolean = false;

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      let from = JSON.stringify(changedProp.previousValue);
      let to = JSON.stringify(changedProp.currentValue);
      log.push(`${propName} changed from ${from} to ${to}`);
    }
    this.changeLog.push(log.join(', '));
    console.log(this.changeLog);

    this.imgSrcData = this.imgSrc;
    this.imgAllData = this.imgAll;
    this.showModal = this.showImg;

    this.imgIndex = _.findIndex(this.imgAll, {'img_large': this.imgSrc});
    console.log(this.imgIndex, this.imgAll.length);

    if (this.showModal) {
      //$('body').addClass('fixed-hidden');
      $('#photo-box-detail').addClass('active');
    }

  }

  ngAfterViewInit() {
    $('body').addClass('fixed-hidden').css('padding-right', this.getBarwidth());
    wheelzoom(document.querySelectorAll('.photo-detail-img img'));
  }

  ngOnDestroy() {
    $('body').removeClass('fixed-hidden').css('padding-right', 0);
  }

  hideModal(): void {
    this.showModal = false;
    $('body').removeClass('fixed-hidden').css('padding-right', 0);
    $('#photo-box-detail').removeClass('active');
    this.hideModalClicked.emit(true);
  }

  imgPrev(): void {
    this.imgIndex = this.imgIndex - 1;
    if (this.imgIndex < 0) {
      this.imgIndex = this.imgAllData.length - 1;
    }
    this.imgSrcData = this.imgAllData[this.imgIndex].img_large;
  }

  imgNext(): void {
    this.imgIndex = this.imgIndex + 1;
    if (this.imgIndex == this.imgAllData.length) {
      this.imgIndex = 0;
    }
    this.imgSrcData = this.imgAllData[this.imgIndex].img_large;
  }

  getBarwidth(): number {
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

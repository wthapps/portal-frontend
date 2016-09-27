import {Component, AfterViewInit, OnDestroy, Output, Input, EventEmitter, OnChanges, SimpleChange} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Photo} from '../../../shared/models/photo.model';

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

export class ZAlbumDetailComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() imgId: number;
  @Input() showImg: boolean;
  @Input() imgAll: Array<Photo>;
  @Output() hideModalClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  changeLog: string[] = [];
  imgOne: Photo;
  imgAllData: Array<any>;

  imgIndex: number = 0;

  showModal: boolean = false;

  errorMessage: string = '';

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
    /*let log: string[] = [];
     for (let propName in changes) {
     let changedProp = changes[propName];
     let from = JSON.stringify(changedProp.previousValue);
     let to = JSON.stringify(changedProp.currentValue);
     log.push(`${propName} changed from ${from} to ${to}`);
     }
     this.changeLog.push(log.join(', '));*/
    //console.log(this.changeLog);

    this.imgAllData = this.imgAll;
    this.showModal = this.showImg;

    if (this.imgId) {
      this.imgIndex = _.findIndex(this.imgAll, {'id': this.imgId});
      this.getImage(this.imgIndex);
    }

    if (this.showModal) {
      $('body').addClass('fixed-hidden').css('padding-right', this.getBarwidth());
      $('#photo-box-detail').addClass('active');
    }

  }

  ngAfterViewInit() {
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
    this.getImage(this.imgIndex);
  }

  imgNext(): void {
    this.imgIndex = this.imgIndex + 1;
    if (this.imgIndex == this.imgAllData.length) {
      this.imgIndex = 0;
    }
    this.getImage(this.imgIndex);
  }

  private getImage(id: any): void {
    this.imgOne = this.imgAll[id];
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

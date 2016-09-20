import {Component, AfterViewInit, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

declare var wheelzoom: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'zone-photo-detail',
  templateUrl: 'photo-detail.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZPhotoDetailComponent implements AfterViewInit, OnDestroy {


  ngAfterViewInit() {
    $('body').addClass('fixed-hidden');
    wheelzoom(document.querySelectorAll('.photo-detail-img img'), {zoom: 0.05});
  }

  ngOnDestroy() {
    $('body').removeClass('fixed-hidden');
  }

}

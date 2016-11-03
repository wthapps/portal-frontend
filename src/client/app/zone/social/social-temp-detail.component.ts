import { Component, OnInit } from '@angular/core';


import { Constants } from '../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-temp-detail',
  templateUrl: 'social-temp-detail.component.html'
})

export class ZSocialTempDetailComponent implements OnInit {

  ngOnInit() {
    this.showPreview();
  }

  ngOnDestroy() {
    $('body').removeClass('fixed-hidden').css('padding-right', 0);
    $('#photo-box-detail').removeClass('active');
    $('#photo-box-detail').removeClass('active-info');
  }

  showPreview(): void {
    $('body').addClass('fixed-hidden').css('padding-right', Constants.windows.scrollBarWidth);
    $('#photo-box-detail').addClass('active');
    $('#photo-box-detail').addClass('active-info');
  }

  hideModal(): void {

  }
}

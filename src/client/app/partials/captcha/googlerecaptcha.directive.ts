//Ref: https://www.npmjs.com/package/angular2-recaptcha
import {Component, OnInit, Input, Output, EventEmitter, NgZone} from '@angular/core';

declare var window:any;

@Component({
  selector: 're-captcha',
  template: '<div class="g-recaptcha" [attr.data-sitekey]="site_key" data-callback="verifyCallback"></div>'
})

/*Captcha functionality component*/
export class ReCaptchaComponent implements OnInit {

  @Input()
  site_key:string = null;

  @Output()
  captchaResponse:EventEmitter<string>;

  constructor(private _zone:NgZone) {
    window['verifyCallback'] = (response:any) => this._zone.run(this.recaptchaCallback.bind(this, response));
    this.captchaResponse = new EventEmitter<string>();
  }

  recaptchaCallback(response:any) {
    this.captchaResponse.emit(response);
  }

  /*Display captcha form/image*/
  showCaptcha() {
    var doc = <HTMLDivElement>document.body;
    var script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    doc.appendChild(script);
  }

  ngOnInit() {
    this.showCaptcha();
  }
}

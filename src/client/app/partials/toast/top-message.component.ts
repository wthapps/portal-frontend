import {Component, OnInit, ChangeDetectorRef} from '@angular/core';

import {Router} from '@angular/router';

import {ToastsService} from './top-message.service';

@Component({
  moduleId: module.id,
  selector: 'wth-toast',
  templateUrl: 'top-message.component.html'
})
export class SimpleToastsComponent implements OnInit {
  type:string;
  message:string;
  close:boolean;

  private defaults = {
    type: {
      info: 'info',
      danger: 'danger',
      warning: 'warning',
      success: 'success'
    },
    message: '',
    close: true
  };

  private cancelButton:any;
  private messageElement:any;


  constructor(private _topMessageService:ToastsService, private _router:Router, private _cdr: ChangeDetectorRef) {
    _topMessageService.info = this.activateInfo.bind(this);
    _topMessageService.danger = this.activateDanger.bind(this);
    _topMessageService.warning = this.activateWarning.bind(this);
    _topMessageService.success = this.activateSuccess.bind(this);
  }

  activateInfo(message = this.defaults.message, close = this.defaults.close) {
    this.type = this.defaults.type.info;
    this.message = message;
    this._cdr.detectChanges();
    this.close = close;
    let promise = new Promise<boolean>((resolve, reject) => {
      this.show();
    });
    return promise;
  }

  activateDanger(message: string, close = this.defaults.close) {
    this.type = this.defaults.type.danger;
    this.message = message;
    this._cdr.detectChanges();
    this.close = close;
    let promise = new Promise<boolean>((resolve, reject) => {
      this.show();
    });
    return promise;
  }

  activateWarning(message = this.defaults.message, close = this.defaults.close) {
    this.type = this.defaults.type.warning;
    this.message = message;
    this._cdr.detectChanges();
    this.close = close;
    let promise = new Promise<boolean>((resolve, reject) => {
      this.show();
    });
    return promise;
  }

  activateSuccess(message = this.defaults.message, close = this.defaults.close) {
    this.type = this.defaults.type.success;
    this.message = message;
    this._cdr.detectChanges();
    this.close = close;
    let promise = new Promise<boolean>((resolve, reject) => {
      this.show();
    });
    return promise;
  }

  activate(type = this.defaults.type,
           message = this.defaults.message,
           close = this.defaults.close) {
    this.type = type;
    this.message = message;
    this._cdr.detectChanges();
    this.close = close;

    let promise = new Promise<boolean>((resolve, reject) => {
      this.show();
    });
    return promise;
  }

  ngOnInit() {
    this._router.changes.subscribe((val) => this.hideDialog());
    this.cancelButton = document.getElementById('alert-close');
    this.messageElement = document.getElementById('alert-wrap');
  }

  private show() {
    if (!this.messageElement || !this.cancelButton) {
      return;
    }

    this.cancelButton.onclick = ((e:any) => {
      e.preventDefault();
      this.hideDialog();
    });

    this.messageElement.classList.add('in');
    this.messageElement.style.display = 'block';
  }

  private hideDialog() {
    this.messageElement.style.display = 'none';
    this.messageElement.classList.remove('in');
  }
}

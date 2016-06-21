import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';

import {TopMessageService} from './top-message.service';

@Component({
  moduleId: module.id,
  selector: 'wth-alert',
  templateUrl: 'top-message.component.html'
})
export class TopMessageComponent implements OnInit {
  type:string;
  message:string;
  close:boolean;
  negativeOnClick:(e:any) => void;
  positiveOnClick:(e:any) => void;

  private defaults = {
    type: 'danger', //success, info, warning, danger
    message: '',
    close: true
  };

  private cancelButton:any;
  private messageElement:any;


  constructor(private _topMessageService:TopMessageService, private _router:Router) {
    _topMessageService.info = this.activateType.bind(this);
    _topMessageService.danger = this.activateType.bind(this);
    _topMessageService.warning = this.activateType.bind(this);
    _topMessageService.success = this.activateType.bind(this);
  }

  activateType(message = this.defaults.message,
               close = this.defaults.close,
               type = this.defaults.type) {
    this.type = type;
    this.message = message;
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

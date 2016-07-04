import {
  Component,
  OnInit,
  OnDestroy
}                       from '@angular/core';
import {
  Router
}                       from '@angular/router';
import {
  FormBuilder
}                       from '@angular/common';

import {
  UserService,
  StreamEmitter,
  DialogService
}                       from '../../shared/index';
import {
  ServicesService
}                       from './services.service';
import {
  ContentPresenter
}                       from './content-presenter.component';
import {
  ServicesViewModel
}                       from './services.viewmodel';

@Component({
  moduleId: module.id,
  templateUrl: 'services.component.html',
  directives: [
    ContentPresenter
  ]
})

export class AccountServicesListComponent 
  implements OnInit, OnDestroy {

  public context:ServicesViewModel;

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _servicesService:ServicesService,
    private _builder:FormBuilder,
    private _streamEmitter:StreamEmitter,
    private _dialogService:DialogService
  ) {}

  ngOnInit() : void {
    if (this.context == null) {
      this.context = new ServicesViewModel(
        this._servicesService, 
        this._router, 
        this._userService,
        this._builder, 
        this,
        this._streamEmitter,
        this._dialogService);
    }
    this.context.load();
  }

  ngOnDestroy() {
    if (this.context != null) {
      this.context.unload();
    }
  }

}

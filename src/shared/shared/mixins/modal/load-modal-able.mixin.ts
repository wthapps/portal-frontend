import {ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';



declare let _: any;

export class LoadModalAble {
  modalIns: any;
  modalRef: any;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(public resolver: ComponentFactoryResolver){}

  loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalRef = this.modalContainer.createComponent(modalComponentFactory);
    this.modalIns = this.modalRef.instance;
  }
}

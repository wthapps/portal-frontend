import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
} from '@angular/core';

import { Subject } from 'rxjs';

@Injectable()
export class WModalService {


  modalRef: any;

  private openSub  = new Subject<any>();
  private closeSub  = new Subject<any>();
  private submitSub  = new Subject<any>();
  open$ = this.openSub.asObservable();
  close$ = this.closeSub.asObservable();
  submit$ = this.submitSub.asObservable();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  /**
   * Add a new modal instance. This step is essential and allows to retrieve any modal at any time.
   * It stores an object that contains the given modal identifier and the modal itself directly in the `modalStack`.
   *
   * @param modalInstance The object that contains the given modal identifier and the modal itself.
   * @param force Optional parameter that forces the overriding of modal instance if it already exists.
   * @returns nothing special.
   */
  open(modalComponent: any, payload?: any): void {

    // 1. Create a modal instance from modal component
    this.modalRef = this.componentFactoryResolver
      .resolveComponentFactory(modalComponent)
      .create(this.injector);

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(this.modalRef.hostView);

    // 3. Get DOM element from component
    const domElem = (this.modalRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 4. Append DOM element to the body
    document.body.appendChild(domElem);

    // // 5. Wait some time and remove it from the component tree and from the DOM
    // setTimeout(() => {
    //   this.appRef.detachView(modalInstance.hostView);
    //   this.modalRef.destroy();
    // }, 3000);

    this.modalRef.instance.open(payload);
  }

  submit(payload?: any) {
    this.submitSub.next(payload);
  }

  close(payload?: any): void {
    // this.modalRef.instance.close(payload);

    // 5. Wait some time and remove it from the component tree and from the DOM
    this.appRef.detachView(this.modalRef.hostView);
    this.modalRef.destroy();
  }
}

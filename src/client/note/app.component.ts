import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import './operators';
import 'rxjs/add/operator/filter';

import { Config } from '../core/shared/config/env.config';
import { ZNoteService } from './shared/services/note.service';
import { ZNoteSharedModalEditComponent } from './shared/modal/note/edit.component';


/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  entryComponents: [
    ZNoteSharedModalEditComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;

  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;

  constructor(private router: Router, private resolver: ComponentFactoryResolver, private noteService: ZNoteService) {
    console.log('Environment config', Config);

    this.noteService.modalEvent$.subscribe((event: any)=> this.doEvent(event));
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => document.body.scrollTop = 0);
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  doEvent(event: any) {
    console.log(event);
    switch (event.action) {
      case 'note:open_modal_edit':
        this.loadModalComponent(ZNoteSharedModalEditComponent);
        this.modal.open();
        break;
      default:
        break;
    }
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
  }
}

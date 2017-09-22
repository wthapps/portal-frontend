import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import './operators';
import 'rxjs/add/operator/filter';

import { Config } from '../core/shared/config/env.config';
import { ZNoteService } from './shared/services/note.service';
import { ZNoteSharedModalEditComponent } from './shared/modal/note/edit.component';
import { ZNoteAddFolderModalComponent } from './shared/modals/add-folder/add-folder-modal.component';
import { CommonEventService } from '../core/shared/services/common-event/common-event.service';
import { ApiBaseService } from '../core/shared/services/apibase.service';


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
  @ViewChild('addFolder') addFolder: ZNoteAddFolderModalComponent;
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;

  constructor(private router: Router, private resolver: ComponentFactoryResolver, private commonEventService: CommonEventService, private apiBaseService: ApiBaseService) {
    console.log('Environment config', Config);
    this.commonEventService.filter((event: any) => event.channel == 'menuCommonEvent').subscribe((event: any) => {
      this.addFolder.open();
    });
    this.noteService.modalEvent$.subscribe((event: any)=> this.doEvent(event));
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
    this.apiBaseService.get('note/folders').subscribe((res: any) => {
      this.commonEventService.broadcast({channel: "noteCommonEvent", action: "updateFolders", payload: res.data})
    });
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

import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { ZNoteService } from '../shared/services/note.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
import * as folder from '../shared/actions/folder';
import * as listReducer from '../shared/reducers/features/list-mixed-entities';
import * as context from '../shared/reducers/context';
import { Observable } from 'rxjs/Observable';
import { Folder } from '../shared/reducers/folder';
import { Note } from '@shared/shared/models/note.model';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { NoteBreadcrumb } from '../shared/breadcrumb/breadcrumb';
import { UrlService } from "@shared/services";
import { noteConstants, NoteConstants } from "note/shared/config/constants";


declare var _: any;

@Component({
  selector: 'z-note-folders',
  templateUrl: 'folders.component.html'
})
export class ZNoteFoldersComponent implements OnInit, OnDestroy {
  currentPath: any;

  sub: Subscription;
  sub2: Subscription;

  breadcrumbs: NoteBreadcrumb[] = [];
  initRoute: string = '/';
  breadcrumbsInit: any = {id: null, name: null, label: 'My notes', routerLink: '/'};

  constructor(private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private urlService: UrlService,
              private commonEventService: CommonEventService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let urlData = this.urlService.parse();
      switch(urlData.paths[0]) {
        case 'shared-by-me':
          this.currentPath = noteConstants.PAGE_SHARED_BY_ME;
          this.initRoute = '/shared-by-me';
          this.breadcrumbsInit = {id: null, name: null, label: 'Shared by me', routerLink: '/shared-by-me'};
          break;
        case 'shared-with-me':
          this.currentPath = noteConstants.PAGE_SHARED_WITH_ME;
          this.initRoute = '/shared-with-me';
          this.breadcrumbsInit = {id: null, name: null, label: 'Shared with me', routerLink: '/shared-with-me'};
          break;
        default:
          this.currentPath = noteConstants.PAGE_MY_NOTE;
          this.initRoute = '';
          this.breadcrumbsInit = {id: null, name: null, label: 'My notes', routerLink: '/'};
      }
      let id = +params['id'];
      this.store.dispatch({type: note.LOAD, payload: {parent_id: id}});
      this.store.dispatch({type: folder.SET_CURRENT_FOLDER, payload: {id: id, page: this.currentPath}});
      this.store.dispatch({type: context.SET_CONTEXT, payload: {
        page: noteConstants.PAGE_INSIDE_FOLDER,
        pathTitle: '',
        permissions: {},
        noData: noteConstants.NO_DATA.MY_NOTE
      }});
      this.sub2 = this.store.select(fromRoot.getCurrentFolderPath).subscribe((res: any)=> {
        this.breadcrumbs.length = 0;
        this.breadcrumbs.push(this.breadcrumbsInit);
        _.map(res, (v: any)=> {
          this.breadcrumbs.push({id: v.id, name: v.name, object_type: v.object_type, parent_id: v.parent_id, label: v.name, routerLink: this.initRoute + '/folders/' + v.id});
        });
      });
    });
  }

  ngOnDestroy() {
    this.store.dispatch({type: folder.SET_CURRENT_FOLDER, payload: {id: null}});
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }
}

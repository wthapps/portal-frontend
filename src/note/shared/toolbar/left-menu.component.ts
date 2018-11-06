import {
  Component,
  OnDestroy, Renderer2
} from '@angular/core';
import { take } from 'rxjs/operators';
import { Constants } from '@shared/constant/config/constants';
import * as fromRoot from '../reducers/index';
import { Store } from '@ngrx/store';

import { ApiBaseService } from '@shared/services/apibase.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import * as fromFolder from '../actions/folder';

declare let $: any;
declare let _: any;

@Component({
  selector: 'z-note-shared-left-menu',
  templateUrl: 'left-menu.component.html',
  styleUrls: ['left-menu.component.scss']
})
export class ZNoteSharedLeftMenuComponent implements OnDestroy {
  noteMenu: any[] = [];
  myNoteMenu: any;
  sub: any;
  sub2: any;
  noteFoldersTree: any[] = [];
  showFolderTree: boolean;

  constructor(
    private store: Store<any>,
    private apiBaseService: ApiBaseService,
    private commonEventService: CommonEventService,
    private renderer: Renderer2
  ) {
    [this.myNoteMenu, ...this.noteMenu] = Constants.noteMenuItems;
    this.sub = this.store
      .select(fromRoot.getFoldersTree)
      .subscribe((folders: any) => {
        console.log('folder tree get updated');
        if (this.noteFoldersTree.length !== 0) {
          return;
        }
        this.commonEventService.broadcast({
          action: 'update',
          channel: 'noteLeftMenu',
          payload: folders
        });
      });
    this.sub2 = this.commonEventService
      .filter((event: any) => event.channel === 'noteLeftMenu')
      .subscribe((event: any) => {
        const { payload, action } = event;
        if (!payload || action === '') {
          return;
        }
        if (!(payload instanceof Array)) {
          event.payload = [payload];
        }
        event.payload = payload.filter((i: any) => {
          return i.object_type === 'Note::Folder';
        });
        switch (action) {
          // Update and create
          case 'update': {
            console.log('folders: ', payload);
            for (const folder of payload) {
              this.update(folder, this.noteFoldersTree);
            }
            break;
          }
          case 'destroy': {
            for (const folder of payload) {
              this.destroy(folder, this.noteFoldersTree);
            }
            this.store.dispatch({
              type: fromFolder.FOLDER_UPDATED,
              payload: this.noteFoldersTree
            });
            break;
          }
          case 'expanded': {
            // folders changes many times to reaches end state
            this.store
              .select(fromRoot.getNotesState)
              .pipe(take(3))
              .subscribe((state: any) => {
                Object.keys(state.folders).forEach((k: any) => {
                  this.update(state.folders[k], this.noteFoldersTree);
                });
              });
            // folder path changes 2 times to reaches end state
            this.store
              .select(fromRoot.getCurrentFolderPath)
              .pipe(take(2))
              .subscribe((folders: any) => {
                folders.forEach((folder: any) => {
                  folder.expanded = true;
                  this.update(folder, this.noteFoldersTree);
                });
              });
            break;
          }
          default:
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  loadMenu(event: any) {
    const htmlTarget: any = event.originalEvent.target;
    const { item } = event;
    const { expanded, id } = item;
    const iconClick = (htmlTarget.className.includes('ui-panelmenu-icon'));

    if (
      item.items && item.items.length === 0
    ) {
      if (expanded) {
        this.apiBaseService
          .get(`note/folders/${id}`)
          .subscribe((res: any) => {
            this.commonEventService.broadcast({
              action: 'update',
              channel: 'noteLeftMenu',
              payload: res.data
            });
          });
      }
    } else {
      if (!iconClick) {
        event.item.expanded = !expanded;
      }
      this.onCloseMenu();
    }
  }

  update(target: any, folders: any, options: any = {}) {
    target.label = target.name;
    target.title = target.name;
    target.icon = 'fa fa-folder-o';
    target.styleClass = `js-note-folders-tree-${target.id}`;
    if (!target.items) { target.items = []; }
    target.command = (event: any) => this.loadMenu(event);
    target.routerLink = ['/folders', target.id];
    target.routerLinkActiveOptions = { exact: true };
    const { id, parent_id, label, name, expanded, routerLink, routerLinkActiveOptions } = target;
    if (!parent_id) {
      if (_.some(folders, ['id', id])) {
        for (const folder of folders) {
          if (folder.id === id) {
            Object.assign(folder, {label, name, expanded, routerLink, routerLinkActiveOptions });
          }
        }
      } else {
        folders.unshift(target);
      }
      this.sort(folders);
      return;
    }
    for (const folder of folders) {
      if (folder.items instanceof Array && folder.items.length > 0) {
        this.update(target, folder.items);
      }
      if (parent_id === folder.id) {
        if (_.some(folder.items, ['id', id])) {
          for (const f of folder.items) {
            if (f.id === id) {
              Object.assign(f, {label, name, routerLink, routerLinkActiveOptions });
            }
          }
        } else {
          folder.items.unshift(target);
        }
      }
    }
    this.sort(folders);
  }

  sort(folders: any) {
    folders.sort(function (a, b) {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  destroy(target: any, folders: any) {
    if (!target.parent_id) {
      _.remove(folders, (item: any) => {
        return item.id === target.id;
      });
      return;
    }
    for (const folder of folders) {
      if (target.parent_id === folder.id) {
        _.remove(folder.items, (item: any) => {
          return item.id === target.id;
        });
      }
      this.destroy(target, folder.items);
    }
  }

  onCloseMenu() {
    this.renderer.removeClass(document.body, 'left-sidebar-open');
  }
}

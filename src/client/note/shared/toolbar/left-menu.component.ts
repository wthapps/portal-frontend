import { Component, OnInit, HostBinding, Input, OnDestroy } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';
import { ZNoteService } from '../services/note.service';
import * as fromFolder from '../actions/folder';
import * as fromRoot from '../reducers/index';
import { Store } from '@ngrx/store';

import * as note from '../actions/note';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Router } from '@angular/router';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import * as folder from '../actions/folder';

declare let $: any;
declare let _: any;
@Component({
  moduleId: module.id,
  selector: 'z-note-shared-left-menu',
  templateUrl: 'left-menu.component.html',
  styleUrls: ['left-menu.component.css']
})
export class ZNoteSharedLeftMenuComponent implements OnDestroy {
  noteMenu = Constants.noteMenuItems;
  sub: any;
  sub2: any;
  noteFoldersTree: any[] = [];

  constructor(private store: Store<any>, private apiBaseService: ApiBaseService, private router: Router, private commonEventService: CommonEventService) {
    this.sub = this.store.select(fromRoot.getFoldersTree).subscribe((folders: any) => {
      this.commonEventService.broadcast({action: 'update', channel: 'noteLeftMenu', payload: folders});
    });
    this.sub2 = this.commonEventService.filter((event: any) => event.channel == 'noteLeftMenu').subscribe((event: any) => {
      if(!event.payload || event.action == '') {
        return;
      }
      if(!(event.payload instanceof Array)) {
        event.payload = [event.payload];
      }
      event.payload = event.payload.filter((i: any) => {return i.object_type == 'folder'});

      switch(event.action) {
        case 'update': {
          for(let folder of event.payload) {
            this.update(folder, this.noteFoldersTree);
          }
          break;
        }
        case 'destroy': {
          for(let folder of event.payload) {
            this.destroy(folder, this.noteFoldersTree);
          }
          this.store.dispatch({type: folder.FOLDER_UPDATED, payload: this.noteFoldersTree});
          break;
        }
        default:
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  loadMenu(event: any) {
    event.originalEvent.stopPropagation();
    let htmlTarget: any = event.originalEvent.target;
    if ($(htmlTarget).hasClass('fa-caret-right') || $(htmlTarget).hasClass('fa-caret-down')) {
      if (event.item.expanded) {
        this.apiBaseService.get(`note/folders/${event.item.id}`).subscribe((res: any) => {
          this.commonEventService.broadcast({action: 'update', channel: 'noteLeftMenu', payload: res.data});
        });
      }
    } else {
      this.router.navigate(['/folders', event.item.id]);
      event.item.expanded = !event.item.expanded;
      $(htmlTarget).closest('.well-folder-tree').find('a').removeClass('active');
      $(htmlTarget).closest('a').addClass('active');
    }
  }

  onNoteClick(event: any) {
    $(event.target).closest('ul').find('.well-folder-tree a').removeClass('active');
  }

  update(target: any, folders: any) {
    target.label = target.name;
    target.icon = 'fa-folder-o';
    target.styleClass = `js-note-folders-tree-${target.id}`;
    if (!target.items) target.items = [];
    target.command = (event: any)=> this.loadMenu(event);
    if (!target.parent_id) {
      if (_.some(folders, ['id', target.id])) {
        for(let folder of folders) {
          if (folder.id == target.id) {
            folder.label = target.label;
            folder.name = target.name;
          };
        }
      } else {
        folders.unshift(target);
      }
      return;
    }
    for(let folder of folders) {
      if (folder.items instanceof Array && folder.items.length > 0) {
        this.update(target, folder.items);
      }
      if (target.parent_id == folder.id) {
        if (_.some(folder.items, ['id', target.id])) {
          for(let f of folder.items) {
            if (f.id == target.id) {
              f.label = target.label;
              f.name = target.name;
            };
          }
        } else {
          folder.items.unshift(target);
        }
      }
    }
  }

  destroy(target: any, folders: any) {
    if (!target.parent_id) {
      _.remove(folders, (item: any) => {return item.id == target.id});
      return;
    }
    for(let folder of folders) {
      if (target.parent_id == folder.id) {
        _.remove(folder.items, (item: any) => {return item.id == target.id});
      }
      this.destroy(target, folder.items);
    }
  }
}

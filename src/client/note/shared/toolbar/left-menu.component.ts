import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';
import { ZNoteService } from '../services/note.service';
import * as fromRoot from '../reducers/index';
import { Store } from '@ngrx/store';

import * as note from '../actions/note';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Router } from '@angular/router';

declare let $: any;
declare let _: any;
@Component({
  moduleId: module.id,
  selector: 'z-note-shared-left-menu',
  templateUrl: 'left-menu.component.html',
  styleUrls: ['left-menu.component.css']
})
export class ZNoteSharedLeftMenuComponent implements OnInit {
  noteMenu = Constants.noteMenuItems;
  sub: any;
  noteFoldersTree: any[] = [];

  constructor(private store: Store<any>, private apiBaseService: ApiBaseService, private router: Router) {

  }
  ngOnInit() {
    this.sub = this.store.select(fromRoot.getFoldersTree).subscribe((folders: any) => {
      for (let folder of folders) {
        if (!folder.parent_id) {
          folder.label = folder.name;
          folder.icon = 'fa-folder-o';
          folder.styleClass = `js-note-folders-tree-${folder.id}`;
          folder.items = [];
          folder.command = (eventClick: any)=> this.loadMenu(eventClick);
          this.noteFoldersTree.push(folder);
          this.noteFoldersTree = _.uniqBy(this.noteFoldersTree, 'id');
        }
      }
    });
  }

  onDestroy() {
    this.sub.unsubscribe();
  }

  loadMenu(event: any) {
    event.originalEvent.stopPropagation();
    let htmlTarget: any = event.originalEvent.target;
    if ($(htmlTarget).hasClass('fa-caret-right') || $(htmlTarget).hasClass('fa-caret-down')) {
      if (event.item.expanded) {
        this.apiBaseService.get(`note/folders/${event.item.id}`).subscribe((res: any) => {
          event.item.items.length = 0;
          for (let folder of res.data) {
            folder.label = folder.name;
            folder.icon = 'fa-folder-o';
            folder.styleClass = `js-note-folders-tree-${folder.id}`;
            folder.items = [];
            folder.command = (event: any)=> this.loadMenu(event);
            event.item.items.push(folder);
          }
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


}

import {
  Component, OnInit, Renderer2, OnDestroy
} from '@angular/core';

import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import { DriveFolderService } from 'drive/shared/services/drive-folder.service';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import { DriveService } from 'drive/shared/services/drive.service';
import { DriveStorageService } from './../../services/drive-storage.service';
import { DriveType } from 'drive/shared/config/drive-constants';


declare let $: any;
declare let _: any;

@Component({
  selector: 'z-drive-shared-left-menu',
  templateUrl: 'left-menu.component.html',
  styleUrls: ['left-menu.component.scss']
})
export class ZDriveSharedLeftMenuComponent implements OnInit, OnDestroy {
  noteMenu: any[] = [];
  myNoteMenu: any;
  settingMenu;
  noteFoldersTree: any[] = [];
  showFolderTree = false;
  destroySubject: Subject<any> = new Subject();

  constructor(
    private renderer: Renderer2,
    private driveServive: DriveService,
    private driveStorage: DriveStorageService,
    private folderService: DriveFolderService,
    private fileDriveUploadService: FileDriveUploadService,
    private commonEventService: CommonEventService,
  ) {
    this.driveStorage.currentFolder$.pipe(
      filter(f => !!f ),
      takeUntil(this.destroySubject)).subscribe(
      (folder: DriveFolder) => {
        this.commonEventService.broadcast({
          action: 'update',
          channel: 'driveLeftMenu',
          payload: [folder]
        });}
    )
    this.driveServive.data$.pipe(
      takeUntil(this.destroySubject)
    ).subscribe((data: DriveType[]) => {
        const folders = data.filter(d => d.model === DriveFolder.model_const)
        if (this.noteFoldersTree.length !== 0) {
          return;
        }
        this.commonEventService.broadcast({
          action: 'update',
          channel: 'driveLeftMenu',
          payload: folders
        });
      });
    this.commonEventService
      .filter((event: any) => event.channel === 'driveLeftMenu')
      .pipe(
        takeUntil(this.destroySubject))
      .subscribe((event: any) => {
        const {payload, action} = event;
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
            for (const folder of payload) {
              this.update(folder, this.noteFoldersTree);
            }
            break;
          }
          case 'destroy': {
            for (const folder of payload) {
              this.destroy(folder, this.noteFoldersTree);
            }
            break;
          }
          case 'expanded': {
            // folders changes many times to reaches end state
            // this.store
            //   .select(fromRoot.getNotesState)
            //   .pipe(take(3))
            //   .subscribe((state: any) => {
            //     Object.keys(state.folders).forEach((k: any) => {
            //       this.update(state.folders[k], this.noteFoldersTree);
            //     });
            //   });
            // // folder path changes 2 times to reaches end state
            // this.store
            //   .select(fromRoot.getCurrentFolderPath)
            //   .pipe(take(2))
            //   .subscribe((folders: any) => {
            //     folders.forEach((folder: any) => {
            //       folder.expanded = true;
            //       this.update(folder, this.noteFoldersTree);
            //     });
            //   });
            break;
          }
          default:
        }
      });
  }
  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  onpenFileUpload() {
    this.fileDriveUploadService.open();
  }


  onFolder() {
    this.driveServive.modalEvent({action: 'drive:folder:edit', payload: {mode: 'add'}});
  }

  loadMenu(event: any) {
    const htmlTarget: any = event.originalEvent.target;
    const {expanded, id, items} = event.item;
    const iconClick = (htmlTarget.className.includes('ui-panelmenu-icon'));

    if (
      items && items.length === 0
    ) {
      if (expanded) {
        this.folderService.get(id)
          .subscribe((res: any) => {
            this.commonEventService.broadcast({
              action: 'update',
              channel: 'driveLeftMenu',
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

  onCloseMenu() {
    this.renderer.removeClass(document.body, 'left-sidebar-open');
  }

  update(target: any, folders: any, options: any = {}) {
    target.label = target.name;
    target.title = target.name;
    target.icon = 'fa fa-folder-o';
    target.styleClass = `js-note-folders-tree-${target.id}`;
    if (!target.items) {
      target.items = [];
    }
    target.command = (event: any) => this.loadMenu(event);
    target.routerLink = ['/folders', target.id];
    target.routerLinkActiveOptions = {exact: true};
    const {id, parent_id, label, name, expanded, routerLink, routerLinkActiveOptions} = target;
    if (!parent_id) {
      if (_.some(folders, ['id', id])) {
        for (const folder of folders) {
          if (folder.id === id) {
            Object.assign(folder, {label, name, expanded, routerLink, routerLinkActiveOptions});
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
              Object.assign(f, {label, name, routerLink, routerLinkActiveOptions});
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

  private mapToMenuItem(folders: DriveFolder[]): MenuItem[] {
    return folders.map((f: DriveFolder) => ({
      id: f.id.toString(),
      label: f.name,
      icon: 'fa fa-folder-o',
      items: [],
      command: (event) => this.loadMenu(event),
      routerLink: ['/folders', f.id],
      routerLinkActiveOptions: {exact: true}

    }));
  }
}

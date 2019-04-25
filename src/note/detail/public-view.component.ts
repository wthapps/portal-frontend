import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {  Subject } from 'rxjs';
import {
  takeUntil,
} from 'rxjs/operators';

import { Constants } from '@shared/constant/config/constants';
import { UserService } from './../../shared/services/user.service';

import { Router } from '@angular/router';
import { ApiBaseService } from '@shared/services/apibase.service';
import { UrlService, WthConfirmService } from '@wth/shared/services';
import { ZNoteSharedSettingsService } from '@notes/shared/services/settings.service';

declare let _: any;

@Component({
  selector: 'z-note-public-view',
  templateUrl: 'public-view.component.html',
  styleUrls: ['public-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZNotePublicViewComponent implements OnInit, AfterViewInit, OnDestroy {
  currentTab: any = 'note';
  tooltip: any = Constants.tooltip;
  note: any;
  visibleTab: 'comment' | 'attachment' | undefined = undefined;
  profile;
  setting;
  modalEditName;
  destroySubject: Subject<any> = new Subject();

  constructor(
    private apiBaseService: ApiBaseService,
    private wthConfirmService: WthConfirmService,
    private router: Router,
    private userService: UserService,
    private noteSetting: ZNoteSharedSettingsService,
    private urlService: UrlService) {}

  ngOnInit() {
    this.profile = this.userService.getSyncProfile();
    this.noteSetting.setting$.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(setting => this.setting = setting)
    ;

  }

  ngOnDestroy(): void {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  ngAfterViewInit() {
    this.apiBaseService.get(`note/notes/show_public/${this.urlService.getId()}`).subscribe(res => {
      this.note = res.data;
      if (this.note && this.note.length == 0) {
        this.raiseError();
        return;
      }

      const modules: any = {
        modules: {
          toolbar: {
            container: '#quill-toolbar'
          }
        },
        readOnly: true,
        theme: 'snow',
        scrollingContainer: '#scrolling-container'
      };
      var quill = new Quill('#quill-editor', modules);
      document.querySelector('.ql-editor').innerHTML = res.data.content;
    }, err => {
      this.wthConfirmService.confirm({
        message:
          'You are in deleted note or invalid permission',
        header: 'Note not found',
        rejectLabel: null,
        accept: () => {
          this.router.navigate(['my-note']);
        },
        reject: () => {
          this.router.navigate(['my-note']);
        }
      });

    });
  }

  handleActionEvents(event) {
    switch (event) {
      case 'showComments': {
        this.visibleTab = (this.visibleTab === 'comment') ? undefined : 'comment';
        break;
      }
      case 'openAttactments': {
        this.visibleTab = (this.visibleTab === 'attachment') ? undefined : 'attachment';
        break;
      }
      default: {

      }
    }
  }

  raiseError() {
    this.wthConfirmService.confirm({
      message:
        'You are in deleted note or invalid permission',
      header: 'Note not found',
      rejectLabel: null,
      accept: () => {
        this.router.navigate(['my-note']);
      },
      reject: () => {
        this.router.navigate(['my-note']);
      }
    });
  }


  download(file: any) {
    this.apiBaseService
      .download('common/files/download', {
        id: file.id,
        object_type: file.object_type
      })
      .subscribe((res: any) => {
        var blob = new Blob([res], { type: file.content_type });
        saveAs(blob, `${file.name}.${file.extension}`);
      });
  }

  downloadAttachments() {
    if (this.note.attachments) {
      for (let att of this.note.attachments) {
        this.download(att);
      }
    }
  }
}

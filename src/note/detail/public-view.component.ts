import {
  Component,
  ViewChild,
  SimpleChanges,
  OnInit,
  ViewEncapsulation,
  AfterViewInit
} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import {
  takeUntil,
  switchMap,
  combineLatest,
  filter,
  mergeMap,
  map,
  debounceTime,
  tap
} from 'rxjs/operators';

import * as fromRoot from '../shared/reducers/index';
import * as context from '../shared/reducers/context';
import * as note from '../shared/actions/note';
import { Note } from '@shared/shared/models/note.model';
import { Constants } from '@shared/constant/config/constants';
import { PhotoUploadService } from '@shared/services/photo-upload.service';
import { GenericFile } from '@shared/shared/models/generic-file.model';
import { GenericFileService } from '@shared/services/generic-file.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiBaseService } from '@shared/services/apibase.service';
import { ClientDetectorService } from '@shared/services/client-detector.service';
import { PhotoService } from '@shared/services/photo.service';
import * as Delta from 'quill-delta/lib/delta';
import { CommonEventService, UrlService } from '@wth/shared/services';
import { ZNoteService } from '../shared/services/note.service';
import { noteConstants } from '@notes/shared/config/constants';
import { Counter } from '@wth/core/quill/modules/counter';
import { CustomImage } from '@wth/core/quill/modules/custom-image';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import ImageBlot from '@wth/core/quill/blots/image';
import IconBlot from '@wth/core/quill/blots/icon';
import DividerBlot from '@wth/core/quill/blots/divider';
import { Font, Size } from '@wth/core/quill/blots/font-size';
import { FileUploaderService } from '@shared/services/file/file-uploader.service';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';

const DEBOUNCE_MS = 2500;
declare let _: any;

@Component({
  selector: 'z-note-public-view',
  templateUrl: 'public-view.component.html',
  styleUrls: ['public-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZNotePublicViewComponent implements OnInit, AfterViewInit {
  currentTab: any = 'note';
  tooltip: any = Constants.tooltip;
  note: any;

  constructor(private apiBaseService: ApiBaseService, private urlService: UrlService) {}

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.apiBaseService.get(`note/notes/show_public/${this.urlService.getId()}`).subscribe(res => {
      this.note = res.data;
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
    })
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
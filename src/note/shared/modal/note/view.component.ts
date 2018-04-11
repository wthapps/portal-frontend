import {
  Component,
  ViewChild,
  ViewEncapsulation,
  Input,
  ViewChildren,
  QueryList,
  AfterViewInit
} from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Note } from '@shared/shared/models/note.model';
import { ZNoteService } from '../../services/note.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Constants } from '@shared/constant/config/constants';

declare let $: any;
declare let jsPDF: any;
declare let saveAs: any;

// declare let printJS: any;

@Component({
  selector: 'z-note-shared-modal-note-view',
  templateUrl: 'view.component.html',
  styleUrls: ['note-edit-modal.component.scss', 'quill-style.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZNoteSharedModalNoteViewComponent implements AfterViewInit {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChildren('pModal') pModals: QueryList<any>;
  @Input() note: Note;

  currentTab: any = 'note';
  hasShowComment: boolean = false;
  orderDesc: boolean = false;
  hasSortBy: boolean = false;
  tooltip: any = Constants.tooltip;

  constructor(private noteService: ZNoteService, private api: ApiBaseService) {}

  ngAfterViewInit() {
    document.querySelector('.ql-editor').innerHTML = this.note.content;
  }

  open() {
    this.modal.open();
  }

  pdfDownload() {
    this.api
      .download('note/notes/pdf_download/' + this.note.id)
      .subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        saveAs(blob, this.note.name + '.pdf');
      });
  }

  print() {
    const editor: any = document.querySelector('div.ql-editor');

    if (!document.querySelector('.printable')) {
      $('body').after(
        '<div class="printable ql-container ql-snow"><div class="ql-editor"></div><div/>'
      );
    }
    document.querySelector('.printable > .ql-editor').innerHTML =
      editor.innerHTML;
    const printable: any = document.querySelector('.printable > .ql-editor');
    printable.innerHTML = editor.innerHTML;
    window.print();
  }

  onModalClose() {
    this.modal.close();
  }

  onSort(name: any) {
    // console.log('name:', name, this.note.attachments);
    this.note.attachments = this.orderDesc
      ? _.sortBy(this.note.attachments, [name])
      : _.sortBy(this.note.attachments, [name]).reverse();
    this.orderDesc = !this.orderDesc;
    this.hasSortBy = true;
  }
}

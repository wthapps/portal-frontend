import { Component, ViewChild, ViewEncapsulation, Input, ElementRef, ViewChildren, QueryList } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Note } from '../../../../core/shared/models/note.model';
import { ZNoteService } from '../../services/note.service';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';

declare let $: any;
declare let jsPDF: any;
declare let saveAs: any;
declare let printJS: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-modal-note-view',
  templateUrl: 'view.component.html',
  styleUrls: ['note-edit-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ZNoteSharedModalNoteViewComponent {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChildren('pModal') pModals: QueryList<any>;
  @Input() data: Note;

  constructor( private noteService: ZNoteService,
              private api: ApiBaseService) {
  }

  open() {
    this.modal.open();
  }

  pdfDownload() {
    this.api.download('note/notes/pdf_download/' + this.data.id).subscribe((res: any) => {
      var blob = new Blob([res.blob()], {type: 'application/pdf'});
      saveAs(blob, this.data.title + '.pdf');
    })
  }

  print() {
    printJS({ printable: 'noteview', type: 'html', header: this.data.title});
  }
}

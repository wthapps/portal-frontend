import { Component, ViewChild, ViewEncapsulation, Input, ElementRef, ViewChildren, QueryList } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Note } from '../../../../core/shared/models/note.model';
import { ZNoteService } from '../../services/note.service';

declare let $: any;
declare let jsPDF: any;

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

  constructor( private noteService: ZNoteService) {
  }

  open() {
    this.modal.open();
  }

  getModalHtmlContent(): string {
    let html: string = '';
    html += '<div>' + (this.data.title || 'Untitled' ) + '</div>';
    html += '<div>' + (this.data.content ) + '</div>';
    html += '<div> Attachments </div>';
    this.data.attachments.forEach((a: any) => { html += `<div><a href='${a.url}'> ${a.name} </a></div>`;});

    console.debug('result: html', html);
    return html;
  }

  pdfDownload() {
    let html = this.getModalHtmlContent();
    let doc = new jsPDF();
    doc.fromHTML(html, 10, 10);
    doc.save(`${this.data.title}.pdf`);


    // this.noteService.get(this.data.id).subscribe((res: any) => {
    //   console.debug('pdf Download res: ', res);
    // })
  }
}

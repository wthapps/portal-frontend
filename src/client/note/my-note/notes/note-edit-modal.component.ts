import { Component, OnInit, ViewChild } from '@angular/core';
import { ZNoteService } from '../../shared/services/note.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  moduleId: module.id,
  selector: 'note-edit-modal',
  templateUrl: 'note-edit-modal.component.html'
})
export class ZNoteEditModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  data: any;

  constructor(private noteService: ZNoteService) {
  }

  ngOnInit() {
    this.noteService.getList().subscribe(
      (res: any)=> {
        this.data = res.data;
      }
    );
  }

  open(options?: any) {
    this.modal.open().then();
  }

  close(options?: any) {
    this.modal.close().then();
  }

}

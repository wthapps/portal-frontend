import { Component, OnInit } from '@angular/core';
import { ZNoteService } from '../shared/services/note.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-my-note',
  templateUrl: 'my-note.component.html'
})
export class ZNoteMyNoteComponent implements OnInit {
  data: Array<any> = new Array<any>();
  viewOption: string = 'list';

  constructor(private noteService: ZNoteService, private apiBaseService: ApiBaseService) {
    this.noteService.notes$.subscribe((res: any)=> {
      this.data = res.data;
    });
    this.noteService.viewOption$.subscribe((viewOption: any)=> {
      this.viewOption = viewOption;
    });
  }

  ngOnInit() {
    this.noteService.getAll().subscribe(
      res => {
        this.data = res.data;
        console.log(res);
      }
    );
  }

  onNewNote() {


    this.noteService.modalEvent({action: 'note:open_note_edit_modal'});
  }
}

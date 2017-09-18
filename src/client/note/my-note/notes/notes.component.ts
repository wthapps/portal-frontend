import { Component, OnInit } from '@angular/core';
import { ZNoteService } from '../../shared/services/note.service';

@Component({
  moduleId: module.id,
  selector: 'z-note-my-note-notes',
  templateUrl: 'notes.component.html'
})
export class ZNoteMyNoteNotesComponent implements OnInit {
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
}

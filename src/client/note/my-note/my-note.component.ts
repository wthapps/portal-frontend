import { Component, OnInit } from '@angular/core';
import { ZNoteService } from '../shared/services/note.service';
import { Note } from '../../core/shared/models/note.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-my-note',
  templateUrl: 'my-note.component.html'
})
export class ZNoteMyNoteComponent implements OnInit {
  data: Note[] = [];

  constructor(private noteService: ZNoteService) {
    this.noteService.notes$.subscribe((res: any)=> {
      this.data = res.data;
    });
  }

  ngOnInit() {
    this.noteService.getList().subscribe(
      res => {
        console.log(res);
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { ZNoteService } from '../shared/services/note.service';
import { Note } from '../../core/shared/models/note.model';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-my-note',
  templateUrl: 'my-note.component.html'
})
export class ZNoteMyNoteComponent implements OnInit {
  data: Note[] = [];
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
    this.noteService.getList().subscribe(
      res => {
        console.log(res);
      }
    );
    /*this.apiBaseService.get(`note/folder`).subscribe((res: any) => {
      console.log(res)
    });*/
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Note } from '../../../../core/shared/models/note.model';
import { Constants } from '../../../../core/shared/config/constants';
import { ZNoteService } from '../../services/note.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-item',
  templateUrl: 'item.component.html'
})
export class ZNoteSharedItemComponent implements OnInit {
  @Input() data: Note;
  tooltip: any = Constants.tooltip;

  selected: boolean = false;

  constructor(private noteService: ZNoteService,
              private router: Router) {
    this.noteService.isSelectAll$.subscribe((isSelectAll: boolean)=> {
      this.selected = isSelectAll;
    });
  }

  ngOnInit() {

  }

  onSelected() {
    this.selected = !this.selected;
    if (this.selected) {
      this.noteService.addItemSelectedObjects(this.data);
    } else {
      this.noteService.removeItemSelectedObjects(this.data);
    }
  }

  onClick() {
    this.onSelected();
    console.log('click');
  }

  onView() {
    if (this.data.type == 'folder') {
      this.router.navigate([`my-note/folders`, this.data.id]);
    } else {
      this.noteService.modalEvent({action: 'note:open_modal_view', payload: this.data});
    }

  }
}

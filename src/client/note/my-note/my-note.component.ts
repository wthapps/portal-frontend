import { Component, OnInit } from '@angular/core';
import { ZNoteService } from '../shared/services/note.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-my-note',
  templateUrl: 'my-note.component.html'
})
export class ZNoteMyNoteComponent implements OnInit {
  data: Array<any> = new Array<any>();
  viewOption: string = 'list';

  constructor(private noteService: ZNoteService, private apiBaseService: ApiBaseService, private commonEventService: CommonEventService) {
  }

  ngOnInit() {
    this.apiBaseService.get(`note/dashboards`, {parent_id: null}).subscribe((res: any) => {
      this.data = res.data;
      this.commonEventService.broadcast({channel: 'noteFolderEvent', action: 'updateFolders', payload: this.data});
    });
    this.commonEventService.filter((event: any) => event.channel == 'noteFolderEvent' && event.action == 'updateFolders').subscribe((event: any) => {
      let tmp = _.clone(event.payload);
      this.data.length = 0;

      for (let item of tmp) {
        if (!item.parent_id) {
          this.data.push(item);
        }
      }
    });
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_edit_modal'});
  }
}

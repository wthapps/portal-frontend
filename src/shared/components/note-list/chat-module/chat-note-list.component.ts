import { Component, OnInit, Input } from '@angular/core';
import { DataUtil } from '@shared/shared/utils/data/json-converter.util';
import { Store } from '@ngrx/store';
import { noteConstants } from '@notes/shared/config/constants';

@Component({
  selector: 'share-chat-note-list',
  templateUrl: './chat-note-list.component.html',
  styleUrls: ['./chat-note-list.component.css']
})
export class ChatNoteListComponent implements OnInit {
  @Input() folders: any;
  @Input() notes: any;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.store.select('notes').subscribe((state: any) => {
      this.folders = state.objects.filter(
        ob => ob.object_type == noteConstants.OBJECT_TYPE.FOLDER
      );
      this.notes = state.objects.filter(
        ob => ob.object_type == noteConstants.OBJECT_TYPE.NOTE
      );
    });
  }
}

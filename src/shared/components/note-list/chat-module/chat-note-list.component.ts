import { Component, OnInit, Input, ViewEncapsulation, HostListener } from '@angular/core';
import { DataUtil } from '@shared/shared/utils/data/json-converter.util';
import { Store } from '@ngrx/store';
import { noteConstants } from '@notes/shared/config/constants';
import * as fromChatNote from './../../../../core/store/chat/note.reducer';


@Component({
  selector: 'share-chat-note-list',
  templateUrl: './chat-note-list.component.html',
  styleUrls: ['./chat-note-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatNoteListComponent implements OnInit {
  @Input() folders: any;
  @Input() notes: any;
  @Input() viewOption: any = 'list';
  allItems: any;
  pressingCtrlKey: boolean = false;

  selectedAll: boolean = false;

  readonly VIEW_MODE = {
    GRID: 'grid',
    LIST: 'list',
    TIMELINE: 'time'
  };

  constructor(private store: Store<any>) {}

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ke: KeyboardEvent) {
    if (this.pressedCtrlKey(ke)) {
      this.pressingCtrlKey = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ke: KeyboardEvent) {
    if (this.pressedCtrlKey(ke)) {
      this.pressingCtrlKey = false;
    }
  }

  ngOnInit() {
    this.store.select('notes').subscribe((state: any) => {
      this.selectedAll = false;
      this.allItems = state.objects;
      if (state.objects.length > 0) {
        const allFolders = state.objects.every(item => {
          return item.object_type == 'Note::Folder';
        });
        if(allFolders) {
          this.selectedAll = false;
        } else {
          this.selectedAll = state.objects.every(item => {
            if(item.object_type == 'Note::Folder') return true;
            return item.selected == true;
          });
        }
      }
      this.folders = state.objects.filter(
        ob => ob.object_type === noteConstants.OBJECT_TYPE.FOLDER
      );
      this.notes = state.objects.filter(
        ob => ob.object_type === noteConstants.OBJECT_TYPE.NOTE
      );
    });
  }

  onSelectedAll() {
    this.selectedAll = !this.selectedAll;
    this.store.dispatch({ type: fromChatNote.SELECT_ALL, payload: this.selectedAll });
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true : false);
  }
}

import { Component } from '@angular/core';
import { WNoteSelectionService } from '@shared/components/w-note-selection/w-note-selection.service';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent {
  selectedDocuments: any;

  constructor(private noteSelectionService: WNoteSelectionService) {
  }

  onShowNoteSelections() {
    this.noteSelectionService.open();
  }

  onSelectCompleted(event) {
    console.log(event);
    this.selectedDocuments = event;
  }
}

import { Component, ViewChild } from '@angular/core';
import { TextBoxSearchComponent } from '@shared/partials/search-box';
import { ServiceManager } from '@shared/services/service-manager';

declare var _: any;

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'note-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class ZNoteSharedHeaderComponent {
  constants: any;
  suggestions: any;
  show: boolean = false;
  searchAdvanced: boolean = false;
  search: string;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  constructor(public serviceManager: ServiceManager) {
  }

  clickedInside($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers
  }

  onEscape(e?: any) {
    console.log('inside onEscape', e);
    this.show = false;
  }

  onEnter(search: any) {
    this.show = false;
    this.search = search;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: this.search}});
  }

  onKey(search: any) {
    if (!search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = search;
    this.serviceManager.getApi().get('note/search', {q: this.search}).subscribe((res: any) => {
      this.suggestions = res.data;
    });
  }

  setText(data: any) {
    this.show = false;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: this.textbox.search}});
  }

  onSearchAdvanced(e: any) {
    console.log(e);
    this.searchAdvanced = e.searchAdvanced;
  }
}

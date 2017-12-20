import { Component, ViewChild } from '@angular/core';
import { TextBoxSearchComponent } from '@shared/shared/components/header/search/components/textbox-search.component';
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
  showAdvanced: boolean = false;
  search: string;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  constructor(public serviceManager: ServiceManager) {
  }

  onEnter(e: any) {
    this.show = false;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: e.search}});
  }

  onKey(e: any) {
    if (!e.search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = e.search;
    this.serviceManager.getApi().get('note/search', {q: e.search}).subscribe((res: any) => {
      this.suggestions = res.data;
    });
  }

  setText(data: any) {
    this.show = false;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: this.textbox.search}});
  }
}

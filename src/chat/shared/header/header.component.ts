import { Component, ViewChild } from '@angular/core';
import { TextBoxSearchComponent } from '@wth/shared/partials/search-box/textbox-search.component';
import { ServiceManager } from '@wth/shared/services';

declare var _: any;

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'chat-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class ZChatSharedHeaderComponent {
  constants: any;
  suggestions: any;
  show: boolean = false;
  search: string;
  searchAdvanced: boolean = false;

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

  onEnter(e: any) {
    this.show = false;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: this.search}});
  }

  onKey(e: any) {
    if (!e.search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = e.search;
    this.serviceManager.getApi().get('zone/chat/search', {q: e.search}).subscribe((res: any) => {
      this.suggestions = res.data;
    });
  }

  setText(data: any) {
    this.show = false;
    if (data.group_json.group_type == 'couple') {
      this.textbox.search = data.display.name;
    }
    if (data.group_json.group_type == 'multiple') {
      if (data.group_json.name) {
        this.textbox.search = data.group_json.name;
      } else {
        this.textbox.search = data.group_json.users_name;
      }
    }
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: this.textbox.search}});
  }

  onSearchAdvanced(e: any) {
    console.log(e);
    this.searchAdvanced = e.searchAdvanced;
  }
}

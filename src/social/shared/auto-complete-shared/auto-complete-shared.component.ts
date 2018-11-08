import { Component, EventEmitter, Output } from '@angular/core';
import { ApiBaseService } from '@shared/services';

@Component({
  selector: 'social-shared-auto-complete',
  templateUrl: 'auto-complete-shared.component.html',
  styleUrls: ['auto-complete-shared.component.scss']
})
export class ZSocialSharedAutoCompleteSharedComponent {
  selectedItems: any[];
  filteredDataMultiple: any[];
  @Output() completeMethod: EventEmitter<any> = new EventEmitter<any>();

  constructor(private apiBaseService: ApiBaseService) {
  }

  filterDataMultiple(event) {
    const query = event.query;
    this.apiBaseService.get(`/zone/social_network/users_search/get_friend_list?search_name=${query}`)
      .subscribe(res => {
        this.filteredDataMultiple = res.data;
      });
  }

  onSelect(event: any) {
    console.log(event);
  }
}

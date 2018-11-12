import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ApiBaseService } from '@shared/services';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  selector: 'social-shared-privacy',
  templateUrl: 'privacy.component.html',
  styleUrls: ['privacy.component.scss']
})
export class ZSocialSharedPrivacyComponent {
  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedItems: any[];
  @ViewChild('myModal') modal: BsModalComponent;
  type: string;
  filteredDataMultiple: any[];

  constructor(private apiBaseService: ApiBaseService) {
  }

  filterDataMultiple(event) {
    const query = event.query;
    this.apiBaseService.get(`/zone/social_network/users_search/get_friend_list?search_name=${query}`)
      .subscribe(res => {
        this.filteredDataMultiple = res.data;
      });
  }

  open(type: string) {
    this.type = type;
    this.modal.open();
  }

  onSave() {
    this.onSelected.emit({ type: this.type, items: this.selectedItems });
    this.modal.close();
  }
}

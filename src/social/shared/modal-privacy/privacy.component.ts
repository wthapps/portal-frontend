import { CustomField } from './../../../contact/contact/custom-field.model';
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
  placeholder = '';
  filteredDataMultiple: any[];

  readonly PRIVACY_TYPE = { custom_friend: 'custom_friend',
  custom_community: 'custom_community'};
  readonly PLACEHOLDER = { custom_friend: 'Search for friends',
  custom_community: 'Search for communities'};

  constructor(private apiBaseService: ApiBaseService) {
  }

  filterDataMultiple(event) {
    const query = event.query;
    switch (this.type) {
      case this.PRIVACY_TYPE.custom_friend: {
        this.apiBaseService.get(`/zone/social_network/users_search/get_friend_list?search_name=${query}`)
        .subscribe(res => {
          this.filteredDataMultiple = res.data;
        });
      }
      break;
      case this.PRIVACY_TYPE.custom_community: {
        this.apiBaseService.get(`zone/social_network/users_search/get_community_list?search_name=${query}`)
        .subscribe(res => {
          this.filteredDataMultiple = res.data;
      });
      }
      break;
    }
  }

  open(type: string, selectedItems?: any[]) {
    this.type = type;
    if (selectedItems) {
      this.selectedItems = selectedItems;
    }
    this.placeholder = this.PLACEHOLDER[type];
    this.modal.open();
  }

  onSave() {
    this.selectedItems = _.uniqBy(this.selectedItems, 'uuid');
    this.onSelected.emit({ type: this.type, items: this.selectedItems });
    this.modal.close();
  }
}

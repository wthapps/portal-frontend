import { WTHNavigateService } from './../../services/wth-navigate.service';
import { Component, Input, Output, EventEmitter, ViewChild, ContentChild, ChangeDetectionStrategy } from '@angular/core';

import { PUBLIC, BUSINESS, NONE } from '../../../contact/shared/card/card.constant';
import { Constants } from '../../constant';
import { CountryService } from '../../shared/components/countries/countries.service';

@Component({
  selector: 'w-card-detail-modal',
  templateUrl: 'card-detail-modal.component.html',
  styleUrls: ['card-detail-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDetailModalComponent {
  @ViewChild('modal') modal: any;
  @Input() card: any;
  @ContentChild('cardActions') cardActions;

  @Output() edit = new EventEmitter<any>();
  @Output() share = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() export = new EventEmitter<any>();
  @Output() closed = new EventEmitter<any>();

  readonly PUBLIC_PROFILE = 'Public Profile';
  readonly PUBLIC = PUBLIC;
  readonly BUSINESS = BUSINESS;
  readonly NONE = NONE;
  readonly SEX = Constants.sex;
  readonly EXPORT_TYPE = { csv: 'csv', vcard: 'vcard' };

  constructor(
    public countryService: CountryService,
    private navigateService: WTHNavigateService
    ) {}

  open(options: any): void {
    this.modal.open();
  }

  close(): void {
    this.closed.emit(true);
    this.modal.close();
  }

  goToChat(card) {
    this.navigateService.navigateOrRedirect('conversations', 'chat', {user_id: card.id});
  }

  onEdit(editImage: boolean = false) {
    this.edit.emit({card: this.card, editImage: editImage});
  }

  onShare() {
    this.share.emit({card: this.card});
  }

  onDelete() {
    this.delete.emit(this.card);
  }

  onExport(type = 'csv') {
    this.export.emit({card: this.card, type});
  }
}

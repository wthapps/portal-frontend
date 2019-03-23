import { Component, ViewEncapsulation, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { PUBLIC, BUSINESS, NONE } from '../card.constant';
import { Constants } from '@shared/constant';
import { CountryService } from '@shared/shared/components/countries/countries.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'w-card-detail-modal',
  templateUrl: 'card-detail-modal.component.html',
  styleUrls: ['card-detail-modal.component.scss'],
})
export class CardDetailModalComponent {
  @ViewChild('modal') modal: any;
  @Input() card: any;
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

  constructor(public countryService: CountryService) {}

  open(options: any): void {
    this.modal.open();
  }

  close(): void {
    this.closed.emit(true);
    this.modal.close();
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

  // getCountry(code: string): Observable<any> {
  //   return this.countryService.getCountry(code);
  // }
}

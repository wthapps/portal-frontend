import { Injectable } from '@angular/core';

import { HConfirmation } from './comfirmation';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@Injectable()
export class HConfirmationService {
  constructor(private confirmationService: ConfirmationService) {}

  confirm(confirmation: HConfirmation) {
    this.confirmationService.confirm(confirmation);
    return this;
  }

  onAccept(): void {
    this.confirmationService.onAccept();
  }
}

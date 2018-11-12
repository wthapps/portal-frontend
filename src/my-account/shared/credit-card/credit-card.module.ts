import { NgModule } from '@angular/core';

import { CCNumberFormatDirective } from './directives/number-format.directive';
import { CCExpiryDateFormatDirective } from './directives/expiry-date-format.directive';
import { CCExpiryMonthFormatDirective } from './directives/expiry-month-format.directive';
import { CCExpiryYearFormatDirective } from './directives/expiry-year-format.directive';

import { CCCvcFormatDirective } from './directives/cvc-format.directive';

const CC_DIRECTIVES = [
  CCNumberFormatDirective,
  CCExpiryDateFormatDirective,
  CCExpiryMonthFormatDirective,
  CCExpiryYearFormatDirective,
  CCCvcFormatDirective
];

@NgModule({
  declarations: [CC_DIRECTIVES],
  exports: [CC_DIRECTIVES]
})
export class CreditCardModule {
}

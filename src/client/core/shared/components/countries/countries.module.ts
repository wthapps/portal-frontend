import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryService } from './countries.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [CountryService]
})

export class CountryModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountriesComponent } from './countries.component';
import { CountryService } from './countries.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CountriesComponent],
  exports: [CountriesComponent],
  providers: [CountryService]
})

export class CountryModule {
}

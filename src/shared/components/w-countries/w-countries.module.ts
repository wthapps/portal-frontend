import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WCountriesService } from '@shared/components/w-countries/w-countries.service';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { WCountriesComponent } from './w-countries.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule
  ],
  declarations: [
    WCountriesComponent
  ],
  exports: [
    WCountriesComponent
  ],
  providers: [WCountriesService]
})
export class WCountriesModule {
}

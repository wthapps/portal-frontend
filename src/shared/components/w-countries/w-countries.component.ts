import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CountryModel, WCountriesService } from '@shared/components/w-countries/w-countries.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'w-countries',
  templateUrl: 'w-countries.component.html',
  styleUrls: ['w-countries.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WCountriesComponent implements OnInit, OnChanges {
  @Input() country: string;
  @Output() completeChange: EventEmitter<string> = new EventEmitter<string>();

  selectedCountry: string;
  countriesCode$: Observable<CountryModel[]>;

  constructor(private countriesService: WCountriesService) {
    this.countriesCode$ = this.countriesService.countriesCode$;
  }

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.selectedCountry = this.country;
    }
  }

  onComplete() {
    this.completeChange.emit(this.selectedCountry);
  }
}

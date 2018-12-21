import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { CountryModel, WCountriesService } from '@shared/components/w-countries/w-countries.service';
import { OverlayPanel } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'w-countries',
  templateUrl: 'w-countries.component.html',
  styleUrls: ['w-countries.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WCountriesComponent implements OnInit, OnChanges {
  @ViewChild('overlayPanel') overlayPanel: OverlayPanel;
  //  Aland Islands (+358)
  @Input() country: string;
  // ai, vn
  @Input() countryCode: string;
  @Output() completeChange: EventEmitter<string> = new EventEmitter<string>();

  selectedCountry: string;
  selectedCountryObject: any;
  countriesCode$: Observable<CountryModel[]>;
  countriesCode: any;

  constructor(private countriesService: WCountriesService) {
    this.countriesCode$ = this.countriesService.countriesCode$;
  }

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe();
    this.countriesCode$.subscribe(res => {
      if(res) {
        this.countriesCode = res;
      }
      if (this.countryCode && res) {
        if (res.find(r => r.code == this.countryCode)) {
          this.selectedCountry = res.find(r => r.code == this.countryCode).value;
          this.selectedCountryObject = res.find(r => r.code == this.countryCode);
        } else {
          this.selectedCountry = res[0].value;
          this.selectedCountryObject = res[0];
        }
      }
      if (this.country && res) {
        this.selectedCountryObject = res.find((r: any) => r.value == this.country);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.country) {
      this.selectedCountry = this.country;
    }
  }

  onComplete() {
    this.selectedCountryObject = this.countriesCode.find((r: any) => r.value == this.selectedCountry);
    this.completeChange.emit(this.selectedCountryObject);
  }
}

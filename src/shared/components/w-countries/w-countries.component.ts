import { Component, EventEmitter, Input, OnChanges, OnInit, Output,
  SimpleChanges, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { OverlayPanel } from 'primeng/primeng';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';


import { CountryService } from '@shared/shared/components/countries/countries.service';

export class CountryModel {
  value: string;
  label: string;
  code: string;
  name: string;
  dial_code: string;
}
@Component({
  selector: 'w-countries',
  templateUrl: 'w-countries.component.html',
  styleUrls: ['w-countries.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WCountriesComponent implements OnInit, OnChanges, OnDestroy {
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
  private destroySubject: Subject<any> = new Subject();

  constructor(private countriesService: CountryService) {
    this.countriesCode$ = this.countriesService.countriesCode$;
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  ngOnInit(): void {
    this.countriesService.countriesCode$.pipe(
      map((res: Array<any>) => {
        return res.map((v: any) => ({
          value: v.name + ' (' + v.dial_code + ')',
          label: v.name + ' (' + v.dial_code + ')',
          name: v.name,
          dial_code: v.dial_code,
          code: v.code.toLowerCase()
        }));
      }),
      takeUntil(this.destroySubject)
    ).subscribe((res: Array<any>) => {
      console.log('res: ', res);

      if (res) {
        this.countriesCode = [...res];
      }
      if (this.countryCode && res) {
        if (res.find(r => r.code === this.countryCode)) {
          this.selectedCountry = res.find(r => r.code === this.countryCode).value;
          this.selectedCountryObject = res.find(r => r.code === this.countryCode);
        } else {
          this.selectedCountry = res[0].value;
          this.selectedCountryObject = res[0];
        }
      }
      if (this.country && res) {
        this.selectedCountryObject = res.find((r: any) => r.value === this.country);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.country) {
      this.selectedCountry = this.country;
    }
  }

  onComplete() {
    this.selectedCountryObject = this.countriesCode.find((r: any) => r.value === this.selectedCountry);
    this.completeChange.emit(this.selectedCountryObject);
  }
}

import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { TextBoxSearchComponent } from '@wth/shared/partials/search-box/textbox-search.component';
import { ServiceManager } from '@wth/shared/services';
import { ActivatedRoute, Params } from '@angular/router';


declare var _: any;

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'media-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class ZMediaSharedHeaderComponent implements OnInit {
  constants: any;
  suggestions: any = [];
  show: boolean = false;
  search: string;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  searchDataDate: any = [
    {key: 'anytime', value: 'Anytime'},
    {key: 'today', value: 'Today'},
    {key: 'yesterday', value: 'Yesterday'},
    {key: 'last_week', value: 'Last week'},
    {key: 'last_month', value: 'Last month'},
    {key: 'custom', value: 'Custom...'}
  ];
  searchDataOwner: any = [
    {key: 'anyone', value: 'Anyone'},
    {key: 'me', value: 'Me'},
    {key: 'not_m', value: 'Not me'},
    {key: 'specific_person', value: 'Specific person'}
  ];

  form: FormGroup;
  searchDate: AbstractControl;
  searchFrom: AbstractControl;
  searchTo: AbstractControl;
  searchFileTypes: AbstractControl;
  searchExcludeWord: AbstractControl;
  searchLabels: AbstractControl;
  searchOwner: AbstractControl;
  searchOwnerName: AbstractControl;
  searchAdvanced: boolean = false;

  @HostListener('document:click', ['$event']) clickedOutside($event: any) {
    // here you can hide your menu
    this.searchAdvanced = false;
  }

  constructor(public serviceManager: ServiceManager, private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.search = params['q'];
      this.textbox.search = this.search;
    });
  }

  clickedInside($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers
  }

  onEnter(search: any) {
    this.show = false;
    this.search = search;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: this.search}});
  }

  onEscape(e?: any) {
    console.log('inside onEscape', e);
    this.show = false;
  }

  onKey(search: any) {
    if (!search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = search;
    this.serviceManager.getApi().post(`media/search/suggestions`, {
      q: `name:${this.search}`
    }).subscribe(
      (res: any) => {
        this.suggestions.length = 0;
        this.suggestions = _.map(res.data, 'name');
      }
    );
  }

  onNavigation(data: any) {
    this.show = false;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: data}});
  }

  onSearchAdvanced(e: any) {
    this.searchAdvanced = e.searchAdvanced;
  }

  createForm() {
    this.form = this.serviceManager.getFormBuilder().group({
      'searchDate': [this.searchDataDate[0].key],
      'searchFrom': [''],
      'searchTo': [''],
      'searchFileTypes': [''],
      'searchExcludeWord': [''],
      'searchLabels': [''],
      'searchOwner': [this.searchDataOwner[0].key],
      'searchOwnerName': [''],
    });

    this.searchDate = this.form.controls['searchDate'];
    this.searchFrom = this.form.controls['searchFrom'];
    this.searchTo = this.form.controls['searchTo'];
    this.searchFileTypes = this.form.controls['searchFileTypes'];
    this.searchExcludeWord = this.form.controls['searchExcludeWord'];
    this.searchLabels = this.form.controls['searchLabels'];
    this.searchOwner = this.form.controls['searchOwner'];
    this.searchOwnerName = this.form.controls['searchOwnerName'];
  }

  onSubmit(values: any) {
    console.log(values);
  }
}

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Subject } from 'rxjs/Subject';

import { noteConstants } from './../../config/constants';
import { ZNoteSharedSettingsService } from '@notes/shared/services/settings.service';

interface SettingItem {
  name: string;
  value: string;
}

@Component({
  selector: 'z-note-shared-setting',
  templateUrl: 'settings.component.html'
})

export class ZNoteSettingsModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  form: FormGroup;
  selected_font: AbstractControl;
  selected_font_size: AbstractControl;

  readonly FONTS = noteConstants.FONTS;
  readonly FONT_SIZES = noteConstants.FONT_SIZES;

  private destroySubject: Subject<any> = new Subject();

  constructor(private fb: FormBuilder,
              private noteSetting: ZNoteSharedSettingsService) {
    // Init default
    this.form = this.fb.group({
      'selected_font': [{name: 'Lato', value: 'lato'}],
      'selected_font_size': [{name: '18', value: '18pt'}]
    });

    this.selected_font = this.form.controls['selected_font'];
    this.selected_font_size = this.form.controls['selected_font_size'];

  }

  ngOnInit() {
    this.initLoad();
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  async initLoad() {
    const res = await this.noteSetting.getSettings().toPromise();
    this.setFormValue(res.data);
  }

  onCompleteChange(country: any) {
  }

  onCancel() {
    const { setting } = this.noteSetting;
    this.setFormValue(setting);
    this.modal.close();
  }

  submit(value: any) {
    console.log('submit value:', value);
    const body = {font: this.selected_font.value.value,
    font_size: this.selected_font_size.value.value };
    this.noteSetting.updateSettings(body).toPromise()
    .then(res => this.setFormValue(res.data));
  }

  async resetSettings() {
    const res = await this.noteSetting.resetSettings().toPromise();
    this.setFormValue(res.data, false);
  }

  open() {
    this.modal.open();
    const { setting } = this.noteSetting;
    this.setFormValue(setting);
  }

  private setFormValue(data, permanent = true) {
    const font = this.FONTS.find(f => f.value === data.font);
    const font_size = this.FONT_SIZES.find(f => f.value === data.font_size);
    console.log('set form value: ', data, font, font_size);
    this.selected_font.setValue(font);
    this.selected_font_size.setValue(font_size);

    if (permanent) { this.noteSetting.setting = data; }
  }
}

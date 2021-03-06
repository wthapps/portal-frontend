import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiBaseService, CommonEventHandler, CommonEventService, CommonEvent } from '@wth/shared/services';
import { MediaCreateModalService } from './media-create-modal.service';


declare var $: any;
declare var _: any;

@Component({
  selector: 'media-create-modal',
  templateUrl: 'media-create-modal.component.html'
})
export class MediaCreateModalComponent extends CommonEventHandler implements OnInit {
  @Output() doneFormModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @Input() items: Array<any>;

  @ViewChild('modal') modal: any;
  form: FormGroup;
  name: AbstractControl;
  description: AbstractControl;

  isChanged: boolean = false;
  tagItems: any;
  title: any;
  namePlaceholder: any;
  done: any;
  channel: string = 'MediaCreateModalComponent';

  arrayItems: Array<any> = [];

  constructor(private apiBaseService: ApiBaseService,
    private fb: FormBuilder,
    public commonEventService: CommonEventService,
    private mediaCreateModalService: MediaCreateModalService
  ) {
    super(commonEventService);
  }

  ngOnInit() {
    this.form = this.fb.group({
      // 'name': "",
      name: ['', Validators.compose([Validators.required])],
      'description': ''
    });
    this.name = this.form.controls['name'];
    this.description = this.form.controls['description'];
  }

  open(event: CommonEvent) {
    this.modal.open().then();
    if (event.payload) {
      ({ title: this.title, namePlaceholder: this.namePlaceholder, selectedObjects: this.arrayItems, done: this.done } = event.payload);
    }
    this.form.setControl('edit', this.name);
    this.name.setValue('');
    this.description.setValue('');
  }

  close(options?: any) {
    this.modal.close().then();
  }

  create(e: any) {
    if (this.done) {
      this.modal.close().then();
      this.done({ parents: [e], children: this.arrayItems });
    }
  }

  onAction(action: string, data: any) {
    let options = { action: action, data: data };
    this.event.emit(options);
  }

  remove(photo: any, event: any): void {
    _.remove(this.arrayItems, (p: any) => p.id == photo.id);
  }

  onAddItems(arrayItems: Array<number>) {
    this.isChanged = true;
    this.arrayItems = arrayItems;
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  Renderer,
  ViewChild,
  OnInit
} from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'search-form',
  templateUrl: 'search-form.component.html'
})
export class SearchFormComponent implements OnInit {
  @Output() public onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() public onBlur: EventEmitter<any> = new EventEmitter();
  @Output() public onFocus: EventEmitter<any> = new EventEmitter();
  @Output() public onKeyup: EventEmitter<any> = new EventEmitter();
  @Output() public onKeydown: EventEmitter<any> = new EventEmitter();

  // inputs
  @Input() public placeholder: string;
  @Input() public validators: ValidatorFn[] = [];
  @Input() public inputId: string;
  @Input() public inputClass: string;

  @ViewChild('input') public input: any;
  public form: FormGroup;

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    // creating form
    this.form = new FormGroup({
      item: new FormControl('', Validators.compose(this.validators))
    });
  }

  /**
   * @name value
   * @returns {AbstractControl}
   */
  get value(): AbstractControl {
    return this.form.get('item');
  }

  /**
   * @name isInputFocused
   * @returns {boolean}
   */
  isInputFocused(): boolean {
    return document.activeElement === this.input.nativeElement;
  }

  /**
   * @name getErrorMessages
   * @param messages
   * @returns {string[]}
   */
  getErrorMessages(messages: any): string[] {
    return Object.keys(messages)
      .filter(err => this.value.hasError(err))
      .map(err => messages[err]);
  }

  /**
   * @name hasErrors
   * @returns {boolean}
   */
  hasErrors(): boolean {
    return this.form.dirty && this.form.value.item && this.form.invalid;
  }

  /**
   * @name focus
   */
  focus(): void {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
  }

  /**
   * @name getElementPosition
   * @returns {ClientRect}
   */
  getElementPosition(): ClientRect {
    return this.input.nativeElement.getBoundingClientRect();
  }

  /**
   * @name onKeyDown
   * @param $event
   */
  onKeyDown($event: any) {
    return this.onKeydown.emit($event);
  }
}

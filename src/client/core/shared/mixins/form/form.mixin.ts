import { Input, Output } from '@angular/core';
import { SubmitMixin } from '../shared/actions.mixin';
import { Mixin } from '../../../design-patterns/decorator/mixin-decorator';

@Mixin([SubmitMixin])
export class FormMixin implements SubmitMixin {
  @Output() eventOut: any;

  onSubmit: (values: any) => void;
}

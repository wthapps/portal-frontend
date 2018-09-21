import { Input, Output } from '@angular/core';
import { SubmitMixin } from '../shared/submit.mixin';
import { Mixins } from '../../../design-patterns/decorator/mixin-decorator';

@Mixins([SubmitMixin])
export class FormMixin implements SubmitMixin {
  @Output() eventOut: any;

  onSubmit: (values: any) => void;
}

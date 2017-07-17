import { Component, Input } from '@angular/core';
import { FormGroup }        from '@angular/forms';

import { QuestionBase }     from './question-base';

@Component({
  moduleId: module.id,
  selector: 'df-question',
  templateUrl: 'dynamic-form-question.component.html',
  styleUrls: ['dynamic-form-question.component.css']
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  get isValid() {
    if (!this.form.controls[this.question.key].touched) {
      return true;
    }
    return this.form.controls[this.question.key].valid
  }

  get isTouched() {
    return this.form.controls[this.question.key].touched;
  }
}

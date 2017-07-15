import { QuestionBase } from './../base/question-base';

export class Textbox extends QuestionBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: any = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

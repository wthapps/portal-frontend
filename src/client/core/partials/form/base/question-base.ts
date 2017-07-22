import { BaseModel } from '../../../shared/models/base.model';
export class QuestionBase<T> extends BaseModel{
  value: T;
  key: string = '';
  // Label
  label: string = '';
  labelCss: string = 'col-xs-2';

  contentCss: string = 'col-xs-12';
  elementCss: string = 'col-xs-10';
  required: boolean = false;
  order: number = 1;
  controlType: string = '';

  constructor(obj?: any) {
    super();
    this.init(obj);
    if (!this.label) {
      this.labelCss = '';
    }
  }
}

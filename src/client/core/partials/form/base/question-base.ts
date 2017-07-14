import { BaseModel } from '../../../shared/models/base.model';
export class QuestionBase<T> extends BaseModel{
  value: T;
  key: string = '';
  label: string = '';
  required: boolean = false;
  order: number = 1;
  controlType: string = '';

  constructor(obj?: any) {
    super();
    this.init(obj);
  }
}

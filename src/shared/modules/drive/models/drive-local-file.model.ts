import ObjectDataModel from '@shared/models/object-data.model';

export default class DriveLocalFile extends ObjectDataModel {
  static model_const = 'Drive::File';
  data: File;
  full_name: string;
  index: number;
  key: string;
  name: string;
  percent: number;
  type: string;

  constructor(data: Object = {}) {
    super(data);
  }
}

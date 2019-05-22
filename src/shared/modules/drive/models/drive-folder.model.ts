import ObjectDataModel from '@shared/models/object-data.model';
import User from '@shared/models/user.model';

export default class DriveFolder extends ObjectDataModel {
  static model_const = 'Drive::Folder';
  id: number;
  uuid: string;
  name: string;
  full_name: string;
  extension: string;
  content_type: string;
  url: string;
  thumbnail_url: string;
  size: string;
  object_type: string = DriveFolder.model_const;
  created_at: string;
  updated_at: string;
  original_filename: string;
  file_upload_id: string;
  model: string;
  user_id: number;
  user: User = new User();
  favorite: any;
  // uploaded file name
  uploaded_name: string;
  // uploaded module
  module: string;

  constructor(data: Object = {}) {
    super(data);
  }
}

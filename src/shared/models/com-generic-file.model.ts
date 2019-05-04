import User from "./user.model";
import ObjectDataModel from "./object-data.model";

export default class CommonGenericFile extends ObjectDataModel {
  static model_const = "Common::GenericFile";
  id: number;
  uuid: string;
  name: string;
  full_name: string;
  extendsion: string;
  content_type: string;
  url: string;
  thumbnail_url: string;
  size: string;
  object_type: string = CommonGenericFile.model_const;
  created_at: string;
  updated_at: string;
  original_filename: string;
  file_upload_id: string;
  model: string;
  user_id: number;
  user: User = new User();
  // uploaded file name
  uploaded_name: string;
  // uploaded module
  module: string;

  constructor(data: Object = {}) {
    super(data);
  }
}
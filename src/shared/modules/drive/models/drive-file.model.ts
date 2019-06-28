import CommonGenericFile from '@shared/models/com-generic-file.model';
import DriveLocalFile from './drive-local-file.model';

export default class DriveFile extends CommonGenericFile {
  constructor(data: Object = {}) {
    super(data);
  }

  static from(local: DriveLocalFile): DriveFile {
    const { name, id, full_name, key, type, data } = local;
    return new DriveFile({
      id,
      name,
      full_name,
      content_type: type,
      size: `${data.size}`,
      file_upload_id: key
    });
  }
}

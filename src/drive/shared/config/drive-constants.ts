import { ConstantsBase } from '@shared/constant';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import DriveFile from '@shared/modules/drive/models/drive-file.model';

export class DriveConstants extends ConstantsBase {
  OBJECT_TYPE = {
    FILE: 'Common::GenericFile',
    FOLDER: 'Drive::Folder'
  };
}

export type DriveType = DriveFolder | DriveFile;

const driveConstants: DriveConstants = new DriveConstants();
export { driveConstants };

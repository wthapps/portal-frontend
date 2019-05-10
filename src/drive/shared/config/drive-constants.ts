import { ConstantsBase } from '@shared/constant';

export class DriveConstants extends ConstantsBase {
  OBJECT_TYPE = {
    FILE: 'Common::GenericFile',
    FOLDER: 'Drive::Folder'
  };
}

const driveConstants: DriveConstants = new DriveConstants();
export { driveConstants };

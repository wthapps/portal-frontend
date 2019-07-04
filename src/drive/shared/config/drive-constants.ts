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
interface Permission {
  edit: boolean;
}
interface IDriveContext {
  permission: Permission;
}

const DEFAULT_CONTEXT: IDriveContext = Object.freeze({
  permission: { edit: true }
});

const driveConstants: DriveConstants = new DriveConstants();
export { driveConstants, IDriveContext, DEFAULT_CONTEXT };

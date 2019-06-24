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
  permission: Permission
};

interface IDriveProgress {
  hasCloseIcon?: boolean;
  loading?: boolean;
  open?: boolean;
  done?: boolean;
  enableAction?: boolean;
  actionText?: String;
  callback?: Function;
  textMessage?: String;
  failed?: boolean;
}

const DEFAULT_CONTEXT: IDriveContext = Object.freeze({
  permission: {edit: true}
});

const DEFAULT_PROGRESS: IDriveProgress = {
  hasCloseIcon: true,
  loading: false,
  open: false,
  done: false,
  enableAction: false,
  actionText: 'String',
  callback: null,
  textMessage: '',
  failed: false
}

const driveConstants: DriveConstants = new DriveConstants();
export { driveConstants, IDriveContext, IDriveProgress, DEFAULT_CONTEXT, DEFAULT_PROGRESS };

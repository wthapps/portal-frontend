import { driveConstants } from 'drive/shared/config/drive-constants';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import DriveFile from '@shared/modules/drive/models/drive-file.model';

export interface DriveState {
  folderIds: Array<number>;
  foldersMap: { [id: number]: DriveFolder };
  fileIds: Array<number>;
  filesMap: { [id: number]: DriveFile };
}

export const initDriveState: DriveState = {
  folderIds: [],
  foldersMap: {},
  fileIds: [],
  filesMap: {}
};

export const isFolder = item =>
  item.object_type === driveConstants.OBJECT_TYPE.FOLDER;
export const isFile = item =>
  item.object_type === driveConstants.OBJECT_TYPE.FILE;

export default class DriveUtils {
  static parse(data: Array<any>): DriveState {
    const rs = _.cloneDeep(initDriveState);
    data.forEach(item => {
      if (isFolder(item)) {
        rs.folderIds.push(item.id);
        rs.foldersMap[item.id] = item;
      }
      if (isFile(item)) {
        rs.fileIds.push(item.id);
        rs.filesMap[item.id] = item;
      }
    });

    return rs;
  }
}

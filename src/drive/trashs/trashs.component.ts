import { Component, OnInit, HostBinding, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DriveContainerComponent } from 'drive/shared/containers/drive-container.component';
import { DriveType, driveConstants } from 'drive/shared/config/drive-constants';
import { DriveService } from 'drive/shared/services/drive.service';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
import { takeUntil } from 'rxjs/operators';
import { DriveBreadcrumb } from 'drive/shared/components/breadcrumb/breadcrumb';
import { WthConfirmService } from '@shared/services';
import { MessageService } from 'primeng/primeng';

@Component({
  selector: 'drive-trashs',
  templateUrl: './trashs.component.html',
  styleUrls: ['./trashs.component.css']
})
export class DriveTrashsComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'main-page-body';
  @ViewChild(DriveContainerComponent) container: DriveContainerComponent;
  data$: Observable<Array<DriveType>>;

  public rightMenuActions: Array<DriveBreadcrumb> = [{icon: 'fa fa-history', command: () => this.restore()},
   {icon: 'fa fa-trash-o', command: () => this.confirmPermanentDelete()}];

  public readonly apiUrl = 'drive/trashs';
  public breadcrumbs: Array<DriveBreadcrumb> = [{ name: "Trash", label: "Trash" },
    { name: 'Empty trash', label: 'Empty trash', icon: 'fa fa-trash-o', command: () => this.emptyTrash()}];
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(
    private driveService: DriveService,
    private fileDriveUploadService: FileDriveUploadService,
    private messageService: MessageService,
    private wthConfirm: WthConfirmService
     ) {
    this.data$ = driveService.data$;
  }

  ngOnInit(): void {
    this.driveService.resetCurrentFolder();
    this.driveService.context = {permission: {edit: false}}
    this.container.loadObjects(this.apiUrl).then();

    // TODO: Move this code section into drive container component
    this.fileDriveUploadService.onChange.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(event => {
      if (event.folderOnly) {
        this.fileDriveUploadService.uploadFolder(event.target.files);
      } else {
        this.fileDriveUploadService.upload(event.target.files);
      }
    });
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  handleViewItem(item) {
    console.log('trash: handle view item: ', item);
    const object_type = item.model === driveConstants.OBJECT_TYPE.FOLDER ? 'folder' : 'file';
    const header = `This ${object_type} is in your trash`;
    const content = `To view this ${object_type}, you'll need to restore it from your trash. `;

    this.wthConfirm.confirm({
      acceptLabel: 'Restore',
      rejectLabel: 'Cancel',
      message: `<p>${content}</p>`,
      header: header,
      accept: () => {
        this.restore([item]);
      }});
  }

  private displayProgress(textMessage: string) {
    this.messageService.add({severity: 'info', detail: textMessage, key: 'progress'});
  }

  private restore(items?) {
    const objects = items || this.compactSelectedObjects();
    console.log('Restore: ', objects);

    ( async() => {
      await this.driveService.restore({objects: objects});
      this.container.clearSelection();

      this.displayProgress(`${objects.length} items restored`);
    }) ();
  }

  private confirmPermanentDelete() {
    const selectedObjects = this.compactSelectedObjects();
    console.log('confirmPermanentDelete: ', selectedObjects);

    this.wthConfirm.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      message: `<p>Selected files will be deleted permanently.</p>
      <p>This action can't be undone.</p>
      `,
      header: 'Delete file',
      accept: () => {
        ( async() => {
          await this.driveService.permanentDelete({objects: selectedObjects});
          this.container.clearSelection();

          this.displayProgress(`${selectedObjects.length} items deleted permanently`);
        }) ();

      }});
  }

  private emptyTrash() {
    this.wthConfirm.confirm({
      acceptLabel: 'Empty trash',
      rejectLabel: 'Cancel',
      message: `<p>All files and folders will be deleted permanently.</p>
      <p>This action can't be undone.</p>
      `,
      header: 'Empty trash',
      accept: () => {
        ( async() => {
          await this.driveService.emptyAll();
          this.container.clearSelection();

          this.displayProgress('Trash emptied');
        }) ();

      }});

  }

  private compactSelectedObjects(): any[] {
    return this.container.selectedObjects.map(({id, uuid, object_type}) => ({id, uuid, object_type}));
  }
}

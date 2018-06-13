import {
  Component,
  Input,
  EventEmitter,
  Output,
  TemplateRef,
  ViewEncapsulation,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver
} from '@angular/core';
import { Constants } from '@wth/shared/constant';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { PlaylistCreateModalComponent } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.component';
import { PlaylistCreateModalService } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.service';

@Component({
  selector: 'w-toolbar',
  exportAs: 'wToolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WToolbarComponent {
  @Input() leftActionsTemplate: TemplateRef<any>;
  @Input() objectActionsTemplate: TemplateRef<any>;
  @Input() moreActionsTemplate: TemplateRef<any>;

  @Input() object; // detail object
  @Input() selectedObjects: Array<any> = new Array<any>();
  @Input() view;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  grid: string = 'grid';
  list: string = 'list';
  timeline: string = 'timeline';
  favoriteAll: boolean = false;
  hasOneObject: boolean = false;
  hasManyObjects: boolean = false;
  hasNoObject: boolean = false;

  tooltip: any = Constants.tooltip;

  constructor(private apiBaseService: ApiBaseService,
    public resolver: ComponentFactoryResolver,
    public playlistCreateModalService: PlaylistCreateModalService,
    private commonEventService: CommonEventService) {}


  doAction(event: any) {
    if (event.action === 'favourite') {
      event.payload.selectedObjects.map(
        object =>
          (object.favorite = event.payload.mode === 'add' ? true : false)
      );
      this.updateSelectedObjects(event.payload.selectedObjects);
    }
    if (event.action === 'deselectAll') {
      this.selectedObjects.length = 0;
      this.updateSelectedObjects([]);
    }
    if (event.action === 'openModalCreatePlayListModal') {
      this.playlistCreateModalService.open({selectedObjects: this.selectedObjects});
    }
    this.event.emit(event);
  }

  updateSelectedObjects(objects: Array<any>) {
    this.selectedObjects = objects;
    this.favoriteAll = this.checkFavoriteAll(this.selectedObjects);
    this.hasManyObjects = this.selectedObjects.length > 1 ? true : false;
    this.hasOneObject = this.selectedObjects.length === 1 ? true : false;
    this.hasNoObject = this.selectedObjects.length === 0 ? true : false;
  }

  uploadHandler(files: any) {
    const data = files.map(file => {
      return {file: file.result, name: file.name, type: file.type};
    });
    this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'init', payload: files });
    data.forEach(f => {
      if (f.type.includes('video')) {
        this.apiBaseService.post(`media/videos`, f).subscribe(res => {
          this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'uploaded', payload: { data: res.data, originPhoto: f } });
          this.event.emit({action: 'uploaded', payload: [...files]});
        });
      } else {
        this.apiBaseService.post(`media/photos`, f).subscribe(res => {
          this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'uploaded', payload: { data: res.data, originPhoto: f } });
        });
      }
    });
  }

  uploaVideodHandler(files: any) {
    const data = files.map(file => {
      return { file: file.result, name: file.name, type: file.type };
    });
    this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'initVideos', payload: files });
    data.forEach(f => {
      this.apiBaseService.post(`media/videos`, f).subscribe(res => {
        this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'uploaded', payload: { data: res.data, originPhoto: f } });
        this.event.emit({ action: 'uploaded', payload: [...files] });
      });
    });
  }

  errorHandler(error: any) {
    if (error.statusCode == 406 && error.error == 'Not Acceptable') {
      this.commonEventService.broadcast({ channel: 'LockMessage', payload: error.files });
    }
  }

  private checkFavoriteAll(objects: Array<any>): boolean {
    let result = true;
    objects.forEach(object => {
      if (object.favorite === false) {
        result = false;
      }
    });
    return result;
  }
}

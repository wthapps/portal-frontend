import { ApiBaseService } from "@shared/services";
import { MediaType } from "./interfaces/media";
import ObjectDataModel from "@shared/models/object-data.model";

export default class Sharing extends ObjectDataModel implements MediaType {
  apiBaseService = (): ApiBaseService => {
    return ApiBaseService.instance;
  };

  id: number;
  uuid: string;
  recipients_count: number;
  object_type: string;
  // users shared
  recipients: Array<any>;
  recipient: any;
  model: string;
  // client fields
  favorite: any;
  selected: boolean;

  constructor(data: Object = {}) {
    super(data);
    this.recipients = this.recipients || [];
  }

  async getApiRecipients() {
    return await this.apiBaseService().get(`media/sharings/${this.id}/recipients`).toPromise();
  }

  async callGetSharing() {
    return await this.apiBaseService().get(`media/sharings/${this.id}`).toPromise();
  }

  isSharingAlbum() {
    return this.object_type === 'Media::Album';
  }

  existRecipients(): boolean {
    if (this.id && this.recipients_count > 0) return true;
    return false;
  }

  existSharing(): boolean {
    return true;
  }
}
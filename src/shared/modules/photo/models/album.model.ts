import { ApiBaseService } from "@shared/services";
import { MediaType } from "./interfaces/media";
import ObjectDataModel from "@shared/models/object-data.model";

export default class Album extends ObjectDataModel implements MediaType {
  id: number;
  uuid: string;
  sharing_id: number;
  recipients_count: number;
  favorite: any;
  selected: boolean;
  model: string;
  object_type: string;
  // who you share album with
  recipient: any;
  apiBaseService = (): ApiBaseService => {
    return ApiBaseService.instance;
  };

  constructor(data: Object = {}) {
    super(data);
  }

  async getApiRecipients() {
    return await this.apiBaseService().get(`media/sharings/${this.sharing_id}/recipients`).toPromise();
  }

  async callGetSharing() {
    return await this.apiBaseService().get(`media/sharings/${this.sharing_id}`).toPromise();
  }

  existRecipients(): boolean {
    if (this.sharing_id && this.recipients_count > 0) return true;
    return false;
  }

  existSharing(): boolean {
    if (this.sharing_id) return true;
    return false;
  }
}
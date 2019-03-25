import ObjectDataModel from "@shared/common/models/object-data.model";
import { ApiBaseService } from "@shared/services";
import { MediaType } from "./interfaces/media";

export default class Sharing extends ObjectDataModel implements MediaType {
  apiBaseService = (): ApiBaseService => {
    return ApiBaseService.instance;
  };

  id: number;
  recipients_count: number;
  // users shared
  recipients: Array<any>;

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

  existRecipients(): boolean {
    if (this.id && this.recipients_count > 0) return true;
    return false;
  }
}
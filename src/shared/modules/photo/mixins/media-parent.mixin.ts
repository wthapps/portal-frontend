import { ApiBaseService } from "@shared/services";

/* MediaParentMixin will provide */
export class MediaParentMixin {
  moreRecipients: any;
  sharingOwner: any;
  recipients: any;

  constructor(public apiBaseService: ApiBaseService) {}

  showMoreRecipients() {
    this.recipients = [...this.recipients, ...this.moreRecipients];
    this.moreRecipients = null;
  }

  getSharingParentInfo(sharingId: any) {
    if (sharingId) {
      this.apiBaseService
        .get(`media/sharings/${sharingId}`)
        .subscribe(res => {
          this.sharingOwner = res.data;
        });
      this.apiBaseService
        .get(
          `media/sharings/${sharingId}/recipients`
        )
        .subscribe(res => {
          this.recipients = res.data;
          if (this.recipients.length > 6) {
            this.recipients = res.data.slice(0, 5 + 1);
            this.moreRecipients = res.data.slice(5, res.data.length + 1);
          }
        });
    }
  }
}

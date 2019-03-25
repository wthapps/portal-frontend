export interface MediaType {
  id: number;
  callGetSharing: () => Promise<any>;
  existRecipients: () => boolean;
}
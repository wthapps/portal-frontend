export interface MediaType {
  id: number;
  // client fields
  favorite: boolean;
  selected: boolean;
  callGetSharing: () => Promise<any>;
  existRecipients: () => boolean;
  existSharing: () => boolean;
}
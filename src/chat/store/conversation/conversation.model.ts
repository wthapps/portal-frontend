export interface Conversation {
  id: string;
  uuid: string;
  name: string;
  profile_image: string;
  favorite: boolean;
  blacklist: boolean;
  allow_add: boolean;

  notification: boolean;
}

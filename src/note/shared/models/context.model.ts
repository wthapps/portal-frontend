import { Context } from "@shared/shared/models/context.model";

export class NoteContext extends Context {
  viewMode: string = 'list';
  loading: boolean = false;
  sort: any = {
    field: "name",
    desc: true
  }
}

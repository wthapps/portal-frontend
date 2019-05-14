import { Context } from '@shared/shared/models/context.model';

export interface SortOption { field: string; desc: boolean; }
export class NoteContext extends Context {
  viewMode = 'list';
  loading = false;
  sort: SortOption = {
    field: 'name',
    desc: true
  };
  groupBy = 'date';
}

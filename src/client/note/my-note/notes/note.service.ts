import { Injectable } from '@angular/core';
import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Note } from '../../../core/shared/models/note.model';

@Injectable()
export class NoteService extends BaseEntityService<Note> {

  constructor(protected api: ApiBaseService) {
    super(api);
    this.url = '/notes'
  }
}

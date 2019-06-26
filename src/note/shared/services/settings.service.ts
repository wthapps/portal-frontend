import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiBaseService } from '@shared/services';

export interface NoteSetting {
    font: string;
    font_size: string;
}

const DEFAULT_SETTING: NoteSetting = {
    font: 'helvetica',
    font_size: '14pt'
};

@Injectable()
export class ZNoteSharedSettingsService {
    setting$: Observable<NoteSetting>;
    private settingSubject: BehaviorSubject<NoteSetting> = new BehaviorSubject<NoteSetting>(DEFAULT_SETTING);

    private url = 'note/wsettings';

    constructor(private api: ApiBaseService) {
        this.setting$ = this.settingSubject.asObservable();
    }

    getSettings(): Observable<any> {
        return this.api.post(`${this.url}/get_setting`);
    }

    updateSettings(body): Observable<any> {
        return this.api.post(`${this.url}/update_setting`, body);
    }

    resetSettings(): Observable<any> {
        return this.api.post(`${this.url}/reset_setting`);
    }

    set setting(data: NoteSetting) {
        this.settingSubject.next(data);
    }

    get setting(): NoteSetting {
        return this.settingSubject.getValue();
    }
}

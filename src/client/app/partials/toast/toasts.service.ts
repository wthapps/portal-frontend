import {Injectable, EventEmitter} from "@angular/core"

@Injectable()
export class ToastsService {

    public emiter: EventEmitter<any> = new EventEmitter();

    set(toast: any, to: boolean) { this.emiter.emit({command: "set", toast: toast, add: to}) };
    getChangeEmitter() { return this.emiter }

    //// Access methods
    success(content: string, override?: any) { this.set({content: content, type: "success", override: override}, true) }
    danger(content: string, override?: any) { this.set({content: content, type: "danger", override: override}, true) }
    warning(content: string, override?: any) { this.set({content: content, type: "warning", override: override}, true) }
    info(content: string, override?: any) { this.set({content: content, type: "info", override: override}, true) }
    bare(content: string, override?: any) { this.set({content: content, type: "bare", override: override}, true) }

    // With type method
    create(content: string, type: string, override?: any) { this.set({content: content, type: type, override: override}, true) }

    // HTML Toast method
    html(html: any, type: string, override?: any) { this.set({html: html, type: type, override: override, title: null, content: null}, true) }

    // Remove all toasts method
    remove(id?: string) {
        if (id) this.emiter.emit({command: "clean", id: id});
        else this.emiter.emit({command: "cleanAll"});
    }

}

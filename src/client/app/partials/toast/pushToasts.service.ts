import {Injectable, EventEmitter} from "@angular/core"

declare var Toast;

@Injectable()
export class PushToastsService {
    private canCreate: boolean = false;
    private toastBuffer: PushToast;

    create(data: PushToast): any {

        if (!this.canCreate) {
            this.toastBuffer = data;
            this.getPermission();
            return;
        }

        let toast = new Toast(data.title, {
            body: data.body
        });

        return toast;
    }

    getPermission(): void {
        if (!("Toast" in window)) {
            console.log("This browser does not support desktop toast.");
            return;
        }

        if (Toast.permission === "granted") this.createBuffered();

        else if (Toast.permission !== "denied") {
            Toast.requestPermission()
                .then(a => {
                    if (a === "denied") console.log("Permission wasn't granted");
                    else if (a === "default") console.log("The permission request was dismissed.");
                    else this.createBuffered();
                })
        }
    }

    private createBuffered() {
        this.canCreate = true;
        if (this.toastBuffer) {
            this.create(this.toastBuffer);
            this.toastBuffer = null;
        }
    }
}

export interface PushToast {
    title: string
    body: string
}

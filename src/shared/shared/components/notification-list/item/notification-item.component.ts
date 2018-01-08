import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  HostBinding,
  ViewContainerRef,
  ViewChild,
  ElementRef,
  HostListener,
  Renderer2
} from '@angular/core';
import { NotificationUndoComponent } from '@shared/shared/components/notification-list/undo/notification-undo.component';
import { Router } from '@angular/router';
import { NotificationService, ApiBaseService } from '@shared/services';

@Component({
  selector: 'app-partials-notification-item',
  templateUrl: 'notification-item.component.html',
  styleUrls: ['notification-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [NotificationUndoComponent]
})

export class NotificationItemComponent implements OnInit {
  @ViewChild('notificationUndo', {read: ViewContainerRef}) undoNotificationRef: ViewContainerRef;
  @ViewChild('notiItemMenuEl') notiItemMenuEl: ElementRef;
  @Input() notification: any;
  @Input() type: string = 'update';

  @HostBinding('class') classes: string = 'notification-item';
  selectedNotifications: string[] = ['social'];
  communitiesUrl: string;
  itemSettings: any = {};
  showToggle: boolean;

  @HostListener('document:click', ['$event']) clickedOutside(event: Event) {
    // here you can hide your menu
    const tmpOld = document.getElementById('notiItemMenuEl');
    if (tmpOld) {
      this.renderer.removeChild(document.body, tmpOld);
    }
  }

  constructor(public notificationService: NotificationService,
              private router: Router,
              private apiBaseService: ApiBaseService,
              private elementRef: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
  }

  clickedInside(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  showMenu(event: any) {
    const tmpOld = document.getElementById('notiItemMenuEl');
    if (tmpOld) {
      this.renderer.removeChild(document.body, tmpOld);
    }
    const el = this.notiItemMenuEl.nativeElement.cloneNode(true);
    const tmp = document.createElement('div');
    tmp.setAttribute('id', 'notiItemMenuEl');
    tmp.appendChild(el);
    this.renderer.appendChild(document.body, tmp);
    this.renderer.setStyle(tmp, 'top', event.clientY + 'px');
    this.renderer.setStyle(tmp, 'left', event.clientX + 'px');
  }

  navigateTo(actions: any[], notif_id: string): void {
    this.notificationService.navigateTo(actions, notif_id);
  }
}

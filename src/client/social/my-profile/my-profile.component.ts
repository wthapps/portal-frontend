import { AfterContentInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { UserService } from '../../core/shared/services/user.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

declare let Shepherd: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-my-profile',
  templateUrl: 'my-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['my-profile.component.css']
})
export class ZSocialMyProfileComponent implements OnInit, AfterContentInit {
  @ViewChild('modal') modal: ModalComponent;
  soUserProfile$: Observable<any>;

  // data: any;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private apiBaseService: ApiBaseService) {
    this.soUserProfile$ = this.userService.soProfile$;
  }

  ngOnInit() {
    this.apiBaseService.get(`zone/social_network/users/${this.userService.profile.uuid}`).take(1).subscribe((res: any) => {
      // this.data = res.data;
      this.userService.soUserProfile = res.data;
    });
  }

  ngAfterContentInit(): void {
    let shepherd;
    shepherd = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
        showCancelLink: true
      }
    });
    shepherd.addStep('main-menu', {
      title: 'Main menu',
      text: 'Collection of available applications and tools in WTH!Zone. <br> Can switch between them easily.',
      attachTo: {element: '#menuleft-nav-intro-1', on: 'right'},
      classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
      buttons: [
        {
          text: 'Skip all',
          classes: 'shepherd-close-text',
          action: shepherd.cancel
        }, {
          text: 'Next',
          action: shepherd.next,
          classes: 'shepherd-button-example-primary'
        }
      ]
    });
    shepherd.addStep('including', {
      title: 'Including',
      text: 'Including Shepherd is easy! Just include shepherd.js, and a Shepherd theme file.',
      attachTo: '.header-nav-apps bottom',
      buttons: [
        {
          text: 'Skip all',
          classes: 'shepherd-close-text',
          action: shepherd.cancel
        }, {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: shepherd.back
        }, {
          text: 'Next',
          action: shepherd.next
        }
      ]
    });
    // shepherd.addStep('example', {
    //   title: 'Example Shepherd',
    //   text: 'Creating a Shepherd is easy too! Just create Shepherd and add as many steps as you want. Check out the <a href="http://github.hubspot.com/shepherd">documentation</a> to learn more.',
    //   attachTo: '.hero-example bottom',
    //   buttons: [
    //     {
    //       text: 'Back',
    //       classes: 'shepherd-button-secondary',
    //       action: shepherd.back
    //     }, {
    //       text: 'Next',
    //       action: shepherd.next
    //     }
    //   ]
    // });

    shepherd.start();
  }

  onOpen(user: any) {
    this.modal.open();
  }

  onClose() {
    setTimeout(() => {
      console.log('adaafafaf');
    }, 500);
  }

  doEvent(e: any) {
    this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, e).subscribe((res: any) => {
      // this.data = res.data;
      this.userService.soUserProfile = res.data;
    });
  }
}

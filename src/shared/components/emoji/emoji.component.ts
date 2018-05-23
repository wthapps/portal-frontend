import {
  Component,
  Input,
  ViewChild,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WTHEmojiService } from './emoji.service';
import { OverlayPanel } from 'primeng/components/overlaypanel/overlaypanel';

@Component({
  selector: 'app-wth-emoji',
  templateUrl: 'emoji.component.html',
  styleUrls: ['emoji.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppWTHEmojiComponent implements OnInit {
  @Input() size: number = 40;
  @ViewChild('overlayPanel') overlayPanel: OverlayPanel;

  emojiData: Observable<any>;
  currentGroup: string = 'people';

  constructor(private emojiService: WTHEmojiService) {
    this.emojiData = this.emojiService.getByCat();
  }

  ngOnInit(): void {
    this.emojiService.showEmoji$.subscribe((event: any) => {
      if (event) {
        this.overlayPanel.toggle(event);
      }
    });
  }

  scroll(el: string) {
    let element = document.getElementById(el);
    element.scrollIntoView();
  }

  onSelected(emoji: any) {
    this.emojiService.setEmoji(emoji);
    this.overlayPanel.hide();
  }

  onEmojiScroll(event: any) {
    // const people = document.getElementById('emoji-people');
    const nature = document.getElementById('emoji-nature');
    const food = document.getElementById('emoji-food');
    const activity = document.getElementById('emoji-activity');
    const travel = document.getElementById('emoji-travel');
    const objects = document.getElementById('emoji-objects');
    const symbols = document.getElementById('emoji-symbols');
    const flags = document.getElementById('emoji-flags');

    if (event.target.scrollTop > flags.offsetTop - 10) {
      this.currentGroup = 'flags';
    } else if (event.target.scrollTop > symbols.offsetTop - 10) {
      this.currentGroup = 'symbols';
    } else if (event.target.scrollTop > objects.offsetTop - 10) {
      this.currentGroup = 'objects';
    } else if (event.target.scrollTop > travel.offsetTop - 10) {
      this.currentGroup = 'travel';
    } else if (event.target.scrollTop > activity.offsetTop - 10) {
      this.currentGroup = 'activity';
    } else if (event.target.scrollTop > food.offsetTop - 10) {
      this.currentGroup = 'food';
    } else if (event.target.scrollTop > nature.offsetTop - 10) {
      this.currentGroup = 'nature';
    } else {
      this.currentGroup = 'people';
    }
  }
}

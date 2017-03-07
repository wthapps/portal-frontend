import { Directive, ElementRef, HostListener, AfterContentInit, Input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[scrollToBottom]'
})
export class ScrollToBottomDirective implements AfterContentInit, OnDestroy {
  @Input('lock-y-offset') lockYOffset = 10;
  @Input('observe-attributes') observeAttributes: string = 'false';

  @HostListener('scroll')
  scrollHandler() {
    const scrollFromBottom = this.nativeElement.scrollHeight - this.nativeElement.scrollTop - this.nativeElement.clientHeight;
    this.isLocked = scrollFromBottom > this.lockYOffset;
  }

  nativeElement: HTMLElement;
  private isLocked = false;
  private mutationObserver: MutationObserver;

  constructor(element: ElementRef) {
    this.nativeElement = element.nativeElement;
  }

  ngAfterContentInit(): void {
    this.mutationObserver = new MutationObserver(() => {
      if (!this.isLocked) {
        this.nativeElement.scrollTop = this.nativeElement.scrollHeight;
      }
    });
    this.mutationObserver.observe(this.nativeElement, {
      childList: true,
      subtree: true,
      attributes: this.getObserveAttributes()
    });
  }

  ngOnDestroy() {
    this.mutationObserver.disconnect();
  }

  getObserveAttributes(): boolean {
    return this.observeAttributes !== '' && this.observeAttributes.toLowerCase() !== 'false';
  }
}

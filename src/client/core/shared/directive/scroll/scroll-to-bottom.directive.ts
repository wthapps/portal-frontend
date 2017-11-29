import { Directive, ElementRef, HostListener, AfterContentInit, Input, OnDestroy, OnChanges } from '@angular/core';

@Directive({
  selector: '[scrollToBottom]'
})
export class ScrollToBottomDirective implements AfterContentInit, OnDestroy, OnChanges {
  @Input() lockYOffset: number = 10;
  @Input() observeAttributes: string = 'false';
  @Input() detectChange: any;
  nativeElement: HTMLElement;
  private isLocked = false;
  private mutationObserver: MutationObserver;

  @HostListener('scroll')
  scrollHandler() {
    const scrollFromBottom = this.nativeElement.scrollHeight - this.nativeElement.scrollTop - this.nativeElement.clientHeight;
    this.isLocked = scrollFromBottom > this.lockYOffset;
  }

  constructor(element: ElementRef) {
    this.nativeElement = element.nativeElement;
  }

  ngOnChanges(changed: any) {
    this.scroll();
  }

  scroll() {
    setTimeout(() => {
      this.nativeElement.scrollTop = this.nativeElement.scrollHeight + 99999;
    }, 200);
  }

  ngAfterContentInit(): void {
    this.scroll();

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

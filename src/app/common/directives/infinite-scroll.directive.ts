import { AfterViewInit, Directive, ElementRef, inject, input, OnDestroy, output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective implements AfterViewInit, OnDestroy {

  threshold = input<number>(150);
  customSelector = input<string>('', { alias: 'appInfiniteScroll' });
  infiniteScroll = output<void>();

  private host = inject(ElementRef);

  private targetElement!: HTMLElement;
  private alreadyTriggered = false;
  private scrollHandler = this.onScroll.bind(this);

  ngAfterViewInit() {
    this.targetElement = this.customSelector() ?
      this.host.nativeElement.querySelector(this.customSelector()) :
      this.host.nativeElement;

    if (this.targetElement) {
      this.targetElement.addEventListener('scroll', this.scrollHandler);
    } else {
      console.warn('InfiniteScrollDirective: Element not found for selector:', this.customSelector());
    }
  }

  ngOnDestroy() {
    this.targetElement?.removeEventListener('scroll', this.scrollHandler);
  }

  /**
   * Handles the scroll event to trigger infinite scroll when the user reaches near the bottom of the scrollable area.
   * @param event
   */
  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceFromBottom <= this.threshold()) {
      if (!this.alreadyTriggered) {
        this.alreadyTriggered = true;
        this.infiniteScroll.emit();
      }
    } else {
      this.alreadyTriggered = false;
    }
  }

}

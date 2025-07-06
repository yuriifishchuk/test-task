import {
  Directive,
  output,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appSearch]',
  host    : {
    '(input)': 'onInput($event.target.value)'
  }
})
export class SearchDirective implements OnInit, OnDestroy {
  search = output<string>();

  private debounceTime = 300;
  private input$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.input$
      .pipe(
        debounceTime(this.debounceTime),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.search.emit(value);
      });
  }

  /**
   * Handles the input event to emit the search value after a debounce period.
   * @param value
   */
  onInput(value: string) {
    this.input$.next(value);
  }

  /**
   * Cleans up the subscriptions when the directive is destroyed.
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

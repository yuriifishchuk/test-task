import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  /**
   * Highlights the query string in the given value by wrapping it in <mark> tags.
   * @param value The string to search within.
   * @param query The string to highlight.
   * @returns The modified string with highlighted query.
   */
  transform(value: string, query: string): string {
    if (!query) return value;
    const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape regex
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return value.replace(regex, `<mark>$1</mark>`);
  }

}

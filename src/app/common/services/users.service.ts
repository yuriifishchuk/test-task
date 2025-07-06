import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '@models/user';
import { Filter, Pageable, PageableResult, Sort } from '@models/pageable';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient);

  /**
   * Calculates the age based on the provided date of birth.
   * @param dateOfBirth
   */
  calculateAge(dateOfBirth: string): number {
    const convertedDateOfBirth = new Date(dateOfBirth);
    return new Date().getFullYear() - convertedDateOfBirth.getFullYear();
  }

  /**
   * Applies filters to the result set based on the provided filters.
   * @param result
   * @param filters
   */
  applyFilters<T>(result: T[], filters: Filter[]): T[] {
    if (!filters || filters.length === 0) return result;

    return result.filter((item: T) => {
      return filters.every((filter: Filter) => {
        if (!filter.value || filter.value.length === 0) return true;

        const itemValue = (item as Record<string, unknown>)[filter.field!];
        if (itemValue == null) return false;

        return filter.value.some((value: string) => {
          if (value === 'NOT_ADULTS') {
            const age = this.calculateAge(itemValue as string);
            return age < 18;
          }

          if (value === 'ADULTS') {
            const age = this.calculateAge(itemValue as string);
            return age >= 18;
          }

          if (value === 'ACTIVE') {
            return itemValue;
          }

          if (value === 'NOT_ACTIVE') {
            return !itemValue;
          }

          return String(itemValue).toLowerCase().includes(value.toLowerCase());
        });
      });
    });
  }

  /**
   * Applies a search query to the result set.
   * @param result
   * @param searchQuery
   */
  applySearchQuery<T>(result: T[], searchQuery: string): T[] {
    const query = searchQuery.toLowerCase();
    return result.filter((item: T) => {
      const fields = ['firstName', 'lastName', 'phone'];

      return fields.some(field => {
        const val = item[field as keyof T];
        if (val == null) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }

  /**
   * Applies sorting to the result set based on the provided sort information.
   * @param result
   * @param sort
   */
  applySorting<T>(result: T[], sort: Sort): void {
    result.sort((a: T, b: T) => {
      const valA = a[sort!.field as keyof T];
      const valB = b[sort!.field as keyof T];
      if (valA < valB) return sort!.direction === 'ascend' ? -1 : 1;
      if (valA > valB) return sort!.direction === 'ascend' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Applies pagination, sorting, filtering, and search to the provided data.
   * @param data
   * @param pageable
   */
  applyPageable<T>(data: T[], pageable: Pageable): PageableResult<T> {
    let result = [...data];

    // Apply filters
    if (pageable.filters?.length) {
      result = this.applyFilters<T>(result, pageable.filters);
    }

    // Apply search
    if (pageable.query) {
      result = this.applySearchQuery<T>(result, pageable.query);
    }

    // Apply sorting
    if (pageable.sort) {
      this.applySorting<T>(result, pageable.sort);
    }

    // Apply pagination
    const startIndex = pageable.page * pageable.size;
    const endIndex = startIndex + pageable.size;

    return {
      content  : result.slice(startIndex, endIndex),
      completed: data.length <= endIndex
    };
  }

  /**
   * Fetches users from the server and applies pagination, sorting, filtering, and search.
   * @param query The pageable object containing pagination, sorting, filtering, and search parameters.
   * @returns An observable of the paginated, sorted, filtered, and searched users.
   */
  getUsers(query: Pageable): Observable<PageableResult<User>> {
    return this.http.get<User[]>('users.json').pipe(
      map(users => this.applyPageable<User>(users, query))
    );
  }

}

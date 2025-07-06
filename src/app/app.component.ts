import { Component, OnInit, inject } from '@angular/core';
import { User } from '@models/user';
import { UsersService } from '@services/users.service';
import { Pageable, PageableResult } from '@models/pageable';
import { TableComponent } from './common/components/table/table.component';
import { TableColumn } from '@models/tableColumn';
import { QueryParams } from '@models/queryParams';

@Component({
  selector   : 'app-root',
  imports: [
    TableComponent
  ],
  templateUrl: './app.component.html',
  styleUrl   : './app.component.scss'
})
export class AppComponent implements OnInit {

  usersService: UsersService = inject(UsersService);

  userList: User[] = [];
  userTableColumns: TableColumn[] = [
    {
      type: 'text',
      field: 'firstName',
      title: 'First Name',
      sortable: true,
      filterValues: []
    },
    {
      type: 'text',
      field: 'lastName',
      title: 'Last Name',
      sortable: true,
      filterValues: []
    },
    {
      type: 'date',
      field: 'dateOfBirth',
      title: 'Date Of Birth',
      sortable: true,
      filterValues: [
        { text: '< 18 years old', value: 'NOT_ADULTS' },
        { text: '> 18 years old', value: 'ADULTS' }
      ]
    },
    {
      type: 'boolean',
      field: 'isActive',
      title: 'Active',
      sortable: true,
      filterValues: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Not Active', value: 'NOT_ACTIVE' }
      ]
    }
  ];

  pageQuery: Pageable = {
    page: 0,
    size: 20,
    query: ''
  }

  ngOnInit() {
    this.getUsers();
  }

  /**
   * Fetches the list of users from the user service.
   * If infiniteLoad is true, it appends the new users to the existing list.
   * Otherwise, it replaces the existing list with the new users.
   * @param infiniteLoad Whether to append to the existing user list or replace it.
   */
  getUsers(infiniteLoad: boolean = false) {
    this.usersService.getUsers(this.pageQuery).subscribe((users: PageableResult<User>) => {
      if (infiniteLoad) {
        if (users.completed) return;
        this.userList.push(...users.content);
      } else {
        this.userList = users.content;
      }
    });
  }

  /**
   * Handles the query params change event from the table.
   * @param params The query parameters object containing sort, filters, and other params.
   */
  onQueryParamsChange(params: QueryParams) {
    const { sort, filters } = params;
    this.pageQuery.page = 0;
    this.pageQuery.sort = {
      field: sort.key || '',
      direction: sort.value || ''
    };
    this.pageQuery.filters = filters.map(filter => ({
      field: filter.key,
      value: filter.value
    })) || [];

    this.getUsers();
  }

  /**
   * Handles the load more event from the table.
   */
  onLoadMore() {
    this.pageQuery.page++;
    this.getUsers(true);
  }

  /**
   * Handles the search event from the table.
   * @param searchQuery The search query string.
   */
  onSearch(searchQuery: string) {
    this.pageQuery.page = 0;
    this.pageQuery.query = searchQuery;
    this.getUsers();
  }


}

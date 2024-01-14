# Pagination
An angular frontend that uses a springboot backend and MySQL to store user data to demonstrate a full pagination application.
Features include: 
- Pagination and page navigation
- User search via search box
- Filter by status of ACTIVE, BANNED or PENDING

![Screenshot 2024-01-13 at 7 56 04 PM](https://github.com/eelizan1/Pagination/assets/15695349/9e714993-071c-461a-b4ea-115aedca01d4)

### Search By Key Words with Continued Pagination 
![Screenshot 2024-01-13 at 7 56 47 PM](https://github.com/eelizan1/Pagination/assets/15695349/c23e6c37-5b29-4907-9d4f-6cade2bf5437)


## Angular 
The client UI demonstrates use of: 
- Reactive approach using observables
- Using Application state at the app component
- Using structural directives to create the pagination logic

### The Observable that sets the Application state 
```
// in service.ts 
 // Make call to the back end API to retrieve page of users
  users$ = (
    name: string = '', // default params
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<Page>> =>
    this.http.get<ApiResponse<Page>>(
      `${this.serverUrl}/users?name=${name}&page=${page}&size=${size}`
    );

// in app component
 usersState$: Observable<{
    appState: string; // will be if the app loaded or is in loading state
    appData?: ApiResponse<Page>; // actual page data
    error?: HttpErrorResponse;
  }>;
```
### Using Structural Directives 
We grab the number of pages from the backend via totalPages then dynamically render the page numbers 
```
              <li
                *ngFor="
                  let pageNumber of [].constructor(
                    state.appData.data.page.totalPages
                  );
                  let i = index
                "
                class="page-item pointer"
                [ngClass]="i == (currentPage$ | async) ? ' active' : ''"
              >
                <a
                  (click)="gotToPage(searchForm.value.name, i)"
                  class="page-link"
                >
                  {{ i + 1 }}
                </a>
              </li>
```

## Backend Spring Boot
The backend will use the PagingAndSortingRepository as its main engine for the pagination methods and functions

```
@Repository
public interface UserRepository extends PagingAndSortingRepository<User, Long> {
    // findByNameContaining is structured so that it can be interpreted as a query
    Page<User> findByNameContaining(String name, Pageable pageable);
}
```

Our Response will be held in a Map property via the HttpResponse model which will hold the generic type of Page 
```
// HttpResponse.java 
 protected Map<?, ?> data;
```

## MySQL 
Mock data came from https://mockaroo.com/

Example insert 
```
insert into MOCK_DATA (id, first_name, last_name, email, gender, ip_address) values (1, 'Seymour', 'Davley', 'sdavley0@miibeian.gov.cn', 'Male', '151.86.56.134');
```

To dynamically generate profile pictures the images came from randomuser.me and was generated randomly with a SQL query 
```
UPDATE user SET image_url = CONCAT('https://randomuser.me/api/portraits/men/', FLOOR(RAND() * 100), '.jpg');
```


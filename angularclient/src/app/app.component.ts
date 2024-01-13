import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { map, startWith, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiResponse } from './interface/api-response';
import { Page } from './interface/page';
import { UserService } from './service/UserService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // app state that will be used from the response data
  usersState$: Observable<{
    appState: string; // will be if the app loaded or is in loading state
    appData?: ApiResponse<Page>; // actual page data
    error?: HttpErrorResponse;
  }>;

  constructor(private userSevice: UserService) {}

  ngOnInit(): void {
    this.usersState$ = this.userSevice.users$().pipe(
      // go through each response
      map((response: ApiResponse<Page>) => {
        console.log(response);

        // define the userState properties from response
        // must return the type of the Observable of userState$
        return {
          appState: 'APP_LOADED',
          appData: response,
        };
      }),
      startWith({ appState: 'APP_LOADING' }), // while we are fetching, current state is LOADING
      catchError((error: HttpErrorResponse) =>
        of({
          appState: 'APP_ERROR',
          error: error, // Changed here to match the structure
        })
      )
    );
  }
}

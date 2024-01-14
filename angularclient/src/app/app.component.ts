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
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();

  constructor(private userSevice: UserService) {}

  // ngOnInit(): void {
  //   this.usersState$ = this.userSevice.users$().pipe(
  //     // go through each response
  //     map((response: ApiResponse<Page>) => {
  //       console.log(response);

  //       // define the userState properties from response
  //       // must return the type of the Observable of userState$
  //       return {
  //         appState: 'APP_LOADED',
  //         appData: response,
  //       };
  //     }),
  //     startWith({ appState: 'APP_LOADING' }), // while we are fetching, current state is LOADING
  //     catchError((error: HttpErrorResponse) =>
  //       of({
  //         appState: 'APP_ERROR',
  //         error: error, // Changed here to match the structure
  //       })
  //     )
  //   );
  // }

  ngOnInit(): void {
    // this.loadingService.loadingOn();
    this.usersState$ = this.userSevice.users$().pipe(
      map((response: ApiResponse<Page>) => {
        //this.loadingService.loadingOff();
        this.responseSubject.next(response);
        this.currentPageSubject.next(response.data.page.number);
        console.log(response);
        return { appState: 'APP_LOADED', appData: response };
      }),
      startWith({ appState: 'APP_LOADING' }),
      catchError((error: HttpErrorResponse) => {
        //this.loadingService.loadingOff();
        return of({ appState: 'APP_ERROR', error });
      })
    );
  }

  gotToPage(name?: string, pageNumber: number = 0): void {
    //this.loadingService.loadingOn();
    this.usersState$ = this.userSevice.users$(name, pageNumber).pipe(
      map((response: ApiResponse<Page>) => {
        //this.loadingService.loadingOff();
        this.responseSubject.next(response);
        this.currentPageSubject.next(pageNumber);
        console.log(response);
        return { appState: 'APP_LOADED', appData: response };
      }),
      startWith({
        appState: 'APP_LOADED',
        appData: this.responseSubject.value,
      }),
      catchError((error: HttpErrorResponse) => {
        // this.loadingService.loadingOff();
        return of({ appState: 'APP_ERROR', error });
      })
    );
  }

  // direction is forward or backrwards
  goToNextOrPreviousPage(direction?: string, name?: string): void {
    this.gotToPage(
      name,
      direction === 'forward'
        ? this.currentPageSubject.value + 1
        : this.currentPageSubject.value - 1
    );
  }
}

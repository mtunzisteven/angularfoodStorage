import { HttpClient, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { take, exhaustMap } from "rxjs/operators";
import { AuthService } from "./auth.service";

// This injectable lacks argument and will be added in the providers inside 
// the app.module.ts file so that Angular understands what it is: interceptor
@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

    constructor(
        private http: HttpClient,
        private authService: AuthService
        ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler){

        // take(1):this take method allows us to take the value we want only once
        // and not remain subscribed to the observable we are takin the value from
        // since we're taking the value we want and not subscribing, we can't
        // subscribe to another observable(http.get()) inside this BehaviorSubject
        // therefore we pipe them together using exhaustMap(). the user observable
        // is executed and once the value is retrieved, it is replaced by the http observable
        return this.authService.user.pipe(
            take(1), 
            exhaustMap(user => {

                // when the user is not logged in, don't add token to requests
                if(!user){
                    return next.handle(req);
                }

                const modifiedReq = req.clone({ // modify the request by cloning it and adding headers
                                                headers: new HttpHeaders( // create new headers 
                                                    {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': 'Bearer '+user.token
                                                    }
                                            )})
                return next.handle(modifiedReq);
            }));


    }

}
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";

export class LoggingInterceptorService implements HttpInterceptor{

    // interface forces us to use this method:
    // req arg is a generic interceptor that will yield any type of data that might be retrieved by the request
    // the interceptor will run code before the request leaves the app and is forwarded to subscribe
    // next is an function that will forward the request to the next step
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //this http interceptor method will run for all requests unless we specify a url it should run in
        // if(req.url == 'url'){ code to execute}

        console.log('Outgoing request!');
        console.log(req.url);
        console.log(req.headers);

        // next.handle(req) lets request leave the app | without this, the app will break
        // next.handle(req) is an observable that has the response, 
        // using pipe on it can allow us to intercept the response and modify it as we please using: .pipe(map/ .pipe(tap etc
        return next.handle(req).pipe(
          tap(event =>{
            // console.log(event);
            if(event.type === HttpEventType.Response){
              console.log("Incoming response!");
              console.log(event.body);
            }
          })
        ); 
    } 

  constructor() { }
}

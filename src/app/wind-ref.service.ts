import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// This service creates a singleton pattern, which makes sure only one instance of
// an object is created for the entire application.
export class WindRefService {

  constructor() { }

  // This method returns a single reference to the DOM window object. 
  // The window object contains useful functions to interact with the
  // browser window.
  getNativeWindow() {
    return window;
 }

}

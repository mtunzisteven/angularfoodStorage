import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
    
    constructor(){
      console.log('dropping down');

    }

    // This host binding decorative will add a class name of 'open'
    // to the element we bind to whenever openToggle is true. 
    // in the html template, just add the directive name as follows: appDropdown
    // this is how Angular will know where to add the class of 'open'
    @HostBinding('class.open') openToggle = false;

    // Angular core listener for events that takes the type of event as argument
    // No need to add anything more on the html template
    // in the html template, just add the directive name as follows: appDropdown or appDropdown(data) if we want to access event data
    // this is how Angular will know in which element to listen for events from.  
    @HostListener('click') hoverOn(eventData: Event){

        this.openToggle = !this.openToggle

    }

}
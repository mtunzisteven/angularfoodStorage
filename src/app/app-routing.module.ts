import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// creating routes for the entire application
const appRoutes: Routes = [
  // {path:'', redirectTo: '/documents', pathMatch: 'full'}, // localhost:4200 will redirect to DocumentsComponent
  // {path:'documents', component: DocumentsComponent, children: [
  //   {path:'new', component: DocumentEditComponent}, // must be above :id route because Angular will confuse new for :id otherwise
  //   {path:':id', component: DocumentDetailComponent},
  //   {path:':id/edit', component: DocumentEditComponent}
  // ]}, // localhost:4200/documents will open DocumentsComponent

  // {path:'messages', component: MessageListComponent}, // localhost:4200/messages will open MessageListComponent
  // {path:'contacts', component: ContactsComponent, children: [
  //     {path:'new', component: ContactEditComponent}, // must be above :id route because Angular will confuse new for :id otherwise
  //     {path:':id', component: ContactDetailComponent},
  //     {path:':id/edit', component: ContactEditComponent}
  // ]} // localhost:4200/messages will open MessageListComponent

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

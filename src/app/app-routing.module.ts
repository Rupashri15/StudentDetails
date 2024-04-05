import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputComponent } from './input/input.component'; 
import { FetchComponent } from './fetch/fetch.component';

const routes: Routes = [
  { path: 'input', component: InputComponent },
  { path: 'fetch', component: FetchComponent }, 
  { path: '', redirectTo: '/input', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

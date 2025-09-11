import { Routes } from '@angular/router';
import {App} from './layout/app';
import {Home} from '../features/home/pages/home/home';
import {Dashboard} from '../features/dashboard/pages/dashboard/dashboard';

export const routes: Routes = [
{ path: '', pathMatch: 'full', redirectTo: 'dashboard'  },
  { path: 'home', component: Home},
  { path: 'dashboard', component: Dashboard},
];

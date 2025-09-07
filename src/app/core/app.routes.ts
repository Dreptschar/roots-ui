import { Routes } from '@angular/router';
import {App} from './layout/app';
import {Home} from '../features/home/pages/home/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'  },
  { path: 'home', component: Home}
];

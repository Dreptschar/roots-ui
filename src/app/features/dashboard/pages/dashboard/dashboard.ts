import { Component } from '@angular/core';
import {Plantsoverview} from '../../../plants/components/plantoverview/plantsoverview';

@Component({
  selector: 'app-dashboard',
  imports: [
    Plantsoverview
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}

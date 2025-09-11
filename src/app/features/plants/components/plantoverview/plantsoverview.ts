import { Component } from '@angular/core';
import {Panel} from 'primeng/panel';
import {Image} from 'primeng/image';
import {Carousel} from 'primeng/carousel';

@Component({
  selector: 'app-plantoverview',
  imports: [
    Panel,
    Image,
    Carousel
  ],
  templateUrl: './plantsoverview.html',
  styleUrl: './plantsoverview.scss'
})
export class Plantsoverview {
  plants = ["1","2","3","4","5","6"]

}

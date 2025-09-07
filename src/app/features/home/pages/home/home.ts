import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
@Component({
  selector: 'app-home',
  imports: [
    Button,
    FormsModule,
    DatePickerModule
  ],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  date: Date | undefined;

}

import {Component} from '@angular/core';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-createplantdialog',
  templateUrl: './createplantdialog.html',
  styleUrl: './createplantdialog.scss'
})
export class Createplantdialog {
  ref: DynamicDialogRef | undefined;

  constructor(public dialog: DialogService) {
  }

}

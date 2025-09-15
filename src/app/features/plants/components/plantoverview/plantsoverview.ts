import { Component } from '@angular/core';
import {Panel} from 'primeng/panel';
import {Image} from 'primeng/image';
import {Carousel} from 'primeng/carousel';
import {Tag} from 'primeng/tag';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {DialogService, DynamicDialogStyle} from 'primeng/dynamicdialog';
import {Createplantdialog} from '../createplantdialog/createplantdialog';

@Component({
  selector: 'app-plantoverview',
  imports: [
    Panel,
    Carousel,
    Tag,
    Button,
  ],
  templateUrl: './plantsoverview.html',
  styleUrl: './plantsoverview.scss'
})
export class Plantsoverview {
  plants = ["1","2","3","4","5","6"]

  constructor(public dialogService: DialogService) {
  }

  onCreatePlantClick(){
    this.dialogService.open(Createplantdialog, {maximizable: true})
  }

}

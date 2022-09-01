import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-exit',
  templateUrl: './exit.component.html',
  styleUrls: ['./exit.component.scss']
})
export class ExitComponent {

  constructor(
    public dialogRef: DynamicDialogRef
  ) { }

  onClick(val: boolean): void {
    this.dialogRef.close(val);
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {text: string}, private _matSnackBarRef: MatSnackBarRef<SnackBarComponent>) { }

  ngOnInit(): void {
  }

  buttonClick(result: 'yes' | 'no') {
    if (result === 'yes') {
      this._matSnackBarRef.dismissWithAction()
    } else {
      this._matSnackBarRef.dismiss()
    }
  }
}

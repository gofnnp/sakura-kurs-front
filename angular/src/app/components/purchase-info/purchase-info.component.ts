import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { PurchaseInfo } from 'src/app/interface/data';

@Component({
  selector: 'app-purchase-info',
  templateUrl: './purchase-info.component.html',
  styleUrls: ['./purchase-info.component.scss']
})
export class PurchaseInfoComponent implements OnInit {
  public purchaseInfo!: PurchaseInfo;
  readonly moment = moment;

  constructor(
    public dialogRef: MatDialogRef<PurchaseInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {purchaseInfo: PurchaseInfo},
  ) { }

  ngOnInit(): void {
    this.purchaseInfo = this.data.purchaseInfo
  }

}

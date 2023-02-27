import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

export interface IListData {
  list: Array<any>;
  active: any;
}

@Component({
  selector: 'app-terminal-list',
  templateUrl: './terminal-list.component.html',
  styleUrls: ['./terminal-list.component.scss']
})
export class TerminalListComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: IListData, private _bottomSheetRef: MatBottomSheetRef<TerminalListComponent>) { }

  ngOnInit(): void {
  }

  selectItem(item: any) {
    this._bottomSheetRef.dismiss(item)
  }

}

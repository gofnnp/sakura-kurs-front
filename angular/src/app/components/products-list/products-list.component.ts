import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from 'src/app/interface/data';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  public products!: Product[]

  constructor(
    public dialogRef: MatDialogRef<ProductsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {products: Product[]},
  ) { }

  ngOnInit(): void {
    this.products = this.data.products
  }

}

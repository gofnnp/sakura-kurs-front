import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AllData, Modifier, ModifiersGroup, Product } from 'src/app/interface/data';
import { WpJsonService } from 'src/app/services/wp-json.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {
  public product!: Product;
  public allData!: AllData;
  public modifiersGroups!: ModifiersGroup[];
  public modifiers!: Modifier[];

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private wpJsonService: WpJsonService
  ) { }

  ngOnInit(): void {
    this.product = this.config.data.product
    this.modifiersGroups = this.config.data.modifiersGroups
    this.modifiers = this.config.data.modifiers  
  }

  modifiersFilter() {
    return this.modifiersGroups.filter((value) => this.product.modifiers_group.includes(value.id))
  }

  // selectedOptions(modifier: Modifier): Option[]{
  //   return this.cartProduct.modifiers.find(cartModifier => cartModifier.id === modifier.id)?.options ?? [];
  // }
}

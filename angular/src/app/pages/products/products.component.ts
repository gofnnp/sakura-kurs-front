import { Component, OnInit } from '@angular/core';
import { Group, Modifier, ModifiersGroup, Product } from "../../interface/data";
import { v4 as uuidv4 } from 'uuid';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductModalComponent } from 'src/app/components/product-modal/product-modal.component';
import { WpJsonService } from 'src/app/services/wp-json.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public products!: Product[];
  public groups: Group[] = [
    {
      id: uuidv4(),
      label: 'Все'
    }
  ];
  public modifiersGroups!: ModifiersGroup[];
  public modifiers!: Modifier[];
  public selectedGroup: Group = this.groups[0];

  constructor(
    public dialogService: DialogService,
    private wpJsonService: WpJsonService
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.wpJsonService.getAllData().subscribe({
      next: (value) => {
        this.products = value.products
        this.groups = [...this.groups, ...value.groups]
        this.modifiersGroups = value.modifiers_groups
        this.modifiers = value.modifiers
      } 
    })
  }

  filterByGroup() {
    if (this.selectedGroup.label === 'Все') return this.products
    return this.products.filter((product) => product.groupId === this.selectedGroup.id)
  }

  addToCart(event: MouseEvent, product: Product) {
    if (event) {
      event.preventDefault()
    }
    const ref = this.dialogService.open(ProductModalComponent, {
      header: product.name,
      width: 'auto',
      style: {
        'max-width': '90vw',
        'max-height': '90vh',
      },
      contentStyle: {
        'max-height': '90vh',
        height: 'auto',
        'max-width': '90vw',
        overflow: 'auto',
      },
      data: {
        product: product,
        modifiersGroups: this.modifiersGroups,
        modifiers: this.modifiers
      },
      baseZIndex: 10000,
      autoZIndex: true,
      dismissableMask: true,
      closeOnEscape: true,
    });

  }

}

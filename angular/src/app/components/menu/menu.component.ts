import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageListMain } from 'src/app/app.constants';
import { Page } from 'src/app/interface/data';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Output() toggleMenu = new EventEmitter();
  readonly mainPageList = PageListMain;
  public cartCount = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartCount = this.cartService.cartCount;
    this.cartService.cartCount$.subscribe({
      next: (count) => {
        this.cartCount = count;
        document
          .querySelectorAll('.cart')[0]
          .setAttribute('data-counter', this.cartCount.toString());
      },
    });
  }

  changeMainPage(page: Page, event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
    if (page.resName === 'cart') {
      this.toggleMenu.emit()
      return
    }
    this.router.navigate([page.resName], {
      // relativeTo: this.route,
      // queryParamsHandling: 'merge',
    });
  }
}

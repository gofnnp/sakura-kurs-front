import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  routeHome(event: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate(['/'], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }
}

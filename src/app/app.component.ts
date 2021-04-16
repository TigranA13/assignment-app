import {Component, OnDestroy, ViewChild} from '@angular/core';
import { NavigationStart, Router } from "@angular/router";

import { Subscription } from "rxjs";

import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  @ViewChild('sideNav') sideNav: MatSidenav;
  private subscription: Subscription;

  constructor(private router: Router) {
    this.subscription = this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.sideNav.close();
        }
      })
  }

  toggleSidenav(): void {
    this.sideNav.toggle();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

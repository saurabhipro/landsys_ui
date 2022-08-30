import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  project: any;
  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    console.log('INSIDE DASHBOARD:');
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.getProjectStatus();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProjectStatus(): void {
    this.dashboardService.query(2).subscribe(
      res => {
        if (res.body) {
          this.project = res.body;
        }
      },
      err => {
        // consoles
      }
    );
  }
}

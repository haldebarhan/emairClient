import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MagasinService } from '../../services/magasin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { search } from '../../../helpers/month.helper';
import { DataService } from '../../services/data.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-monthly-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './monthly-list.component.html',
  styleUrl: './monthly-list.component.css',
})
export class MonthlyListComponent implements OnInit {
  monthly: any = [];
  constructor(
    private magService: MagasinService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.magService.monthluStatus().subscribe({
      next: (value) => {
        this.monthly = value;
      },
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }

  getMonth(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthName = search(month);
    return `${monthName} ${year}`;
  }

  sendData(dateStr: string) {
    this.dataService.sendMonthlyDate(dateStr)
    this.router.navigate(['/monthly'])
  }
}

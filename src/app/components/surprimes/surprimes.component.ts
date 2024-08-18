import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SuprimesService } from '../../services/suprimes.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LimitToFivePipe } from '../../pipes/limit-to-five.pipe';
import { Surprime } from '../../models/surprime';

@Component({
  selector: 'app-surprimes',
  standalone: true,
  imports: [CommonModule, LimitToFivePipe],
  templateUrl: './surprimes.component.html',
  styleUrl: './surprimes.component.css',
})
export class SurprimesComponent implements OnInit {
  @Input() magasinDate!: string;
  surprimes: Surprime[] = [];
  constructor(
    private surprimeService: SuprimesService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadData();
  }

  getCurrentMonthAndYear(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { year, month };
  }

  newSurprime() {
    this.router.navigate(['/surprime-add']);
  }


  goToList(){
    this.router.navigate(['/surprime-list'])
  }

  formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const formatDate = date
      .toLocaleDateString('en-GB')
      .replace('/', '-')
      .replace('/', '-');
    return formatDate;
  }

  loadData() {
    const { year, month } = this.getCurrentMonthAndYear(this.magasinDate);
    this.surprimeService.filter(year, month).subscribe({
      next: (value) => (this.surprimes = value),
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }
}

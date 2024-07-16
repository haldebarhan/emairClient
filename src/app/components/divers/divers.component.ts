import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DiversService } from '../../services/divers.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-divers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './divers.component.html',
  styleUrl: './divers.component.css',
})
export class DiversComponent implements OnInit {
  @Input() magasinDate!: string;
  divers: any = [];

  constructor(private diversService: DiversService, private router: Router) {}
  ngOnInit(): void {
    this.loadData()
  }


  getCurrentMonthAndYear(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { year, month };
  }

  newDivers() {
    this.router.navigate(['/divers-add']);
  }


  goToList(){
    this.router.navigate(['/divers-list'])
  }

  loadData(){
    const { year, month } = this.getCurrentMonthAndYear(this.magasinDate);
    this.diversService.filter(year, month).subscribe({
      next: (value) => (this.divers = value),
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }
}

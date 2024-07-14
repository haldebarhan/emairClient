import { Component, Input, OnInit } from '@angular/core';
import { Magasin } from '../../models/magasin';
import { CommonModule } from '@angular/common';
import { LimitToFivePipe } from '../../pipes/limit-to-five.pipe';
import { NumberWithSpacesPipe } from '../../pipes/number-with-spaces.pipe';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Stock } from '../../models/stock';
import { ConsoService } from '../../services/conso.service';
import { Rapport } from '../../models/rapport';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [CommonModule, LimitToFivePipe, NumberWithSpacesPipe],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.css',
})
export class DataViewComponent implements OnInit {
  @Input() monthData!: Magasin;
  @Input() magasinId!: string;
  stock!: Stock[];
  consoReport: Rapport[] = [];
  constructor(
    private router: Router,
    private dataService: DataService,
    private consoService: ConsoService
  ) {}
  ngOnInit(): void {
    this.stock = this.monthData.stock;
    const { year, month } = this.getCurrentMonthAndYear(this.monthData.date);
    this.consoService.findMonthlyConsumption(year, month).subscribe({
      next: (value) => {
        this.consoReport = value;
      },
      error: (err) => console.log(err),
    });
  }

  getMagValue() {
    var sum = 0;
    this.stock.map((item) => (sum += item.prix * item.quantite));
    return sum;
  }

  getGlobalExpense() {
    var expense = 0;
    this.stock.map((item) => (expense += item.appro * item.prix));
    return expense;
  }

  getTotalItem() {
    var quantity = 0;
    this.stock.map((item) => (quantity += item.balance));
    return quantity;
  }

  goToDetail() {
    this.router.navigate(['/magasin']);
  }

  consoEdit(id: string) {
    this.router.navigate(['conso-edit', id]);
  }
  goToAppro() {
    this.router.navigate(['/appro', this.monthData.id]);
  }

  sendData() {
    this.dataService.setData(this.stock);
    this.goToDetail();
  }

  goToConsoReport() {
    this.router.navigate(['/report-conso']);
  }

  getCurrentMonthAndYear(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { year, month };
  }

  getTotalMatin(data: Rapport) {
    var compt = 0;
    data.report.map((item) => {
      compt += item.petit_dejeuner;
    });
    return compt;
  }
  getTotalMidi(data: Rapport) {
    var compt = 0;
    data.report.map((item) => {
      compt += item.dejeuner;
    });
    return compt;
  }
  getTotalSoir(data: Rapport) {
    var compt = 0;
    data.report.map((item) => {
      compt += item.diner;
    });
    return compt;
  }

  formatedDate(data: Rapport) {
    const date = new Date(data.date);
    const formatedDate = date
      .toLocaleDateString('en-GB')
      .replace('/', '-')
      .replace('/', '-');
    return formatedDate;
  }
}

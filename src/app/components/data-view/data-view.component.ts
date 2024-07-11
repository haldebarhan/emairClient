import { Component, Input, OnInit } from '@angular/core';
import { Magasin } from '../../models/magasin';
import { CommonModule } from '@angular/common';
import { LimitToFivePipe } from '../../pipes/limit-to-five.pipe';
import { NumberWithSpacesPipe } from '../../pipes/number-with-spaces.pipe';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Stock } from '../../models/stock';

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
  constructor(private router: Router, private dataService: DataService) {}
  ngOnInit(): void {
    this.stock = this.monthData.stock;
  }

  getMagValue() {
    var sum = 0;
    this.stock.map((item) => (sum += item.prix * item.quantite));
    return sum;
  }

  getGlobalExpense() {
    var expense = 0;
    this.stock.map((item) => (expense += item.appro));
    return expense;
  }

  getTotalItem() {
    var quantity = 0;
    this.stock.map((item) => (quantity += item.quantite));
    return quantity;
  }

  goToDetail() {
    this.router.navigate(['/magasin']);
  }

  sendData() {
    this.dataService.setData(this.stock);
    this.goToDetail();
  }
}

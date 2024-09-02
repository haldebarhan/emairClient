import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookletService } from './booklet.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Booklet } from '../models/booklet';
import { MagasinService } from '../services/magasin.service';
import { getCurrentMonthAndYear } from '../../helpers/currentMonthAndYear';
import { NumberWithSpacesPipe } from '../pipes/number-with-spaces.pipe';
import { PdfGeneratorService } from '../services/pdf-generator.service';

export interface DataElement {
  produit: string;
  appro: number[];
  conso: number[];
  balance: number[];
  existant: number;
}

@Component({
  selector: 'app-booklet',
  standalone: true,
  imports: [CommonModule, RouterLink, NumberWithSpacesPipe],
  templateUrl: './booklet.component.html',
  styleUrl: './booklet.component.css',
})
export class BookletComponent implements OnInit {
  magasinId: string | null = null;
  booklet: Booklet | null = null;
  dataSource: DataElement[] = [];
  book: DataElement[] = [];
  pageSize = 10;
  currentPage = 0;
  pages: number[] = [];
  pagedData: DataElement[] = [];
  total_Lines: number = 0;
  total_matin!: number[];
  total_midi!: number[];
  total_soir!: number[];
  magasin_date: string = '';
  currentYear!: number;
  currentMonth!: number;

  constructor(
    private readonly bookService: BookletService,
    private readonly magasinService: MagasinService,
    private route: ActivatedRoute,
    private pdfService: PdfGeneratorService
  ) {}

  ngOnInit(): void {
    this.loadBook();
  }

  loadBook() {
    this.route.paramMap.subscribe((params) => {
      this.magasinId = params.get('id');
      if (this.magasinId) {
        this.bookService.findOneByMagId(`${this.magasinId}`).subscribe({
          next: (value) => {
            if (value) {
              this.book = value.carnet;
              this.dataSource = value.carnet;
              this.total_Lines = value.total_matin.length;
              this.total_matin = value.total_matin;
              this.total_midi = value.total_midi;
              this.total_soir = value.total_soir;
              this.setPage(0);
              this.pages = Array(
                Math.ceil(this.dataSource.length / this.pageSize)
              )
                .fill(0)
                .map((x, i) => i);
            }
            this.booklet = value;
          },
          error: (err: HttpErrorResponse) => console.log(err),
        });
        this.loadMag(this.magasinId);
      }
    });
  }

  loadMag(magasinId: string) {
    this.magasinService.findOne(magasinId).subscribe({
      next: (value) => {
        this.magasin_date = value.date;
        const { year, month } = getCurrentMonthAndYear(this.magasin_date);
        this.currentMonth = month;
        this.currentYear = year;
      },
    });
  }

  setPage(pageIndex: number) {
    this.currentPage = pageIndex;
    const startIndex = pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedData = this.dataSource.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.setPage(this.currentPage - 1);
    }
  }
  nextPage() {
    if (this.currentPage < this.pages.length - 1) {
      this.setPage(this.currentPage + 1);
    }
  }

  fullDate(day: number) {
    const date = new Date(`${this.currentYear}-${this.currentMonth}-${day}`);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('fr-FR', options);
    return formattedDate;
  }

  getSum(table: number[]): number {
    const total = table.reduce((sum: number, item: number) => sum + item);
    return total;
  }

  findLastBalance(item: DataElement): number {
    let conso_sum = item.conso.reduce((sum: number, value: number) => sum + value)
    let appro_sum = item.appro.reduce((sum: number, value: number) => sum + value)
    appro_sum += item.existant
    const last_balance = appro_sum - conso_sum
    return last_balance;
  }


  async print(){
    await this.pdfService.printBooklet()
  }
}

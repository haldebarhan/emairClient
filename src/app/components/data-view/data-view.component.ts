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
import { Toast } from '../../../helpers/toast.helper';
import { Sw } from '../../../helpers/sw.helper';
import { PdfGeneratorService } from '../../services/pdf-generator.service';

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
  reportSheet: any = [];
  consoReport: Rapport[] = [];
  constructor(
    private router: Router,
    private dataService: DataService,
    private consoService: ConsoService,
    private pdfService: PdfGeneratorService
  ) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
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

  goToReportDetail(id: string) {
    this.consoService.getConsoById(id).subscribe({
      next: (value) => {
        this.dataService.setReportData(value);
        this.router.navigate(['/conso-detail']);
      },
      error: () =>
        Toast.fire({
          icon: 'error',
          title: 'Erreur',
        }),
    });
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
  EmitReport(id: string) {
    Sw.fire({
      icon: 'info',
      title: 'Information',
      text: 'Une fois soumit ce rapport ne sera plus éligible ni à la suppression ni à la modification',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non',
      confirmButtonText: 'Je soumets',
    }).then((result) => {
      if (result.isConfirmed) {
        this.consoService.emitReport(id).subscribe({
          next: () => {
            Sw.fire({
              title: 'Effectué',
              icon: 'success',
              text: `le rapport a bien été transmit`,
              timer: 1500,
              timerProgressBar: true,
              didClose: () => this.loadData(),
            });
          },
          error: (err) => console.log(err),
        });
      }
    });
  }
  DeleteConso(id: string) {
    Sw.fire({
      icon: 'question',
      title: 'Etes-vous sure ?',
      titleText: 'Supprimer ce rapport?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non',
      confirmButtonText: 'Oui, je confirme!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.consoService.deleteConso(id).subscribe({
          next: () =>
            Sw.fire({
              title: 'Supprimé',
              icon: 'success',
              text: `le rapport a bien été supprimé`,
              timer: 1500,
              timerProgressBar: true,
              didClose: () => this.loadData(),
            }),
        });
      }
    });
  }
  formatedDate(data: Rapport) {
    const date = new Date(data.date);
    const formatedDate = date
      .toLocaleDateString('en-GB')
      .replace('/', '-')
      .replace('/', '-');
    return formatedDate;
  }

  PrintReport(reportId: string) {
    this.consoService.dailyReport(reportId).subscribe({
      next: (value) => {
        this.reportSheet = value;
        this.pdfService.generateDailySheet(this.reportSheet)
      },
    });
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { ApproService } from '../../services/appro.service';
import { LimitToTenPipe } from '../../pipes/limit-to-ten.pipe';
import { LimitToEightPipe } from '../../pipes/limit-to-eight.pipe';
import { SurprimesComponent } from '../surprimes/surprimes.component';
import { DiversComponent } from '../divers/divers.component';
import { MagasinService } from '../../services/magasin.service';
import { UniteService } from '../unite/unite.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MonthlyTableService } from '../../services/monthly-table.service';
import { getCurrentMonthAndYear } from '../../../helpers/currentMonthAndYear';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LimitToFivePipe,
    NumberWithSpacesPipe,
    LimitToTenPipe,
    LimitToEightPipe,
    SurprimesComponent,
    DiversComponent,
  ],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.css',
})
export class DataViewComponent implements OnInit {
  @Input() monthData!: Magasin;
  @Input() magasinId!: string;
  @Output() completed = new EventEmitter<any>();
  stock!: Stock[];
  reportSheet: any = [];
  consoReport: Rapport[] = [];
  supplies: any = [];
  totalDay: number = 0;
  unites: any;
  units: any = [];
  totalMatin!: Array<number>;
  totalMidi!: Array<number>;
  totalSoir!: Array<number>;
  totalRow!: Array<number>;
  totalMatinSum = 0;
  totalMidiSum = 0;
  totalSoirSum = 0;
  globalCost = 0;
  isEdit: boolean = false;
  tableId!: string;
  errorMessage!: string;

  constructor(
    private router: Router,
    private dataService: DataService,
    private consoService: ConsoService,
    private pdfService: PdfGeneratorService,
    private approService: ApproService,
    private magasinService: MagasinService,
    private uniteService: UniteService,
    private monthlyTableService: MonthlyTableService
  ) {}
  ngOnInit(): void {
    this.loadData();
    this.loadTableData(this.magasinId);
  }

  loadData() {
    this.stock = this.monthData.stock;
    const { year, month } = getCurrentMonthAndYear(this.monthData.date);
    this.totalDay = this.getDayInMonth(month, year);
    this.consoService.findMonthlyConsumption(year, month).subscribe({
      next: (value) => {
        this.consoReport = value;
        this.approService.filterByMagId(this.monthData.id).subscribe({
          next: (value) => {
            this.supplies = value;
            if (
              this.allTrue(this.consoReport) &&
              this.consoReport.length == this.totalDay
            ) {
              this.completedMonth();
            }
          },
          error: (err) => console.log(err),
        });
      },
      error: (err) => console.log(err),
    });
  }

  getMagValue() {
    var sum = 0;
    this.stock.map((item) => (sum += item.prix * item.balance));
    return sum;
  }

  getFirsdayMagValue() {
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
    return this.stock.length;
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

  gotToBook(){
    this.router.navigate(['/booklet-magasin', this.magasinId])
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
        this.pdfService.generateDailySheet(this.reportSheet);
      },
    });
  }

  britishDate(dateStr: string) {
    const date = new Date(dateStr);
    const britishFormat = date.toLocaleDateString('en-GB');
    return britishFormat;
  }

  getDecompte(data: any) {
    var sum = 0;
    data.produits.map((item: any) => (sum += item.quantite * item.denree.pu));
    return sum;
  }

  printSupplySheet(data: any) {
    const article = data.produits.map((item: any) => {
      return {
        produit: item.denreeName,
        quantite: item.quantite,
        um: item.denree.mesure.unite,
        pu: item.denree.pu,
        decompte: item.quantite * item.denree.pu,
      };
    });

    this.pdfService.generateSupplySheet(article, this.britishDate(data.date));
  }
  allTrue(data: Rapport[]) {
    return data.every((element: any) => element.transmit == true);
  }

  getDayInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  updateTotals(rowIndex: number, unitIndex: number): void {
    this.totalMatin[rowIndex] = this.units.reduce((sum: number, unite: any) => {
      const value = parseFloat(unite.matin[rowIndex]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    this.totalMidi[rowIndex] = this.units.reduce((sum: number, unite: any) => {
      const value = parseFloat(unite.midi[rowIndex]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    this.totalSoir[rowIndex] = this.units.reduce((sum: number, unite: any) => {
      const value = parseFloat(unite.soir[rowIndex]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    // Calculer un total général pour la ligne
    this.totalRow[rowIndex] =
      this.totalMatin[rowIndex] * 400 +
      this.totalMidi[rowIndex] * 1000 +
      this.totalSoir[rowIndex] * 800;

    const unite = this.units[unitIndex];
    unite.totalMatin = unite.matin.reduce(
      (sum: number, value: number) => sum + +value
    );
    unite.totalMidi = unite.midi.reduce(
      (sum: number, value: number) => sum + +value
    );
    unite.totalSoir = unite.soir.reduce(
      (sum: number, value: number) => sum + +value
    );
    this.totalMatinSum = this.totalMatin.reduce(
      (acc: number, value: number) => acc + +value
    );
    this.totalMidiSum = this.totalMidi.reduce(
      (acc: number, value: number) => acc + +value
    );
    this.totalSoirSum = this.totalSoir.reduce(
      (acc: number, value: number) => acc + +value
    );

    this.globalCost = this.totalRow.reduce(
      (sum: number, value: number) => sum + +value
    );
  }

  editTable() {
    this.isEdit = true;
  }

  SaveTableData() {
    this.isEdit = false;
    const payload = {
      magasin: this.magasinId,
      unites: this.units,
      totalMatin: this.totalMatin,
      totalMidi: this.totalMidi,
      totalSoir: this.totalSoir,
      totalRow: this.totalRow,
    };

    this.monthlyTableService
      .updateMonthlyTable(this.tableId, payload)
      .subscribe({
        next: () => {
          Toast.fire({
            title: 'Sauvegardée',
            icon: 'success',
            didClose: () => this.loadTableData(this.magasinId),
          });
        },
        error: (
          errors: {
            statusCode: number;
            message: string;
            error: string;
          }[]
        ) => {
          let affectedLines: string[] = [];
          errors.forEach((err) => {
            affectedLines.push(err.message);
          });
          this.errorMessage = `les données de ligne ${affectedLines.join(
            ', '
          )} ne seront pas enregistrées car le menu comporte des denrees dont la quantité est insuffisante pour satifaire la conso ou non presentes en stock`;
          Sw.fire({
            title: 'Erreur Survenue',
            text: this.errorMessage,
            icon: 'error',
            didClose: () => this.loadTableData(this.magasinId),
          });
        },
      });
  }

  completedMonth() {
    Sw.fire({
      title: 'Mois terminé',
      text: 'tout les rapports de consommation ont été transmit le mois est donc terminé',
      icon: 'info',
      didClose: () => this.completed.emit(),
    });
  }

  loadTableData(magasinId: string) {
    this.monthlyTableService.getMonthlyTable(magasinId).subscribe({
      next: (data: any) => {
        this.units = data.unites;
        this.totalMatin = data.totalMatin;
        this.totalMidi = data.totalMidi;
        this.totalSoir = data.totalSoir;
        this.totalRow = data.totalRow;
        this.tableId = data._id;
        this.globalCost = this.totalRow.reduce(
          (sum: number, value: number) => sum + value
        );
        this.totalMatinSum = this.totalMatin.reduce(
          (sum: number, value: number) => sum + +value
        );
        this.totalMidiSum = this.totalMidi.reduce(
          (sum: number, value: number) => sum + +value
        );
        this.totalSoirSum = this.totalSoir.reduce(
          (sum: number, value: number) => sum + +value
        );
      },
      error: (err: HttpErrorResponse) => console.error(err),
    });
  }
}

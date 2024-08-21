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
import { Unites } from '../../models/unites';
import { MonthlyTable } from '../../models/monthly-table';

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
  @Output() completed = new EventEmitter<string>();
  stock!: Stock[];
  reportSheet: any = [];
  consoReport: Rapport[] = [];
  supplies: any = [];
  totalDay: number = 0;
  unites: any;
  units: Unites[] = [];
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
  currentYear!: number;
  currentMonth!: number;
  monthCompleted: boolean = false;

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
    this.currentMonth = month;
    this.currentYear = year;
    this.totalDay = this.getDayInMonth(month, year);
    this.consoService.findMonthlyConsumption(year, month).subscribe({
      next: (value) => {
        this.consoReport = value;
        this.approService.filterByMagId(this.monthData.id).subscribe({
          next: (value) => {
            this.supplies = value;
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

  goToAppro() {
    this.router.navigate(['/appro', this.monthData.id]);
  }

  gotToBook() {
    this.router.navigate(['/booklet-magasin', this.magasinId]);
  }

  sendData() {
    this.dataService.setData(this.stock);
    this.goToDetail();
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
  cancel() {
    this.loadTableData(this.magasinId);
    this.isEdit = false;
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

  ShowPrint(index: number): boolean {
    if (
      this.totalMatin[index] != 0 &&
      this.totalMidi[index] != 0 &&
      this.totalSoir[index] != 0
    ) {
      return true;
    }
    return false;
  }

  PrintReport(index: number) {
    index += 1;
    this.consoService
      .dailyReport(this.currentYear, this.currentMonth, index)
      .subscribe({
        next: (value) => {
          if (value) {
            this.pdfService.generateDailySheet(value);
          } else {
            Toast.fire({
              titleText: 'Enregistrez avant',
              icon: 'warning',
            });
          }
        },
        error: (err) => console.log(err),
      });
    // const date = new Date('2024-2-1')
  }

  completedMonth() {
    Sw.fire({
      icon: 'warning',
      title: 'Passage au Mois suivant',
      text: "Etes-vous sure d'avoir verifié toutes les données",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, je comfirme',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        Sw.fire({
          title: 'Progression',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Sw.showLoading();
          },
          didClose: () => {
            this.completed.emit(this.magasinId);
          },
        });
      }
    });
  }

  loadTableData(magasinId: string) {
    this.monthlyTableService.getMonthlyTable(magasinId).subscribe({
      next: (data) => {
        this.showCompleteButton(data);
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

  showCompleteButton(data: MonthlyTable) {
    const isfull_totalMatin = data.totalMatin.every((value) => +value !== 0);
    const isfull_totalMidi = data.totalMidi.every((value) => +value !== 0);
    const isfull_totalSoir = data.totalSoir.every((value) => +value !== 0);

    if (
      isfull_totalMatin == true &&
      isfull_totalMidi == true &&
      isfull_totalSoir == true
    ){
      this.monthCompleted = true;
    }
  }
}

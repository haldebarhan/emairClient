import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { UniteService } from '../unite/unite.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PdfGeneratorService } from '../../services/pdf-generator.service';
import { ConsoService } from '../../services/conso.service';
import { NumberWithSpacesPipe } from '../../pipes/number-with-spaces.pipe';
import { DiversService } from '../../services/divers.service';
import { SuprimesService } from '../../services/suprimes.service';
import { Stock } from '../../models/stock';
import { MagasinService } from '../../services/magasin.service';
import { search } from '../../../helpers/month.helper';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Magasin } from '../../models/magasin';
import { MonthlyTableService } from '../../services/monthly-table.service';
import { Unites } from '../../models/unites';
import { getCurrentMonthAndYear } from '../../../helpers/currentMonthAndYear';
import { MonthlyTable } from '../../models/monthly-table';
import { Divers } from '../../models/divers';
import { Surprime } from '../../models/surprime';
import { getDay } from '../../../helpers/get-day';
import { Sw } from '../../../helpers/sw.helper';

@Component({
  selector: 'app-monthly-table',
  standalone: true,
  imports: [CommonModule, NumberWithSpacesPipe],
  templateUrl: './monthly-table.component.html',
  styleUrl: './monthly-table.component.css',
})
export class MonthlyTableComponent implements OnInit, AfterViewInit {
  units: Unites[] = [];
  totalMatin!: Array<number>;
  totalMidi!: Array<number>;
  totalSoir!: Array<number>;
  totalRow!: Array<number>;
  totalMatinSum = 0;
  totalMidiSum = 0;
  totalSoirSum = 0;
  globalCost = 0;
  monthlyTable!: MonthlyTable;
  surprimesList: Surprime[] = [];
  divers: Divers[] = [];
  list: string[] = [];
  currentYear!: number;
  currentMonth!: number;

  reports: any = [];
  totalUnit: any = [];
  surprimes: any = [];
  consoReport: any = [];
  monthlyDate: string | null = null;

  monthLib: string = '';
  magasin!: Magasin;
  constructor(
    private uniteService: UniteService,
    private pdfService: PdfGeneratorService,
    private consoSerive: ConsoService,
    private diversService: DiversService,
    private surprimeSerice: SuprimesService,
    private magasinService: MagasinService,
    private dataService: DataService,
    private router: Router,
    private monthlyTableService: MonthlyTableService
  ) {}
  ngAfterViewInit(): void {
    Sw.fire({
      title: 'Patientez ...',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Sw.showLoading();
      },
      didClose: () => {
        this.print();
      },
    });
  }

  ngOnInit(): void {
    this.dataService.data$.subscribe((value) => (this.monthlyDate = value));
    if (this.monthlyDate != null) {
      this.loadData(this.monthlyDate);
      this.loadTable(this.monthlyDate);
      this.loadSurprimeList();
    }
  }

  loadData(date: string) {
    const { year, month } = getCurrentMonthAndYear(date);
    this.currentMonth = month;
    this.currentYear = year;
    let monthName = search(month);
    this.monthLib = `${monthName} ${year}`;
  }

  loadTable(date: string) {
    this.magasinService.finOneByDate(date).subscribe({
      next: (value) => {
        if (value) {
          this.magasin = value;
          this.monthlyTableService.getMonthlyTable(value.id).subscribe({
            next: (data) => {
              this.monthlyTable = data;
              this.units = data.unites;
              this.list = this.units.map((u) => {
                return u.nom;
              });
              this.totalMatin = data.totalMatin;
              this.totalMidi = data.totalMidi;
              this.totalSoir = data.totalSoir;
              this.totalRow = data.totalRow;
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

              this.loadDivers(value.id);
            },
          });
        }
      },
    });
  }

  loadSurprimeList() {
    this.surprimeSerice.filter(this.currentYear, this.currentMonth).subscribe({
      next: (values) => {
        this.surprimesList = values;
      },
      error: (err) => console.log(err),
    });
  }

  loadDivers(magasinId: string) {
    this.diversService.filter(magasinId).subscribe({
      next: (values) => {
        this.divers = values;
      },
      error: (err) => console.log(err),
    });
  }

  getSurprimeCount(suprime: Surprime): number {
    const index = getDay(suprime.date.toString());
    return this.monthlyTable.totalMidi[index];
  }

  totalDivers() {
    const sup = this.surprimesList.map((s) => {
      const effectif = this.getSurprimeCount(s);
      return { effectif: effectif, montant: s.montant };
    });

    let sup_total = 0;
    sup.map((s) => (sup_total += s.montant * s.effectif));
    let divers_total = 0;
    this.divers.map((div) => (divers_total += div.montant));

    return divers_total + sup_total;
  }

  moyenneEffectif() {
    let effectif =
      this.totalMatinSum / this.totalMatin.length +
      this.totalMidiSum / this.totalMatin.length +
      this.totalSoirSum / this.totalMatin.length;
    let moyenne = effectif / 3;
    moyenne = Math.ceil(moyenne);
    return moyenne;
  }

  effectifTotal() {
    let effectif = this.totalMatinSum + this.totalMidiSum + this.totalSoirSum;
    return effectif;
  }
  print() {
    const data: {
      recette: number;
      depense: number;
      moyenne_effectif: number;
      effectif_total: number;
      mois: string;
      valMag: number;
    } = {
      recette: this.totalIncome(),
      depense: this.totalExpense(),
      moyenne_effectif: this.moyenneEffectif(),
      effectif_total: this.effectifTotal(),
      mois: this.monthLib,
      valMag: this.getLastdayMagValue(),
    };
    this.pdfService.printTest(data);
    this.router.navigate(['/monthly-list']);
  }

  sousTotal() {
    const sous_total =
      this.totalMatinSum * 400 +
      this.totalMidiSum * 1000 +
      this.totalSoirSum * 800;
    return sous_total;
  }

  averageByEffectif(effectif: number) {
    return Math.ceil(effectif / this.totalMatin.length);
  }

  getDayInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  getFirsdayMagValue() {
    var sum = 0;
    this.magasin.stock.map((item) => (sum += item.prix * item.quantite));
    return sum;
  }

  getGlobalExpense() {
    var expense = 0;
    this.magasin.stock.map((item) => (expense += item.appro * item.prix));
    return expense;
  }

  getLastdayMagValue() {
    var sum = 0;
    this.magasin.stock.map((item) => (sum += item.prix * item.balance));
    return sum;
  }

  orderFormsMinusDivers() {
    return this.getGlobalExpense() - this.totalDivers();
  }

  total1() {
    return this.orderFormsMinusDivers() + this.getFirsdayMagValue();
  }

  total2() {
    return this.total1() - this.getLastdayMagValue();
  }

  totalExpense() {
    return this.total2() + this.totalDivers();
  }

  totalIncome() {
    return this.sousTotal() + this.totalDivers();
  }
}

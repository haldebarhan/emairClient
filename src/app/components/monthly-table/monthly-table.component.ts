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

@Component({
  selector: 'app-monthly-table',
  standalone: true,
  imports: [CommonModule, NumberWithSpacesPipe],
  templateUrl: './monthly-table.component.html',
  styleUrl: './monthly-table.component.css',
})
export class MonthlyTableComponent implements OnInit {
  unites: any = [];
  reports: any = [];
  totalUnit: any = [];
  divers: any = [];
  surprimes: any = [];
  consoReport: any = [];
  surprimesList: any = [];
  montylyDate!: string;
  month!: number;
  year!: number;
  dayInMonth!: number;
  stock!: Stock[];
  monthLib: string = '';
  constructor(
    private uniteService: UniteService,
    private pdfService: PdfGeneratorService,
    private consoSerive: ConsoService,
    private diversService: DiversService,
    private surprimeSerice: SuprimesService,
    private magasinService: MagasinService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.dataService.data$.subscribe((value) => (this.montylyDate = value));
    const date = this.getCurrentMonthAndYear(this.montylyDate);
    this.month = date[0];
    this.year = date[1];
    this.dayInMonth = this.getDayInMonth(this.month, this.year);
    let monthName = search(this.month);
    this.monthLib = `${monthName} ${this.year}`;
    this.uniteService.getUnites().subscribe({
      next: (values) => {
        this.unites = values;
        this.consoSerive
          .findMonthlyConsumption(this.year, this.month)
          .subscribe({
            next: (value) => {
              this.consoReport = value;
              this.reports = this.getReport(value);
              this.totalUnit = this.TotalByUnit(this.reports);
              this.magasinService
              .finOneByDate(this.montylyDate)
              .subscribe({
                next: (value) => {
                  this.stock = value.stock;
                  this.diversService.filter(value.id.toString()).subscribe({
                    next: (value) => {
                      this.divers = value;
                      this.surprimeSerice.filter(this.year, this.month).subscribe({
                        next: (value) => {
                          this.surprimes = value;
                          this.surprimesList = this.getSurprimesData();
                        },
                        error: (err: HttpErrorResponse) => console.log(err),
                      });
                    },
                    error: (err) => console.log(err),
                  });
                },
                error: (err) => console.log(err),
              });
            
            },
            error: (err) => console.log(err),
          });
      },
      error: (err: HttpErrorResponse) => console.log(err),
    });
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
    this.router.navigate(['/monthly-list'])
  }

  getReport(reports: any) {
    let data: any = [];
    reports.map((report: any) => {
      const f = report.report.map((item: any) => {
        return {
          matin: item.petit_dejeuner,
          midi: item.dejeuner,
          soir: item.diner,
        };
      });
      data.push(f);
    });

    return data;
  }

  TotalByUnit(data: any) {
    const maxLength = Math.max(
      ...data.map((subArray: string | any[]) => subArray.length)
    );
    const totals = Array.from({ length: maxLength }, () => ({
      total_matin: 0,
      total_midi: 0,
      total_soir: 0,
    }));

    data.forEach((subArray: any[]) => {
      subArray.forEach((obj, index) => {
        totals[index].total_matin += obj.matin || 0;
        totals[index].total_midi += obj.midi || 0;
        totals[index].total_soir += obj.soir || 0;
      });
    });

    return totals;
  }

  TotalMatin(data: any) {
    let sum = 0;
    data.map((item: any) => {
      sum += item.matin;
    });
    return sum;
  }
  TotalMidi(data: any) {
    let sum = 0;
    data.map((item: any) => {
      sum += item.midi;
    });
    return sum;
  }
  TotalSoir(data: any) {
    let sum = 0;
    data.map((item: any) => {
      sum += item.soir;
    });

    return sum;
  }

  Totaux(matin: number, midi: number, soir: number) {
    let total: number = matin * 400 + midi * 1000 + soir * 800;
    return total;
  }

  recapMatin() {
    let total = 0;
    this.totalUnit.map((item: any) => {
      total += item.total_matin;
    });
    return total;
  }

  recapMidi() {
    let total = 0;
    this.totalUnit.map((item: any) => {
      total += item.total_midi;
    });
    return total;
  }

  recapSoir() {
    let total = 0;
    this.totalUnit.map((item: any) => {
      total += item.total_soir;
    });
    return total;
  }

  effectifTotal() {
    const moyenne =
      (this.recapMatin() + this.recapMidi() + this.recapSoir()) / 3;
    return Math.ceil(moyenne);
  }

  getSurprimesData() {
    let effectif = 0;
    const data = this.surprimes.map((item: any) => {
      const report = this.consoReport.find((cr: any) => cr.date == item.date);
      report.report.map((r: any) => (effectif += r.dejeuner));
      return { nom: item.nom, montant: item.montant, effectif: effectif };
    });

    return data;
  }

  sousTotal() {
    const sous_total =
      this.recapMatin() * 400 +
      this.recapMidi() * 1000 +
      this.recapSoir() * 800;
    return sous_total;
  }

  diversTotal() {
    let total = 0;
    this.divers.map((item: any) => {
      total += item.montant;
    });
    this.surprimesList.map(
      (surprime: any) => (total += this.surprimeMontant(surprime))
    );
    return total;
  }

  surprimeMontant(surprime: any) {
    return surprime.montant * surprime.effectif;
  }

  moyenneEffectif() {
    let effectif =
      this.recapMatin() / this.dayInMonth +
      this.recapMidi() / this.dayInMonth +
      this.recapSoir() / this.dayInMonth;
    let moyenne = effectif / 3;
    moyenne = Math.ceil(moyenne);
    return moyenne;
  }
  averageByEffectif(effectif: number) {
    return Math.ceil(effectif / this.dayInMonth);
  }
  getCurrentMonthAndYear(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return [month, year];
  }

  getDayInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
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

  getLastdayMagValue() {
    var sum = 0;
    this.stock.map((item) => (sum += item.prix * item.balance));
    return sum;
  }

  orderFormsMinusDivers() {
    return this.getGlobalExpense() - this.diversTotal();
  }

  total1() {
    return this.orderFormsMinusDivers() + this.getFirsdayMagValue();
  }

  total2() {
    return this.total1() - this.getLastdayMagValue();
  }

  totalExpense() {
    return this.total2() + this.diversTotal();
  }

  totalIncome() {
    return this.sousTotal() + this.diversTotal();
  }
}

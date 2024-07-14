import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UniteService } from '../unite/unite.service';
import { dateInMonthYearValidator } from '../../../shared/date-in-month-year.directive';
import { MagasinService } from '../../services/magasin.service';
import { search } from '../../../helpers/month.helper';
import { Rapport } from '../../models/rapport';
import { MenuService } from '../menu/menu.service';
import { getDayName } from '../../../helpers/getDayName';
import { ConsoService } from '../../services/conso.service';

@Component({
  selector: 'app-conso-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conso-report.component.html',
  styleUrl: './conso-report.component.css',
})
export class ConsoReportComponent implements OnInit {
  unites: any = [];
  monthData: any = [];
  message: string = '';
  menuData: any = [];
  reportForm: FormGroup = this.fb.group({
    date: new FormControl('', Validators.required),
    units: this.fb.array([]),
  });
  requiredYear: number[] = [];
  constructor(
    private readonly uniteService: UniteService,
    private fb: FormBuilder,
    private magService: MagasinService,
    private menuService: MenuService,
    private consoService: ConsoService
  ) {}
  ngOnInit(): void {
    this.uniteService.getUnites().subscribe({
      next: (value) => {
        this.unites = value;
        this.magService.findAll().subscribe({
          next: (values) => {
            this.monthData = values;
            this.requiredYear = this.getMonthAndYear(this.monthData.date);
            this.message = `${search(this.requiredYear[0])} ${
              this.requiredYear[1]
            }`;
            this.reportForm = this.fb.group({
              date: new FormControl('', [
                Validators.required,
                dateInMonthYearValidator(
                  this.requiredYear[0],
                  this.requiredYear[1]
                ),
              ]),
              units: this.fb.array([]),
            });
            this.initForm();
          },
          error: (err) => console.log(err),
        });
      },
      error: (err) => console.log(err),
    });
  }

  get unitsFormArray(): FormArray {
    return this.reportForm.get('units') as FormArray;
  }

  initForm() {
    this.unites.map((unit: any) => {
      this.unitsFormArray.push(
        this.fb.group({
          unite: new FormControl(unit.id),
          matin: new FormControl(0),
          midi: new FormControl(0),
          soir: new FormControl(0),
        })
      );
    });
  }
  Submit() {
    const values: { date: string; units: any[] } = { ...this.reportForm.value };
    const rapport = values.units.map((data) => {
      return {
        unite: data.unite,
        petit_dejeuner: data.matin,
        dejeuner: data.midi,
        diner: data.soir,
      };
    });
    const dayName = getDayName(new Date(values.date));
    this.menuService.findMenuByDayName(dayName).subscribe({
      next: (value: any) => {
        this.menuData = value
        const data: Rapport = {
          date: new Date(values.date),
          magasin: this.monthData.id,
          menu: this.menuData._id,
          report: rapport,
          transmit: false,
        }; 
        this.consoService.createConso(data).subscribe({
          next: (value) => console.log(value),
          error: (err) => console.log(err)
        })
        
      },
      error: (err) => console.log(err),
    });

  }

  getMonthAndYear(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return [month, year];
  }
}

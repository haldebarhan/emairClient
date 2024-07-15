import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MenuService } from '../menu/menu.service';
import { MagasinService } from '../../services/magasin.service';
import { ConsoService } from '../../services/conso.service';
import { UniteService } from '../unite/unite.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Rapport } from '../../models/rapport';
import { CommonModule } from '@angular/common';
import { getMonthAndYear } from '../../../helpers/monthAndYear';
import { dateInMonthYearValidator } from '../../../shared/date-in-month-year.directive';
import { getDayName } from '../../../helpers/getDayName';
import { Toast } from '../../../helpers/toast.helper';

@Component({
  selector: 'app-conso-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conso-edit.component.html',
  styleUrl: './conso-edit.component.css',
})
export class ConsoEditComponent implements OnInit {
  unites: any = [];
  consoId: string | null = null;
  monthData: any = [];
  reportForm: FormGroup;
  requiredYear: number[] = [];
  menuData: any = [];
  isSubit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private uniteService: UniteService,
    private route: ActivatedRoute,
    private consoService: ConsoService,
    private menuService: MenuService,
    private router: Router
  ) {
    this.reportForm = this.fb.group({
      date: new FormControl('', [Validators.required]),
      units: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.uniteService.getUnites().subscribe({
      next: (values) => {
        this.unites = values;
        this.route.paramMap.subscribe((param) => {
          this.consoId = param.get('id');
          if (this.consoId) {
            this.consoService.getConsoById(this.consoId).subscribe({
              next: (value) => {
                const { year, month } = getMonthAndYear(value.date);
                this.reportForm = this.fb.group({
                  date: new FormControl('', [
                    Validators.required,
                    dateInMonthYearValidator(month, year),
                  ]),
                  units: this.fb.array([]),
                });
                this.reportForm.patchValue({
                  date: this.formatDate(value.date),
                });
                this.initForm(value);
              },
              error: (err) => {},
            });
          }
        });
      },
      error: (err) => console.log(err),
    });
  }
  get unitsFormArray(): FormArray {
    return this.reportForm.get('units') as FormArray;
  }
  initForm(data: Rapport) {
    this.unites.map((unite: any) => {
      const reportData = data.report.find((item) => item.unite == unite.id);
      this.unitsFormArray.push(
        this.fb.group({
          unite: reportData?.unite,
          matin: reportData?.dejeuner,
          midi: reportData?.dejeuner,
          soir: reportData?.diner,
        })
      );
    });
  }
  Submit() {
    this.isSubit = true;
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
      next: (value) => {
        this.menuData = value;
        const data: Rapport = {
          date: new Date(values.date),
          magasin: this.monthData.id,
          menu: this.menuData._id,
          report: rapport,
          transmit: false,
        };
        this.consoService.updateConsoById(this.consoId!, data).subscribe({
          next: () => {
            Toast.fire({
              icon: 'success',
              title: 'Modification effectuée',
              didClose: () => {
                this.isSubit = false;
                this.router.navigate(['/']);
              },
            });
          },
          error: () => {
            Toast.fire({
              icon: 'error',
              title: 'Erreur rencontrée',
              didClose: ()=> this.isSubit = false
            })
          },
        });
      },
    });
  }

  formatDate(dateStr: Date): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

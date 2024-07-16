import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MagasinService } from '../../services/magasin.service';
import { dateInMonthYearValidator } from '../../../shared/date-in-month-year.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { SuprimesService } from '../../services/suprimes.service';
import { Toast } from '../../../helpers/toast.helper';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-surprimes-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './surprimes-form.component.html',
  styleUrl: './surprimes-form.component.css',
})
export class SurprimesFormComponent implements OnInit {
  supForm: FormGroup;
  isSubmit: boolean = false;
  headerLabel: string = 'Création';
  buttonLabel: string = 'Créer';
  surprimeId: string | null = null;
  constructor(
    private fb: FormBuilder,
    private magasinService: MagasinService,
    private route: ActivatedRoute,
    private suprimeService: SuprimesService,
    private router: Router
  ) {
    this.supForm = this.fb.group({
      date: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      montant: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.surprimeId = params.get('id');
      if (this.surprimeId) {
        this.suprimeService.getOne(this.surprimeId).subscribe({
          next: (data: any) => {
            this.magasinService.findAll().subscribe({
              next: (values) => {
                const { year, month } = this.getCurrentMonthAndYear(
                  values?.date!
                );
                this.supForm = this.fb.group({
                  date: new FormControl('', [
                    Validators.required,
                    dateInMonthYearValidator(month, year),
                  ]),
                  nom: new FormControl('', [Validators.required]),
                  montant: new FormControl('', [Validators.required]),
                });
                this.headerLabel = 'Modification'
                this.buttonLabel = "Modifier"
                this.supForm.patchValue({
                  date: this.formatDate(data.date),
                  montant: data.montant,
                  nom: data.nom
                })
              },
            });
          },
        });
      } else {
        this.initForm();
      }
    });
  }

  getCurrentMonthAndYear(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { year, month };
  }

  initForm() {
    this.magasinService.findAll().subscribe({
      next: (values) => {
        const { year, month } = this.getCurrentMonthAndYear(values?.date!);
        this.supForm = this.fb.group({
          date: new FormControl('', [
            Validators.required,
            dateInMonthYearValidator(month, year),
          ]),
          nom: new FormControl('', [Validators.required]),
          montant: new FormControl('', [Validators.required]),
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

  Submit(){
    this.isSubmit = true
    const date = new Date(this.supForm.value.date)
    const montant = this.supForm.value.montant
    const nom = this.supForm.value.nom
    if(this.surprimeId){
      this.suprimeService.update(this.surprimeId, {date, nom, montant}).subscribe({
        next: () => Toast.fire({
          icon: 'success',
          title: 'Surprime modifiée',
          didClose: ()=> this.router.navigate(['/'])
        }),
        error:(err: HttpErrorResponse) => console.log(err)
      })
    }else {
      this.suprimeService.create({date, nom, montant}).subscribe({
        next: () => Toast.fire({
          icon: 'success',
          title: 'Surprime enregistrée',
          didClose: ()=> this.router.navigate(['/'])
        }),
        error: (err: HttpErrorResponse) => console.log(err)
      })
    }
  }
}

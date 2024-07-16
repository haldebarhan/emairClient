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
import { ActivatedRoute, Router } from '@angular/router';
import { DiversService } from '../../services/divers.service';
import { Toast } from '../../../helpers/toast.helper';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-divers-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './divers-form.component.html',
  styleUrl: './divers-form.component.css',
})
export class DiversFormComponent implements OnInit {
  diversForm: FormGroup;
  isSubmit: boolean = false;
  headerLabel: string = 'Créer';
  buttonLabel: string = 'Créer'
  diversId: string | null = null;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private diversService: DiversService
  ) {
    this.diversForm = this.fb.group({
      libelle: new FormControl('', [Validators.required]),
      montant: new FormControl('', [Validators.required]),
      date: new FormControl(new Date()),
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.diversId = params.get('id');
      if (this.diversId) {
        this.diversService.findOne(this.diversId).subscribe({
          next: (value: any) => {
            this.buttonLabel = "Modifier"
            this.headerLabel = "Modification"
            this.diversForm.patchValue({
              libelle: value.libelle,
              montant: value.montant,
              date: value.date,
            });
          },
        });
      }
    });
  }

  Submit() {
    this.isSubmit = true
    const data = { ...this.diversForm.value };
    if (this.diversId) {
      this.diversService.update(this.diversId, data).subscribe({
        next: () => {
          Toast.fire({
            icon: 'success',
            title: 'Modifié',
            didClose: () => this.router.navigate(['/']),
          });
        },
        error: (err: HttpErrorResponse) => console.log(err),
      });
    } else {
      this.diversService.create(data).subscribe({
        next: () => {
          Toast.fire({
            icon: 'success',
            title: 'Enregistré',
            didClose: () => this.router.navigate(['/']),
          });
        },
        error: (err: HttpErrorResponse) => console.log(err),
      });
    }
  }
}

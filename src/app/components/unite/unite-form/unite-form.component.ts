import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UniteService } from '../unite.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Toast } from '../../../../helpers/toast.helper';

@Component({
  selector: 'app-unite-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './unite-form.component.html',
  styleUrl: './unite-form.component.css',
})
export class UniteFormComponent implements OnInit {
  unitId: string | null = null;
  unitForm: FormGroup;
  message: string = 'Nouvelle Unité';
  buttonLabel: string = 'Créer';
  isEdit: boolean = false;
  isSubmitted: boolean = false;
  constructor(
    private readonly uniteService: UniteService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.unitForm = this.fb.group({
      nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.unitId = params.get('id');
      if (this.unitId) {
        this.message = "Modifier l'unité";
        this.buttonLabel = 'Modifer';
        this.uniteService.getone(this.unitId).subscribe((response: any) => {
          this.unitForm.patchValue({
            nom: response.nom,
          });
        });
      }
    });
  }

  saveForm() {
    this.isSubmitted = true;
    const formData = { ...this.unitForm.value };
    if (this.unitId) {
      this.uniteService
        .updateUnite(this.unitId, formData)
        .subscribe((response: any) => {
          Toast.fire({
            icon: 'success',
            title: 'Modification réussie',
            didClose: () => {
              this.unitForm.reset();
              this.isSubmitted = false;
              this.router.navigate(['/unite']);
            },
          });
        });
    } else {
      this.uniteService.createUnite(formData).subscribe((response: any) => {
        Toast.fire({
          icon: 'success',
          title: `${response.nom} crée avec success`,
          didClose: () => {
            this.unitForm.reset();
            this.isSubmitted = false;
            this.router.navigate(['/unite']);
          },
        });
      });
    }
  }
}

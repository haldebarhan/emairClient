import { Component, OnInit } from '@angular/core';
import { DenreeService } from '../denree.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Denree } from '../../../models/denree';
import { Toast } from '../../../../helpers/toast.helper';
import { Sw } from '../../../../helpers/sw.helper';

@Component({
  selector: 'app-add-denree',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-denree.component.html',
  styleUrl: './add-denree.component.css',
})
export class AddDenreeComponent implements OnInit {
  mesures: any = [];
  denreeForm: FormGroup;
  isSubmited: boolean = false;
  conversionUnit: any = ['KG', 'LITRE', 'UNITE'];
  options: string[] = [];
  denreeId: string | null = null;
  message: string = 'Nouvelle denrée';
  buttonLabel: string = 'Créer';
  constructor(
    private readonly denreeService: DenreeService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.denreeForm = this.fb.group({
      denree: new FormControl('', [Validators.required]),
      mesure: new FormControl('', Validators.required),
      pu: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    this.getMesure();
    this.getConversionUinit();
    this.route.paramMap.subscribe((params) => {
      this.denreeId = params.get('id');
      if (this.denreeId) {
        this.message = 'Modifier la denrée';
        this.buttonLabel = 'Modifier';
        this.denreeService
          .getOneDenree(this.denreeId)
          .subscribe((response: any) => {
            this.denreeForm.patchValue({
              denree: response.product,
              mesure: response.mesure,
              pu: response.pu,
            });
          });
      }
    });
  }

  getMesure() {
    this.denreeService.getMesures().subscribe((response) => {
      this.mesures = response;
    });
  }

  getConversionUinit() {
    this.denreeService.getConversionUnit().subscribe((response) => {
      this.conversionUnit = response;
    });
  }

  saveForm() {
    this.isSubmited = true;
    const result = this.getSelectedMesureId(this.denreeForm.value.mesure);
    const denree: string = this.denreeForm.value.denree;
    const data: Denree = {
      produit: denree.toUpperCase(),
      mesure: result.id,
      pu: this.denreeForm.value.pu,
    };
    if (this.denreeId) {
      this.denreeService.updateDenree(this.denreeId, data).subscribe(() => {
        Toast.fire({
          icon: 'success',
          title: 'Modification effectuée',
          didClose: () => {
            this.denreeForm.reset();
            this.isSubmited = false;
            this.router.navigate(['/denree-list']);
          },
        });
      });
    } else {
      this.denreeService.createDenree(data).subscribe({
        next: () => {
          Toast.fire({
            icon: 'success',
            title: 'Enregistrement effectué',
            didClose: () => {
              this.denreeForm.reset();
              this.isSubmited = false;
              this.router.navigate(['/denree-list']);
            },
          });
        },
        error: () => {
          Sw.fire({
            title: 'Erreur',
            icon: 'error',
            text: "L'élement existe deja",
            didClose: () => (this.isSubmited = false),
          });
        },
      });
    }
  }

  getSelectedMesureId(selected: string) {
    const searchedMesure = this.mesures.find(
      (item: any) => item.mesure == selected
    );
    return searchedMesure;
  }

  getSelectedConversionUnitId(selected: string) {
    const find = this.conversionUnit.find((item: any) => item.uc == selected);
    return find;
  }
}

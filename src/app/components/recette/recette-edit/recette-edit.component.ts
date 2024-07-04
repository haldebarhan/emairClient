import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RecetteService } from '../../../recette/recette.service';
import { numericValidator } from '../../../../shared/number-validator.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { getOption } from '../../../../helpers/getOptions.helper';
import { recette } from '../../../models/recette';
import * as $ from 'jquery'

@Component({
  selector: 'app-recette-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recette-edit.component.html',
  styleUrl: './recette-edit.component.css',
})
export class RecetteEditComponent implements OnInit {
  form: FormGroup;
  ingForm: FormGroup;
  denrees: any = [];
  recettes: any[] = [];
  units: any[] = [];
  selectedUnit: string = '';
  isSubmit: boolean = false;
  dataId: string;
  isSubmitted = false;
  constructor(
    private readonly recetteService: RecetteService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nomRecette: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
    this.ingForm = this.fb.group({
      denree: new FormControl('', [Validators.required]),
      ration: new FormControl('', [Validators.required, numericValidator()]),
      mesure: new FormControl('', [Validators.required]),
    });

    this.dataId = this.route.snapshot.paramMap.get('id') ?? '';
    this.ingForm.get('denree')?.valueChanges.subscribe((selectedDenree) => {
      if (selectedDenree) {
        var options = getOption(selectedDenree.mesure);
        this.units = options;
      }
    });
  }
  ngOnInit(): void {
    this.loadData();
    this.getDenree();
  }

  loadData() {
    this.recetteService
      .getOneRecette(this.dataId)
      .subscribe((response: any) => {
        const ingredients = response.ingredients.map((ingredient: any) => {
          return {
            id: ingredient.denree._id,
            produit: ingredient.denree.produit,
            ration: ingredient.ration,
            mesure: ingredient.unite,
          };
        });
        this.form.patchValue({
          nomRecette: response.nom,
        });
        this.recettes = ingredients;
      });
  }
  saveForm() {
    this.isSubmit = true
    const nomRecette = this.form.value.nomRecette;
    const ingredients = this.recettes.map((ingredient) => {
      return {
        denree: ingredient.id,
        ration: ingredient.ration,
        unite: ingredient.mesure,
      };
    });
    const formData: recette = { nomRecette, ingredients };
    this.recetteService.updateRecette(this.dataId, formData).subscribe((response)=> {
      $.default('#alert').show();
      setTimeout(() => {
        $.default('#alert').hide();
      }, 3000);
      this.isSubmit = false;
      this.router.navigate(['/recette-list'])
    })
  }
  saveIngForm() {
    const formData = { ...this.ingForm.value };
    const formatted = {
      id: formData.denree.id,
      produit: formData.denree.product,
      ration: formData.ration,
      mesure: formData.mesure,
    };

    this.recettes.push(formatted);
    this.ingForm.reset();
  }
  removeIngredient(index: number) {
    this.recettes.splice(index, 1);
  }

  getDenree() {
    this.recetteService.getAllDenrees().subscribe((response: any) => {
      this.denrees = response;
    });
  }
}

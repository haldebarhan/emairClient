import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RecetteService } from './recette.service';
import { CommonModule } from '@angular/common';
import { getOption } from '../../helpers/getOptions.helper';
import { numericValidator } from '../../shared/number-validator.directive';
import { recette } from '../models/recette';
import * as $ from 'jquery';
@Component({
  selector: 'app-recette',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recette.component.html',
  styleUrl: './recette.component.css',
})
export class RecetteComponent implements OnInit {
  constructor(
    private readonly recetteService: RecetteService,
    private fb: FormBuilder
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

    this.ingForm.get('denree')?.valueChanges.subscribe((selectedDenree) => {
      if (selectedDenree) {
        var options = getOption(selectedDenree.mesure);
        this.units = options;
      }
    });
  }
  denrees: any = [];
  recettes: any[] = [];
  units: any[] = [];
  selectedUnit: string = '';
  form: FormGroup;
  ingForm: FormGroup;
  isSubmit: boolean = false;
  message: string = '';

  ngOnInit(): void {
    this.getDenree();
  }
  getDenree() {
    this.recetteService.getAllDenrees().subscribe((res) => {
      this.denrees = res;
    });
  }

  getSelectMesure(selected: any): string {
    const result = this.denrees.find((item: any) => item.product == selected);

    return result.mesure;
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
  saveForm() {
    this.isSubmit = true;
    const nomRecette = this.form.value.nomRecette;
    const ingredients = this.recettes.map((ingredient) => {
      return {
        denree: ingredient.id,
        ration: ingredient.ration,
        unite: ingredient.mesure,
      };
    });
    const formData: recette = { nomRecette, ingredients };

    this.recetteService.createRecette(formData).subscribe((res: any) => {
      $.default('#alert').show();
      setTimeout(() => {
        $.default('#alert').hide();
      }, 3000);
      this.recettes = [];
      this.form.reset();
      this.ingForm.reset();
      this.isSubmit = false;
    });
  }
}

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
import { map, startWith } from 'rxjs';
import { Toast } from '../../helpers/toast.helper';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recette',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recette.component.html',
  styleUrl: './recette.component.css',
})
export class RecetteComponent implements OnInit {
  denrees: any = [];
  recettes: any[] = [];
  units: any[] = [];
  selectedUnit: string = '';
  form: FormGroup;
  ingForm: FormGroup;
  queryField: FormControl = new FormControl('', [Validators.required]);
  filteredOptions: any[] = [];
  isSubmit: boolean = false;
  message: string = '';
  userHasTyped: boolean = false;

  constructor(
    private readonly recetteService: RecetteService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      nomRecette: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
    this.ingForm = this.fb.group({
      denree: this.queryField,
      ration: new FormControl('', [Validators.required, numericValidator()]),
      mesure: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getDenree();
    this.reaload();
  }
  getDenree() {
    this.recetteService.getAllDenrees().subscribe((res) => {
      this.denrees = res;
    });
  }

  getSelectMesure(selected: string): any {
    const result = this.denrees.find((item: any) => item.product == selected);
    return result;
  }

  saveIngForm() {
    const formData = { ...this.ingForm.value };
    const denree = this.getSelectMesure(formData.denree);

    const formatted = {
      id: denree.id,
      produit: formData.denree,
      ration: formData.ration,
      mesure: formData.mesure,
    };

    this.recettes.push(formatted);
    this.resetForm();
  }

  removeIngredient(index: number) {
    this.recettes.splice(index, 1);
  }
  saveForm() {
    this.isSubmit = true;
    const nomRecette: string = this.form.value.nomRecette;
    const ingredients = this.recettes.map((ingredient) => {
      return {
        denree: ingredient.id,
        ration: ingredient.ration,
        unite: ingredient.mesure,
      };
    });
    const formData: recette = {
      nomRecette: nomRecette.toUpperCase(),
      ingredients: ingredients,
    };
    this.recetteService.createRecette(formData).subscribe(() => {
      Toast.fire({
        icon: 'success',
        title: 'Enregistrement réussie',
        didClose: () => {
          this.recettes = [];
          this.form.reset();
          this.resetForm();
          this.isSubmit = false;
          this.router.navigate(['/recette-list']);
        },
      });
    });
  }

  onUserInput() {
    this.userHasTyped = true;
  }
  filter(query: string): any[] {
    return this.denrees.filter((option: any) =>
      option.product.toLowerCase().includes(query.toLowerCase())
    );
  }
  selectOption(option: string) {
    this.queryField.setValue(option);
    const denree = this.getSelectMesure(option);
    var options = getOption(denree.uc);
    this.units = options;
    this.filteredOptions = [];
  }

  reaload() {
    this.queryField.valueChanges
      .pipe(
        startWith(''),
        map((value) => this.filter(value))
      )
      .subscribe((filteredOptions) => (this.filteredOptions = filteredOptions));
  }

  resetForm() {
    this.queryField.setValue('');
    this.ingForm.get('ration')?.setValue('');
    this.ingForm.get('mesure')?.setValue('');
    this.userHasTyped = false;
  }
}

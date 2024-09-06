import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { map, startWith, Subject, takeUntil } from 'rxjs';
import { Toast } from '../../helpers/toast.helper';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetteType } from '../models/recette-type';
import { Denree } from '../models/denree';
export type cast = { id: string; libelle: string };
@Component({
  selector: 'app-recette',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recette.component.html',
  styleUrl: './recette.component.css',
})
export class RecetteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  denrees: Denree[] = [];
  recetteId: string | null = null;
  recettes: any[] = [];
  recetteType: RecetteType[] = [];
  libelle: string = '';
  title: string = 'Nouveau repas';
  buttonTitle: string = 'Créer';
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
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nomRecette: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      type: new FormControl('', [Validators.required]),
    });

    this.ingForm = this.fb.group({
      denree: this.queryField,
      ration: new FormControl('', [Validators.required, numericValidator()]),
    });
  }

  ngOnInit(): void {
    this.getDenree();
    this.reaload();
    this.getRecetteType();
    this.route.paramMap.subscribe((params) => {
      this.recetteId = params.get('id');
      if (this.recetteId) {
        this.recetteService
          .getOneRecette(this.recetteId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (value) => {
              this.title = 'Modifier le repas';
              this.buttonTitle = 'Modifier';
              let ingredients = value.ingredients;
              let finded = this.recetteType.find(
                (rt) => rt.libelle == value.type
              )!;
              ingredients.forEach((ingredient) => {
                const denree = this.getSelectMesure(ingredient.denree)!;
                const formatted = {
                  id: denree.id!,
                  produit: ingredient.denree,
                  ration: ingredient.ration,
                  mesure: denree.mesure,
                };
                this.recettes.push(formatted);
              });
              this.form.patchValue({
                nomRecette: value.nomRecette,
                type: finded._id,
              });
            },
          });
      }
    });
  }
  getDenree() {
    this.recetteService.getAllDenrees().subscribe({
      next: (denrees) => (this.denrees = denrees),
    });
  }

  getRecetteType() {
    this.recetteService
      .getRecetteTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => (this.recetteType = response),
      });
  }

  getSelectMesure(selected: string): Denree | undefined {
    const result = this.denrees.find((item: any) => item.product == selected);
    return result;
  }

  saveIngForm() {
    const formData = { ...this.ingForm.value };
    const denree = this.getSelectMesure(formData.denree)!;

    const formatted = {
      id: denree.id,
      produit: formData.denree,
      ration: formData.ration,
      mesure: denree.mesure,
    };

    this.recettes.push(formatted);
    this.resetForm();
  }

  removeIngredient(index: number) {
    this.recettes.splice(index, 1);
  }

  getOutput(item: {
    id: string;
    produit: string;
    ration: number;
    mesure: string;
  }) {
    let output = '';
    switch (item.mesure) {
      case 'KG':
        output = `${item.ration}g`;
        break;
      case 'LITRE':
        output = `${item.ration}ml`;
        break;
      default:
        output = `1/${item.ration}`;
    }
    return output;
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
      type: this.form.value.type,
    };
    if (this.recetteId) {
      this.recetteService.updateRecette(this.recetteId, formData).subscribe({
        next: () => {
          Toast.fire({
            icon: 'success',
            title: 'Modification réussie',
            didClose: () => {
              this.recettes = [];
              this.form.reset();
              this.resetForm();
              this.isSubmit = false;
              this.router.navigate(['/recette-list']);
            },
          });
        },
      });
    } else {
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
    const denree = this.getSelectMesure(option)!;
    this.libelle = getOption(denree);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

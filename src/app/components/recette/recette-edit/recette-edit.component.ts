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
import * as $ from 'jquery';
import { Toast } from '../../../../helpers/toast.helper';
import { map, startWith } from 'rxjs';

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
  queryField: FormControl = new FormControl('', [Validators.required]);
  filteredOptions: any[] = [];
  userHasTyped: boolean = false;
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
      denree: this.queryField,
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
    this.reaload()
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
    this.recetteService.updateRecette(this.dataId, formData).subscribe(() => {
      Toast.fire({
        icon: 'success',
        title: 'Modification réussie',
        didClose: () => {
          this.recettes = [];
          this.isSubmit = false;
          this.router.navigate(['/recette-list']);
        },
      });
    });
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
    this.resetForm()
  }
  removeIngredient(index: number) {
    this.recettes.splice(index, 1);
  }

  getDenree() {
    this.recetteService.getAllDenrees().subscribe((response: any) => {
      this.denrees = response;
    });
  }

  filter(query: string): any[] {
    return this.denrees.filter((option: any) =>
      option.product.toLowerCase().includes(query.toLowerCase())
    );
  }

  reaload() {
    this.queryField.valueChanges
      .pipe(
        startWith(''),
        map((value) => this.filter(value))
      )
      .subscribe((filteredOptions) => (this.filteredOptions = filteredOptions));
  }
  selectOption(option: string) {
    this.queryField.setValue(option);
    const denree = this.getSelectMesure(option);
    var options = getOption(denree.mesure);
    this.units = options;
    this.filteredOptions = [];
  }
  resetForm() {
    this.queryField.setValue('');
    this.ingForm.get('ration')?.setValue('');
    this.ingForm.get('mesure')?.setValue('');
    this.userHasTyped = false;
  }

  getSelectMesure(selected: string): any {
    const result = this.denrees.find((item: any) => item.product == selected);
    return result;
  }
  onUserInput() {
    this.userHasTyped = true;
  }
}

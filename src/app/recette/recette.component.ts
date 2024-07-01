import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
        // this.ingForm.get('mesure')?.setValue(options);
      }
    });
  }
  denrees: any = [];
  recettes: any = [];
  units: any[] = [];
  selectedUnit: string = '';
  form: FormGroup;
  ingForm: FormGroup;

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

  saveForm() {}
}

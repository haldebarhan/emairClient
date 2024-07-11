import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../menu.service';
import { RecetteService } from '../../../recette/recette.service';
import { AutoCompleteComponent } from '../../auto-complete/auto-complete.component';
import { Toast } from '../../../../helpers/toast.helper';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteComponent],
  templateUrl: './menu-form.component.html',
  styleUrl: './menu-form.component.css',
})
export class MenuFormComponent implements OnInit {
  menuForm: FormGroup;
  menuId: string | null = null;
  recettes: any = [];
  petit_dejeuner: FormControl = new FormControl('', [Validators.required]);
  hors_doeuvre: FormControl = new FormControl('', [Validators.required]);
  dejeuner: FormControl = new FormControl('', [Validators.required]);
  dessert: FormControl = new FormControl('', [Validators.required]);
  diner: FormControl = new FormControl('', [Validators.required]);
  isSumitted = false;
  message: string = 'Nouveau Menu';
  isEdit: boolean = false;
  submitLabel = 'Créer';
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private recetteService: RecetteService
  ) {
    this.menuForm = this.fb.group({
      jour: new FormControl('', [Validators.required]),
      petit_dejeuner: this.petit_dejeuner,
      hors_doeuvre: this.hors_doeuvre,
      dejeuner: this.dejeuner,
      dessert: this.dessert,
      diner: this.diner,
    });
  }
  ngOnInit(): void {
    this.loadRecettes();
    this.route.paramMap.subscribe((params) => {
      this.menuId = params.get('id');
      if (this.menuId) {
        this.isEdit = true;
        this.message = 'Modifier le menu';
        this.submitLabel = 'Modifier';
        this.menuService.getOne(this.menuId).subscribe((response: any) => {
          this.menuForm.patchValue({
            jour: response.jour,
          });
          this.petit_dejeuner.setValue(response.petit_dejeuner.nomRecette);
          this.hors_doeuvre.setValue(response.hors_doeuvre.nomRecette);
          this.dejeuner.setValue(response.dejeuner.nomRecette);
          this.dessert.setValue(response.dessert.nomRecette);
          this.diner.setValue(response.diner.nomRecette);
        });
      }
    });
  }

  loadRecettes() {
    this.recetteService.getAllRecette().subscribe((response: any) => {
      this.recettes = response;
    });
  }

  Submit() {
    this.isSumitted = true;
    const data = { ...this.menuForm.value };
    const formatedData: any = {};
    Object.keys(data).forEach((key) => {
      if (key === 'jour') return;
      formatedData[key] = this.findRecetteIdByName(data[key]);
    });
    formatedData['jour'] = this.menuForm.value.jour;
    if (this.menuId) {
      this.menuService.updateMenu(this.menuId, formatedData).subscribe(() => {
        Toast.fire({
          icon: 'success',
          title: 'Modification réussie',
          didClose: () => {
            this.isSumitted = false;
            this.router.navigate(['/menu-list']);
          },
        });
      });
    } else {
      this.menuService.createMenu(formatedData).subscribe(() => {
        Toast.fire({
          icon: 'success',
          title: 'Enregistrement réussie',
          didClose: () => {
            this.isSumitted = false;
            this.router.navigate(['/menu-list']);
          },
        });
      });
    }
  }
  getControl(controlName: string) {
    return this.menuForm.get(controlName);
  }

  onOptionSelected(option: any, controlName: string) {
    const exist = this.controlExists(controlName);
    if (exist) {
      this.menuForm.get(controlName)?.setValue(option._id);
    }
  }

  controlExists(controlName: string): boolean {
    return this.menuForm.get(controlName) !== null;
  }

  findRecetteIdByName(searched: string) {
    const result = this.recettes.find(
      (recette: any) => recette.nomRecette == searched
    );
    return result._id;
  }
}

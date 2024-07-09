import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DenreeService } from '../denree.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Denree } from '../../../models/denree';
import { Toast } from '../../../../helpers/toast.helper';

@Component({
  selector: 'app-edit-denree',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-denree.component.html',
  styleUrl: './edit-denree.component.css',
})
export class EditDenreeComponent implements OnInit {
  denreeForm: FormGroup;
  dataId: string;
  mesures: any = [];
  isSubmited: boolean = false;
  constructor(
    private fb: FormBuilder,
    private denreeService: DenreeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.denreeForm = this.fb.group({
      denree: new FormControl('', [Validators.required]),
      mesure: new FormControl('', [Validators.required]),
      uc: new FormControl('', [Validators.required]),
      equivalent: new FormControl('', [Validators.required]),
    });
    this.dataId = this.route.snapshot.paramMap.get('id') ?? '';
  }
  ngOnInit(): void {
    this.loadData();
  }
  saveForm() {
    this.isSubmited = true;
    const result = this.getSelectedMesureId(this.denreeForm.value.mesure);
    const denree = this.denreeForm.value.denree;
    const data: Denree = {
      produit: denree,
      mesure: result.id,
      uc: '',
      equivalence: 0,
      pu: 0,
      valeur: ''
    };
    this.denreeService.updateDenree(this.dataId, data).subscribe((response) => {
      Toast.fire({
        icon: 'success',
        title: 'Modification réussie',
        didClose: () => {
          this.isSubmited = false;
          this.router.navigate(['/denree-list']);
        },
      });
    });
  }
  loadData() {
    this.denreeService.getMesures().subscribe((data: any) => {
      this.mesures = data;
    });
    this.denreeService.getOneDenree(this.dataId).subscribe((data: any) => {
      this.denreeForm.patchValue({
        denree: data.produit,
        mesure: data.mesure.unite,
      });
    });
  }

  getSelectedMesureId(selected: string) {
    const searchedMesure = this.mesures.find(
      (item: any) => item.mesure == selected
    );
    return searchedMesure;
  }
}

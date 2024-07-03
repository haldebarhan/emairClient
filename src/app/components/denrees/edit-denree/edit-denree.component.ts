import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DenreeService } from '../denree.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Denree } from '../../../models/denree';

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
  constructor(
    private fb: FormBuilder,
    private denreeService: DenreeService,
    private route: ActivatedRoute
  ) {
    this.denreeForm = this.fb.group({
      denree: new FormControl('', [Validators.required]),
      mesure: new FormControl('', [Validators.required]),
    });
    this.dataId = this.route.snapshot.paramMap.get('id') ?? '';
  }
  ngOnInit(): void {
    this.loadData();
  }
  saveForm() {
    const result = this.getSelectedMesureId(this.denreeForm.value.mesure);
    const denree = this.denreeForm.value.denree;
    const data: Denree = { produit: denree, mesure: result.id };
    this.denreeService.updateDenree(this.dataId, data).subscribe((response)=> console.log(response))
  }
  loadData() {
    this.denreeService.getMesures().subscribe((data: any) => {
      this.mesures = data;
    });
    this.denreeService.getOneDenree(this.dataId).subscribe((data: any) => {
      this.denreeForm.patchValue({
        denree: data.produit,
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

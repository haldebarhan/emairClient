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
import { Denree } from '../../../models/denree';
import * as $ from 'jquery';

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
  constructor(
    private readonly denreeService: DenreeService,
    private fb: FormBuilder
  ) {
    this.denreeForm = this.fb.group({
      denree: new FormControl('', [Validators.required]),
      mesure: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    this.getMesure();
  }

  getMesure() {
    this.denreeService.getMesures().subscribe((response) => {
      this.mesures = response;
    });
  }

  saveForm() {
    const result = this.getSelectedMesureId(this.denreeForm.value.mesure);
    const denree = this.denreeForm.value.denree;
    const data: Denree = { produit: denree, mesure: result.id };
    this.denreeService.createDenree(data).subscribe((response) => {
      $.default('#alert').show();
      setTimeout(() => {
        $.default('#alert').hide();
      }, 3000);
      this.denreeForm.reset();
    });
  }

  getSelectedMesureId(selected: string) {
    const searchedMesure = this.mesures.find(
      (item: any) => item.mesure == selected
    );
    return searchedMesure;
  }
}

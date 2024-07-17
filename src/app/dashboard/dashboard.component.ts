import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MagasinService } from '../services/magasin.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Toast } from '../../helpers/toast.helper';
import { Sw } from '../../helpers/sw.helper';
import { DataViewComponent } from '../components/data-view/data-view.component';
import { Magasin } from '../models/magasin';
import { search } from '../../helpers/month.helper';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataViewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  confirm: boolean = false;
  isSubmit: boolean = false;
  magForm: FormGroup;
  dataCreated: boolean = false;
  monthData!: Magasin;
  message: string = '';
  constructor(
    private magService: MagasinService,
    private fb: FormBuilder,
    private router:Router
  ) {
    this.magForm = this.fb.group({
      date: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.reload();
  }

  dialog() {
    Sw.fire({
      title: 'Information',
      icon: 'info',
      text: 'Vous etes sur le point de créer le premier magasin du système. les denrées seront automatiquement enregistrés avec une quantité initiale de 0.',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "C'est parti!",
      cancelButtonText: 'Annuler',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirm = true;
      } else if (result.dismiss == Sw.DismissReason.cancel) {
        this.confirm = false;
      }
    });
  }

  save() {
    this.isSubmit = true;
    const date: string = this.magForm.value.date;
    const [year, month] = date.split('-');
    const data = { year, month };
    this.magService.create(data).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: 'Enregistrement effectué',
          didClose: () => this.reload(),
        });
      },
      error: (error) => console.log(error),
    });
  }

  isObjectEmpty(obj: Object | null | undefined): boolean {
    if (obj == null) {
      return true;
    }
    return Object.keys(obj).length === 0;
  }

  reload() {
    this.magService.findAll().subscribe({
      next: (data: Magasin | null) => {
        if (data != null) {
          this.monthData = data;
          this.getMonth(this.monthData.date);
          this.dataCreated = true;
        }
      },
      error: (err: any) => console.log(err),
    });
  }

  getMonth(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthName = search(month);
    this.message = `${monthName} ${year}`;
  }

  onCompleted(magasinId: any) {
    this.magService.nextMonth(magasinId, '').subscribe({
      next: () => window.location.reload(),
      error: (err: HttpErrorResponse) => console.log(err),
    });
  }
}

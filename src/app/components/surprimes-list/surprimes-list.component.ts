import { Component, OnInit } from '@angular/core';
import { MagasinService } from '../../services/magasin.service';
import { SuprimesService } from '../../services/suprimes.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Sw } from '../../../helpers/sw.helper';

@Component({
  selector: 'app-surprimes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './surprimes-list.component.html',
  styleUrl: './surprimes-list.component.css',
})
export class SurprimesListComponent implements OnInit {
  surprimes: any = [];
  constructor(
    private magService: MagasinService,
    private surprimeService: SuprimesService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadData();
  }

  getCurrentMonthAndYear(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { year, month };
  }

  loadData() {
    this.magService.findAll().subscribe({
      next: (values) => {
        const { year, month } = this.getCurrentMonthAndYear(values?.date!);
        this.surprimeService.filter(year, month).subscribe({
          next: (value) => (this.surprimes = value),
        });
      },
    });
  }
  newSurprime() {
    this.router.navigate(['/surprime-add']);
  }

  editSurprime(id: string) {
    this.router.navigate(['surprime-edit', id]);
  }

  delete(id: string) {
    Sw.fire({
      title: 'Etes-vous sure ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non',
      confirmButtonText: 'Oui, je confirme!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.surprimeService.delete(id).subscribe({
          next: () => {
            Sw.fire({
              title: 'Supprimé',
              icon: 'success',
              text: 'l surprime a bien été supprimé',
              timer: 1500,
              timerProgressBar: true,
              didClose: () => this.loadData(),
            });
          },
        });
      }
    });
  }

  formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const formatDate = date
      .toLocaleDateString('en-GB')
      .replace('/', '-')
      .replace('/', '-');
    return formatDate;
  }
}

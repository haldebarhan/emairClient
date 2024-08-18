import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MagasinService } from '../../services/magasin.service';
import { DiversService } from '../../services/divers.service';
import { Router } from '@angular/router';
import { Sw } from '../../../helpers/sw.helper';

@Component({
  selector: 'app-divers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './divers-list.component.html',
  styleUrl: './divers-list.component.css',
})
export class DiversListComponent implements OnInit {
  divers: any = []
  constructor(
    private magService: MagasinService,
    private diverService: DiversService,
    private router: Router 
  ) {}
  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.magService.findAll().subscribe({
      next: (values) => {
        if(values){
          this.diverService.filter(values.id).subscribe({
            next: (value) => (this.divers = value),
          });
        }
      },
    });
  }

  getCurrentMonthAndYear(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { year, month };
  }

  newDivers() {
    this.router.navigate(['/divers-add']);
  }

  editDivers(id: string) {
    this.router.navigate(['divers-edit', id]);
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
        this.diverService.delete(id).subscribe({
          next: () => {
            Sw.fire({
              title: 'Supprimé',
              icon: 'success',
              text: 'l\'élément a bien été supprimé',
              timer: 1500,
              timerProgressBar: true,
              didClose: () => this.loadData(),
            });
          },
        });
      }
    });
  }
}

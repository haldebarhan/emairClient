import { Component, OnInit } from '@angular/core';
import { RecetteService } from '../../recette/recette.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Sw } from '../../../helpers/sw.helper';

@Component({
  selector: 'app-recette-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recette-list.component.html',
  styleUrl: './recette-list.component.css',
})
export class RecetteListComponent implements OnInit {
  recettes: any = [];
  constructor(
    private readonly recetteService: RecetteService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getRecette();
  }

  getRecette() {
    this.recetteService.getAllRecette().subscribe((response) => {
      this.recettes = response;
    });
  }

  goToDetail(id: string) {
    this.router.navigate(['/recette-detail', id]);
  }

  goToEdit(id: string) {
    this.router.navigate(['/recette-edit', id]);
  }

  delete(id: string) {
      Sw.fire({
        title: 'Etes-vous sure ?',
        text: `vous allez supprimer la recette`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Non',
        confirmButtonText: 'Oui, je confirme!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.recetteService.deleteRecette(id)
          .subscribe(() => {
            Sw.fire({
              title: 'Supprimé',
              icon: 'success',
              text: 'La recette a bien été supprimée',
              timer: 1500,
              timerProgressBar: true,
              didClose: () => this.getRecette(),
            });
          });
          
        }
      });
  }
}

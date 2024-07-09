import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UniteService } from '../unite.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './unite.component.html',
  styleUrl: './unite.component.css',
})
export class UniteComponent implements OnInit {
  unites: any = [];
  newItem: boolean = false;
  constructor(
    private readonly uniteService: UniteService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.laodData();
  }

  laodData() {
    this.uniteService.getUnites().subscribe((response) => {
      this.unites = response;
    });
  }

  create() {
    this.newItem = true;
  }

  goToEdit(uniteId: string) {
    this.router.navigate(['/unite-edit', uniteId]);
  }

  delete(id: string) {
    const uniteName = this.getUniteById(id);
    Swal.fire({
      title: 'Etes-vous sure ?',
      text: `Vous allez supprimer ${uniteName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      allowEscapeKey: false,
      allowOutsideClick: false,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non',
      confirmButtonText: 'Oui, je confirme!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.uniteService.delete(id).subscribe((response) => {
          Swal.fire({
            title: 'Supprimé',
            text: `${uniteName} a été supprimé`,
            icon: 'success',
            allowEscapeKey: false,
            allowOutsideClick: false,
            timer: 1500,
            didClose: ()=> {
              this.laodData()
            }
          });
        });
      }
    });
  }

  getUniteById(id: string): string {
    const unite = this.unites.find((unite: any) => unite.id == id);
    return unite.nom;
  }
}

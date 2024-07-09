import { Component, OnInit, ViewChild } from '@angular/core';
import { DenreeService } from '../denree.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Sw } from '../../../../helpers/sw.helper';

export interface DataElement {
  id: string;
  product: string;
  mesure: string;
}

@Component({
  selector: 'app-denree-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './denree-list.component.html',
  styleUrl: './denree-list.component.css',
})
export class DenreeListComponent implements OnInit {
  denrees: DataElement[] = [];
  dataSource: DataElement[] = [];
  pageSize = 15;
  currentPage = 0;
  pages: number[] = [];
  pagedData: DataElement[] = [];
  constructor(private denreeService: DenreeService, private router: Router) {}
  ngOnInit(): void {
    this.getDenree();
  }

  getDenree() {
    this.denreeService.getAllDenree().subscribe((response: any) => {
      this.denrees = response;
      this.dataSource = response;
      this.setPage(0);
      this.pages = Array(Math.ceil(this.dataSource.length / this.pageSize))
        .fill(0)
        .map((x, i) => i);
    });
  }

  setPage(pageIndex: number) {
    this.currentPage = pageIndex;
    const startIndex = pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedData = this.dataSource.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.setPage(this.currentPage - 1);
    }
  }
  nextPage() {
    if (this.currentPage < this.pages.length - 1) {
      this.setPage(this.currentPage + 1);
    }
  }

  deleteDenree(data: DataElement) {
    Sw.fire({
      title: 'Etes-vous sure ?',
      text: `vous allez supprimer la denree ${data.product}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Non',
      confirmButtonText: 'Oui, je confirme!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.denreeService.deleteDenree(data.id).subscribe((response) => {
          Sw.fire({
            title: 'Supprimé',
            icon: 'success',
            text: `${data.product} a bien été supprimé`,
            timer: 1500,
            timerProgressBar: true,
            didClose: () => this.getDenree(),
          });
        });
      }
    });
  }

  edit(id: string) {
    this.router.navigate(['/denree-edit', id]);
  }
}

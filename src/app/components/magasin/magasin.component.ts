import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { PdfGeneratorService } from '../../services/pdf-generator.service';

@Component({
  selector: 'app-magasin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './magasin.component.html',
  styleUrl: './magasin.component.css',
})
export class MagasinComponent implements OnInit {
  data!: {
    produit: string;
    quantite: number;
    conso: number;
    appro: number;
    balance: number;
    prix: number;
  }[];
  constructor(private dataService: DataService, private pdfGeneratorService: PdfGeneratorService) {}
  ngOnInit(): void {
    this.dataService.data$.subscribe((data) => {
      this.data = data;
    });
  }

  generatePdf(){
    this.pdfGeneratorService.generateTrackingSheet(this.data)
  }
}

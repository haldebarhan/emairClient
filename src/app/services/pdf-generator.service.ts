import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { Stock } from '../models/stock';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  constructor() {}

  async generatePdfFromDiv(divId: string) {}

  generatePdfFromTable(tableId: string) {}

  generateTrackingSheet(stock: Stock[]) {
    const data = stock.map((item) => {
      return [
        item.produit,
        item.quantite,
        `(${item.conso})`,
        item.appro,
        item.balance,
      ];
    });
    const doc = new jsPDF();
    const styles = {
      cellStyles: { 1: { textColor: [255, 0, 0] } }
    };
    doc.text('Fiche de suivi', 10, 10);

    autoTable(doc, {
      head: [['Denrées', 'Existant (J1)', 'Conso', 'Appro', 'Balance']],
      body: data,
      theme: 'striped',
    });

    autoTable(doc, { html: '#impr' });

    doc.save('fiche-suivie.pdf');
  }
}

import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { Stock } from '../models/stock';
import { Article } from '../models/article';

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
        item.conso,
        item.appro,
        item.balance,
      ];
    });
    const doc = new jsPDF();
    const text = 'Fiche de suivi';
    const positionX = 105;
    const positionY = 10;
    doc.text(text, positionX, positionY, { align: 'center' });
    const textWidth = doc.getTextWidth(text);
    const underlineY = positionY + 1;
    doc.line(positionX, underlineY, positionX + textWidth, underlineY);

    autoTable(doc, {
      head: [['Denrées', 'Existant (J1)', 'Conso', 'Appro', 'Balance']],
      body: data,
      theme: 'striped',
    });

    autoTable(doc, { html: '#impr' });

    doc.save('fiche-suivie.pdf');
  }

  generateSupplySheet(articles: Article[]) {
    var total = 0;
    const data = articles.map((article) => {
      total += article.decompte;
      return [
        article.produit,
        article.quantite,
        article.um,
        `${article.pu} FCFA`,
        `${article.decompte} FCFA`,
      ];
    });
    const doc = new jsPDF();
    const date = this.formatDate();
    const text = "FICHE D'APPROVISIONNEMENT";
    const datePositionX = 105;
    const datePositionY = 10;
    const pageWith = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(text);
    const x = (pageWith - textWidth) / 2;
    const y = 25;
    const underlineY = y + 1;

    doc.text(text, datePositionX, y, {
      align: 'center',
    });
    doc.text(`Date: ${date}`, 195, datePositionY, { align: 'right' });
    doc.line(x, underlineY, x + textWidth, underlineY);
    autoTable(doc, {
      head: [['DENREES', 'QTE', 'U M', 'P U', 'DECOMPTE']],
      body: data,
      margin: { top: 30 },
      columnStyles: { 4: { halign: 'right', fontStyle: 'bold' } },
      foot: [['', '', '', 'Total', `${total} FCFA`]],
      footStyles: { halign: 'right', fontStyle: 'bold' },
      theme: 'grid',
      showFoot: 'lastPage',
      showHead: 'firstPage'
    });

    autoTable(doc, {
      html: '#impr',
    });

    doc.save('fiche-appro.pdf');
  }

  formatDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
}

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
    doc.line(positionX - 17, underlineY, textWidth + 88, underlineY);

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
    doc.setFontSize(10)
    doc.setFont('times', 'bold')
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
      showHead: 'firstPage',
    });

    autoTable(doc, {
      html: '#impr',
    });

    doc.save('fiche-appro.pdf');
  }

  generateDailySheet(data: any) {
    const pdf = this.getHeader();
    const date = new Date(data.date)
    const formatDate = date
    .toLocaleDateString('en-GB')
    .replace('/', '-')
    .replace('/', '-');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const Signature = 'CHEF CUISINIER' 
    const SignatureWidth = pdf.getTextWidth(Signature)
    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.text('PETIT DEJEUNER        EFF: '.concat(data.pdej_effect), 14, 65);
    pdf.setFont('times', 'normal');
    pdf.text(data.pdej, 14, 71);
    pdf.setFont('times', 'bold');
    pdf.text('DEJEUNER        EFF: '.concat(data.dej_effect), 14, 80);
    pdf.setFont('times', 'normal');
    pdf.text(data.hd, 14, 87);
    pdf.text(data.dej, 14, 94);
    pdf.text(data.des, 14, 101);
    pdf.setFont('times', 'bold');
    pdf.text('SORTIE SUPPLEMENTAIRE', pageWidth / 2 + 20, 65);
    pdf.setFont('times', 'bold');
    pdf.text('DINER     EFF: '.concat(data.din_effect), 14, 108);
    pdf.setFont('times', 'normal');
    pdf.text(data.din, 14, 114);
    pdf.text('Abidjan, le '.concat(formatDate), pageWidth / 2 + 60, 45)

    const denrees = data.sorties.map((item: any) => {
      return [
        item.produit,
        `${item.matin != 0 ? item.matin : '-'}`,
        `${item.soir != 0 ? item.soir : '-'}`,
        item.unite,
      ];
    });
    autoTable(pdf, {
      head: [['DESIGNATION', 'MATIN', 'SOIR', 'UM']],
      body: denrees,
      startY: 120,
      didDrawCell: (data) => {
        // Vérifiez si la cellule actuelle est la dernière cellule de la dernière ligne
        if (
          data.row.index === data.table.body.length - 1 &&
          data.column.index === 3
        ) {
          const pageHeight = pdf.internal.pageSize.height;
          const y = data.cell.y + data.cell.height + 10; // Position y après la table

          if (y + 20 > pageHeight) {
            // Ajouter une nouvelle page si le contenu additionnel ne rentre pas dans la page actuelle
            pdf.addPage();
            pdf.text(
              Signature,
              pageWidth / 2 - 10,
              20
            );
            pdf.line( pageWidth / 2 - 10, y+1, SignatureWidth + 80, y+1)
          } else {
            pdf.text(
              Signature,
              pageWidth / 2 - 10,
              y
            );
            pdf.line( pageWidth / 2 - 10, y+1, SignatureWidth + 80, y+1)
          }
        }
      },
    });

    pdf.save(`sortie journaliere ${formatDate}.pdf`);
  }

  formatDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  getHeader() {
    const pdf = new jsPDF();
    const imageUrl = '../assets/images/images.png';
    const rectText1 = "FORCES ARMEES DE COTE D'IVOIRE";
    const rectText2 = "ARMEE DE L'AIR";
    const rectText3 = "BASE AERIENNE D'ABIDJAN";
    const rightText1 = "REPUBLIQUE DE COTE D'IVOIRE";
    const rightText2 = 'Union - Discipline - Travail';
    const MainText = 'FICHE DE SORTIE JOURNALIERE';
    const rectText1Width = pdf.getTextWidth(rectText1);
    const rectText2Width = pdf.getTextWidth(rectText2);
    const rectText3Width = pdf.getTextWidth(rectText3);
    const MainTextWidth = pdf.getTextWidth(MainText);
    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(imageUrl, 'JPEG', pageWidth / 2 - 10, 10, 30, 30);
    pdf.rect(10, 12, 80, 25);
    pdf.setFont('times', 'normal');
    pdf.setFontSize(12);
    pdf.text(rectText1, 14, 20);
    pdf.setFont('times', 'bold');
    pdf.setFontSize(12);
    pdf.text(rectText2, 31, 26);
    pdf.setFont('times', 'normal');
    pdf.text(rectText3, 22, 32);
    pdf.line(14, 21, rectText1Width - 14, 21);
    pdf.line(31, 27, rectText2Width + 22, 27);
    pdf.line(22, 33, rectText3Width + 2, 33);
    pdf.setFont('times', 'bold');
    pdf.text(rightText1, pageWidth / 2 + 27, 17);
    pdf.setFont('times', 'bolditalic');
    pdf.text(rightText2, pageWidth / 2 + 38, 25, {});
    pdf.setFont('times', 'bold');
    pdf.setFontSize(15);
    pdf.text(MainText, pageWidth / 2 - 45, 55);
    pdf.setLineWidth(0.5);
    pdf.line(pageWidth / 2 - 45, 56, MainTextWidth + 57, 56, 'DF');

    return pdf;
  }
}

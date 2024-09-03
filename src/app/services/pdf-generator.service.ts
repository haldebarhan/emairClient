import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { Stock } from '../models/stock';
import { Article } from '../models/article';
import { spaceNumber } from '../../helpers/spaceNumber';
import { formatNumber } from '../../helpers/format-price';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  constructor() {}

  async printBooklet() {
    const pdf = new jsPDF({
      orientation: 'landscape',
    });

    const tableId = document.getElementById('monthly')!;
    html2canvas(tableId)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
      })
      .then(() => pdf.save('test2.pdf'));
  }

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

  generateSupplySheet(articles: Article[], date: string) {
    var total = 0;
    const data = articles.map((article) => {
      total += article.decompte;
      return [
        article.produit,
        formatNumber(article.quantite),
        article.um,
        `${formatNumber(article.pu)} FCFA`,
        `${formatNumber(article.decompte)} FCFA`,
      ];
    });
    const doc = new jsPDF();
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
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text(`Date: ${date}`, 195, datePositionY, { align: 'right' });
    doc.line(x, underlineY, x + textWidth, underlineY);
    autoTable(doc, {
      head: [['DENREES', 'QTE', 'U M', 'P U', 'DECOMPTE']],
      body: data,
      margin: { top: 30 },
      columnStyles: { 4: { halign: 'right', fontStyle: 'bold' } },
      foot: [['', '', '', 'Total', `${formatNumber(total)} FCFA`]],
      footStyles: { halign: 'right', fontStyle: 'bold' },
      theme: 'striped',
      showFoot: 'lastPage',
      showHead: 'firstPage',
    });

    doc.save('fiche-appro.pdf');
  }

  generateDailySheet(data: any) {
    const pdf = this.getHeader();
    const date = new Date(data.date);
    const formatDate = date
      .toLocaleDateString('en-GB')
      .replace('/', '-')
      .replace('/', '-');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const Signature = 'CHEF CUISINIER';
    const SignatureWidth = pdf.getTextWidth(Signature);
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
    pdf.text('Abidjan, le '.concat(formatDate), pageWidth / 2 + 60, 45);

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
            pdf.text(Signature, pageWidth / 2 - 10, 20);
            pdf.line(pageWidth / 2 - 10, y + 1, SignatureWidth + 80, y + 1);
          } else {
            pdf.text(Signature, pageWidth / 2 - 10, y);
            pdf.line(pageWidth / 2 - 10, y + 1, SignatureWidth + 80, y + 1);
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

  async GenerateFistPage(mois: string) {
    const pdf = new jsPDF({
      orientation: 'landscape',
    });

    pdf.addPage();
    pdf.setPage(2);
    let finalY: number | undefined = 0;
    autoTable(pdf, {
      html: '#recap',
      columnStyles: {
        0: { cellWidth: 70, halign: 'left', valign: 'middle' },
        1: { cellWidth: 20, halign: 'center', valign: 'middle' },
        2: { cellWidth: 20, halign: 'center', valign: 'middle' },
        3: { cellWidth: 30, halign: 'right', valign: 'middle' },
      },
      styles: {
        lineWidth: 0.1,
      },
      didDrawCell: (data) => {
        finalY = data.cursor?.y;
      },
    });

    let Tsign = "LE SOUS-OFFICIER D'ORDINAIRE";
    let Tsign1 = 'LE CSAF GFCA';
    let tsWidth1 = pdf.getTextWidth(Tsign1);
    let tsWidth = pdf.getTextWidth(Tsign);
    let pageWidth = pdf.internal.pageSize.getWidth();
    let xPos = pageWidth - tsWidth1 - 50;
    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.text(Tsign, 60, finalY + 20);
    pdf.line(60, finalY + 21, tsWidth + 28, finalY + 21);
    pdf.text(Tsign1, xPos, finalY + 20);
    pdf.line(xPos, finalY + 21, xPos + 26, finalY + 21);

    let lib1 = "Commandant de l'Unité administrative";
    let lib2 = 'La présente situation';
    let lib3 = 'A Abidjan, le';

    pdf.setFont('times', 'normal');
    pdf.setFontSize(12);
    pdf.text(lib1, xPos - 30, 20);
    pdf.text(lib2, xPos - 28, 27);
    pdf.text(lib3, xPos - 30, 33);

    pdf.setPage(1);
    const text1 = "FORCES ARMEES DE COTE D'IVOIRE";
    const text2 = "ARMEE DE L'AIR";
    const text3 = "BASE AERIENNE D'ABIDJAN";
    const text = 'SITUATION ADMINISTRATIVE';
    const month = `${mois.toUpperCase()}`;
    const datePlace = 'DATE  :';

    const text1Width = pdf.getTextWidth(text1);
    const text2Width = pdf.getTextWidth(text2);
    const text3Width = pdf.getTextWidth(text3);
    const textWidth = pdf.getTextWidth(text);
    let textPos = pageWidth - textWidth - 129;

    pdf.setFont('times', 'bold');
    pdf.setFontSize(11);
    pdf.text(text1, 15, 18);
    pdf.text(text2, 34, 25);
    pdf.text(text3, 24, 32);
    pdf.text(text, 110, 38);
    pdf.setFontSize(10);
    pdf.text(datePlace, 240, 40);
    pdf.text(month, 130, 44);

    pdf.line(15, 19, text1Width + 14, 19);
    pdf.line(34, 26, text2Width + 34, 26);
    pdf.line(24, 33, text3Width + 22, 33);
    pdf.line(textPos, 39, textWidth + textPos, 39);

    const tableId = document.getElementById('table');
    html2canvas(tableId!)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 10, 47, pdfWidth - 15, pdfHeight + 10);
      })
      .then(() => pdf.save('situation administrative.pdf'));
  }

  async GenerateSecondPage(data: {
    recette: number;
    depense: number;
    moyenne_effectif: number;
    effectif_total: number;
    mois: string;
    valMag: number;
  }) {
    const pdf = new jsPDF({
      orientation: 'landscape',
    });

    let pageWidth = pdf.internal.pageSize.getWidth();

    const libelle = 'SITUATION MENSUELLE DE GESTION';
    const libWidth = pdf.getTextWidth(libelle);
    const monthLib = 'MOIS DE :';
    const unitLib = 'UNITE :';
    pdf.setFont('times', 'bold');
    const libPos = pageWidth - libWidth - 100;

    pdf.text(libelle, libPos, 15);
    pdf.line(libPos, 16, libPos + libWidth + 2, 16);
    pdf.setFontSize(10);
    pdf.text(monthLib, 15, 28);
    pdf.text(data.mois.toUpperCase(), 40, 28);
    pdf.text(unitLib, libPos + 50, 28);
    pdf.setFontSize(11);
    const numb = 'V - ';
    const sum = ' Résumé de la gestion';
    const sumWidth = pdf.getTextWidth(sum);
    const table = document.getElementById('c34');
    html2canvas(table!)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight - 10);
        pdf.text(numb, 15, pdfHeight + 25);
        pdf.text(sum, 20, pdfHeight + 25);
        pdf.line(20, pdfHeight + 26, 20 + sumWidth, pdfHeight + 26);
        pdf.setFont('times', 'normal');
        pdf.text('Recettes journalières par homme', 15, pdfHeight + 35);
        pdf.setFont('times', 'bold');
        pdf.text(`${spaceNumber(data.recette)} F`, 80, pdfHeight + 31);
        pdf.line(70, pdfHeight + 33, 110, pdfHeight + 33);
        pdf.text(`${spaceNumber(data.effectif_total)}`, 85, pdfHeight + 37);
        pdf.text('=', 113, pdfHeight + 34);
        pdf.text(
          `${spaceNumber(
            this.dailyIncomePerPerson(data.recette, data.effectif_total)
          )} F`,
          120,
          pdfHeight + 34
        );
        pdf.setFont('times', 'normal');
        pdf.text('Dépenses journalières par homme', 160, pdfHeight + 35);
        pdf.setFont('times', 'bold');
        const depPos = pageWidth - 80;
        pdf.text(`${spaceNumber(data.depense)} F`, depPos + 5, pdfHeight + 31);
        pdf.line(depPos, pdfHeight + 33, depPos + 35, pdfHeight + 33);
        pdf.text(
          `${spaceNumber(data.effectif_total)}`,
          depPos + 10,
          pdfHeight + 37
        );
        pdf.text('=', depPos + 37, pdfHeight + 34);
        pdf.text(
          `${spaceNumber(
            this.dailyIncomePerPerson(data.depense, data.effectif_total)
          )} F`,
          depPos + 40,
          pdfHeight + 34
        );

        pdf.text('DIVERS: ', 15, pdfHeight + 50);
        pdf.setFont('times', 'normal');
        pdf.text(
          ' Nombre de journées de vivre en magasin au dernier jour du mois',
          32,
          pdfHeight + 50
        );
        pdf.setFont('times', 'bold');
        pdf.text("LE SOUS-OFFICIER D'ORDINAIRE", depPos - 15, pdfHeight + 50);
        pdf.text(`${spaceNumber(data.valMag)}`, 50, pdfHeight + 60);
        pdf.line(30, pdfHeight + 62, 90, pdfHeight + 62);
        pdf.text(
          `${data.moyenne_effectif} x ${spaceNumber(2200)} F`,
          50,
          pdfHeight + 67
        );
        pdf.text('=', 92, pdfHeight + 63);
        pdf.text(
          `${this.remainingFoodInMag(
            data.valMag,
            2200,
            data.moyenne_effectif
          )} Jour (s)`,
          100,
          pdfHeight + 63
        );
        pdf.text(
          `${this.getBoni(data.recette, data.depense)} %`,
          115,
          pdfHeight + 24
        );
      })
      .then(() => pdf.save(`situation mensuelle ${data.mois}.pdf`));
  }

  dailyIncomePerPerson(income: number, persNumber: number): number {
    const personIncome = income / persNumber;
    return Math.ceil(personIncome);
  }

  remainingFoodInMag(
    lastDayMagValue: number,
    totalExpenseByPerson: number,
    average: number
  ): string {
    const num = lastDayMagValue / (average * totalExpenseByPerson);
    let roundedNumber = Math.round((num + Number.EPSILON) * 100) / 100;
    let stringNumber = roundedNumber.toString();
    return stringNumber.replace('.', ',');
  }

  getBoni(income: number, expense: number): string {
    let boni = income - expense;
    let boniPercent = (boni / income) * 100;
    let roundedNumber = Math.round((boniPercent + Number.EPSILON) * 100) / 100;
    let stringNumber = roundedNumber.toString();
    return stringNumber.replace('.', ',');
  }
}

import jsPDF from "jspdf";
import "jspdf-autotable";
import Moment from 'moment';

// define a generatePDF function that accepts a tickets argument
const generateTransfusionPDF = (transfusions, poruka) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setFillColor(135, 124,45,0);

  const tableColumn = ["Datum objave potrebne transfuzije", "Potrebna krvna grupa", "Mjesto potrebne transfuzije", "Kolicina potrebnih doza"];
  const tableRows = [];

  transfusions.forEach(t => {
    var type=t.user.typeOfBlood.rhFactor ? '+':'-';
    const donationData = [
    Moment(t.publishingDate).format('DD-MM-YYYY'),
    t.user.typeOfBlood.bloodType + type,
    t.placeOfNeededDonation,
    t.bloodQuantityNeeded
    ];
    tableRows.push(donationData);
  });


  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  const date = Date().split(" ");
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  doc.text(poruka, 14, 15);
  doc.save(`report_transfusions_${dateStr}.pdf`);
};

export default generateTransfusionPDF;
import jsPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call
import Moment from 'moment';

// define a generatePDF function that accepts a tickets argument
const generateDonationsPDF = (donations, poruka) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setFillColor(135, 124,45,0);

  const tableColumn = ["Datum donacije", "Donator", "Primalac", "Mjesto donacije", "Kolicina doniranih doza"];
  const tableRows = [];

  // for each ticket pass all its data into an array
  donations.forEach(d => {
    var type=d.user.typeOfBlood.rhFactor ? '+':'-';
    var rh=d.receiver.typeOfBlood.rhFactor ? '+':'-'
    const donationData = [
    Moment(d.donationDate).format('DD-MM-YYYY'),
    d.user.firstname + " " + d.user.lastname+"\n Krvna grupa:" + d.user.typeOfBlood.bloodType + type,
    d.receiver.firstname + " " + d.receiver.lastname + "\n Krvna grupa:" + d.receiver.typeOfBlood.bloodType +rh,
    d.donationPlace,
    d.bloodQuantity,
    ];
    tableRows.push(donationData);
  });

  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  const date = Date().split(" ");
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  doc.text(poruka, 14, 15);
  doc.save(`report_donations_${dateStr}.pdf`);
};

export default generateDonationsPDF;
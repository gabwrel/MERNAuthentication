

export const generatePDF = () => {
    const input = document.getElementById('employeeTable');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, heightLeft - imgHeight, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('employee_list.pdf');
    });
  };

export function PitoyNiOwie({uroy}){
  return <>
    {uroy}
  </>
};
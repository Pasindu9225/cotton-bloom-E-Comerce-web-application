// components/DownloadReportButton.tsx
"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DownloadReportButtonProps {
    data: {
        totalSales: number;
        totalOrders: number;
        totalCustomers: number;
    };
}

export default function DownloadReportButton({ data }: DownloadReportButtonProps) {

    const generatePDF = () => {
        // 1. Create a new PDF document
        const doc = new jsPDF();

        // 2. Add Title
        doc.setFontSize(20);
        doc.text("Cotton Bloom - Admin Report", 14, 22);

        // 3. Add Timestamp
        doc.setFontSize(11);
        doc.setTextColor(100);
        const date = new Date().toLocaleString();
        doc.text(`Generated on: ${date}`, 14, 30);

        // 4. Create the Data Table
        autoTable(doc, {
            startY: 40,
            head: [['Metric', 'Value']],
            body: [
                ['Total Sales', `$${data.totalSales.toFixed(2)}`],
                ['Total Orders', data.totalOrders.toString()],
                ['Total Customers', data.totalCustomers.toString()],
                ['Conversion Rate', '3.4% (Calculated)'], // Example static data
            ],
            styles: { fontSize: 12 },
            headStyles: { fillColor: [0, 0, 0] }, // Black header
        });

        // 5. Save the file
        doc.save(`cotton-bloom-report-${Date.now()}.pdf`);
    };

    return (
        <button
            onClick={generatePDF}
            className="rounded-md bg-black dark:bg-white px-6 py-2.5 text-sm font-semibold text-white dark:text-black hover:opacity-90 transition-opacity"
        >
            Download Report
        </button>
    );
}
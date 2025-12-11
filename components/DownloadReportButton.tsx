// components/DownloadReportButton.tsx
"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportData {
    stats: { totalSales: number; totalOrders: number; totalCustomers: number };
    revenueData: { date: string; total: number }[];
    statusData: { name: string; value: number }[];
    topProducts: { name: string; sales: number }[];
}

export default function DownloadReportButton({ data }: { data: ReportData }) {

    const generatePDF = () => {
        const doc = new jsPDF();

        // 1. Header
        doc.setFontSize(20);
        doc.text("Cotton Bloom - Executive Report", 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        // 2. Summary Table
        autoTable(doc, {
            startY: 40,
            head: [['Key Metric', 'Value']],
            body: [
                ['Total Revenue', `$${data.stats.totalSales.toFixed(2)}`],
                ['Total Orders', data.stats.totalOrders.toString()],
                ['Total Customers', data.stats.totalCustomers.toString()],
            ],
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0] },
        });

        // 3. Top Products Table (Represents the Top 5 Chart)
        doc.text("Top Selling Products", 14, (doc as any).lastAutoTable.finalY + 10);

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 15,
            head: [['Product Name', 'Units Sold']],
            body: data.topProducts.map(p => [p.name, p.sales.toString()]),
            theme: 'striped',
        });

        // 4. Order Status Breakdown (Represents the Pie Chart)
        doc.text("Order Status Breakdown", 14, (doc as any).lastAutoTable.finalY + 10);

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 15,
            head: [['Status', 'Count']],
            body: data.statusData.map(s => [s.name, s.value.toString()]),
            theme: 'striped',
        });

        // 5. Recent Revenue (Represents the Bar Chart)
        doc.text("Recent Revenue Trends", 14, (doc as any).lastAutoTable.finalY + 10);

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 15,
            head: [['Date', 'Revenue']],
            body: data.revenueData.map(r => [r.date, `$${r.total.toFixed(2)}`]),
        });

        doc.save(`cotton-bloom-full-report-${Date.now()}.pdf`);
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
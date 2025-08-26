import { Component, OnInit } from '@angular/core';
import {
  Chart,
  PieController,
  BarController,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { ChartssService } from '../chartsservice/chartss.service';

// Register required Chart.js components
Chart.register(
  PieController,
  BarController,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
  constructor(private chardata: ChartssService) {}

  ngOnInit(): void {
    this.chardata.getChartData().subscribe((res: any) => {
      const yearData = this.processChartData(res);
      this.showdata(
        yearData.years,
        yearData.totals,
        yearData.colors,
        yearData.borderColors
      );
    });
  }

  private processChartData(res: any): {
    years: string[];
    totals: number[];
    colors: string[];
    borderColors: string[];
  } {
    const yearMap: { [year: string]: number } = {};

    // ✅ Loop through each order
    res.order?.forEach((order: any) => {
      // ✅ Loop through each product
      order.products?.forEach((product: any) => {
        const dateStr = product.order_date || order.date;
        if (!dateStr) return;

        const date = this.parseDate(dateStr);
        if (!date) return;

        const year = date.getFullYear();

        const shared = parseFloat(product.total) || 0;
        const privateTransfer = parseFloat(product.privatetransferprice) || 0;
        const combined = shared + privateTransfer;

        yearMap[year] = (yearMap[year] || 0) + combined;
      });
    });

    // 🔥 Get all years sorted (as string array)
    let allYears = Object.keys(yearMap)
      .map((y) => Number(y))
      .sort((a, b) => a - b);

    // 🔥 Keep only the last 5 years
    if (allYears.length > 5) {
      allYears = allYears.slice(allYears.length - 5); // last 5 years only
    }

    const years = allYears.map((y) => y.toString());
    const totals = allYears.map((year) => yearMap[year]);

    const backgroundColors = years.map((_, i) =>
      i % 2 === 0 ? 'rgba(15, 30, 239, 0.6)' : 'rgba(15, 239, 59, 0.6)'
    );
    const borderColors = years.map((_, i) =>
      i % 2 === 0 ? 'rgba(15, 30, 239, 1)' : 'rgba(15, 239, 59, 1)'
    );

    return { years, totals, colors: backgroundColors, borderColors };
  }

  private parseDate(dateStr: string): Date | null {
    try {
      // Handle dd/MM/yyyy format
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
      }
      // Fallback to ISO or other valid formats
      return new Date(dateStr);
    } catch (e) {
      return null;
    }
  }

  showdata(
    years: string[],
    totals: number[],
    colors: string[],
    borderColors: string[]
  ) {
    // Destroy existing charts if already rendered
    Chart.getChart('mychart')?.destroy();
    Chart.getChart('barchart')?.destroy();

    // ✅ Pie Chart
    new Chart('mychart', {
      type: 'pie',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Total Revenue (PKR)',
            data: totals,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => `PKR ${context.raw?.toLocaleString()}`,
            },
          },
        },
      },
    });

    // ✅ Bar Chart
    new Chart('barchart', {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Total Revenue (PKR)',
            data: totals,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `PKR ${value}`,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `PKR ${context.raw?.toLocaleString()}`,
            },
          },
        },
      },
    });
  }
}

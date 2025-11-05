import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule]
})
export class Dashboard implements OnInit {
  totalUsers: number = 0;
  totalRole: number = 0;
  insightsData: any[] = [];
  chart: Chart | null = null;

  // Reference to the canvas element in HTML
  @ViewChild('insightsChart') insightsChart!: ElementRef<HTMLCanvasElement>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Fetch dashboard data from backend
    this.dashboardService.getDetails().subscribe({
      next: (res: any) => {
        this.totalRole = res.totalRoles;
        this.totalUsers = res.totalUsers;
        this.insightsData = res.dashboardInsights || [];

        console.log('✅ Dashboard data:', this.insightsData);

        // Wait for DOM to update, then render chart
        setTimeout(() => this.renderChart(), 100);
      },
      error: (err) => {
        console.error('Error fetching dashboard details:', err);
      }
    });
  }

  renderChart(): void {
    // Check if canvas is available
    if (!this.insightsChart) {
      console.warn('Canvas not yet available.');
      return;
    }

    // Check if data exists
    if (!this.insightsData || this.insightsData.length === 0) {
      console.warn(' No insights data available.');
      return;
    }

    // Group data by 'Type' and sum up activity counts
    const grouped = this.insightsData.reduce((acc: any, curr: any) => {
      if (!acc[curr.type]) acc[curr.type] = 0;
      acc[curr.type] += curr.activityCount;
      return acc;
    }, {});

    const labels: string[] = Object.keys(grouped);
    const values: number[] = Object.values(grouped).map(v => Number(v)); 

    // Destroy previous chart (if exists)
    if (this.chart) this.chart.destroy();

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Activity Count by Type',
            data: values,
            backgroundColor: [
              '#6a11cb',
              '#2575fc',
              '#36a2eb',
              '#4bc0c0',
              '#9966ff',
              '#ff6384'
            ],
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
           
            labels: {
              font: { size: 14 }
            }
           
          },
          title: {
            display: true,
           
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Activity Count' }
          },
          x: {
            title: { display: true, text: 'Activity Type' },
            ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 }
          }
        }
      }
    };

    const ctx = this.insightsChart.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, config);
      console.log('Chart rendered successfully.');
    } else {
      console.error(' Failed to get canvas context.');
    }
  }
}

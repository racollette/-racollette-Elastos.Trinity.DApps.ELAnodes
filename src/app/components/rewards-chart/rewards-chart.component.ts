import { Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ModalController, NavController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as moment from 'moment';

@Component({
  selector: 'rewards-chart',
  templateUrl: './rewards-chart.component.html',
  styleUrls: ['./rewards-chart.component.scss'],
})
export class RewardsChartComponent implements OnInit {

  @Input() historyChartData: any;
  @Input() historyChartLabels: any;
  @Input() firstPayout: string;
  @Input() totalEarned: number;
  @Input() totalPayouts: number;
  @Input() weekEarn: string;
  @Input() weekARR: string;
  @Input() monthEarn: string;
  @Input() monthARR: string;
  @Input() perNodeEarningsObject: any;


  @ViewChild('historyChart', { static: false }) historyCanvas;
  @ViewChild('perNodeEarningsChart', { static: false }) perNodeEarningsCanvas;

  constructor(
    private modalCtrl: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  lineChart: any;
  horizontalBar: any;
  public context: CanvasRenderingContext2D;

  data = []
  public gradient: any;

  public time = Date.now() / 1000
  public month = 2628000
  baseColor: string = '#000'
  activateColor: string = 'rgb(51, 204, 255, 0.7)'
  color1M = this.baseColor
  color6M = this.baseColor
  color1Y = this.baseColor
  colorAll = this.activateColor

  public historyChartLabelsAll: any;
  public historyChartDataAll: any;

  ionViewDidEnter() {
    this.gradient = this.historyCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 260);
    this.gradient.addColorStop(1, "rgb(0, 0, 0, 0.4)")
    this.gradient.addColorStop(0, "rgb(0, 150, 171, 0.4)")

    this.historyChartLabelsAll = this.historyChartLabels.map(function(e) { return moment.unix(e).format('LL') });
    this.historyChartDataAll = this.historyChartData.map(function(e) { return e.toFixed(4) });

    this.lineChartMethod(this.historyChartLabelsAll, this.historyChartDataAll, this.gradient);
    this.horizontalBarMethod();
  }

  public toggleColor(button) {
    this.color1M = this.baseColor
    this.color6M = this.baseColor
    this.color1Y = this.baseColor
    this.colorAll = this.baseColor

    if (button == '1M') {
      this.color1M = this.activateColor
    }
    if (button == '6M') {
      this.color6M = this.activateColor
    }
    if (button == '1Y') {
      this.color1Y = this.activateColor
    }
    if (button == 'All') {
      this.colorAll = this.activateColor
    }
  }

  public switch1M() {
    this.toggleColor('1M');
    let labels = this.historyChartLabels
    let historyLabels1M = []
    let historyData1M = []
    let formatData1M = []

    for (let i = 0; i < labels.length; i++) {
      if (labels[i] > (this.time - this.month * 1)) {
        historyLabels1M.push(moment.unix(labels[i]).format('LL'))
      }
    }

    this.data = this.historyChartData
    historyData1M = this.data.slice(-1 * historyLabels1M.length)
    formatData1M = historyData1M.map(function(e) { return e.toFixed(4) })
    
    this.lineChartMethod(historyLabels1M, formatData1M, this.gradient);
  }

  public switch6M() {
    this.toggleColor('6M');
    let labels = this.historyChartLabels
    let historyLabels6M = []
    let historyData6M = []
    let formatData6M = []

    for (let i = 0; i < labels.length; i++) {
      if (labels[i] > (this.time - this.month * 6)) {
        historyLabels6M.push(moment.unix(labels[i]).format('LL'))
      }
    }

    this.data = this.historyChartData
    historyData6M = this.data.slice(-1 * historyLabels6M.length)
    formatData6M = historyData6M.map(function(e) { return e.toFixed(4) })
    
    this.lineChartMethod(historyLabels6M, formatData6M, this.gradient);
  }

  public switch1Y() {
    this.toggleColor('1Y');
    this.lineChartMethod(this.historyChartLabelsAll, this.historyChartDataAll, this.gradient);
  }

  public switchAll() {
    this.toggleColor('All');
    this.lineChartMethod(this.historyChartLabelsAll, this.historyChartDataAll, this.gradient);
  }


  lineChartMethod(labels, data, gradient) {

    Chart.defaults.global.defaultFontColor = '#fff';
    this.lineChart = new Chart(this.historyCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            fill: true,
            backgroundColor: gradient,
            borderColor: 'rgb(51, 204, 255)',
            borderWidth: 0.4,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            pointRadius: 0.39,
            pointHitRadius: 5,
            datalabels: {
              display: false
            }
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 6
            }
          }],
          xAxes: [{
            type: 'time',
            distribution: 'linear',
            ticks: {
              maxTicksLimit: 4,
              maxRotation: 0,
              minRotation: 0,
            }
          }],
        },
      }
    });
  }

  horizontalBarMethod() {

    let nodeLabels = this.perNodeEarningsObject.map(function(d) { return d.Name });
    let earningData = this.perNodeEarningsObject.map(function(d) { return d.Earnings });

    let colorOptions = ['#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c']

    let colorLabels = []
    for (let i = 0; i < nodeLabels.length; i++) {
      colorLabels.push(colorOptions[i])
    }

    this.perNodeEarningsCanvas.nativeElement.height = nodeLabels.length * 16 + 40

    this.horizontalBar = new Chart(this.perNodeEarningsCanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: nodeLabels,
        datasets: [{
          data: earningData,
          backgroundColor: colorLabels,
          barPercentage: 0.8,
          minBarLength: 12,
          maxBarThickness: 8,
          datalabels: {
            display: false
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            position: 'top',
            display: true,
            scaleLabel: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5
            }
          }
          ]
        }
      },
    });
  }


  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}

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

  @Input() balance: any;
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
  activateColor1: string = 'rgb(204, 0, 255, 0.7)'
  color1M = this.baseColor
  color6M = this.baseColor
  color1Y = this.baseColor
  colorAll = this.activateColor
  colorBar1W = this.baseColor
  colorBar1M = this.baseColor
  colorBar6M = this.baseColor
  colorBar1Y = this.baseColor
  colorBarAll = this.activateColor1

  public historyChartLabelsAll: any;
  public historyChartDataAll: any;

  public nodeLabels: any;
  public earningData: any;

  ionViewDidEnter() {
    this.gradient = this.historyCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 260);
    this.gradient.addColorStop(1, "rgb(0, 0, 0, 0.4)")
    this.gradient.addColorStop(0, "rgb(0, 150, 171, 0.4)")

    this.historyChartLabelsAll = this.historyChartLabels.map(function(e) { return moment.unix(e).format('LL') });
    this.historyChartDataAll = this.historyChartData.map(function(e) { return e.toFixed(4) });

    this.lineChartMethod(this.historyChartLabelsAll, this.historyChartDataAll, this.gradient);

    this.nodeLabels = this.perNodeEarningsObject.all.map(function(d) { return d.Name });
    this.earningData = this.perNodeEarningsObject.all.map(function(d) { return d.Earnings });
    this.horizontalBarMethod(this.nodeLabels, this.earningData);
  }

  public toggleColor(chart, button) {

    if (chart == 'line') {
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

    if (chart == 'bar') {
      this.colorBar1W = this.baseColor
      this.colorBar1M = this.baseColor
      this.colorBar6M = this.baseColor
      this.colorBar1Y = this.baseColor
      this.colorBarAll = this.baseColor

    if (button == '1W') {
      this.colorBar1W = this.activateColor1
    }
    if (button == '1M') {
      this.colorBar1M = this.activateColor1
    }
    if (button == '6M') {
      this.colorBar6M = this.activateColor1
    }
    if (button == '1Y') {
      this.colorBar1Y = this.activateColor1
    }
    if (button == 'All') {
      this.colorBarAll = this.activateColor1
    }
    }
  }

  public switch1M() {
    this.toggleColor('line', '1M');
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
    this.toggleColor('line','6M');
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
    this.toggleColor('line', '1Y');
    this.lineChartMethod(this.historyChartLabelsAll, this.historyChartDataAll, this.gradient);
  }

  public switchAll() {
    this.toggleColor('line', 'All');
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

  // Per Node Earnings Chart //

  public switchPerNode1W() {
    this.toggleColor('bar', '1W');
    this.nodeLabels = this.perNodeEarningsObject.last1Week.map(function(d) { return d.Name });
    this.earningData = this.perNodeEarningsObject.last1Week.map(function(d) { return d.Earnings });
    this.horizontalBarMethod(this.nodeLabels, this.earningData);
  }

  public switchPerNode1M() {
    this.toggleColor('bar', '1M');
    this.nodeLabels = this.perNodeEarningsObject.last1Month.map(function(d) { return d.Name });
    this.earningData = this.perNodeEarningsObject.last1Month.map(function(d) { return d.Earnings });
    this.horizontalBarMethod(this.nodeLabels, this.earningData);
  }

  public switchPerNode6M() {
    this.toggleColor('bar', '6M');
    this.nodeLabels = this.perNodeEarningsObject.last6Months.map(function(d) { return d.Name });
    this.earningData = this.perNodeEarningsObject.last6Months.map(function(d) { return d.Earnings });
    this.horizontalBarMethod(this.nodeLabels, this.earningData);
  }

  public switchPerNode1Y() {
    this.toggleColor('bar', '1Y');
    this.nodeLabels = this.perNodeEarningsObject.last1Year.map(function(d) { return d.Name });
    this.earningData = this.perNodeEarningsObject.last1Year.map(function(d) { return d.Earnings });
    this.horizontalBarMethod(this.nodeLabels, this.earningData);
  }

  public switchPerNodeAll() {
    this.toggleColor('bar', 'All');
    this.nodeLabels = this.perNodeEarningsObject.all.map(function(d) { return d.Name });
    this.earningData = this.perNodeEarningsObject.all.map(function(d) { return d.Earnings });
    this.horizontalBarMethod(this.nodeLabels, this.earningData);
  }


  horizontalBarMethod(nodeLabels, earningData) {

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

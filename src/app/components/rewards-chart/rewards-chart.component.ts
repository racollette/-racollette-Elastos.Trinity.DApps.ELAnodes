import { Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
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


  @ViewChild('historyChart',{static:false}) historyCanvas;
  @ViewChild('perNodeEarningsChart',{static:false}) perNodeEarningsCanvas;

  constructor( 
    private modalCtrl: ModalController,   
  ) { }

  lineChart: any;
  horizontalBar: any;
  public context: CanvasRenderingContext2D;

  ngOnInit() {
  }

  ionViewDidEnter() {
      const gradient = this.historyCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 260);
        gradient.addColorStop(1,"rgb(0, 0, 0, 0.4)") // F44336 rgb(244, 67, 54)
        gradient.addColorStop(0, "rgb(0, 150, 171, 0.4)") // F50057 rgb(245, 0, 87)

      this.lineChartMethod(gradient);
      this.horizontalBarMethod();
  }

  lineChartMethod(gradient) {

    Chart.defaults.global.defaultFontColor = '#fff';
    this.lineChart = new Chart(this.historyCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.historyChartLabels,
        datasets: [
          {
            data: this.historyChartData,
            fill: true,
            backgroundColor: gradient,
            borderColor: 'rgb(51, 204, 255)',
            borderWidth: 0.4,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            pointRadius: 0.35,
            pointHitRadius: 3,
            datalabels: {
              display: false
            }
          }
        ]
      },
     options:  {
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
          maxTicksLimit: 5,
          maxRotation: 0,
          minRotation: 0,
       }
      }],
      },
    } 
    });
  }

  horizontalBarMethod() {

    let nodeLabels = this.perNodeEarningsObject.map(function(d) {return d.Name});
    let earningData = this.perNodeEarningsObject.map(function(d) {return d.Earnings});

    let colorOptions = ['#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c', '#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c','#5fc8e8', '#d225f5', '#4965f2', '#f0326b', '#e8885f', '#ede47c']

    let colorLabels = []
    for (let i=0; i < nodeLabels.length; i++) {
      colorLabels.push(colorOptions[i])
    }

    console.log(nodeLabels)
    console.log(earningData)

    this.perNodeEarningsCanvas.nativeElement.height = nodeLabels.length*16 + 40

    this.horizontalBar = new Chart(this.perNodeEarningsCanvas.nativeElement, {
    type: 'horizontalBar',
    data: {
      labels: nodeLabels,
      datasets: [{
          data: earningData,
          backgroundColor: colorLabels,
          //barThickness: ,
          barPercentage: 0.8,
          minBarLength: 12,
          maxBarThickness: 8,
          datalabels: {
            display:false
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

  onChartClick(event) {
    console.log(event);
  }

}
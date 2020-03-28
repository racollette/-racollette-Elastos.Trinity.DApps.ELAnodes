import { Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { NodesService } from 'src/app/services/nodes.service';
import { Chart } from 'chart.js';
import { ChartType } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as moment from 'moment';

declare let appManager: any;

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage {

  updateStats(event) {
    setTimeout(() => {
      this.nodesService.fetchStats().then(() => {
        event.target.complete();
      });
    }, 2000);
  }



  @ViewChild('coinChart',{static:false}) coinCanvas;
  @ViewChild('stakedChart',{static:false}) stakedCanvas;
  @ViewChild('mainchainChart',{static:false}) mainchainCanvas;
  @ViewChild('stackedBarChart',{static:false}) stackedBarCanvas;
  

  constructor(
    public nodesService: NodesService
  ) { }

  public time = Date.now()/1000
  public month = 2628000

  public staked = this.nodesService.voters.percent

  public stakingLabels = this.nodesService.voters.chart.time
  public stakingData = this.nodesService.voters.chart.ELA
  public stakingSupplyData = this.nodesService.voters.chart.percent
  public stakingVotersData = this.nodesService.voters.chart.voters

  public stakingLabelsAll = this.stakingLabels.map(function(e) {return moment.unix(e).format('LL')});
  public stakingDataAll = this.stakingData.map(function(e) {return (e/1000000).toFixed(2)});
  public stakingSupplyDataAll = this.stakingSupplyData.map(function(e) {return (e)});
  public stakingVotersDataAll = this.stakingVotersData.map(function(e) {return (e/1000).toFixed(2)});

  public coinsActive: boolean = true;
  public supplyActive: boolean = false;
  public votersActive: boolean = false;

  public coinsAxis: string = 'M'
  public supplyAxis: string = '%'
  public votersAxis: string = 'K'

  pieChart: any;
  stakingLineChart: any;
  mainchainLineChart: any;
  stackedBarChart: any;
  data = []
  axis: string
  gradient: string
  border: string

  public coinsGradient: any;
  public coinsBorder: string = 'rgb(51, 204, 255)'
  public coinsButton: string = 'rgb(51, 204, 255, 0.7)'
  public supplyGradient: any;
  public supplyBorder: string = 'rgb(255, 128, 255)'
  public supplyButton: string = 'rgb(179, 26, 255, 0.75)'
  public votersGradient: any;
  public votersBorder: string =  'rgb(73, 101, 242)' // "rgb(204, 51, 153)"
  public votersButton: string =  'rgb(73, 101, 242, 0.7)' //"rgb(204, 51, 153, 0.85)"

  public context: CanvasRenderingContext2D;

  baseColor: string = '#000'
  activateColor: string =  'rgb(51, 204, 255, 0.7)'
  color1M = this.baseColor
  color6M = this.baseColor
  color1Y = this.baseColor
  colorAll =  this.activateColor
  colorCoins = this.coinsButton
  colorSupply = this.baseColor
  colorVoters = this.baseColor


  //ngOnInit() {
  //}

  ///////////////////////////////////////////////////////////////////
  //////////////////////// STAKING CHART ///////////////////////////
  //////////////////////////////////////////////////////////////////

  public toggleColor(button) {
    if (this.coinsActive) {
      this.activateColor = this.coinsButton
    }
    if (this.supplyActive) {
      this.activateColor = this.supplyButton
    }
    if (this.votersActive) {
      this.activateColor = this.votersButton
    }

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

  public toggleDatasetColor(button) {
    this.colorCoins = this.baseColor
    this.colorSupply = this.baseColor
    this.colorVoters =  this.baseColor
    
    if (button == 'Coins') {
    this.colorCoins = this.coinsButton
    } 
    if (button == 'Supply') {
    this.colorSupply = this.supplyButton
    } 
    if (button == 'Voters') {
    this.colorVoters = this.votersButton
    } 
  }

  ionViewDidEnter() {

    console.log(this.nodesService)

    this.coinsGradient = this.coinCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 200);
    this.coinsGradient.addColorStop(1,"rgb(0, 0, 0, 0.4)") // F44336 rgb(244, 67, 54)
    this.coinsGradient.addColorStop(0, "rgb(0, 150, 171, 0.4)") // F50057 rgb(245, 0, 87)

    this.supplyGradient = this.coinCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 200);
    this.supplyGradient.addColorStop(1,"rgb(0, 0, 0, 0.4)") // F44336 rgb(244, 67, 54)
    this.supplyGradient.addColorStop(0, "rgb(179, 26, 255, 0.4)") // F50057 rgb(245, 0, 87)

    this.votersGradient = this.coinCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 200);
    this.votersGradient.addColorStop(1,"rgb(0, 0, 0, 0.4)") // F44336 rgb(244, 67, 54)
    this.votersGradient.addColorStop(0, "rgb(73, 101, 242, 0.4)") // F50057 rgb(245, 0, 87)

    this.hashrateGradient = this.mainchainCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 200);
    this.hashrateGradient.addColorStop(1,"rgb(0, 0, 0, 0.4)") // F44336 rgb(244, 67, 54)
    this.hashrateGradient.addColorStop(0, 'rgb(245, 112, 152, 0.6)') // F50057 rgb(245, 0, 87)

    this.aaGradient = this.mainchainCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 200);
    this.aaGradient.addColorStop(1,"rgb(0, 0, 0, 0.4)") // F44336 rgb(244, 67, 54)
    this.aaGradient.addColorStop(0, 'rgb(255, 219, 77, 0.4)') // F50057 rgb(245, 0, 87)

    this.tphGradient = this.mainchainCanvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 200);
    this.tphGradient.addColorStop(1,"rgb(0, 0, 0, 0.4)") // F44336 rgb(244, 67, 54)
    this.tphGradient.addColorStop(0, "rgb(0, 204, 153, 0.6)") // F50057 rgb(245, 0, 87)

    
    this.stakingChartMethod( this.stakingLabelsAll, this.stakingDataAll, this.coinsAxis, this.coinsGradient, this.coinsBorder );

    this.pieChartMethod(this.nodesService.voters.percent);
    this.stackedBarChartMethod(this.nodesService.block.percentBTChashrate);

    this.mainchainChartMethod( this.hashrateLabelsAll, this.hashrateDataAll, this.hashrateAxis, this.hashrateGradient, this.hashrateBorder );
  }

  public selectCoins() {
    this.coinsActive = true;
    this.supplyActive = false;
    this.votersActive = false;
    this.toggleDatasetColor('Coins');
    this.toggleColor('All')
    this.stakingChartMethod( this.stakingLabelsAll, this.stakingDataAll, this.coinsAxis, this.coinsGradient, this.coinsBorder );
  }

  public selectSupply() {
    this.supplyActive = true;
    this.coinsActive = false;
    this.votersActive = false;
    this.toggleDatasetColor('Supply');
    this.toggleColor('All')
    this.stakingChartMethod(this.stakingLabelsAll, this.stakingSupplyDataAll, this.supplyAxis, this.supplyGradient, this.supplyBorder);
  }

  public selectVoters() {
    this.votersActive = true;
    this.coinsActive = false;
    this.supplyActive = false;
    this.toggleDatasetColor('Voters');
    this.toggleColor('All')
    this.stakingChartMethod(this.stakingLabelsAll, this.stakingVotersDataAll, this.votersAxis, this.votersGradient, this.votersBorder);
  }

  public switch1M() {
    this.toggleColor('1M');
    let labels = this.stakingLabels
    let stakingLabels1M = []
    let stakingData1M = []
    let formatData1M = []

    for (let i=0; i < labels.length; i++) {
      if (labels[i] > (this.time - this.month*1)) {
        stakingLabels1M.push(moment.unix(labels[i]).format('LL'))
      }
    }

    if (this.coinsActive) {
    this.data = this.stakingData
    this.axis = this.coinsAxis
    this.gradient = this.coinsGradient
    this.border = this.coinsBorder
    stakingData1M = this.data.slice(-1*stakingLabels1M.length)
    formatData1M = stakingData1M.map(function(e) {return (e/1000000).toFixed(2)}) 
    }
    if (this.supplyActive) {
    this.data = this.stakingSupplyData
    this.axis = this.supplyAxis
    this.gradient = this.supplyGradient
    this.border = this.supplyBorder
    stakingData1M = this.data.slice(-1*stakingLabels1M.length)
    formatData1M = stakingData1M.map(function(e) {return (e)}) 
    }
    if (this.votersActive) {
    this.data = this.stakingVotersData
    this.axis = this.votersAxis
    this.gradient = this.votersGradient
    this.border = this.votersBorder
    stakingData1M = this.data.slice(-1*stakingLabels1M.length)
    formatData1M = stakingData1M.map(function(e) {return (e/1000).toFixed(2)}) 
    }

    this.stakingChartMethod( stakingLabels1M, formatData1M, this.axis, this.gradient, this.border );
  }

  public switch6M() {
    this.toggleColor('6M');
    let data = this.stakingData
    let labels = this.stakingLabels
    let stakingLabels6M = []
    let stakingData6M = []
    let formatData6M = []

    for (let i=0; i < labels.length; i++) {
      if (labels[i] > (this.time - this.month*6)) {
        stakingLabels6M.push(moment.unix(labels[i]).format('LL'))
      }
    }

    if (this.coinsActive) {
    this.data = this.stakingData
    this.axis = this.coinsAxis
    this.gradient = this.coinsGradient
    this.border = this.coinsBorder
    stakingData6M = this.data.slice(-1*stakingLabels6M.length)
    formatData6M = stakingData6M.map(function(e) {return (e/1000000).toFixed(2)}) 
    }
    if (this.supplyActive) {
    this.data = this.stakingSupplyData
    this.axis = this.supplyAxis
    this.gradient = this.supplyGradient
    this.border = this.supplyBorder
    stakingData6M = this.data.slice(-1*stakingLabels6M.length)
    formatData6M = stakingData6M.map(function(e) {return (e)}) 
    }
    if (this.votersActive) {
    this.data = this.stakingVotersData
    this.axis = this.votersAxis
    this.gradient = this.votersGradient
    this.border = this.votersBorder
    stakingData6M = this.data.slice(-1*stakingLabels6M.length)
    formatData6M = stakingData6M.map(function(e) {return (e/1000).toFixed(2)}) 
    }

    this.stakingChartMethod( stakingLabels6M, formatData6M, this.axis, this.gradient, this.border );
  }

  public switch1Y() {
    this.toggleColor('1Y');
    let formatData1Y = []

    if (this.coinsActive) {
      formatData1Y = this.stakingDataAll
      this.axis = this.coinsAxis
      this.gradient = this.coinsGradient
      this.border = this.coinsBorder
    }
    if (this.supplyActive) {
      formatData1Y = this.stakingSupplyDataAll
      this.axis = this.supplyAxis
      this.gradient = this.supplyGradient
      this.border = this.supplyBorder
    }
    if (this.votersActive) {
      formatData1Y = this.stakingVotersDataAll
      this.axis = this.votersAxis
      this.gradient = this.votersGradient
      this.border = this.votersBorder
    }

    // Switch to Year in June /// <<<<<<<<<<<<<<<
    this.stakingChartMethod( this.stakingLabelsAll, formatData1Y, this.axis, this.gradient, this.border )
  }

  public switchAll() {
    this.toggleColor('All');
    let formatDataAll = []

    if (this.coinsActive) {
      formatDataAll = this.stakingDataAll
      this.axis = this.coinsAxis
      this.gradient = this.coinsGradient
      this.border = this.coinsBorder
    }
    if (this.supplyActive) {
      formatDataAll = this.stakingSupplyDataAll
      this.axis = this.supplyAxis
      this.gradient = this.supplyGradient
      this.border = this.supplyBorder
    }
    if (this.votersActive) {
      formatDataAll = this.stakingVotersDataAll
      this.axis = this.votersAxis
      this.gradient = this.votersGradient
      this.border = this.votersBorder
    }
    this.stakingChartMethod( this.stakingLabelsAll, formatDataAll, this.axis, this.gradient, this.border );
  }
  ///////////////////////////////////////////////////////////////
  ////////////////// MAINCHAIN CHART ///////////////////////////
  //////////////////////////////////////////////////////////////
  
  public hashrateLabels = this.nodesService.mainchain.chart.hashrate.time
  public hashrateData = this.nodesService.mainchain.chart.hashrate.hashrateBTC
  public tphLabels = this.nodesService.mainchain.chart.tph.time
  public tphData = this.nodesService.mainchain.chart.tph.data
  public aaLabels = this.nodesService.mainchain.chart.aa.time
  public aaData = this.nodesService.mainchain.chart.aa.data

  public hashrateLabelsAll = this.hashrateLabels.map(function(e) {return moment.unix(e).format('LL')});
  public hashrateDataAll = this.hashrateData.map(function(e) {return (e)}); 
  public tphLabelsAll = this.tphLabels.map(function(e) {return moment.unix(e).format('LL')});
  public tphDataAll = this.tphData.map(function(e) {return (e)}); 
  public aaLabelsAll = this.aaLabels.map(function(e) {return moment.unix(e).format('LL')});
  public aaDataAll = this.aaData.map(function(e) {return (e/1000).toFixed(2)});

  public hashrateActive: boolean = true;
  public aaActive: boolean = false;
  public tphActive: boolean = false;

  public hashrateAxis: string = '% BTC'
  public aaAxis: string = 'K'
  public tphAxis: string = ''

  public hashrateGradient: any;
  public hashrateBorder: string = 'rgb(240, 50, 107)' // //rgb(240, 50, 107)"
  public hashrateButton: string = 'rgb(240, 50, 107, 0.75)' //"rgb(204, 51, 153, 0.85)" //"rgb(240, 50, 107, 0.75)" 
  public aaGradient: any;
  public aaBorder: string = "rgb(255, 219, 77)"
  public aaButton: string = "rgb(255, 219, 77, 0.4)"
  public tphGradient: any;
  public tphBorder: string = "rgb(0, 204, 153)"
  public tphButton: string = "rgb(0, 204, 153, 0.4)"

  mainchainBaseColor: string = '#000'
  mainchainActivateColor: string = 'rgb(240, 50, 107)' //"rgb(204, 51, 153, 0.85)"
  mainchainColor1M = this.mainchainBaseColor
  mainchainColor6M = this.mainchainBaseColor
  mainchainColor1Y = this.mainchainBaseColor
  mainchainColorAll =  this.mainchainActivateColor
  colorHashrate = this.hashrateBorder
  colorAA = this.mainchainBaseColor
  colorTPH = this.mainchainBaseColor


  public toggleMainchainColor(button) {
    if (this.hashrateActive) {
      this.mainchainActivateColor = this.hashrateButton
    }
    if (this.aaActive) {
      this.mainchainActivateColor = this.aaButton
    }
    if (this.tphActive) {
      this.mainchainActivateColor = this.tphButton
    }

    this.mainchainColor1M = this.mainchainBaseColor
    this.mainchainColor6M = this.mainchainBaseColor
    this.mainchainColor1Y = this.mainchainBaseColor
    this.mainchainColorAll = this.mainchainBaseColor

    if (button == '1M') {
    this.mainchainColor1M = this.mainchainActivateColor
    } 
    if (button == '6M') {
    this.mainchainColor6M = this.mainchainActivateColor
    } 
    if (button == '1Y') {
    this.mainchainColor1Y = this.mainchainActivateColor
    } 
    if (button == 'All') {
    this.mainchainColorAll = this.mainchainActivateColor
    } 

  }

  public toggleMainchainDatasetColor(button) {
    this.colorHashrate = this.mainchainBaseColor
    this.colorAA = this.mainchainBaseColor
    this.colorTPH =  this.mainchainBaseColor
    
    if (button == 'Hashrate') {
    this.colorHashrate = this.hashrateButton
    } 
    if (button == 'AA') {
    this.colorAA = this.aaButton
    } 
    if (button == 'TPH') {
    this.colorTPH = this.tphButton
    }   
  }

  public selectHashrate() {
   console.log(this.hashrateLabelsAll)
   console.log(this.hashrateDataAll)
    this.hashrateActive = true;
    this.aaActive = false;
    this.tphActive = false;
    this.toggleMainchainDatasetColor('Hashrate');
    this.toggleMainchainColor('All')
    this.mainchainChartMethod( this.hashrateLabelsAll, this.hashrateDataAll, this.hashrateAxis, this.hashrateGradient, this.hashrateBorder );
  }

  public selectAA() {
    console.log(this.aaLabelsAll)
    console.log(this.aaLabels)
    console.log(this.aaDataAll)
    this.hashrateActive = false;
    this.aaActive = true;
    this.tphActive = false;
    this.toggleMainchainDatasetColor('AA');
    this.toggleMainchainColor('All')
    this.mainchainChartMethod(this.aaLabelsAll, this.aaDataAll, this.aaAxis, this.aaGradient, this.aaBorder);
  }

 public selectTPH() {
   console.log(this.tphLabelsAll)
   console.log(this.tphDataAll)
    this.hashrateActive = false;
    this.aaActive = false;
    this.tphActive = true;
    this.toggleMainchainDatasetColor('TPH');
    this.toggleMainchainColor('All')
    this.mainchainChartMethod( this.tphLabelsAll, this.tphDataAll, this.tphAxis, this.tphGradient, this.tphBorder );
  }

 public mainchainSwitch1M() {
    this.toggleMainchainColor('1M');
    let mainchainLabels1M = []
    let mainchainData1M = []
    let formatData1M = []
    let labels = []
    

    if (this.hashrateActive) {
    labels = this.hashrateLabels
      for (let i=0; i < labels.length; i++) {
        if (labels[i] > (this.time - this.month*1)) {
          mainchainLabels1M.push(moment.unix(labels[i]).format('LL'))
        }
      }      
    this.data = this.hashrateData
    this.axis = this.hashrateAxis
    this.gradient = this.hashrateGradient
    this.border = this.hashrateBorder
    mainchainData1M = this.data.slice(-1*mainchainLabels1M.length)
    formatData1M = mainchainData1M
    }
    if (this.aaActive) {
    labels = this.aaLabels
      for (let i=0; i < labels.length; i++) {
        if (labels[i] > (this.time - this.month*1)) {
          mainchainLabels1M.push(moment.unix(labels[i]).format('LL'))
        }
      }      
    this.data = this.aaData
    this.axis = this.aaAxis
    this.gradient = this.aaGradient
    this.border = this.aaBorder
    mainchainData1M = this.data.slice(-1*mainchainLabels1M.length)
    formatData1M = mainchainData1M.map(function(e) {return (e/1000).toFixed(2)}) 
    }
    if (this.tphActive) {
    labels = this.tphLabels
      for (let i=0; i < labels.length; i++) {
        if (labels[i] > (this.time - this.month*1)) {
          mainchainLabels1M.push(moment.unix(labels[i]).format('LL'))
        }
      }      
    this.data = this.tphData
    this.axis = this.tphAxis
    this.gradient = this.tphGradient
    this.border = this.tphBorder
    mainchainData1M = this.data.slice(-1*mainchainLabels1M.length)
    formatData1M = mainchainData1M
    }

    this.mainchainChartMethod( mainchainLabels1M, formatData1M, this.axis, this.gradient, this.border );
  }

  public mainchainSwitch6M() {
    this.toggleMainchainColor('6M');
    let mainchainLabels6M = []
    let mainchainData6M = []
    let formatData6M = []
    let labels = []
    

    if (this.hashrateActive) {
    labels = this.hashrateLabels
      for (let i=0; i < labels.length; i++) {
        if (labels[i] > (this.time - this.month*6)) {
          mainchainLabels6M.push(moment.unix(labels[i]).format('LL'))
        }
      }      
    this.data = this.hashrateData
    this.axis = this.hashrateAxis
    this.gradient = this.hashrateGradient
    this.border = this.hashrateBorder
    mainchainData6M = this.data.slice(-1*mainchainLabels6M.length)
    formatData6M = mainchainData6M
    }
    if (this.aaActive) {
    labels = this.aaLabels
      for (let i=0; i < labels.length; i++) {
        if (labels[i] > (this.time - this.month*6)) {
          mainchainLabels6M.push(moment.unix(labels[i]).format('LL'))
        }
      }      
    this.data = this.aaData
    this.axis = this.aaAxis
    this.gradient = this.aaGradient
    this.border = this.aaBorder
    mainchainData6M = this.data.slice(-1*mainchainLabels6M.length)
    formatData6M = mainchainData6M.map(function(e) {return (e/1000).toFixed(2)}) 
    }
    if (this.tphActive) {
    labels = this.tphLabels
      for (let i=0; i < labels.length; i++) {
        if (labels[i] > (this.time - this.month*6)) {
          mainchainLabels6M.push(moment.unix(labels[i]).format('LL'))
        }
      }      
    this.data = this.tphData
    this.axis = this.tphAxis
    this.gradient = this.tphGradient
    this.border = this.tphBorder
    mainchainData6M = this.data.slice(-1*mainchainLabels6M.length)
    formatData6M = mainchainData6M
    }

    this.mainchainChartMethod( mainchainLabels6M, formatData6M, this.axis, this.gradient, this.border );
  }

  public mainchainSwitch1Y() {
    this.toggleMainchainColor('1Y');
    let mainchainLabels1Y = []
    let mainchainData1Y = []
    let formatData1Y = []
    let labels = []

    if (this.hashrateActive) {
      labels = this.hashrateLabels
        for (let i=0; i < labels.length; i++) {
          if (labels[i] > (this.time - this.month*12)) {
            mainchainLabels1Y.push(moment.unix(labels[i]).format('LL'))
          }
        }      
      this.data = this.hashrateData
      this.axis = this.hashrateAxis
      this.gradient = this.hashrateGradient
      this.border = this.hashrateBorder
      mainchainData1Y = this.data.slice(-1*mainchainLabels1Y.length)
      formatData1Y = mainchainData1Y
    }
    if (this.aaActive) {
      mainchainLabels1Y = this.aaLabelsAll
      formatData1Y = this.aaDataAll
      this.axis = this.aaAxis
      this.gradient = this.aaGradient
      this.border = this.aaBorder
    }
    if (this.tphActive) {
      mainchainLabels1Y = this.tphLabelsAll
      formatData1Y = this.tphDataAll
      this.axis = this.tphAxis
      this.gradient = this.tphGradient
      this.border = this.tphBorder
    }

    // Switch to year in October for aa and TPH <<<<<<<<<<<<<,,
    this.mainchainChartMethod( mainchainLabels1Y, formatData1Y, this.axis, this.gradient, this.border );
  }

  public mainchainSwitchAll() {
    this.toggleMainchainColor('All');
    let dataAll = []
    let labelsAll = []

    if (this.hashrateActive) {
      dataAll = this.hashrateDataAll
      labelsAll = this.hashrateLabelsAll
      this.axis = this.hashrateAxis
      this.gradient = this.hashrateGradient
      this.border = this.hashrateBorder
    }
    if (this.aaActive) {
      dataAll = this.aaDataAll
      labelsAll = this.aaLabelsAll
      this.axis = this.aaAxis
      this.gradient = this.aaGradient
      this.border = this.aaBorder
    }
    if (this.tphActive) {
      dataAll = this.tphDataAll
      labelsAll = this.tphLabelsAll
      this.axis = this.tphAxis
      this.gradient = this.tphGradient
      this.border = this.tphBorder
    }

    this.mainchainChartMethod( labelsAll, dataAll, this.axis, this.gradient, this.border );
  }



  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////


   stakingChartMethod(labels, data, axis, gradient, border ) {

    this.stakingLineChart = new Chart(this.coinCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            fill: true,
            backgroundColor: gradient,
            borderColor: border,
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
          maxTicksLimit: 6,
          callback: function(value, index, values) {
                        return value + axis;
                    }
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

pieChartMethod(staked) {

    let unstaked = (100 - parseFloat(staked)).toFixed(2)

    Chart.defaults.global.defaultFontColor = '#fff';
    this.pieChart = new Chart(this.stakedCanvas.nativeElement, {
      type: 'doughnut',
      plugins: [ChartDataLabels],
      data: {
        labels: ['Staked', 'Circ'],
        datasets: [
          {
            data: [staked, unstaked],
            fill: true,
            backgroundColor: [ 'rgb(179, 26, 255, 0.4)', 'rgb(73, 101, 242, 0.4)'],
            borderColor:  ['rgb(179, 26, 255)', 'rgb(73, 101, 242)'],
            borderWidth: 1.75,
            datalabels: {  
              formatter: function(value, context) {
                return  value + '%';
              },
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
      tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                return data.labels[tooltipItem.index] + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%'
            }
        }
      }
    } 
    });
  }

mainchainChartMethod(labels, data, axis, gradient, border ) {

    this.mainchainLineChart = new Chart(this.mainchainCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            fill: true,
            backgroundColor: gradient,
            borderColor: border,
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
          maxTicksLimit: 6,
          callback: function(value, index, values) {
                        return value + axis;
                    }
        }
      }],
      xAxes: [{
       type: 'time',
       distribution: 'linear',
       ticks: {
          maxTicksLimit: 3,
          maxRotation: 0,
          minRotation: 0,
       }
      }],
      },
    } 
    });
  }
  
  stackedBarChartMethod(hashrate) {

    let ELA_hashrate = hashrate
    let BTC_hashrate = (100 - ELA_hashrate)
   
    this.stackedBarChart = new Chart(this.stackedBarCanvas.nativeElement, {
      type: 'bar',
      data: {
      datasets: [{
        label: '% BTC',
        barThickness: 100,
        data: [ ELA_hashrate ],
        backgroundColor: [
        "rgb(0, 204, 153, 0.2)"
          //'rgb(51, 204, 255, 0.2)'
         //"rgb(255, 195, 77, 0.2)"
         // "rgb(0, 204, 153, 0.2)"
         // 'rgb(0, 150, 171, 0.4)'
        ],
        borderColor: [ 
           "rgb(0, 204, 153, 0.8)"
          //'rgb(51, 204, 255, 0.8)'
         //"rgb(255, 195, 77)"
         // "rgb(0, 204, 153, 0.75)"
        //  'rgb(0, 150, 171)'
        ],
        borderWidth: 1.75,
        datalabels: {  
              formatter: function(value, context) {
                return  'ELA: ' + value + '%';
              },
        }
      },
      {
        label: 'BTC',
        barThickness: 100,
        data: [ BTC_hashrate ],
        backgroundColor: [
          'rgb(240, 50, 107, 0.4)'
          //'rgb(240, 50, 107, 0.2)'
          //'rgb(179, 26, 255, 0.2)'
          //'rgba(255, 99, 132, 0.4)'
        ],
        borderColor: [
          'rgb(240, 50, 107)'
          //'rgb(240, 50, 107)'
         // 'rgb(179, 26, 255, 0.75)'
         // 'rgba(255,99,132,1)'
        ],
        borderWidth: 1.75,
        datalabels: {  
              formatter: function(value, context) {
                return  'BTC';
              },
        }
      }
    ]
  },
  options: {
    layout: {
      padding: {
         left: -10,
         right: 0,
         top: 0,
         bottom: -10
         }
    },
    tooltips: {
        enabled: false
    },
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        stacked: true,
         ticks: {
           display: false
         }
      }],
      xAxes: [{
        stacked: true,
        ticks: {
          display: false
        }
      }]

    }
  }
});

  }

  // //// Define Values ////
  // fixHeight(): string {
  //   return this.nodesService.currentHeight.toLocaleString().split(/\s/).join(',');
  // }

  // fixTotalVotes(): string {
  //   return this.nodesService.totalVotes.toLocaleString().split(/\s/).join(',');
  // }

  // fixTotalEla(): string {
  //   let ela: number = parseFloat(this.nodesService.voters.ELA);
  //   return ela.toLocaleString().split(/\s/).join(',');
  // }

  // fixTotalVoters(): string {
  //   return this.nodesService.voters.total.toLocaleString().split(/\s/).join(',');
  // }

  // fixActiveAddresses(): string {
  //   return this.nodesService.mainchain.activeaddresses.toLocaleString().split(/\s/).join(',');
  // }

  // fixSupply(): string {
  //   let supply: number = parseFloat(this.nodesService.price.circ_supply);
  //   return supply.toLocaleString().split(/\s/).join(',');
  // }

  // fixVolume(): string {
  //   let volume: number = parseFloat(this.nodesService.price.volume);
  //   return volume.toLocaleString().split(/\s/).join(',');
  // }

  /*   getVotePercent(): string {
    let votePercent: number = this.nodesService.totalVotes / (parseFloat(this.nodesService.price.circ_supply) * 36) * 100;
    return votePercent.toFixed(2);
  } */

  /* getTotalRewards(): string {
    let totalRewards = 0;
    this.nodesService._nodes.map(node => {
      totalRewards += parseInt(node.EstRewardPerYear);
    });
    totalRewards = totalRewards / 365
    return totalRewards.toLocaleString().split(/\s/).join(',');
  } */

}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { NodesService } from 'src/app/services/nodes.service';
import { DataService } from 'src/app/services/data.service';
import { VotePage } from 'src/app/pages/vote/vote.page';
import { TranslateService } from '@ngx-translate/core';

declare let appManager: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

export class MenuComponent implements OnInit {

  constructor(
    private data: DataService,
    public nodesService: NodesService,
    private storageService: StorageService,
    private toastController: ToastController,
    private votePage: VotePage,
    private translate: TranslateService
  ) { }

  public input:number;
  public input1:number;
  public input2:number;
  public nodesSelected: any;
  public nodeTable: any;
  public input3:number;
  public voteDocument: any

  public nodeLoad: any;

  public NA: number = 0;
  public SA: number = 0;
  public EU: number = 0;
  public AS: number = 0;
  public OC: number = 0;
  public AF: number = 0;

  // Node Selection
  public selectedCount: number = 0;
  public selectedARR: number = 0;
  public selectedAvgPay: number = 0;

  // Intent
  public voted: boolean = false;

  // Toast for voteFailed/voteSuccess
  private toast: any = null;

  // Loading
  public loaded: boolean = false;
  

  ngOnInit() {
    this.data.currentselectedCount.subscribe(input => this.input = input)
    this.data.currentselectedARR.subscribe(input1 => this.input1 = input1)
    this.data.currentselectedAvgPay.subscribe(input2 => this.input2 = input2)
    this.data.currentselected.subscribe(nodesSelected => this.nodesSelected = nodesSelected)
    this.data.currentnodeTable.subscribe(nodeTable => this.nodeTable = nodeTable)
    this.data.currentvotePercent.subscribe(input3 => this.input3 = input3)
    this.data.currentvoteDocument.subscribe(voteDocument => this.voteDocument = voteDocument)
    this.data.NA_Count.subscribe(NA => this.NA = NA)
    this.data.SA_Count.subscribe(SA => this.SA = SA)
    this.data.EU_Count.subscribe(EU => this.EU = EU)
    this.data.AS_Count.subscribe(AS => this.AS = AS)
    this.data.OC_Count.subscribe(OC => this.OC = OC)
    this.data.AF_Count.subscribe(AF => this.AF = AF)

    this.nodesService.nodesLoaded.subscribe(nodeLoad => this.nodeLoad = nodeLoad)
  }

  async init() {
  }

  ionViewDidEnter() {
    appManager.setVisible("show", ()=>{}, (err)=>{});
  }

  menuOpened() {
    console.log('Opened')
  }
  
  onSelect({ selected }) {
    if (selected.length == 0) {
      this.nodesSelected = []
    }
    this.nodesSelected.splice(0, this.nodesSelected.length);
    this.nodesSelected.push(selected);
    this.input = this.nodesSelected[0].length

    this.NA = 0;
    this.SA = 0;
    this.EU = 0;
    this.AS = 0;
    this.OC = 0;
    this.AF = 0;

    if (this.input > 0) {

    let sumARR: number = 0;
    let avgPay: number = 0;
    let votePercent: number = 0;

    let selectedArray: any[] = Object.values(this.nodesSelected[0])

    for (let i=0; i < selectedArray.length; i++) {
    if (isNaN(parseFloat(selectedArray[i].AnnualROI))) {
    } else {
      sumARR += parseFloat(selectedArray[i].AnnualROI)
      avgPay += parseFloat(selectedArray[i].PercentPayout)
      votePercent += (parseFloat(selectedArray[i].Votes) / parseFloat(selectedArray[i].Totalvotes))*100
    }

    if (selectedArray[i].Continent == 'North America') {
      this.NA++
    }
    if (selectedArray[i].Continent == 'South America') {
      this.SA++
    }
    if (selectedArray[i].Continent == 'Europe') {
      this.EU++
    }
    if (selectedArray[i].Continent == 'Asia') {
      this.AS++
    }
    if (selectedArray[i].Continent == 'Oceania') {
      this.OC++
    }
    if (selectedArray[i].Continent == 'Africa') {
      this.AF++
    }

    }

    this.input1 = Number(sumARR.toFixed(3))
    this.input2 = Number((avgPay/this.input).toFixed(2))
    this.input3 = Number(votePercent.toFixed(2))

    } else {
      this.input1 = 0
      this.input2 = 0
      this.input3 = 0
    }

    this.data.updateStats(this.input, this.input1, this.input2, this.nodesSelected, this.nodeTable, this.input3, this.voteDocument)
    this.data.updateContinents(this.NA, this.SA, this.EU, this.AS, this.OC, this.AF)
  }

  clearSelections() {
    let el = this.voteDocument

       for (let i = 0; i < el.length; i++){
         el[i].className = '';
         el[i].classList.add("datatable-body-row");
         //el[i].attributes[5].value = 'false'
       }
 
     this.onSelect({selected: []});
     if (this.nodeTable) {
     this.nodeTable.selected = []
     }
  }

  getStoredNodes() {
    this.storageService.getNodes().then(data => {
      console.log('Last Node Vote', data);
      if(data) {
        this.myLastVote(data)
      } else {
        let translation = this.translate.instant('No voting history found')
        this.data.toastError(translation)
      }
    });
  }

  myLastVote(data) {
    this.clearSelections()
    let voteArr = data
    let nodes = this.nodeLoad

    let nodeRows: any = []
    let el = this.voteDocument

    nodes.forEach(node => {
      if (voteArr.includes(node.Producer_public_key)) {
        nodeRows.push(node)
      }
    })

    let length = nodeRows.length
    for (let j=0; j < length; j++) {
       let index = nodeRows[j].Rank - 1
       el[index].classList.add("active");
     }

    console.log(nodeRows)
    this.onSelect({selected: nodeRows});
    this.nodeTable.selected = nodeRows
  }


  maxReturn() {
    this.clearSelections()

    let nodes = this.nodeLoad
    let arrayROI: string[] = []

    for (let i=0; i < nodes.length; i++) {
      arrayROI.push(nodes[i].AnnualROI)
    }

    let sortROI = arrayROI.map((val, ind) => {return {ind, val}})
           .sort((a, b) => {return a.val > b.val ? -1 : a.val == b.val ? 1 : 0 })
           .map((obj) => obj.ind);

    let rowsROI: string[] = []
    let el = this.voteDocument

     for (let j=0; j < 36; j++) {
       let index = sortROI[j]
       rowsROI.push(nodes[index])
       el[index].classList.add("active");
     }
    console.log(rowsROI)
    this.onSelect({selected: rowsROI});
    this.nodeTable.selected = rowsROI
  }

  top36() {
    this.clearSelections()

    let nodes = this.nodeLoad

    let el = document.querySelectorAll('.datatable-body-row');
    let rows36: string[] = []

    for (let j=0; j < 36; j++) {
      rows36.push(nodes[j])
      el[j].classList.add("active");
    }

    console.log(rows36)
    this.onSelect({selected: rows36});
    this.nodeTable.selected = rows36
  }

  // Vote intent 
  elastOSVote() {
    let submitNodeKeys: string[] = [];

    if (this.nodesSelected[0] === undefined) {
      this.nodesSelected = [[]]
    }

    if (this.nodesSelected[0].length > 0) {

    const selectedArray = Object.keys(this.nodesSelected[0]).map(i => this.nodesSelected[0][i])
    for (let i=0; i < selectedArray.length; i++) {
      submitNodeKeys = submitNodeKeys.concat(selectedArray[i].Producer_public_key);
    }

    console.log(submitNodeKeys);
    let votesSent: boolean = false;

      appManager.sendIntent(
        'dposvotetransaction',
        { publickeys: (submitNodeKeys) },
        {},
        (res) => {
          console.log('Insent sent sucessfully', res);

          if(res.result.txid === null ) {
            votesSent = true;
            let translation = this.translate.instant('votes-canceled-toast');
            this.voteFailed(translation);
          } else {
            votesSent = true;
            this.voted = true;
            let date = new Date;
            let txid: string = res.result.txid;
            txid = txid.substr(0,16) + '... ' + txid.substr(48,16)

            this.nodesService._votes = this.nodesService._votes.concat({ date: date, tx: txid, keys: submitNodeKeys });
            console.log('Vote history updated', this.nodesService._votes);
            this.storageService.setVotes(this.nodesService._votes);
            this.storageService.setNodes(submitNodeKeys);
            this.voteSuccess(txid);
          }
        }, (err) => {
          votesSent = true;
          console.log('Intent sent failed', err);
          this.voteFailed(err);
        }
      );

      // If no response is sent from wallet, show vote transaction has failed
      setTimeout(() => {
        if(votesSent === false) {
          let translation = this.translate.instant('wallet-failed-toast');
          this.voteFailed(translation);
        }
      }, 10000)

    } else {
      this.noNodesChecked();
    }
  }

  elephantVote() {
    let submitNodeKeys: string[] = [];
    let elephantKeys: string = ''

    if (this.nodesSelected[0] === undefined) {
      this.nodesSelected = [[]]
    }

    if (this.nodesSelected[0].length > 0) {

    const selectedArray = Object.keys(this.nodesSelected[0]).map(i => this.nodesSelected[0][i])

    for (let i=0; i < selectedArray.length; i++) {
      submitNodeKeys = submitNodeKeys.concat(selectedArray[i].Producer_public_key);
      elephantKeys += (selectedArray[i].Producer_public_key + ',');
    }

    elephantKeys = elephantKeys.slice(0, -1)

    if (submitNodeKeys.length > 0) {

      let requestHeader = 'https://elephantwallet.app/redirect/?appName=ELAnodes&appTitle=ELAnodes&redirectURL=elaphant%3A%2F%2Feladposvote%3FAppID%3D47e9aaeab2eb22032d451d095569237057cfb6fd50c204b880d3ea40247aacf1f7d066e09b5af7326e0f2db2773c341fe291b7a73a3d0d9b316828c313fc7b00%26AppName%3DELAnodes%26DID%3DiSsF2vQMSFYxTo5DVb53MR1FRbqAsqV4sj%26PublicKey%3D0305cc0feffcfc122ee6644027f6a4f924607bf261ac5b3a58705afa417d7ac577%26ReturnUrl%3Dhttps%253A%252F%252Felanodes.com%26CandidatePublicKeys%3D'
      let url = encodeURIComponent(elephantKeys)

      this.data.openUrl(requestHeader + url)
      this.storageService.setNodes(submitNodeKeys);
    }

   } else {
      this.noNodesChecked();
   }

  }

  //// Alerts ////
  async voteSuccess(res: string) {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      header: this.translate.instant('vote-success-header'),
      message: 'TxID: ' + res,//.slice(0,30) + '...',
      cssClass: "toast-success",
      position: "middle",
      buttons: [
        {
          text: this.translate.instant('toast-ok'),
          handler: () => {
            this.toast.dismiss();
          }
        }
      ],
    });
    this.toast.present();
  }

  async voteFailed(res: string) {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      header: this.translate.instant('vote-failed-toast'),
      message: res,
      position: "middle",
      cssClass: 'toast-warn',
      buttons: [
        {
          text: this.translate.instant('toast-ok'),
          handler: () => {
            this.toast.dismiss();
          }
        }
      ]
    });
    this.toast.present();
  }

  // If received response from sendIntent, close the toast displayed for timeout
  closeToast() {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
  }

  async noNodesChecked() {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: this.translate.instant('select-36-toast'),
      cssClass: "toast-warn",
      position: "middle",
      duration: 2000
    });
    toast.present();
  }

}

import { Injectable, NgZone} from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { NodesService } from 'src/app/services/nodes.service';
import { Reward } from 'src/app/models/reward.model';
import { Transaction } from 'src/app/models/transaction.model';


import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(
    private inappBrowser: InAppBrowser,
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private nodesService: NodesService,
    private toastController: ToastController,
  ) {}

  /////////////// Observables /////////////////////

    private loadedSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    loaded = this.loadedSource.asObservable();

    loadTimer(load) {
      console.log(load)
      this.loadedSource.next(load)
    }

    ///////////////////////////////////////////////

    private selectedSource: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private selectedCountSource: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private selectedARRSource: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private selectedAvgPaySource: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private nodeTableSource: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private votePercentSource: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private voteDocumentSource: BehaviorSubject<string> = new BehaviorSubject<string>('');

    currentselected = this.selectedSource.asObservable();
    currentselectedCount = this.selectedCountSource.asObservable();
    currentselectedARR = this.selectedARRSource.asObservable();
    currentselectedAvgPay = this.selectedAvgPaySource.asObservable();
    currentnodeTable = this.nodeTableSource.asObservable();
    currentvotePercent = this.votePercentSource.asObservable();
    currentvoteDocument = this.voteDocumentSource.asObservable();

    updateStats(input, input1, input2, nodesSelected, nodeTable, input3, voteDocument) {
        this.selectedCountSource.next(input)
        this.selectedARRSource.next(input1)
        this.selectedAvgPaySource.next(input2)
        this.selectedSource.next(nodesSelected)
        this.nodeTableSource.next(nodeTable)
        this.votePercentSource.next(input3)
        this.voteDocumentSource.next(voteDocument)
    }



    private NA_Source: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private SA_Source: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private EU_Source: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private AS_Source: BehaviorSubject<number> = new BehaviorSubject<number>(0); 
    private OC_Source: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private AF_Source: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    NA_Count = this.NA_Source.asObservable();
    SA_Count = this.SA_Source.asObservable();
    EU_Count = this.EU_Source.asObservable();
    AS_Count = this.AS_Source.asObservable();
    OC_Count = this.OC_Source.asObservable();
    AF_Count = this.AF_Source.asObservable();

    updateContinents(NA, SA, EU, AS, OC, AF) {
       this.NA_Source.next(NA)
       this.SA_Source.next(SA)
       this.EU_Source.next(EU)
       this.AS_Source.next(AS)
       this.OC_Source.next(OC)
       this.AF_Source.next(AF)
    }

    /////////////////// Open Browser ///////////////////////////////////

    public openUrl(url: string) {
        const target = "_system";
        const options = "location=no";
        this.inappBrowser.create(url, target, options);
    }

    //////////////////  Wallet History Retrieval //////////////////////////

    async init() {
        this.fetchPayoutAddresses();
    }
    
    private nodeApi: string = 'https://node1.elaphant.app/api/v1';
    private proxyurl = "https://cors-anywhere.herokuapp.com/";


    private toast: any = null;
    public rewardsObjectCreated: boolean = false;
    public walletRequested: boolean = false;
    public requestFailed: boolean = false;
    private _wallet: Transaction[] = [];
    private _walletAddress: string;
    private _walletBalance: any;
    public _rewards: string[] = []
    public _payoutAddresses: any;

    // Chart Variables //
    public historyChartData: any;
    public historyChartLabels: any;
    public firstPayout: string;
    public totalEarned: number;
    public totalPayouts: number;

    public weekEarn: string;
    public weekARR: any;
    public monthEarn: string;
    public monthARR: any;

    public perNodeEarningsObject: any;


    public fetchPayoutAddresses() {
      console.log('Fetching Payout Address object..');
      //this.http.get<any>(this.nodeApi + 'v1/dpos/rank/height/' + height).subscribe((res) => {
      this.http.get<any>(this.proxyurl + 'https://elanodes.com/api/payout-addresses').subscribe((res) => { 
        console.log('Payout Address fetch response', res)
        this._payoutAddresses = res.result
      });
    }


    public fetchWallet(address: string) {
      this._walletAddress = address;
      this.rewardsObjectCreated = false;
      this.walletRequested = true;
      this._rewards = []
      
      console.log('Fetching Address History..');
  
      this.http.get<any>(this.proxyurl + this.nodeApi + '/history/' + address).subscribe((res) => {
        if (res.status == 200) { 
        console.log('Address Fetch Response', res)
        this._wallet = (res.result.History) 
        console.log(this._walletAddress)
        this.fetchBalance(this._walletAddress)
        } else {
          this.toastError('Not a valid address. Please try again.')
          this.walletRequested = false;
        }
        }, (err) => {
          console.log(err);
          this.toastError('Not a valid address. Please try again.')
          this.walletRequested = false;
      });
    } 


  public fetchBalance(address: string) {
      this.http.get<any>(this.proxyurl + this.nodeApi + '/asset/balances/' + address).subscribe((res) => {
        if (res.Error == 0) { 
        console.log('Address Fetch Balance', res)
        this._walletBalance = res.Result
        this.matchDelegate(this._wallet)
        } else {
          this.toastError('Balance fetch error')
        }
        }, (err) => {
          console.log(err);
          this.toastError('Balance fetch error')
      });
  }

  public matchDelegate(wallet) {
    for (let i = wallet.length-1; i > -1; i--) {
      let sender = wallet[i].Inputs
        for (let j=0; j < sender.length; j++) {
          const result = this._payoutAddresses.filter(node => node.Payout_wallet.includes(sender[j]));
          //console.log(result)

       if (result.length > 0) {
         let entry = Object.create(null)
         entry.Time = moment.unix(wallet[i].CreateTime).format('MM/DD/YY HH:mm')
         entry.CreateTime = wallet[i].CreateTime
         entry.imageUrl = this.nodesService.getRewardIcon(result[0].Nickname)
         entry.Delegate = this.truncateNames(result[0].Nickname)
         entry.Value = (wallet[i].Value/100000000).toFixed(6)
         entry.Memo =  wallet[i].Memo.slice(14)
         entry.Address = wallet[i].Inputs[0].substr(0,10) + '... ' + wallet[i].Inputs[0].substr(24,10)
         entry.Height = wallet[i].Height
         entry.Hash = wallet[i].Txid.substr(0,16) + '... ' + wallet[i].Txid.substr(48,16)
         this._rewards.push(entry)
       }
      }
    }
    console.log(this._rewards)

    this.formatChartData(this._rewards)
    this.calculateReturnRates(this._rewards)
    this.rewardsPerNode(this._rewards)
    this.walletRequested = false;
    this.rewardsObjectCreated = true;
  }

  public formatChartData(rewards) {
    let labels = rewards.map(function(e) {
      return e.Time
    });
    labels = labels.reverse()

    let data = rewards.map(function(e) {
      return e.Value
    });
    data = data.reverse()

    let starting_balance: number = 0
    for (let i=0; i < data.length; i++) {
      starting_balance += parseFloat(data[i])
      data[i] = starting_balance
    }

    // let reduceData: string[] = []
    // let reduceLabels: string[] = []

    // for (let j = 0; j < data.length; j=j+10) {
    //   reduceData.push(data[j]);
    //   reduceLabels.push(labels[j]);
    // }

    this.firstPayout = moment(labels[0]).format('LL')
    this.totalEarned = data.slice(-1).pop().toFixed(4)
    this.totalPayouts = data.length

    this.historyChartLabels = labels
    this.historyChartData = data
  }

  public calculateReturnRates(data) {
    //let recentVote = 0
    let week = 0
    let month = 0
    let timeNow = Date.now()/1000
    let timeWeek = 604800
    let timeMonth = 2628000
    //timestampRecentVote= block_time
    let timestampWeek = timeNow - timeWeek
    let timestampMonth = timeNow - timeMonth

    for (let i=0; i < data.length; i++) {
      if (data[i].CreateTime > timestampMonth) {
        month += parseFloat(data[i].Value)
      }
      if (data[i].CreateTime > timestampWeek) {
        week += parseFloat(data[i].Value)
      }
      // if (data[i].CreateTime > timestampRecentVote) {
      //   recentVote += data[i].Value
      // }
    }
    // yearsElapsedRecentVote = parseFloat((timeNow - timestampRecentVote)/31536000)
    // recentVoteARR = parseFloat((recentVote/yearsElapsedRecentVote)/this._walletBalance*100)
    this.weekEarn = week.toFixed(4)
    this.weekARR = ((week*52)/(parseFloat(this._walletBalance))*100).toFixed(2)
    this.monthEarn = month.toFixed(4)
    this.monthARR = ((month*12)/(parseFloat(this._walletBalance))*100).toFixed(2)
  }

  public rewardsPerNode(data) {
    let starfishSum: number = 0;
    let uniqueNodes = Object.create(null)

    data.forEach(payment => {
        let delegate = payment.Delegate
        uniqueNodes[delegate] = []
     })

    let uniqueNodesArray = Object.keys(uniqueNodes)
    data.forEach(payment => {
      if (uniqueNodesArray.includes(payment.Delegate)) {
        uniqueNodes[payment.Delegate].push(payment.Value)
      }
    })

    let payArrays = Object.values(uniqueNodes)
    const arrSum = payment => payment.reduce((a,b) => parseFloat(a) + parseFloat(b), 0)
    let paySums = []
    payArrays.forEach(payment => {
      paySums.push(arrSum(payment))
    })

    let barChartData = []
    for (let i=0; i < uniqueNodesArray.length; i++) {
      let earnPerNode = Object.create(null)
      earnPerNode.Name = uniqueNodesArray[i]
      earnPerNode.Earnings = paySums[i].toFixed(2)
      barChartData.push(earnPerNode)
    }
  
    barChartData.sort(function(a, b) {
      return b.Earnings - a.Earnings;
    });

    this.perNodeEarningsObject = barChartData;
  }

  closeToast() {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
  }

  truncateNames(name) {
    if (name == "Cyber Republic Press CR新闻团队") {
      return "Cyber Republic Press"
    } else if (name == "Elastos Forest Node (EFN)") {
      return "Elastos Forest Node"
    } else if (name == "CR Regions Global Fund - Clarence Liu") {
      return "CR Regions Global Fund"
    } else if (name == "Orchard - Elastos Business Development") {
      return "Orchard Business Development"
    } else if (name == "Long ELA，Short the world(追风筝的人)") {
      return "Long ELA，Short the world"
    } else if (name == "Pmhee555 75% weekly payouts") {
      return "Pmhee555 75% payouts"
    } else {
      return name
    }
  }

  async toastError(res: string) {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      //header: 'Failed to get an address from your wallet',
      message: res,
      position: "middle",
      cssClass: 'toaster',
      duration: 2000
    });
    this.toast.present();
  }


}
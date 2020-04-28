import { Injectable, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { AlertController } from '@ionic/angular';
import { NodesService } from 'src/app/services/nodes.service';
import { Reward } from 'src/app/models/reward.model';
import { Transaction } from 'src/app/models/transaction.model';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

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
    private alertController: AlertController,
    private translate: TranslateService,
    private zone: NgZone
  ) {}

  public language: string;
  public wallets = []
  
  async init() {
      console.log('DATA SERVICE INITIATED')
      this.getLanguage();
      this.fetchPayoutAddresses();     
      this.getStoredWallets();
      this.setActiveAlias();
  }

  getLanguage() {
        appManager.getLocale(
            (defaultLang, currentLang, systemLang) => {
                console.log('DefaultLang', defaultLang, ' CurrentLang:', currentLang, ' SystemLang:', systemLang);
                this.setCurLang(currentLang);
            }
        );
    }

  setCurLang(lang: string) {
      this.zone.run(()=> {
          this.translate.use(lang);
          this.language = lang
      });
  }
  /////////////// Observables /////////////////////

    // private loadedSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // loaded = this.loadedSource.asObservable();

    // loadTimer(load) {
    //   console.log(load)
    //   this.loadedSource.next(load)
    // }

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


    //////////////////// Saved Wallets Storage //////////////////////////

    public inputAddressSource: BehaviorSubject<string> = new BehaviorSubject<string>('');
    inputAddress = this.inputAddressSource.asObservable();

    updateInputAddress(address) {
      this.inputAddressSource.next(address);
    }

    private activeAliasSource: BehaviorSubject<string> = new BehaviorSubject<string>('');
    activeAlias = this.activeAliasSource.asObservable();

    updateAlias(alias) {
      this.activeAliasSource.next(alias);
    }

    getStoredWallets() {
      this.storageService.getWallets().then(data => {
       if(data) {
        this.wallets = data
        console.log('Stored Wallets', data)
        this.setActiveAlias();

        let activeAddress: string;
        this.wallets.forEach(wallet => {
          if (wallet.active == true ) {
          activeAddress = wallet.address
          }
        });

        this.fetchWallet(activeAddress)
        this.updateInputAddress(activeAddress)

      } else {
        this.wallets = []
      }

      });
    }

    setActiveAlias() {

    if (this.wallets) {
       this.wallets.forEach(wallet => {
        if (wallet.active == true ) {
          this.updateAlias(wallet.alias)
        }
      })
    }
    
    }

    expandStorage(data) {
      let address = data.address
      let alias = data.alias
      let noDupes: boolean = true;

      let wallet = Object.create(null)

      this.wallets.forEach(wallet => {
        if (wallet.address == address) {
          let translation = this.translate.instant('duplicate-toast-error');
          this.toastErrorConfirm(translation)
          noDupes = false;
          return
        }
      })

      if (address.length == 34 && noDupes) {
        wallet.address = address

        if (alias.length === 0) {
          alias = address
          wallet.alias = alias
        } else {
          wallet.alias = alias
        }
  
        if (this.wallets.length == 0) {
          wallet.active = true
          this.updateAlias(wallet.alias);
        } else {
          wallet.active = false
        }

        this.wallets.push(wallet)
      } else if (address.length !== 34) {
        let translation = this.translate.instant('invalid-address-toast-error');
        this.toastErrorConfirm(translation)
      }
      this.storageService.setWallets(this.wallets);
    }

    clearStorage(item) {
      let wallets = this.wallets
      this.wallets = []
     
      wallets.forEach(wallet => {
        if (wallet.address == item.address) {
          // Don't rebuild
        } else {
          this.wallets.push(wallet)
        }
      })

      if (this.wallets.length > 0) {
        if (item.active = true) {
          this.wallets[0].active = true
        }
      } 
      
      this.setActiveAlias();
      this.storageService.setWallets(this.wallets);
    }

    firstTimeStorage(data, address) {
      let alias = data.alias

      let wallets = this.wallets
      let wallet = Object.create(null)

      wallets.forEach(wallet => {
        wallet.active = false;
      })

        wallet.address = address
        wallet.active = true;
        wallet.alias = alias
     
        this.wallets.push(wallet)
        this.fetchWallet(address)
        this.storageService.setWallets(this.wallets);
    }

    //////////////////  Wallet History Retrieval //////////////////////////
    
    private nodeApi: string = 'https://node1.elaphant.app/api/v1';

    private toast: any = null;
    public rewardsObjectCreated: boolean = false;
    public rewardsMatched: boolean = false;
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
      this.http.get<any>('https://elanodes.com/api/payout-addresses').subscribe((res) => { 
        console.log('Payout Address fetch response', res)
        this._payoutAddresses = res.result
      });
    }


    public fetchWallet(address: string) {
      this._walletAddress = address;
      this.rewardsObjectCreated = false;
      this.walletRequested = true;
      this._rewards = []
  
      this.http.get<any>(this.nodeApi + '/history/' + address).subscribe((res) => {
        if (res.status == 200) { 
        console.log('Address Fetch Response', res)
        this._wallet = (res.result.History) 
        this.fetchBalance(this._walletAddress)
        } else {
          let translation = this.translate.instant('invalid-address-toast-error');
          this.toastError(translation)
          this.walletRequested = false;
        }
        }, (err) => {
          console.log(err);
          let translation = this.translate.instant('unknown-toast-error');
          this.toastError(translation)
          this.walletRequested = false;
      });
    } 


  public fetchBalance(address: string) {
      this.http.get<any>(this.nodeApi + '/asset/balances/' + address).subscribe((res) => {
        if (res.Error == 0) { 
        this._walletBalance = res.Result
        this.matchDelegate(this._wallet)
        } else {
          let translation = this.translate.instant('balance-fetch-toast-error');
          this.toastErrorConfirm(translation)
        }
        }, (err) => {
          console.log(err);
          let translation = this.translate.instant('unknown-toast-error');
          this.toastErrorConfirm(translation)
      });
  }

  public matchDelegate(wallet) {
    for (let i = wallet.length-1; i > -1; i--) {
      let sender = wallet[i].Inputs
        for (let j=0; j < sender.length; j++) {
          const result = this._payoutAddresses.filter(node => node.Payout_wallet.includes(sender[j]));

       if (result.length > 0) {
         let entry = Object.create(null)
         entry.Time = moment.unix(wallet[i].CreateTime).format('MM/DD/YY HH:mm')
         entry.CreateTime = wallet[i].CreateTime
         entry.imageUrl = this.nodesService.getRewardIcon(result[0].Nickname)
         entry.Delegate = this.truncateNames(result[0].Nickname)
         entry.ValueFloat = (wallet[i].Value/100000000)
         entry.Value = (wallet[i].Value/100000000).toFixed(6)
         entry.Memo =  wallet[i].Memo.slice(14)
         entry.Address = wallet[i].Inputs[0] //.substr(0,10) + '... ' + wallet[i].Inputs[0].substr(24,10)
         entry.Height = wallet[i].Height
         entry.Hash = wallet[i].Txid //.substr(0,16) + '... ' + wallet[i].Txid.substr(48,16)
         this._rewards.push(entry)
       }
      }
    }

    // If wallet has no matching rewards throw error
    if (this._rewards.length === 0) {
      let translation = this.translate.instant('no-rewards') + '\n\n'  + this._walletAddress.substr(0,14) + '... ' + this._walletAddress.substr(20,14)
      this.toastErrorConfirm(translation)
      this.rewardsMatched = false;
    } else {
      this.formatChartData(this._rewards)
      this.calculateReturnRates(this._rewards)
      this.rewardsPerNode(this._rewards)
      this.rewardsMatched = true;
    }
    this.rewardsObjectCreated = true;
    this.walletRequested = false;

  }

  public formatChartData(rewards) {
    let labels = rewards.map(function(e) {
      return e.CreateTime
    });
    labels = labels.reverse()

    let data = rewards.map(function(e) {
      return e.ValueFloat
    });
    data = data.reverse()

    let starting_balance: number = 0
    for (let i=0; i < data.length; i++) {
      starting_balance += parseFloat(data[i])
      data[i] = starting_balance
    }

    this.firstPayout = moment.unix(labels[0]).format('LL')
    this.totalEarned = data.slice(-1).pop().toFixed(4)
    this.totalPayouts = data.length

    this.historyChartLabels = labels
    this.historyChartData = data
  }

  public calculateReturnRates(data) {
    let week = 0
    let month = 0
    let timeNow = Date.now()/1000
    let timeWeek = 604800
    let timeMonth = 2628000
    let timestampWeek = timeNow - timeWeek
    let timestampMonth = timeNow - timeMonth

    for (let i=0; i < data.length; i++) {
      if (data[i].CreateTime > timestampMonth) {
        month += parseFloat(data[i].Value)
      }
      if (data[i].CreateTime > timestampWeek) {
        week += parseFloat(data[i].Value)
      }
  
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
      message: res,
      position: "middle",
      cssClass: 'toast-warn',
      duration: 2000
    });
    this.toast.present();
  }

    async toastErrorConfirm(res: string) {
        this.closeToast();
        this.toast = await this.toastController.create({
          mode: 'ios',
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

}
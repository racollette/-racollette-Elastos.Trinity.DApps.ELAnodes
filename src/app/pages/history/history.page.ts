import { Component, OnInit, Input, NgZone, Injectable, ViewChild } from '@angular/core';
import { ToastController, NavController, ModalController, AlertController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Router } from '@angular/router';

import { RewardsChartComponent } from '../../components/rewards-chart/rewards-chart.component';
import { NodesService } from 'src/app/services/nodes.service';
import { DataService } from 'src/app/services/data.service';
import { Node } from 'src/app/models/nodes.model';
import { Vote } from 'src/app/models/history.model';
import { TranslateService } from '@ngx-translate/core';


declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})

export class HistoryPage implements OnInit {

  @ViewChild('rewardsTable', { static: false }) table: any;

  public _votes: Vote[] = [];
  public address: string;
  public addressReturned: boolean = false;
  public alias: string;

  constructor(
    public nodesService: NodesService,
    private toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController,
    private navController: NavController,
    private zone: NgZone,
    private clipboard: Clipboard,
    public data: DataService,
    private router: Router,
    private translate: TranslateService
  ) { }

  // Toast for voteFailed/voteSuccess
  private toast: any = null;

  ngOnInit() {
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant('rewards-tab'))
    titleBarManager.setBackgroundColor("#000000");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
    appManager.setListener((ret) => {this.onMessageReceived(ret)});

    this.data.setActiveAlias();
    this.data.activeAlias.subscribe(alias => this.alias = alias)
    this.data.inputAddress.subscribe(address => this.address = address)
  }

  onMessageReceived(ret: AppManagerPlugin.ReceivedMessage) {
    if (ret.message == "navback") {
      this.navController.back();
    }
  }

  ionViewDidEnter() {
    this.data.setActiveAlias();
  }

  // modDate(date) {
  //   return moment(date).format("MMM Do YY, h:mm:ss a");
  // }

  // setActiveAlias() {
  //   let wallets = this.data.wallets

  //   wallets.forEach(wallet => {
  //     if (wallet.active == true ) {
  //       this.activeAlias = wallet.alias
  //     }
  //   })
  // }

  switchWallets() {
    this.router.navigate(['wallets']);
  }


  requestWalletAccess() {
    appManager.sendIntent("walletaccess", { elaaddress: { reason: 'Check staking rewards history' } }, {}, (res) => {
      this.zone.run(() => {
        console.log(res)
        if (res.result.elaaddress) {
          console.log('success?')
          this.address = res.result.elaaddress;
          this.addressReturned = !this.addressReturned
          console.log(this.address)
          this.data.updateInputAddress(this.address)
          this.addWalletStorage();
        } else if (res.result.walletinfo) {

          console.log('else if?')
          this.address = res.result.walletinfo[0].elaaddress
        } else {
          this.toastWalletErr();
        }
      });
    }, (err) => {
      console.log(err);
      this.toastWalletErr();
    });
  }

  async addWalletStorage() {
    let address = (this.address).trim()
    let match: boolean = false

    this.data.wallets.forEach(wallet => {
      if (wallet.address == address) {
        match = true
      }
    })

    if (!match) {

      const alert = await this.alertController.create({
        cssClass: 'firstAddWalletAlert',
        header: this.translate.instant('save-alert-header'),
        message: this.translate.instant('save-alert-message'),
        buttons: [
          {
            text: this.translate.instant('no-alert'),
            role: 'cancel',
            handler: () => {
              this.retrieveTxHistory();
            }
          }, {
            text: this.translate.instant('yes-alert'),
            cssClass: 'acceptButton',
            handler: () => {
              this.aliasAlert(address);
            }
          }
        ]
      });
      await alert.present();

    } else {
      this.retrieveTxHistory();
    }
  }

  async aliasAlert(address) {
    const alert = await this.alertController.create({
      cssClass: 'addWalletAlert',
      header: this.translate.instant('alias-alert'),
      inputs: [
        {
          name: 'alias',
          type: 'text',
          id: 'alias-id',
          placeholder: this.translate.instant('optional-alert'),
        },
      ],
      buttons: [
        {
          text: this.translate.instant('no-thanks-alert'),
          role: 'cancel',
          handler: () => {
            let data = address
            this.data.firstTimeStorage(data, address);
            this.data.setActiveAlias();
          }
        }, {
          text: this.translate.instant('add-alert'),
          cssClass: 'acceptButton',
          handler: data => {
            this.data.firstTimeStorage(data, address);
            this.data.setActiveAlias();
          }
        }
      ]
    });
    await alert.present();
  }

  retrieveTxHistory() {
    let address = (this.address).trim()
    this.data.fetchWallet(address)
  }

  pasteAddress() {
    this.clipboard.paste().then((resolve: string) => {
      //console.log(resolve);
      this.address = resolve;
      this.data.updateInputAddress(this.address)
      this.addWalletStorage();

    }, (reject: string) => {
      console.error('Error: ' + reject);
    }
    );
  };

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row.selected[0]);
  }

  // async voteSuccess(res: string) {
  //   this.closeToast();
  //   this.toast = await this.toastController.create({
  //     mode: 'ios',
  //     header: 'Votes successfully submitted.',
  //     message: 'Txid:' + res,//.slice(0,30) + '...',
  //     cssClass: "toaster",
  //     position: "middle",
  //     buttons: [
  //       {
  //         text: 'Ok',
  //         handler: () => {
  //           this.toast.dismiss();
  //         }
  //       }
  //     ],
  //   });
  //   this.toast.present();
  // }

  // async toastError(res: string) {
  //   this.closeToast();
  //   this.toast = await this.toastController.create({
  //     mode: 'ios',
  //     //header: 'Failed to get an address from your wallet',
  //     message: res,
  //     //color: "primary",
  //     position: "middle",
  //     cssClass: 'toaster',
  //     buttons: [
  //       {
  //         text: 'Ok',
  //         handler: () => {
  //           this.toast.dismiss();
  //         }
  //       }
  //     ]
  //   });
  //   this.toast.present();
  // }

  async toastWalletErr() {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      header: this.translate.instant('access-fail-toast-header'),
      message: this.translate.instant('access-fail-toast-message'),
      //color: "primary",
      position: "middle",
      cssClass: 'toaster',
      buttons: [
        {
          text: this.translate.instant('ok-toast'),
          handler: () => {
            this.toast.dismiss();
          }
        }
      ]
    });
    this.toast.present();
  }

  // // If we get response from sendIntent, we need to close the toast showed for timeout
  closeToast() {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: RewardsChartComponent,
      componentProps: {
        historyChartData: this.data.historyChartData,
        historyChartLabels: this.data.historyChartLabels,
        firstPayout: this.data.firstPayout,
        totalEarned: this.data.totalEarned,
        totalPayouts: this.data.totalPayouts,
        weekEarn: this.data.weekEarn,
        weekARR: this.data.weekARR,
        monthEarn: this.data.monthEarn,
        monthARR: this.data.monthARR,
        perNodeEarningsObject: this.data.perNodeEarningsObject
      }
    });
    return await modal.present();
  }


}

import { Component, OnInit, Input, NgZone, Injectable, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ToastController, NavController, ModalController, AlertController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Router } from '@angular/router';

import { RewardsChartComponent } from '../../components/rewards-chart/rewards-chart.component';
import { NodesService } from 'src/app/services/nodes.service';
import { DataService } from 'src/app/services/data.service';
import { Node } from 'src/app/models/nodes.model';
import { TranslateService } from '@ngx-translate/core';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})

export class RewardsPage implements OnInit {

  @ViewChild('rewardsTable', { static: false }) table: any;

  public address: string;
  public addressReturned: boolean = false;
  public alias: string;
  public modalOpen: boolean = false;

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
    private translate: TranslateService,
    private changeDetection: ChangeDetectorRef
  ) { }

  // Toast for voteFailed/voteSuccess
  private toast: any = null;

  // Tabledata
  public render: boolean = false;

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
    if (ret.message == "navback" && this.modalOpen) {
      this.modalController.dismiss();
      this.modalOpen = false;
    } else if (ret.message == "navback") {
      this.navController.back();
    }
  }

  ionViewDidEnter() {
    this.data.setActiveAlias();
    this.resetChildForm();
  }

  resetChildForm(){
    this.render = false;
    setTimeout(() => {
      this.render = true;
    }, 50);
  }

  switchWallets() {
    this.router.navigate(["/tabs/wallets"]);
  }


  requestWalletAccess() {
    appManager.sendIntent("walletaccess", { elaaddress: { reason: 'Check staking rewards rewards' } }, {}, (res) => {
      this.zone.run(() => {
        console.log(res)
        console.log(res.result)
        if (res.result.elaaddress) {
          this.address = res.result.elaaddress;
          this.addressReturned = !this.addressReturned
          this.data.updateInputAddress(this.address)
          this.addWalletStorage();
        } else if (res.result.walletinfo) {
          this.address = res.result.walletinfo[0].elaaddress
          this.addressReturned = !this.addressReturned
          this.data.updateInputAddress(this.address)
          this.addWalletStorage();
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
        match = true;
        wallet.active = true;
      } else {
        wallet.active = false;
      }
    })
    this.data.setActiveAlias();

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
              this.retrieveTxRewards();
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
      this.retrieveTxRewards();
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

  retrieveTxRewards() {
    let address = (this.address).trim()
    this.data.fetchWallet(address)
  }

  pasteAddress() {
    this.clipboard.paste().then((resolve: string) => {
      //console.log(resolve);
      this.address = resolve
      this.data.updateInputAddress(this.address)
      this.addWalletStorage();

    }, (reject: string) => {
      console.error('Error: ' + reject);
    }
    );
  };

  toggleExpandRow(row) {
    console.log(row)
    this.table.rowDetail.toggleExpandRow(row.selected[0]);
    console.log(this.table.rowDetail)
  }

  async toastWalletErr() {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      header: this.translate.instant('access-fail-toast-header'),
      message: this.translate.instant('access-fail-toast-message'),
      position: "middle",
      cssClass: 'toast-warn',
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
    this.modalOpen = true;
    return await modal.present();
  }


}

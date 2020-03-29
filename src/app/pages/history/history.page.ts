import { Component, OnInit, Input, NgZone, Injectable, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { RewardsChartComponent } from '../../components/rewards-chart/rewards-chart.component';
import { NodesService } from 'src/app/services/nodes.service';
import { DataService } from 'src/app/services/data.service';
import { Node } from 'src/app/models/nodes.model';
import { Vote } from 'src/app/models/history.model';

declare let appManager: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})

export class HistoryPage implements OnInit {

  @ViewChild('rewardsTable',{static:false}) table: any;

  public _votes: Vote[] = [];
  public address: string = '';
  public addressReturned: boolean = false;

  constructor(
    public nodesService: NodesService,
    private toastController: ToastController,
    private modalController: ModalController,
    private zone: NgZone,
    private clipboard: Clipboard,
    public data: DataService
    ) { }

  // Toast for voteFailed/voteSuccess
  private toast: any = null;

  ngOnInit() {
  }

  // modDate(date) {
  //   return moment(date).format("MMM Do YY, h:mm:ss a");
  // }



  requestWalletAccess() {
      appManager.sendIntent("walletaccess", {elaaddress: {reason: 'Check staking rewards history'}}, {}, (res) => {
      this.zone.run(() => {
        if(res.result.elaaddress) {
          this.address = res.result.elaaddress;
          this.addressReturned = !this.addressReturned
          this.retrieveTxHistory();
        } else if(res.result.walletinfo) {
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

  retrieveTxHistory() {
    let address = (this.address).trim()
    this.data.fetchWallet(address)
  }
  
  pasteAddress(){
    this.clipboard.paste().then((resolve: string) => {
      this.address = resolve;
      console.log(resolve);
      this.retrieveTxHistory();
    }, (reject: string) => {
      console.error('Error: ' + reject);
      }
    );
  };

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row.selected[0]);
  }

  async voteSuccess(res: string) {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      header: 'Votes successfully submitted.',
      message: 'Txid:' + res,//.slice(0,30) + '...',
      cssClass: "toaster",
      position: "middle",
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.toast.dismiss();
          }
        }
      ],
    });
    this.toast.present();
  }

  async toastError(res: string) {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      //header: 'Failed to get an address from your wallet',
      message: res,
      //color: "primary",
      position: "middle",
      cssClass: 'toaster',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.toast.dismiss();
          }
        }
      ]
    });
    this.toast.present();
  }

   async toastWalletErr() {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      header: 'Failed to get an address from your wallet',
      message: 'Is your wallet set up?',
      //color: "primary",
      position: "middle",
      cssClass: 'toaster',
      buttons: [
        {
          text: 'Ok',
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

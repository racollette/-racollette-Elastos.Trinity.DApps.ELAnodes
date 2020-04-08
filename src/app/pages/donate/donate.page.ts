import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-donate',
  templateUrl: './donate.page.html',
  styleUrls: ['./donate.page.scss'],
})
export class DonatePage implements OnInit {

  public value: number = 0;

  // Toast for donate Failed/Success
  private toast: any = null;

  public donationAddress: string = "EWgdfwohScg3SPHr9PL14iu8odZJLc76u5"

  constructor(
    private toastController: ToastController,
    private navController: NavController,
    private zone: NgZone,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant('donate-title'))
    titleBarManager.setBackgroundColor("#000000");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
    appManager.setListener((ret) => {this.onMessageReceived(ret)});
  }

  onMessageReceived(ret: AppManagerPlugin.ReceivedMessage) {
    if (ret.message == "navback") {
      this.navController.back();
    }
  }

  ionViewDidEnter() {
  }

  rangeValue(event) {
    this.value = (event.detail.value).toFixed(1)
  }

  donate() {
    appManager.sendIntent("pay", {
      receiver: this.donationAddress,
      amount: this.value,
      type: 'payment-confirm'
    }, {}, (res) => {
      this.zone.run(() => {
        if (res.result.txid) {
          let translation: string = this.translate.instant('donate-success-toast');
          this.paySuccess(translation, res);
        } else {
          let translation: string = this.translate.instant('donate-canceled-toast');
          this.toastError(translation);
        }
      });
    }, (err) => {
      console.log(err);
      let translation: string = this.translate.instant('Error. Unable to access wallet application.');
      this.toastError(translation);
    });
  }

  async paySuccess(header: string, res: string) {
    this.closeToast();
    this.toast = await this.toastController.create({
      mode: 'ios',
      header: this.translate.instant('Success! We appreciate your support!'),
      message: res,
      cssClass: "toast-success",
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
      message: res,
      position: "middle",
      cssClass: 'toast-warn',
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


  closeToast() {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
  }

}

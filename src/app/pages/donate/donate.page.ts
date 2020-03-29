import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';

declare let appManager: any;

@Component({
    selector: 'app-donate',
    templateUrl: './donate.page.html',
    styleUrls: ['./donate.page.scss'],
})
export class DonatePage implements OnInit {

    public value: number = 0;

    // Toast for donate Failed/Success
    private toast: any = null;

    constructor(
        private toastController: ToastController,
        private zone: NgZone
    ) {}

    ngOnInit() {
    }

    close() {
    }

    rangeValue(event) {
        this.value = (event.detail.value).toFixed(1)
        console.log('Donation Value: ' + this.value)
    }

    donate() {
      appManager.sendIntent("pay", {
          receiver:'EXnTnfzbz3xdnarzruf9rLzawGrw7ENnMd', 
          amount: this.value, 
          type: 'payment-confirm'
        }, {}, (res) => {
      this.zone.run(() => {
        if(res.result) {
            console.log(res.result)
        //   this.address = res.result.elaaddress;
        //   this.addressReturned = !this.addressReturned
        //this.paySuccess('Success! We appreciate your support!');
        this.paySuccess(res);
        } else {
          this.toastError('Error. Payment canceled');
        }
      });
    }, (err) => {
      console.log(err);
      this.toastError('Oops');
    });
    }

    async paySuccess(res: string) {
        this.closeToast();
        this.toast = await this.toastController.create({
          mode: 'ios',
          header: 'Votes successfully submitted.',
          message: res,//.slice(0,30) + '...',
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


    closeToast() {
       if (this.toast) {
         this.toast.dismiss();
         this.toast = null;
       }
     }

}
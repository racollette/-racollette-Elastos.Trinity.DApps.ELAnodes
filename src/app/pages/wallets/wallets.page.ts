import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
    selector: 'app-wallets',
    templateUrl: './wallets.page.html',
    styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {

    constructor(
        private alertController: AlertController,
        private toastController: ToastController
    ) {}

    private toast: any = null;

    ngOnInit() {
    }

    public wallets = [
      {
      address: "EXnTnfzbz3xdnarzruf9rLzawGrw7ENnMd",
      alias: "elephant" 
      },
      {
      address: "EK5TPYQVP4AuS9i1ytY5j8xuG5x4qWL9a6",
      alias: "vlyx"
      },
    ];

    async addWallet() {
     const alert = await this.alertController.create({
        cssClass: 'addWalletAlert',
        header: 'Add wallet',
        inputs: [
        {
          name: 'alias',
          type: 'text',
          id: 'alias-id',
          placeholder: 'Alias (optional)'
        },
        {
          name: 'address',
          type: 'text',
          id: 'address-id',
          placeholder: 'Address'
        }
      ],
        buttons: [
        {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Cancel');
            }
        }, {
            text: 'Add',
            cssClass: 'acceptButton',
            handler: data => {
                this.expandStorage(data);
            }
        }
    ]
    });
      await alert.present();
    }

    expandStorage(data) {
      console.log(data)
      let address = data.address
      let alias = data.alias
      let noDupes: boolean = true;

      let wallets = this.wallets
      let wallet = Object.create(null)

      wallets.forEach(wallet => {
        if (wallet.address == address) {
          this.toastError('Duplicate address detected. Please remove the old one before updating the alias.')
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
        this.wallets.push(wallet)
      } else if (address.length !== 34) {
        this.toastError('Not a valid address. Please try again.')
      }
      
    }
  
    async removeWallet(item) {
     const alert = await this.alertController.create({
        cssClass: 'removeWalletAlert',
        header: 'Remove wallet',
        message: 'Wallet address will be cleared from device storage.',
        buttons: [
        {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Cancel');
            }
        }, {
            text: 'Remove',
            cssClass: 'acceptButton',
            handler: () => {
                this.clearStorage(item);
            }
        }
    ]
    });
      await alert.present();
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
    }


    async toastError(res: string) {
        this.closeToast();
        this.toast = await this.toastController.create({
          mode: 'ios',
          message: res,
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
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { TranslateService } from '@ngx-translate/core';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-wallets',
    templateUrl: './wallets.page.html',
    styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {

    constructor(
        private alertController: AlertController,
        private toastController: ToastController,
        private navController: NavController,
        public data: DataService,
        public storageService: StorageService,
        private translate: TranslateService,
    ) { }

    private toast: any = null;

    ngOnInit() {
    }

    ionViewWillEnter() {
        titleBarManager.setTitle(this.translate.instant('wallets-title'))
    }

    toggleActiveWallet(item) {
        this.data.wallets.forEach(wallet => {
            if (wallet.address == item.address) {
                wallet.active = true
            } else {
                wallet.active = false;
            }
        });
        this.storageService.setWallets(this.data.wallets);
        this.data.updateAlias(item.alias)
        this.data.updateInputAddress(item.address)

        if (!this.data.walletRequested) {
            this.data.fetchWallet(item.address)
        }
    }

    async addWallet() {
        const alert = await this.alertController.create({
            cssClass: 'addWalletAlert',
            header: this.translate.instant('add-alert-header'),
            inputs: [
                {
                    name: 'alias',
                    type: 'text',
                    id: 'alias-id',
                    placeholder: this.translate.instant('add-alert-alias'),
                },
                {
                    name: 'address',
                    type: 'text',
                    id: 'address-id',
                    placeholder: this.translate.instant('add-alert-address'),
                }
            ],
            buttons: [
                {
                    text: this.translate.instant('add-alert-cancel'),
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel');
                    }
                }, {
                    text: this.translate.instant('add-alert-add'),
                    cssClass: 'acceptButton',
                    handler: data => {
                        this.data.expandStorage(data);
                    }
                }
            ]
        });
        await alert.present();
    }

    async removeWallet(item) {
        const alert = await this.alertController.create({
            cssClass: 'removeWalletAlert',
            header: this.translate.instant('remove-alert-header'),
            message: this.translate.instant('remove-alert-message'),
            buttons: [
                {
                    text: this.translate.instant('remove-alert-cancel'),
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel');
                    }
                }, {
                    text: this.translate.instant('remove-alert-remove'),
                    cssClass: 'acceptButton',
                    handler: () => {
                        this.data.clearStorage(item);
                    }
                }
            ]
        });
        await alert.present();
    }

}

import { Injectable, NgZone } from '@angular/core';
//import { Router } from '@angular/router';
//import { ToastController, LoadingController, NavController } from '@ionic/angular';
//import { Clipboard } from '@ionic-native/clipboard/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
//import { TranslateService } from '@ngx-translate/core';
//import { Logger } from '../services/Logger';

/***
 * APP底层交互
 */
@Injectable({
  providedIn: 'root'
})

export class Native {
    //private mnemonicLang: string = "english";
    //private loadingIsOpen: boolean = false;
    constructor(//public toastCtrl: ToastController,
                //private clipboard: Clipboard,
                //public translate: TranslateService,
                //private loadingCtrl: LoadingController,
                private inappBrowser: InAppBrowser
                //private navCtrl: NavController,
                //private zone: NgZone,
                //private router: Router
                ) {}

    // public info(message) {
    //     Logger.log(message, "Info");
    // }

    // public error(message) {
    //     Logger.log(message, "Error");
    // }

    // public warnning(message) {
    //     Logger.log(message, "Warnning");
    // }

    // public toast(_message: string = '操作完成', duration: number = 2000): void {
    //     this.toastCtrl.create({
    //         message: _message,
    //         duration: 2000,
    //         position: 'top'
    //     }).then(toast => toast.present());
    // }

    // public toast_trans(_message: string = '', duration: number = 2000): void {
    //     _message = this.translate.instant(_message);
    //     this.toastCtrl.create({
    //         message: _message,
    //         duration: 2000,
    //         position: 'middle'
    //     }).then(toast => toast.present());
    // }

    // copyClipboard(text) {
    //     return this.clipboard.copy(text);
    // }

    // public go(page: any, options: any = {}) {
    //     console.log("Navigating to:", page);
    //     this.zone.run(()=>{
    //         this.hideLoading();
    //         this.navCtrl.setDirection('forward');
    //         this.router.navigate([page], { queryParams: options });
    //     });
    // }

    // public pop() {
    //     this.navCtrl.pop();
    // }

    public openUrl(url: string) {
        const target = "_system";
        const options = "location=no";
        this.inappBrowser.create(url, target, options);
    }

    // public setRootRouter(page: any,  options: any = {}) {
    //     console.log("Setting root router path to:", page);
    //     this.zone.run(()=>{
    //         this.hideLoading();
    //         this.navCtrl.setDirection('root');
    //         this.router.navigate([page], { queryParams: options });
    //     });
    // }

    // public getMnemonicLang(): string {
    //     return this.mnemonicLang;
    // }

    // public setMnemonicLang(lang) {
    //     this.mnemonicLang = lang;
    // }

    // public clone(myObj) {
    //     if (typeof (myObj) != 'object') return myObj;
    //     if (myObj == null) return myObj;

    //     let myNewObj;

    //     if (myObj instanceof (Array)) {
    //         myNewObj = new Array();
    //     } else {
    //         myNewObj = new Object();
    //     }

    //     for (let i in myObj)
    //         myNewObj[i] = this.clone(myObj[i]);

    //     return myNewObj;
    // }

    // /**
    //  * 统一调用此方法显示loading
    //  * @param content 显示的内容
    //  */
    // public async showLoading(content: string = '') {
    //     if (!this.loadingIsOpen) {
    //         this.loadingIsOpen = true;
    //         let loading = await this.loadingCtrl.create({
    //             message: content
    //         });
    //         return await loading.present();
    //     }
    // }

    // /**
    //  * 关闭loading
    //  */
    // public hideLoading(): void {
    //     this.loadingIsOpen && this.loadingCtrl.dismiss();
    //     this.loadingIsOpen = false;
    // }

    // public getTimestamp() {
    //     return new Date().getTime().toString();
    // }
}
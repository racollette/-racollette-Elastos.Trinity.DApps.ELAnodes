import { NotificationService } from './../../services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Native } from '../../services/native.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

interface NotificationOptions {
    health: string;
    report: boolean;
    change: boolean;
}

@Component({
    selector: 'app-notification',
    templateUrl: './notification.page.html',
    styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

    constructor(public native: Native,
        public translate: TranslateService,
        public data: DataService,
        private navController: NavController,
        private zone: NgZone,
        private storageService: StorageService,
        private notificationService: NotificationService
    ) { }

    public health: string;
    public report: boolean;
    public change: boolean;
    public optimal: boolean;
    public revote: boolean;
    public storedAddress: boolean;
    public notificationOptions: any;

    ngOnInit() {
    }

    ionViewWillEnter() {
        titleBarManager.setTitle(this.translate.instant('notification-title'))

        this.storageService.getNotificationOptions().then(data => {
            if (data) {
                this.notificationOptions = data;
                this.health = data.health.frequency;
                this.report = data.report.enabled;
                this.change = data.change.enabled;
                this.optimal = data.optimal.enabled;
                this.revote = data.revote.enabled;
                this.storedAddress = data.storedAddress.enabled;
            } else {
                this.zone.run(() => {
                    this.notificationOptions = this.notificationService.defaultOptions()
                    this.health = this.notificationOptions.health.frequency
                    this.report = this.notificationOptions.report.enabled
                    this.change = this.notificationOptions.change.enabled
                    this.optimal = this.notificationOptions.optimal.enabled
                    this.revote = this.notificationOptions.revote.enabled
                    this.storedAddress = this.notificationOptions.storedAddress.enabled
                });
            }
        });
    }

    ionViewDidEnter() {
    }

    healthCheckFrequency(event) {
        let choice = event.detail.value
        console.log('Frequency set at ' + choice)
        this.notificationOptions.health.frequency = choice
        this.storageService.setNotificationOptions(this.notificationOptions)
    }

    optionsToggle(event, option) {
        switch (option) {
            case 'report':
                this.notificationOptions.report.enabled = event.detail.checked;
                this.storageService.setNotificationOptions(this.notificationOptions)
                break;
            case 'change':
                this.notificationOptions.change.enabled = event.detail.checked;
                this.storageService.setNotificationOptions(this.notificationOptions)
                break;
            case 'optimal':
                this.notificationOptions.optimal.enabled = event.detail.checked;
                this.storageService.setNotificationOptions(this.notificationOptions)
                break;
            case 'revote':
                this.notificationOptions.revote.enabled = event.detail.checked;
                this.storageService.setNotificationOptions(this.notificationOptions)
                break;
            case 'storedAddress':
                this.notificationOptions.storedAddress.enabled = event.detail.checked;
                this.storageService.setNotificationOptions(this.notificationOptions)
                break;
            default:
                break;
        }
    }

}

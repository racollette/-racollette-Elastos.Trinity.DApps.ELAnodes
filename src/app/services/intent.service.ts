import { Injectable, NgZone } from '@angular/core';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { Native } from './native.service';
import { DataService } from './data.service';
import { NodesService } from './nodes.service';

declare let appManager: AppManagerPlugin.AppManager;

@Injectable({
    providedIn: 'root'
})

export class IntentService {

    constructor(
        private zone: NgZone,
        public events: Events,
        public native: Native,
        public nodesService: NodesService,
        public data: DataService
    ) { }

    static intentConfig: any;
    private isReceiveIntentReady = false;

    init() {
        console.log("Intents service initialized");
        this.setIntentListener();
    }

    setIntentListener() {
        if (!this.isReceiveIntentReady) {
            this.isReceiveIntentReady = true;
            appManager.setIntentListener((intent: AppManagerPlugin.ReceivedIntent) => {
                this.onReceiveIntent(intent);
            });
        }
    }

    onReceiveIntent(intent: AppManagerPlugin.ReceivedIntent) {
        console.log("Intent received message:", intent.action, ". params: ", intent.params, ". from: ", intent.from);

        switch (intent.action) {
            case 'elanodes-stakingtools':
            case 'elanodes-addwallet':
            case 'elanodes-viewreport':
                this.handleRoutingIntent(intent);
                break;
            default:
                break;
        }
    }

    handleRoutingIntent(intent: AppManagerPlugin.ReceivedIntent) {

        switch (intent.action) {
            case 'elanodes-stakingtools':
                console.log('Open staking tools page');
                this.native.go('/tabs/vote')
                this.native.openMenu();
                break;
            case 'elanodes-addwallet':
                console.log('Open address storage page');
                this.native.go('/tabs/wallets')
                this.native.closeMenu();

                break;
            case 'elanodes-viewreport':
                console.log('Open rewards page');
                this.native.go('/tabs/rewards')
                this.native.closeMenu();
                break;
            default:
                console.log('Unknown intent:', intent);
                return;
        }

    }

}
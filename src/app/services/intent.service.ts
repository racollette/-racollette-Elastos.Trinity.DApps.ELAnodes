import { Injectable, NgZone } from '@angular/core';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';

declare let appManager: AppManagerPlugin.AppManager;

@Injectable({
    providedIn: 'root'
})

export class IntentService {

    constructor(
        private zone: NgZone,
        public events: Events
    ) { }

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
            case 'stakingtools':
                this.handleStakingIntent(intent);
                break;
            case 'addwallet':
                this.handleAddWalletIntent(intent);
                break;
            case 'viewreport':
                this.handleWeeklyReportIntent(intent);
                break;
            default:
                break;
        }
    }

    handleStakingIntent(intent: AppManagerPlugin.ReceivedIntent) {
        console.log('Staking intent')
    }

    handleAddWalletIntent(intent: AppManagerPlugin.ReceivedIntent) {
        console.log('Add wallet intent')
    }

    handleWeeklyReportIntent(intent: AppManagerPlugin.ReceivedIntent) {
        console.log('Weekly report intent')
    }


}
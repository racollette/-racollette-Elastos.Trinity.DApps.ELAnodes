import { DataService } from './data.service';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { NodesService } from 'src/app/services/nodes.service';
import { TranslateService } from '@ngx-translate/core';

declare let appManager: AppManagerPlugin.AppManager;
declare let notificationManager: NotificationManagerPlugin.NotificationManager;

@Injectable({
    providedIn: 'root'
})

export class NotificationService {

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
        private data: DataService,
        private nodesService: NodesService,
        private translate: TranslateService,
        private zone: NgZone
    ) { }

    public storedNodes: any;
    public _nodeStatus = []
    public hasSendHealthCheckNotification: boolean = false;
    private nodeApi: string = 'https://node1.elaphant.app/api/v1/';

    public voteRecordExists: boolean = false;
    public storedWalletNodes: any;
    public lastVote: number;

    public activeAddress: string;

    async init() {
        this.data.getLanguage();
        console.log('Notification service initiated')
        this.storedNodes = await this.storageService.getNodes().then(storedNodes => {
            if (storedNodes) {
                return storedNodes
            } else {
                console.log('No saved nodes found.')
                return false
            }
        });

        this.storedWalletNodes = await this.storageService.getWallets().then(storedAddresses => {
            if (storedAddresses && storedAddresses.length > 0) {
                console.log(storedAddresses)
                // Choose the active wallet
                let activeAddress: string;
                storedAddresses.forEach(wallet => {
                    if (wallet.active == true) {
                        activeAddress = wallet.address
                        this.activeAddress = wallet.address
                    }
                });
                console.log(activeAddress)
                console.log('No local voting record. Rewards address stored. Retrieving last vote record')
                let nodes = this.fetchVoteRecord(activeAddress);
                return nodes

            } else {
                console.log('No voting addresses saved.')
                return false
            }
        });

        if (this.storedNodes !== false || this.storedWalletNodes !== false) {
            this.checkNotificationSettings()
        }

    }


    checkNotificationSettings() {
        this.storageService.getNotificationOptions().then(settings => {
            if (settings) {
                console.log('Use saved notification settings')
            } else {
                settings = this.defaultOptions()
            }

            let elapsed = Date.now() - settings.health.lastNotify

            switch (settings.health.frequency) {
                case 'instant':
                    console.log('Every session health check')
                    this.setNotificationTime('health', settings)
                    this.fetchNodeStatus('health');
                    break;
                case 'daily':
                    if (elapsed > 3600 * 24 * 1000) {
                        console.log('Daily health check')
                        this.setNotificationTime('health', settings)
                        this.fetchNodeStatus('health');
                    }
                    break;
                case 'weekly':
                    if (elapsed > 7 * 3600 * 24 * 1000) {
                        console.log('Weekly health check')
                        this.setNotificationTime('health', settings)
                        this.fetchNodeStatus('health');
                    }
                    break;
                case 'never':
                    break;
                default:
                    break;
            }

            if (settings.report.enabled == true) {
                console.log('Weekly earnings report check')
                let reportElapsed = Date.now() - settings.report.lastNotify
                if (reportElapsed > 7 * 3600 * 24 * 1000) { // Weekly
                    console.log('Weekly earnings report')
                    this.setNotificationTime('report', settings)
                    this.weeklyReportNotification()
                }
            }
            if (settings.change.enabled == true) {
                console.log('Change detection check')
                let changeElapsed = Date.now() - settings.change.lastNotify
                if (changeElapsed > 2 * 3600 * 24 * 1000) { // Two days
                    console.log('Significant change detection scan')
                    this.setNotificationTime('change', settings)
                    this.fetchNodeStatus('change');
                }
            }
            if (settings.optimal.enabled == true) {
                let optimalElapsed = Date.now() - settings.optimal.lastNotify
                if (optimalElapsed > 10 * 3600 * 24 * 1000) { // Ten days
                    console.log('Optimal configuration check')
                    this.setNotificationTime('optimal', settings)
                    this.fetchNodeStatus('optimal');
                }
            }
            if (settings.storedAddress.enabled == true) {
                let storedAddressElapsed = Date.now() - settings.storedAddress.lastNotify
                if (storedAddressElapsed > 7 * 3600 * 24 * 1000) { // One week
                    console.log('Address storage check')
                    this.setNotificationTime('storedAddress', settings)
                    if (this.activeAddress.length !== 34) {
                        this.noAddressStored()
                    }
                }
            }
            if (settings.revote.enabled == true) {
                // Requires an address to be stored locally. Append to stored wallet check?
                let revoteElapsed = Date.now() - settings.revote.lastNotify
                if (revoteElapsed > 1 * 3600 * 24 * 1000) { // Two days
                    console.log('Vote cancellation check')
                    if (this.activeAddress.length == 34) {
                        this.setNotificationTime('revote', settings)
                        // Route to fetch then cancellation detection function
                        this.fetchTxHistory(this.activeAddress)
                    }
                }
            }

        });
    }

    public defaultOptions() {
        return {
            health: { frequency: 'weekly', lastNotify: null },
            change: { enabled: true, lastNotify: null },
            report: { enabled: true, lastNotify: null },
            optimal: { enabled: true, lastNotify: null },
            revote: { enabled: true, lastNotify: null },
            storedAddress: { enabled: true, lastNotify: null }
        }
    }

    setNotificationTime(type, settings) {
        let timestamp = Date.now()
        settings[type].lastNotify = timestamp
        this.storageService.setNotificationOptions(settings)
    }

    fetchVoteRecord(address): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get<any>(this.nodeApi + 'dpos/address/' + address + '?pageSize=1&pageNum=1').subscribe((res) => {
                console.log('Voting record', res)
                this.voteRecordExists = true;
                this.lastVote = res.result[0].Vote_Header.Block_time;
                resolve(res.result[0].Vote_Header.Nodes)
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    fetchNodeStatus(category): Promise<any> {
        this._nodeStatus = []
        return new Promise((resolve, reject) => {
            this.http.get<any>('https://elanodes.com/api/payout-addresses').subscribe((res) => {
                this._nodeStatus = res.result;

                switch (category) {
                    case 'health':
                        if (this.voteRecordExists) {
                            this.checkNodeCount(this.storedWalletNodes)
                            this.checkInactives(this._nodeStatus, this.storedWalletNodes)
                        } else {
                            this.checkNodeCount(this.storedNodes)
                            this.checkInactives(this._nodeStatus, this.storedNodes)
                        }
                        break;
                    case 'change':
                        if (this.voteRecordExists) {
                            this.changeDetection(this._nodeStatus, this.storedWalletNodes)
                        } else {
                            this.changeDetection(this._nodeStatus, this.storedNodes)
                        }
                        break;
                    case 'optimal':
                        if (this.voteRecordExists) {
                            this.optimalConfiguration(this._nodeStatus, this.storedWalletNodes)
                        } else {
                            this.optimalConfiguration(this._nodeStatus, this.storedNodes)
                        }
                        break;
                    default:
                        break;
                }
                resolve(res.result);
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    fetchTxHistory(address): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get<any>(this.nodeApi + 'history/' + address + '?order=desc').subscribe((res) => {
                console.log('Tx history', res)
                this.cancellationDetection(res.result.History)
                resolve(res.result.History)
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    checkNodeCount(data) {
        if (data.length < 36) {
            this.sendHealthCheckNotification('sub36', 36 - data.length)
        }
    }

    checkInactives(data, votedNodes) {
        console.log('All nodes', data)
        console.log('My voted nodes', votedNodes)

        // Development code
        //let inactives = data.filter((node) => node.Nickname === 'Starfish' || node.Nickname === 'Elastos Australia' || node.Nickname === 'ThaiEla');
        // Production code
        let inactives = data.filter((node) => node.State === 'Inactive' || node.State === 'Canceled' || node.State === 'Illegal' || node.State === 'Returned');
        let votedInactives: number = 0;
        votedNodes.forEach(storedNode => {
            let match = inactives.find(inactiveNode => inactiveNode.Producer_public_key === storedNode)
            if (match !== undefined) {
                votedInactives++
                if (match.State === 'Inactive') {
                    this.sendHealthCheckNotification('offline', match.Nickname)
                } else if (match.State === 'Canceled' || match.State === 'Returned') {
                    this.sendHealthCheckNotification('canceled', match.Nickname)
                } else if (match.State === 'Illegal') {
                    this.sendHealthCheckNotification('illegal', match.Nickname)
                }
            }
        });

        if (votedInactives == 0) {
            this.sendHealthCheckNotification('pass', [])
        }
    }

    sendHealthCheckNotification(type, name) {
        let request: NotificationManagerPlugin.NotificationRequest = {
            key: '',
            title: this.translate.instant('notification-health-header'),
            message: '',
            url: 'https://scheme.elastos.org/elanodes-stakingtools?'
        };


        switch (type) {
            case 'sub36':
                request.key = 'sub36Alert'
                request.message = this.translate.instant('notification-health-sub36-1') + ' ' + name + ' ' + this.translate.instant('notification-health-sub36-2')
                notificationManager.sendNotification(request);
                console.log('Sub36')
                break;
            case 'pass':
                request.key = 'healthStatusPass'
                request.message = this.translate.instant('notification-health-pass')
                request.url = ''
                notificationManager.sendNotification(request);
                console.log('Pass')
                break;
            case 'offline':
                request.key = name + '-offlineAlert'
                request.message = name + ' ' + this.translate.instant('notification-health-offline-2')
                notificationManager.sendNotification(request);
                console.log('Inactive')
                break;
            case 'canceled':
                request.key = name + '-canceledAlert'
                request.message = name + ' ' + this.translate.instant('notification-health-canceled-2')
                notificationManager.sendNotification(request);
                console.log('Canceled')
                break;
            case 'illegal':
                request.key = name + '-illegalAlert'
                request.message = name + ' ' + this.translate.instant('notification-health-illegal-2')
                notificationManager.sendNotification(request);
                console.log('Illegal')
                break;
            default:
                break;
        }
    }

    weeklyReportNotification() {
        let request: NotificationManagerPlugin.NotificationRequest = {
            key: 'weeklyReport',
            title: this.translate.instant('notification-report-header'),
            message: this.translate.instant('notification-report'),
            url: 'https://scheme.elastos.org/elanodes-viewreport?'
        };
        notificationManager.sendNotification(request);
    }

    changeDetection(data, votedNodes) {
        console.log('change detection fired')
        let request: NotificationManagerPlugin.NotificationRequest = {
            key: '',
            title: this.translate.instant('notification-change-header'),
            message: '',
            url: 'https://scheme.elastos.org/elanodes-stakingtools?'
        };

        votedNodes.forEach(storedNode => {
            let match = data.find(node => node.Producer_public_key === storedNode)
            if (match !== undefined) {

                if (match.deltaPayout) {
                    if (match.deltaPayout.significant) {
                        let direction = this.translate.instant('notification-change-increased')
                        let priorPayout = match.PercentPayout - match.deltaPayout.percent
                        if (match.deltaPayout.percent < 0) {
                            direction = this.translate.instant('notification-change-reduced')
                        }
                        let elapsed = (Date.now() - match.deltaPayout.time) / 1000

                        if (elapsed < 604800) { // Within the last week
                            request.key = match.Nickname + '-changeDetection'
                            request.message = `${match.Nickname} ${this.translate.instant('notification-change-2')}  ${direction} ${this.translate.instant('notification-change-3')}  ${priorPayout}% ${this.translate.instant('notification-change-4')}  ${match.PercentPayout}%`
                            notificationManager.sendNotification(request);
                        }
                    }
                }
            }
        });
    }

    optimalConfiguration(data, votedNodes) {
        let request: NotificationManagerPlugin.NotificationRequest = {
            key: '',
            title: this.translate.instant('notification-optimal-header'),
            message: '',
            url: 'https://scheme.elastos.org/elanodes-stakingtools?'
        };

        let votedROI: number = 0
        votedNodes.forEach(storedNode => {
            let match = data.find(node => node.Producer_public_key === storedNode)
            if (match !== undefined && match.AnnualROI) {
                votedROI += parseFloat(match.AnnualROI)
            }
        });

        let arrayROI: any[] = []
        data.forEach(node => {
            arrayROI.push(parseFloat(node.AnnualROI))
        })
        let maxROI = arrayROI.sort(function(a, b) { return b - a }).slice(0, 36).reduce((a, b) => a + b, 0)
        let difference = maxROI - votedROI

        if (difference > 0.25) {
            request.key = 'optimalConfiguration'
            request.message = `${this.translate.instant('notification-optimal')}  ${difference.toFixed(2)}%`
            notificationManager.sendNotification(request);
        }
    }

    filterHistory(data): any[] {
        return [...data.filter(tx => tx.Type === 'spend' && tx.CreateTime > this.lastVote && tx.TxType !== 'Vote')];
    }

    cancellationDetection(history) {
        let filterHistory = this.filterHistory(history)

        if (filterHistory.length > 0) {
            let tx = filterHistory[0]
            let value = (tx.Value / 100000000).toFixed(2)
            let date = new Date(tx.CreateTime * 1000).toDateString();
            let request: NotificationManagerPlugin.NotificationRequest = {
                key: 'cancellationDetection',
                title: this.translate.instant('notification-cancellation-header'),
                message: `${this.translate.instant('notification-cancellation-1')}  ${value} ${this.translate.instant('notification-cancellation-2')} ${date} ${this.translate.instant('notification-cancellation-3')}`,
                url: 'https://scheme.elastos.org/elanodes-stakingtools?'
            };
            notificationManager.sendNotification(request);
        }
    }

    noAddressStored() {
        let request: NotificationManagerPlugin.NotificationRequest = {
            key: 'addressStorage',
            title: this.translate.instant('notification-noAddress-header'),
            message: this.translate.instant('notification-noAddress'),
            url: 'https://scheme.elastos.org/elanodes-addwallet?'
        };
        notificationManager.sendNotification(request);
    }


}
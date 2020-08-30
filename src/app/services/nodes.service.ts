import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { StorageService } from 'src/app/services/storage.service';
import { Node } from '../models/nodes.model';
import { Vote } from '../models/history.model';
import { Mainchain, Voters, Price, Block } from '../models/stats.model';

declare let appManager: AppManagerPlugin.AppManager;

@Injectable({
    providedIn: 'root'
})

export class NodesService {

    // Nodes
    public _nodes: Node[] = [];
    public activeNodes: Node[] = [];
    public totalVotes: number = 0;

    // Stats
    public statsFetched: boolean = false;
    public currentHeight: number = 0;
    public mainchain: Mainchain;
    public voters: Voters;
    public price: Price;
    public block: Block;

    public firstLoad: boolean = false;

    // Storage
    public firstVisit: boolean = false;
    public _votes: Vote[] = [];

    constructor(
        private http: HttpClient,
        private router: Router,
        private storageService: StorageService,
    ) { }

    // Fetch
    private nodeApi: string = 'https://node1.elaphant.app/api/';

    get nodes(): Node[] {
        return [...this._nodes.filter((a, b) => this._nodes.indexOf(a) === b)];
    }

    getNode(id: string): Node {
        return { ...this._nodes.find(node => node.Producer_public_key === id) };
    }

    getVote(id: string): Vote {
        return { ...this._votes.find(vote => vote.tx === id) };
    }

    async init() {
        console.log('NODE SERVICE INITIATED')
        this.getVisit();
        const height: number = await this.fetchCurrentHeight();
        this.fetchNodes();
        this.fetchStats();
    }

    fetchStats() {
        return new Promise((resolve, reject) => {
            this.http.get<any>('https://elanodes.com/api/widgets?=12345671').subscribe((res) => {
                console.log('General Stats Fetched', res);
                this.statsFetched = true;
                this.mainchain = res.mainchain;
                this.voters = res.voters;
                this.price = res.price;
                this.block = res.block;
                resolve();
            });
        });
    }

    fetchCurrentHeight(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.http.get<any>(this.nodeApi + '1/currHeight').subscribe((res) => {
                // console.log('Current height: ' + res.result);
                this.currentHeight = res.result;
                resolve(res.result);
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    // Node Load Observable
    private nodesLoadedSource: BehaviorSubject<string> = new BehaviorSubject<string>('');
    nodesLoaded = this.nodesLoadedSource.asObservable();

    nodeLoader(nodeLoad) {
        this.nodesLoadedSource.next(nodeLoad)
    }

    fetchNodes() {
        this._nodes = []
        return new Promise((resolve, reject) => {
            this.http.get<any>('https://elanodes.com/api/node-metrics').subscribe((res) => {
                this._nodes = this._nodes.concat(res.result);
                this.getNodeIcon();
                this.getNodeDayChange();
                this.nodeLoader(this._nodes)
                console.log('Nodes retrieved..', this._nodes);
                resolve();
            });
        });
    }

    getVisit() {
        appManager.hasPendingIntent((hasPendingIntent) => {
            // Route your app to the right screen here: home screen, or intent screen.
            console.log('PENDING INTENT?')
            console.log(hasPendingIntent)
            if (!hasPendingIntent) {
                this.storageService.getVisit().then(data => {
                    if (data || data === true) {
                        this.router.navigate(['/tabs/vote']);
                    } else {
                        this.firstVisit = true;
                        this.router.navigate(['/tutorial']);
                    }
                });
            }
        });
    }


    getNodeDayChange() {
        this._nodes.map(node => {
            node.isChecked = false
            if (node.deltaRank < 0) {
                node.rankChange = true
            } else if (node.deltaRank > 0) {
                node.rankChange = false
            }

            if (node.deltaVotes > 0) {
                node.votesChange = true
            } else if (node.deltaVotes < 0) {
                node.votesChange = false
            }

            if (node.deltaVoters > 0) {
                node.votersChange = true
            } else if (node.deltaVoters < 0) {
                node.votersChange = false
            }
        });
    }

    getNodeIcon() {
        this._nodes.map(node => {

            if (node.Nickname === 'Starfish'
                || node.Nickname === 'AIoTV(视九TVbox)'
                || node.Nickname === 'Enter Elastos -Callisto'
                || node.Nickname === 'Antpool-ELA'
                || node.Nickname === 'Enter Elastos - Ganymede'
                || node.Nickname === 'AnyPeer'
                || node.Nickname === 'Enter Elastos - Titan '
                || node.Nickname === 'Elephant Wallet'
                || node.Nickname === 'BIT.GAME'
                || node.Nickname === 'F2Pool'
                || node.Nickname === 'BitWork (CR Region HK)'
                || node.Nickname === 'Famous Amos'
                || node.Nickname === 'Black Swan'
                || node.Nickname === 'greengang'
                || node.Nickname === 'BTC.com'
                || node.Nickname === 'HashWorld'
                || node.Nickname === 'Cheery Community'
                || node.Nickname === 'Hyper'
                || node.Nickname === 'CR Herald'
                || node.Nickname === 'IOEX(ioeX Network)'
                || node.Nickname === 'CR Regions Global Fund - Clarence Liu'
                || node.Nickname === 'KuCoin'
                || node.Nickname === 'Cyber Republic Press CR新闻团队'
                || node.Nickname === 'NextGenius'
                || node.Nickname === 'DACA区块链技术公开课'
                || node.Nickname === 'Northern Lights'
                || node.Nickname === 'Orchard - Elastos Business Development'
                || node.Nickname === 'Default'
                || node.Nickname === 'RUOLAN(若兰)'
                || node.Nickname === 'DHG(大黄哥)'
                || node.Nickname === 'Dragonela'
                || node.Nickname === 'ElaChat'
                || node.Nickname === 'ThaiEla'
                || node.Nickname === 'elafans'
                || node.Nickname === 'The Houston Supernode'
                || node.Nickname === 'ELAFISH'
                || node.Nickname === 'TYROLEE(小黑狼)'
                || node.Nickname === 'elaHorse @ 亦乐马'
                || node.Nickname === 'viewchain'
                || node.Nickname === 'ELA News (ELA新闻)'
                || node.Nickname === 'WeFilmchain'
                || node.Nickname === 'ELAONSEN 亦来温泉'
                || node.Nickname === 'Wild Strawberries Apollo'
                || node.Nickname === 'Elastos Australia'
                || node.Nickname === 'Wild Strawberries Atlas'
                || node.Nickname === 'Wild Strawberries Calypso'
                || node.Nickname === 'Elastos Carrier'
                || node.Nickname === 'Witzer（无智）'
                || node.Nickname === 'ElastosDMA'
                || node.Nickname === 'Elastos Forest Node (EFN)'
                || node.Nickname === 'Noderators - Watermelon'
                || node.Nickname === 'Noderators - Champagne'
                || node.Nickname === '区块链研习社'
                || node.Nickname === 'Elastos HIVE'
                || node.Nickname === '曲率区动'
                || node.Nickname === 'Elastos Scandinavia'
                || node.Nickname === '比特头条BITETT '
                || node.Nickname === 'Elastos.info'
                || node.Nickname === 'Elate.ch'
                || node.Nickname === '链世界'
                || node.Nickname === 'Dragonela 2.0'
                || node.Nickname === 'ElaboxSN1'
            ) {
                node.imageUrl = '../../assets/logos/' + node.Nickname + '.png'
            }
            if (node.Nickname === '韩锋/SunnyFengHan') {
                node.imageUrl = '../../assets/logos/SunnyFengHan.png'
            }
            if (node.Nickname === "CR Herald | CR 先锋资讯") {
                node.imageUrl = '../../assets/logos/CR Herald.png'
            }
            else {
                return '../../assets/logos/Default.png'
            }
            // else {
            //   node.imageUrl = 'https://elanodes.com/logos/' + node.Nickname + '.png'
            // }
        });
    }

    getRewardIcon(name) {

        if (name === 'Starfish'
            || name === 'AIoTV(视九TVbox)'
            || name === 'Enter Elastos -Callisto'
            || name === 'Antpool-ELA'
            || name === 'Enter Elastos - Ganymede'
            || name === 'AnyPeer'
            || name === 'Enter Elastos - Titan '
            || name === 'Elephant Wallet'
            || name === 'BIT.GAME'
            || name === 'F2Pool'
            || name === 'BitWork (CR Region HK)'
            || name === 'Famous Amos'
            || name === 'Black Swan'
            || name === 'greengang'
            || name === 'BTC.com'
            || name === 'HashWorld'
            || name === 'Cheery Community'
            || name === 'Hyper'
            || name === 'CR Herald'
            || name === 'IOEX(ioeX Network)'
            || name === 'CR Regions Global Fund - Clarence Liu'
            || name === 'KuCoin'
            || name === 'Cyber Republic Press CR新闻团队'
            || name === 'NextGenius'
            || name === 'DACA区块链技术公开课'
            || name === 'Northern Lights'
            || name === 'Orchard - Elastos Business Development'
            || name === 'Default'
            || name === 'RUOLAN(若兰)'
            || name === 'DHG(大黄哥)'
            || name === 'Dragonela'
            || name === 'ElaChat'
            || name === 'ThaiEla'
            || name === 'elafans'
            || name === 'The Houston Supernode'
            || name === 'ELAFISH'
            || name === 'TYROLEE(小黑狼)'
            || name === 'elaHorse @ 亦乐马'
            || name === 'viewchain'
            || name === 'ELA News (ELA新闻)'
            || name === 'WeFilmchain'
            || name === 'ELAONSEN 亦来温泉'
            || name === 'Wild Strawberries Apollo'
            || name === 'Elastos Australia'
            || name === 'Wild Strawberries Atlas'
            || name === 'Wild Strawberries Calypso'
            || name === 'Elastos Carrier'
            || name === 'Witzer（无智）'
            || name === 'ElastosDMA'
            || name === 'Elastos Forest Node (EFN)'
            || name === 'Noderators - Watermelon'
            || name === 'Noderators - Champagne'
            || name === '区块链研习社'
            || name === 'Elastos HIVE'
            || name === '曲率区动'
            || name === 'Elastos Scandinavia'
            || name === '比特头条BITETT '
            || name === 'Elate.ch'
            || name === 'Elastos.info'
            || name === '链世界'
            || name === 'Dragonela 2.0'
            || name === 'ElaBoxSN1'
        ) {
            return '../../assets/logos/' + name + '.png'
        }
        if (name === '韩锋/SunnyFengHan') {
            return '../../assets/logos/SunnyFengHan.png'
        }
        if (name === "CR Herald | CR 先锋资讯") {
            return '../../assets/logos/CR Herald.png'
        }
        else {
            return '../../assets/logos/Default.png'
        }
    }

}

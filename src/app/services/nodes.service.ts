import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { StorageService } from 'src/app/services/storage.service';
import { Node } from '../models/nodes.model';
import { Vote } from '../models/history.model';
import { Mainchain, Voters, Price, Block } from '../models/stats.model';



@Injectable({
  providedIn: 'root'
})

export class NodesService {

  // Nodes
  public _nodes: Node[] = [];
  public activeNodes: Node[] = [];
  public totalVotes: number = 0;

  // Style
  public tableStyle: string = 'dark';

  // Stats
  public statsFetched: boolean = false;
  public currentHeight: number = 0;
  public mainchain: Mainchain;
  public voters: Voters;
  public price: Price;
  public block: Block;

  // Storage
  private firstVisit: boolean = false;
  public _votes: Vote[] = [
   /* {
      date: new Date(),
      tx: 'a2677487ba6c406f70b22c6902b3b2ffe582f99b58848bbfba9127c5fa47c712',
      keys: [
        '0368044f3b3582000597d40c9293ea894237a88b2cd55f79a18193399937d22664',
        '03d55285f06683c9e5c6b5892a688affd046940c7161571611ea3a98330f72459f',
        '024b527700491895b79fc5bfde8a60395307c5416a075503e6ac7d1df61c971c78'
      ]
    },
    {
      date: new Date(),
      tx: 'd42da61ad9d12e0adf167d9451506cc119ad6384cae6d57158e643192720cf10',
      keys: [
        '03674a7867f2d4a557764d1f61138b9f98542c9a77e8773953432ac3e48ae60226',
        '02d6f8ff72eaa9aada515d6b316cff2cbc55be09ddab17981d74a585ae20617a72',
        '02a85be1f6244b40b8778b626bde33e1d666b3b5863f195487e72dc0e2a6af33a1'
      ]
    },
    {
      date: new Date(),
      tx: '241315309c645e52fabafe9e8963037829f025526b9b616972b8b7a0965e6ac4',
      keys: [
        '026c8ce246d2587df8a669eee82be4f365ab6cf4fc45e3e539cf0ab91fbab3a809',
        '0315067144eaad471ed0c355e6f9822c51b93308e0cd9febf0792304c605973916',
        '030cda9b67897652dbf9f85cb0aba39a09203004f59366517a5461b1e48d9faa64',
        '02b6052f5f65089be3b94efb91c98a5f94c0bf7fbefdbd85c1d547aa7b3d547710'
      ]
    } */
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
  ) {}

  // Fetch
  private nodeApi: string = 'https://node1.elaphant.app/api/';
  private elaNodeUrl: string = 'https://elanodes.com/wp-content/uploads/custom/images/';
  private proxyurl = "https://cors-anywhere.herokuapp.com/";

  get nodes(): Node[] {
    return [...this._nodes.filter((a,b) => this._nodes.indexOf(a) === b)];
  }

  getNode(id: string): Node {
    return {...this._nodes.find(node => node.Producer_public_key === id)};
  }

  getVote(id: string): Vote {
    return {...this._votes.find(vote => vote.tx === id)};
  }

  async init() {
    this.getVisit();
    this.getStoredVotes();
    this.fetchStats();

  /*   setInterval(() => {
      this.fetchStats();
    }, 5000); */

    const height: number = await this.fetchCurrentHeight();
    this.fetchNodes(height);
  }

   Storage
   getVisit() {

     console.log(this.storageService)
    this.storageService.getVisit().then(data => {
      if(data || data === true) {
        this.firstVisit = false;
        console.log('First visit?', this.firstVisit);
      } else {
        this.router.navigate(['vote']);
      }
    });
   }

   getStoredVotes() {
    this.storageService.getVotes().then(data => {
      console.log('Vote history', data);
      if(data) {
        this._votes = data;
      }
    });
  }

  getStoredNodes() {
    this.storageService.getNodes().then(data => {
      console.log(data);
      this._nodes.map(node => {
        if (data && data.includes(node.Ownerpublickey) && node.State === 'Active') {
          node.isChecked = true;
        }
      });
    });
  }

  fetchStats() {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.proxyurl + 'https://elanodes.com/api/widgets?=12345671').subscribe((res) => {
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
    console.log('Fetching height');
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.nodeApi + '1/currHeight').subscribe((res) => {
        console.log('Current height fetched' + res.result);
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

  fetchNodes(height: number) {
    console.log('Fetching Nodes..');
    //this.http.get<any>(this.nodeApi + 'v1/dpos/rank/height/' + height).subscribe((res) => {
    this.http.get<any>(this.proxyurl + 'https://elanodes.com/api/node-metrics').subscribe((res) => { 
      console.log('Nodes Fetch Response', res)
      this._nodes = this._nodes.concat(res.result);
      //this.activeNodes = this._nodes.filter(node => node.State === 'Active');
      this.getNodeIcon();
      this.getNodeDayChange();
      this.getStoredNodes();

      this.nodeLoader(this._nodes)
      //this.getTotalVotes(res.result);
      console.log('Nodes Added..', this._nodes);

      //console.log('Active Nodes..', this.activeNodes);
    });
  }

  // getTotalVotes(nodes: Node[]) {
  //   nodes.map(node => {
  //     this.totalVotes += parseFloat(node.Votes);
  //   });
  //   console.log('Total votes counted', this.totalVotes);
  // }

  getNodeDayChange() {
    this._nodes.map(node => {
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
      || node.Nickname === 'Daily Rewards'                        
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
      || node.Nickname === 'YDiot(云端物联）'
      || node.Nickname === 'Elastos Forest Node (EFN)'
      || node.Nickname === 'Noderators - Watermelon'    
      || node.Nickname === 'Noderators - Champagne'                
      || node.Nickname === '区块链研习社'
      || node.Nickname === 'Elastos HIVE'                          
      || node.Nickname === '曲率区动'
      || node.Nickname === 'Elastos Scandinavia'                   
      || node.Nickname === '比特头条BITETT '
      || node.Nickname === 'Elate.ch'                               
      || node.Nickname === '链世界') {
        node.imageUrl = '../../assets/logos/' + node.Nickname + '.png'
      }
      if (node.Nickname === '韩锋/SunnyFengHan') {
         node.imageUrl = '../../assets/logos/SunnyFengHan.png'
      }
      if (node.Nickname === "CR Herald | CR 先锋资讯") {
         node.imageUrl = '../../assets/logos/CR Herald.png'
      } else {
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
      || name === 'Daily Rewards'                        
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
      || name === 'YDiot(云端物联）'
      || name === 'Elastos Forest Node (EFN)'
      || name === 'Noderators - Watermelon'    
      || name === 'Noderators - Champagne'                
      || name === '区块链研习社'
      || name === 'Elastos HIVE'                          
      || name === '曲率区动'
      || name === 'Elastos Scandinavia'                   
      || name === '比特头条BITETT '
      || name === 'Elate.ch'                               
      || name === '链世界') {
        return '../../assets/logos/' + name + '.png'
      }
      if (name === '韩锋/SunnyFengHan') {
         return '../../assets/logos/SunnyFengHan.png'
      }
      if (name === "CR Herald | CR 先锋资讯") {
         return '../../assets/logos/CR Herald.png'
      } else {
         return '../../assets/logos/Default.png'
      }

  }

 }
        
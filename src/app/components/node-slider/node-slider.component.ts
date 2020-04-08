import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Node } from 'src/app/models/nodes.model';
import { IonSlides } from '@ionic/angular';
import { Native } from 'src/app/services/native.service';

@Component({
  selector: 'app-node-slider',
  templateUrl: './node-slider.component.html',
  styleUrls: ['./node-slider.component.scss'],
})
export class NodeSliderComponent implements OnInit {

  @ViewChild('slider', {static: false}) slider: IonSlides;
  
  @Input() _nodes: Node[] = [];
  //@Input() totalVotes: number = 0;
  @Input() nodeIndex: number;
  @Input() node: Node;
  // @Input() showDetails: boolean;

  // @Output() updateSlideToggle = new EventEmitter<string>();

  // Truncate
  @Input() limit: number = 250;
  truncating = true;

  constructor(    
    public native: Native,
  ) { }

  public displayedArr: Node[] = [];

  slideOpts = {
    initialSlide: 1,
    speed: 200,
    centeredSlides: true,
    slidesPerView: 1,
  };

  // sendtoParent() {
  //   this.showDetails = false;
  //   this.updateSlideToggle.emit()
  // }

  ngOnInit() {
    this.displayedArr = this._nodes.slice(0, this.nodeIndex + 2);
    this.slideOpts.initialSlide = this.displayedArr.indexOf(this.node);
  }

  // Increment nodes array when sliding forward
  loadNext() {
    let lastNode: Node = this.displayedArr.slice(-1)[0]
    let nextNodeIndex: number = this._nodes.indexOf(lastNode) + 1;
    if(nextNodeIndex) {
      this.displayedArr.push(this._nodes[nextNodeIndex]);
    }
    console.log('last node', lastNode);
    console.log('next node', this._nodes[nextNodeIndex]);
  }
  
  getState(rank: number) {
    if (rank <= 24) {
      return 'Active'
    } else if (rank > 24) {
      return 'Standy'
    }
  }

  getVotes(votes: string): string {
    const fixedVotes = parseInt(votes);
    return fixedVotes.toLocaleString().split(/\s/).join(',');
  }

  getRewards(rewards) {
    const income: number =  parseFloat(rewards) / 365;
    return income.toFixed(2);
  }

  votePercent(node) {
    const votePercent: number = (parseFloat(node.Votes) / parseFloat(node.Totalvotes))*100
    return votePercent.toFixed(2) + '%'
  }

    formatVotes(votes) {
    const votesDisplay: string = ((parseFloat(votes))/1000000).toLocaleString(undefined, { maximumFractionDigits: 2 }).split(/\s/).join(',') + 'M'
    return votesDisplay
  }

  formatVoters(voters) {
    const votersDisplay: string = (parseInt(voters)).toLocaleString().split(/\s/).join(',')
    return votersDisplay
  }

  deltaStatus(input) {
    let delta: number = Math.abs(parseInt(input))
    if (delta !== 0) {
      return delta.toLocaleString().split(/\s/).join(',')
    } else {
      return;
    }
  }

  arrPercent(arr) {
    const arrPercent: number = arr
    if (isNaN(arrPercent)) {
      return 'No Data'
    } else {
    return arrPercent + '%'
    }
  }

  payPercent(pay: string): string {
    const payPercent: number = parseFloat(pay)
    if (isNaN(payPercent)) {
      return 'No Data'
    } else {
    return payPercent.toFixed(0) + '%'
    }
  }

  socialLink(url) {
    this.native.openUrl(url)
  }

  fixWebURL(url) {
    let httpString = 'http://';
    let httpsString = 'https://';
    if (url.substr(0, httpString.length) !== httpString && url.substr(0, httpsString.length) !== httpsString) {
        url = httpString + url;
        this.socialLink(url)
    } else {
      this.socialLink(url)
    }
  }

}


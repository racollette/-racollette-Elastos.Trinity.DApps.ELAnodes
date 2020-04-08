import { Component, OnInit, NgZone } from '@angular/core';
import { Native } from '../../services/native.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

  constructor(public native: Native,
    public translate: TranslateService,
    public data: DataService,
    private navController: NavController,
    private zone: NgZone
  ) { }

  public lang: string;

  ngOnInit() {
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant('language-title'))
    titleBarManager.setBackgroundColor("#000000");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
    appManager.setListener((ret) => {this.onMessageReceived(ret)});
    this.lang = this.data.language
  }

  onMessageReceived(ret: AppManagerPlugin.ReceivedMessage) {
    if (ret.message == "navback") {
      this.navController.back();
    }
  }

  ionViewDidEnter() {
  }

  languageChoice(event) {
    this.zone.run(()=> {
      this.lang = event.detail.value
      console.log('Language Set: ' + this.lang)
      this.data.setCurLang(this.lang)
    });
  }

}

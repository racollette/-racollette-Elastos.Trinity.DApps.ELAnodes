import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
      //{ path: '', redirectTo: 'vote', pathMatch: 'full' },
      { path: 'splashscreen', loadChildren: './pages/splashscreen/splashscreen.module#SplashscreenPageModule' },
      { path: 'vote', loadChildren: './pages/vote/vote.module#VotePageModule'},
      { path: 'home', loadChildren: './pages/home/home.module#HomePageModule'},
      { path: 'stats', loadChildren: './pages/stats/stats.module#StatsPageModule'},
      { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule'},
      { path: 'language', loadChildren: './pages/language/language.module#LanguagePageModule'},
      { path: 'wallets', loadChildren: './pages/wallets/wallets.module#WalletsPageModule'},
      { path: 'donate', loadChildren: './pages/donate/donate.module#DonatePageModule'},
      { path: 'faq', loadChildren: './pages/faq/faq.module#FAQPageModule'},
      { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule'},
      { path: 'intro', loadChildren: './pages/intro/intro.module#IntroPageModule'},
      { path: 'history', loadChildren: './pages/history/history.module#HistoryPageModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

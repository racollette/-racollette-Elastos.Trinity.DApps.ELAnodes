import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
      { path: '', redirectTo: 'vote', pathMatch: 'full' },
      { path: 'vote', loadChildren: './pages/vote/vote.module#VotePageModule'},
      { path: 'home', loadChildren: './pages/home/home.module#HomePageModule'},
      { path: 'intro', loadChildren: './pages/intro/intro.module#IntroPageModule'},
      { path: 'stats', loadChildren: './pages/stats/stats.module#StatsPageModule'},
      { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule'},
      { path: 'language', loadChildren: './pages/language/language.module#LanguagePageModule'},
      { path: 'donate', loadChildren: './pages/donate/donate.module#DonatePageModule'},
      { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule'},
      { path: 'history', loadChildren: './pages/history/history.module#HistoryPageModule'},
      { path: 'history/:txId', loadChildren: './pages/tx/tx.module#TxPageModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

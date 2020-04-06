import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
      { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
      { path: 'splashscreen', loadChildren: './pages/splashscreen/splashscreen.module#SplashscreenPageModule' },
      { path: 'tutorial', loadChildren: './pages/tutorial/tutorial.module#TutorialPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

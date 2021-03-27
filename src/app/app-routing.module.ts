import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { QrScreenComponent } from './components/qr-screen/qr-screen.component';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full"},
  { path: "login", component: QrScreenComponent },
  { path: "main", component: ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

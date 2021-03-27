import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { AppComponent } from './app.component';
import { QrScreenComponent } from './components/qr-screen/qr-screen.component';
import { ChatComponent } from './components/chat/chat.component';
import { FilterPipe } from './helpers/filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    QrScreenComponent,
    ChatComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgxQRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

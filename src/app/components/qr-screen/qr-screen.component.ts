import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { SocketService } from "../../services/socket.service";
import { Eventt } from "../../models/client-enums";
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-qr-screen',
  templateUrl: './qr-screen.component.html',
  styleUrls: ['./qr-screen.component.css'],
})
export class QrScreenComponent implements OnInit {
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  qr_code: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService.onEvent(Eventt.CONNECT).subscribe(() => {
      console.log('connected');
    });

    this.socketService.onEvent(Eventt.DISCONNECT).subscribe(() => {
      console.log('disconnected');
    });

    this.socketService.getQr().subscribe((result: any) => {
      this.qr_code = result;
    });

    this.socketService.isReadyClient().subscribe((result: any) => {
      if (result) this.router.navigate(['main']);
    });

  }
}

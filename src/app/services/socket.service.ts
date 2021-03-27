import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  //:::::::::::::::::::::::: VARIABLES :::::::::::::::::::::::://
  socket: any;
  QRCODE: any;
  //:::::::::::::::::::::::: VARIABLES :::::::::::::::::::::::://

  constructor() {}

  public initSocket(): void {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }

  public onEvent(event: any): Observable<any> {
    return new Observable<Event>((observer) => {
      this.socket.on(event, () => observer.next());
    });
  }

  public getQr = () => {
    return new Observable<any>((observer) => {
      this.socket.on('ready_qr', (data: string) => {
        data = data.replace('"', '');
        observer.next(data);
      });
    });
  };

  public isReadyClient = () => {
    return new Observable<any>((observer) => {
      this.socket.on('isReadyClient', (data: boolean) => {
        observer.next(data);
      });
    });
  };

  public getContactList = () => {
    this.socket.emit('getContactList');
  };
  public contactList = () => {
    return new Observable<any[]>((observer) => {
      this.socket.on('contactList', (data: any[]) => {
        observer.next(data);
      });
    });
  };

  public getContact = (id: any, isScrollTop: boolean) => {
    this.socket.emit('getChatById', { id, isScrollTop });
  };
  public fetchMessages = () => {
    return new Observable<any[]>((observer) => {
      this.socket.on('fetchMessages', (data: any[]) => {
        observer.next(data);
      });
    });
  };

  public getContactPhoto = (number: any) => {
    this.socket.emit('getContactPhoto', number);
  };
  public responseContactPhoto = () => {
    return new Observable<any[]>((observer) => {
      this.socket.on('responseContactPhoto', (data: any) => {
        observer.next(data);
      });
    });
  };

  public sendMessage = (number: any, message: any) => {
    this.socket.emit('sendMessage', { number, message });
  };

  public inComingMessage = () => {
    return new Observable<any[]>((observer) => {
      this.socket.on('inComingMessage', (data: any) => {
        observer.next(data);
      });
    });
  };
}

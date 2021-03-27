import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  searchText: string;
  isContactListClick: boolean = false;
  contactList: any[] = [];
  messageList: any[] = [];
  applicationTextList: any[] = [];
  contactNameToMessage: string = '';
  contactNumberToMessage: string = '';
  myProfilePhoto: string = '';
  contactProfilePhoto: string = '';
  scrollTopLoading: boolean = false;
  contactPhoto: string = '';

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.initIoConnection();
  }
  
  scrollToTop() {
    let isScrollTop: any = document.getElementsByClassName('chat-message-content')[0];
      isScrollTop = isScrollTop.scrollTop;
      if (isScrollTop == 0) {
        this.scrollTopLoading = true;
        this.socketService.getContact(this.contactNumberToMessage, true);
      }
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService.getContactList();

    this.socketService.contactList().subscribe((result: any[]) => {
      this.contactList = [
        ...result
          .filter((f) => !f.isMe && !f.isBlocked)
          .sort((a, b) => {
            return b - a;
          }),
      ];
    });

    this.socketService.fetchMessages().subscribe((result: any[]) => {
      const newResult = result.map((_) => {
        let date = this.format_time(_.timestamp);
        _.timestamp = date;
        return _;
      });
      this.messageList = [...newResult];
      this.scrollTopLoading = false;
    });

    this.socketService.inComingMessage().subscribe((result: any) => {
      if (result) {
        const { message, fromUser } = result;
        const isInSameScreen = this.messageList.filter(
          (f) => f.from === fromUser
        );
        if (isInSameScreen.length > 0) {
          // aynı ekrandaysa ekranı güncelle, yani mesajı ekle
          let date = this.format_time(message.timestamp);
          message.timestamp = date;
          this.messageList = [...this.messageList, message];
        } else {
          // aynı ekran açık değilse yani konuşulan kişi farklı mesaj gelen kişi farklı ise
          // önce kişiyi contactlist ten bul onu yukarı taşı ve sonra mevcut mesajlarının sonuna yeni mesajı ekle
          const number = fromUser.split('@')[0];
          if (!number.startsWith('905')) return;
          const filterUser = this.contactList.filter(
            (f) => f.number === number
          );
          const filterUserObj = { ...filterUser[0] };
          const filterOtherUsers = this.contactList.filter(
            (f) => f.number !== number
          );
          this.contactList = [filterUserObj, ...filterOtherUsers];
        }
      }
    });

    this.socketService.responseContactPhoto().subscribe((result: any) => {
      if(result) {
        this.contactPhoto = result;
      }
    });

  }

  chatContact(number: any, name: any) {
    this.messageList = [];
    this.contactPhoto = "";
    this.isContactListClick = true;
    this.contactNameToMessage = name;
    this.contactNumberToMessage = number;
    this.socketService.getContact(number, false);
    this.scrollTopLoading = true;
    this.socketService.getContactPhoto(number);
    let applicationText: any = document.getElementById('applicationText');
    applicationText.value = "";
    this.applicationTextList = [];
  }

  sendMessage() {
    const _message: any = document.getElementById('sendMessage');
    let message = _message.value;
    this.socketService.sendMessage(this.contactNumberToMessage, message);
    _message.value = '';
  }
  keyDownSendMessage(event: any) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  checkToMessage(event: any) {
    let applicationText: any = document.getElementById('applicationText');
    const messageBody: any = event.target.parentElement.querySelector('#messageBody').textContent;
    if (messageBody === '') {
      const messageImage: any = event.target.parentElement.querySelector('#messageBody').children[0].src;
      this.downloadBase64File(messageImage);
    } else {
      if (this.applicationTextList.indexOf(messageBody) !== -1) {
        this.applicationTextList = this.applicationTextList.filter(
          (f) => f !== messageBody
        );
      } else {
        this.applicationTextList = [...this.applicationTextList, messageBody];
      }
      applicationText.value = this.applicationTextList.join('\r\n');
    }
  }

  downloadBase64File(base64Data: any) {
    const linkSource = `${base64Data}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    const random = Math.round(Math.random() * 101);
    const dateTimee = new Date().toLocaleDateString();
    downloadLink.download = `${dateTimee}_whatsapp_photo_${random}.png`;
    downloadLink.click();
  }

  format_time(s: any) {
    const _date = new Date(s * 1000);
    const date = _date.toLocaleString();
    return date;
  }
}

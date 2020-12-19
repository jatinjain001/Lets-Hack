import { Injectable } from '@angular/core';
import {AngularFireDatabase,AngularFireObject} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs';
import { ChatMessage} from 'src/app/chat-form/modals/chat-message.model';
import {AuthService} from 'src/app/services/auth.service';
import * as firebase from 'firebase/app';
import { AngularFireAuthModule } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user : any;
  private _chatMessages: AngularFireObject<ChatMessage[]> | undefined; 
  public get chatMessages(): AngularFireObject<ChatMessage[]> | undefined {
    return this._chatMessages;
  }
  public set chatMessages(value: AngularFireObject<ChatMessage[]> | undefined) {
    this._chatMessages = value;
  }
  chatMessage : chatMessages;
  userName?: Observable<string>;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
    ) {
        this.afAuth.authState.subscribe(auth => {
          if (auth !== undefined && auth !== null) {
            this.user = auth;
          }

          this.getUser().subscribe(a => {
            this.userName = a.displayName;
          });
        });
    }



    getUser() {
      const userId = this.user.uid;
      const path = `/users/${userId}`;
      return this.db.object(path);
    }

    getUsers() {
      const path = '/users';
      return this.db.list(path);
    }

    getMessages(): AngularFireObject<ChatMessage[]> {
      // query to create our message feed binding
      return this.db.list('/items', ref => ref.orderByChild('size').equalTo('large'));
      }

    getTimeStamp() {
      const now = new Date();
      const date = now.getUTCFullYear() + '/' +
                   (now.getUTCMonth() + 1) + '/' +
                   now.getUTCDate();
      const time = now.getUTCHours() + ':' +
                   now.getUTCMinutes() + ':' +
                   now.getUTCSeconds();
  
      return (date + ' ' + time);
    }
  sendMessage(msg: string)
  {
     const timestamp=this.getTimeStamp();
     const email=this.user.email;
     this.chatMessages=this.getMessages();
     this.chatMessages.push({
       message: msg,
       timeSent = timestamp,
       userName=this.userName,
       email = email
     });
  }

}

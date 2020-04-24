import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Peer from 'peerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'video-calling';
  peer;
  connection;
  remotePeerId: '';
  getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  @ViewChild('videoCallingWindow') video: ElementRef;


  ngOnInit() {
    this.peer = new Peer();

    this.peer.on('open', (id) => {
      console.log(this.peer.id, ' ', this.peer.key)
    })

    this.peer.on('connection', con => {
      con.on('data', (data) => console.log(data))
    })

    this.peer.on('call', (call) => {
      this.getUserMedia({ video: true, audio: true }, stream => {
        call.answer(stream)
        call.on('steam', remoteStream => {
          this.video.nativeElement.srcObject = remoteStream;
          const playPromise = this.video.nativeElement.play()

          if (playPromise !== null) {
            playPromise.catch(() => { /* discard runtime error */ })
          }

        })
      }, err => console.log(err))
    })

  }

  connect() {
    this.connection = this.peer.connect(this.remotePeerId);
    this.connection.on('open', () => {
      this.connection.send('Mesage')
    })

    this.getUserMedia({ video: true, audio: true }, stream => {
      const call = this.peer.call(this.remotePeerId, stream);
      call.on('stream', remoteStream => {
        this.video.nativeElement.srcObject = remoteStream;
        const playPromise = this.video.nativeElement.play()

        if (playPromise !== null) {
          playPromise.catch(() => { /* discard runtime error */ })
        }


      })

    }, err => console.log(err))
  }
}

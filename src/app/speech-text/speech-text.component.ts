import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-speech-text',
  templateUrl: './speech-text.component.html',
  styleUrls: ['./speech-text.component.css']
})
export class SpeechTextComponent implements OnInit {

  private isRecording = false
  private recognizeStream = null
  private keywords = [
    {keyword: '徐々に', class: 'jojoni'},
    {keyword: '海賊', class: 'kaizoku'},
  ];

  constructor(private http: HttpClient, private detector: ChangeDetectorRef) { }

  ngOnInit() {}

  getTokenAsync() {
    return this.http.get('/auth');
  }

  async handleMicClick() {
    if (this.recognizeStream) {
      this.stopRecognizeStream()
    } else if (!this.isRecording) {
      this.isRecording = true
      await this.getTokenAsync()
        .subscribe(token => {
          console.log(token)
          this.startRecognizeStream(token['token']);
        })
    }
  }

  startRecognizeStream(token) {
    const stream = recognizeMicrophone({
      token,
      model: 'ja-JP_BroadbandModel',
      objectMode: true,
      extractResults: true,
      keywords: ['徐々に', '海賊'],
      keywords_threshold: 0.7,
    })
    stream.on('data', data => {
      if (data.final) {
        console.log(data);
        const transcript = data.alternatives[0].transcript
        this.checkEffectedWord(transcript);
      }
    })
    this.recognizeStream = stream
  }

  stopRecognizeStream() {
    if (this.recognizeStream) {
      this.recognizeStream.stop()
      this.recognizeStream.removeAllListeners()
    }
    this.isRecording = false
    this.recognizeStream = null
  }

  checkEffectedWord(word) {
    const body = document.getElementById('slide');
    body.className = 'effect-layer';
    this.keywords.forEach(obj => {
      if (word.match(obj.keyword)) {
        body.classList.add(obj.class);
      }
    })
  }
}

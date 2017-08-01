import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as recognizeMicrophone  from 'watson-speech/speech-to-text/recognize-microphone';

@Component({
  selector: 'app-speech-text',
  templateUrl: './speech-text.component.html',
  styleUrls: ['./speech-text.component.css']
})
export class SpeechTextComponent implements OnInit {

  private isRecording = false
  private recognizeStream = null

  constructor(private detector:ChangeDetectorRef) { }

  ngOnInit() {}

  getTokenAsync() {
    return fetch('http://0.0.0.0:4000/speech-to-text/token')
            .then(res => res.json() as any)
            .then(data => data.token)
  }

  async handleMicClick() {
    if (this.recognizeStream) {
      this.stopRecognizeStream()
    } else if (!this.isRecording) {
      this.isRecording = true
      await this.getTokenAsync()
        .then(token => {
          this.startRecognizeStream(token)
        })
    }
  }

  startRecognizeStream(token) {
    const stream = recognizeMicrophone({
      token,
      model: 'ja-JP_BroadbandModel',
      objectMode: true,
      extractResults: true,
      keywords: ['徐々に','海賊'],
      keywords_threshold: 0.7,
    })
    stream.on('data', data => {
      if (data.final) {
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


    private keywords = [
      {keyword: '徐々に', class: 'jojoni'},
      {keyword: '海賊', class: 'kaizoku'},
    ];
    checkEffectedWord(word) {
      let body = document.getElementById('slide');
      body.className='effect-layer';
                console.log(word)
      this.keywords.forEach(obj => {
        if (word.match(obj.keyword)) {

          body.classList.add(obj.class);
        }
      })
    }
}

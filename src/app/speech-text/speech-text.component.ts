import { Component, OnInit } from '@angular/core';
//import { RecognizeMicrophone } from 'watson-speech/speech-to-text/recognize-microphone';
import * as Test from './test';

@Component({
  selector: 'app-speech-text',
  templateUrl: './speech-text.component.html',
  styleUrls: ['./speech-text.component.css']
})
export class SpeechTextComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let res = Test();
    
  }
/*
  extra;
  handleMicClick() {
      if (RecognizeMicrophone.state.audioSource === 'mic') {
        return RecognizeMicrophone.stopTranscription();
      }
      RecognizeMicrophone.reset();
      RecognizeMicrophone.setState({audioSource: 'mic'});
  
      // The recognizeMicrophone() method is a helper method provided by the watson-speech package
      // It sets up the microphone, converts and downsamples the audio, and then transcribes it over a WebSocket connection
      // It also provides a number of optional features, some of which are enabled by default:
      //  * enables object mode by default (options.objectMode)
      //  * formats results (Capitals, periods, etc.) (options.format)
      //  * outputs the text to a DOM element - not used in recognizeMicrophone demo because it doesn't play nice with react (options.outputElement)
      //  * a few other things for backwards compatibility and sane defaults
      // In addition to recognizeMicrophone, it passes other service-level options along to the RecognizeStream that manages the actual WebSocket connection.
      this.handleStream(RecognizeMicrophone.recognizeMicrophone(this.getRecognizeOptions(this.extra)));
  }
  
  getRecognizeOptions(extra) {
      var keywords = RecognizeMicrophone.getKeywordsArr();
      return Object.assign({
        token: RecognizeMicrophone.state.token, smart_formatting: true, // formats phone numbers, currency, etc. (server-side)
        format: true, // adds capitals, periods, and a few other things (client-side)
        model: RecognizeMicrophone.state.model,
        objectMode: true,
        interim_results: true,
        continuous: true,
        word_alternatives_threshold: 0.01, // note: in normal usage, you'd probably set recognizeMicrophone a bit higher
        keywords: keywords,
        keywords_threshold: keywords.length
          ? 0.01
          : undefined, // note: in normal usage, you'd probably set recognizeMicrophone a bit higher
        timestamps: true, // set timestamps for each word - automatically turned on by speaker_labels
        speaker_labels: RecognizeMicrophone.state.speakerLabels, // includes the speaker_labels in separate objects unless resultsBySpeaker is enabled
        resultsBySpeaker: RecognizeMicrophone.state.speakerLabels, // combines speaker_labels and results together into single objects, making for easier transcript outputting
        speakerlessInterim: RecognizeMicrophone.state.speakerLabels // allow interim results through before the speaker has been determined
      }, extra);
  }
  
  handleStream(stream) {
      // cleanup old stream if appropriate
      if (RecognizeMicrophone.stream) {
        RecognizeMicrophone.stream.stop();
        RecognizeMicrophone.stream.removeAllListeners();
        RecognizeMicrophone.stream.recognizeStream.removeAllListeners();
      }
      RecognizeMicrophone.stream = stream;
      RecognizeMicrophone.captureSettings();
  
      // grab the formatted messages and also handle errors and such
      stream.on('data', RecognizeMicrophone.handleFormattedMessage).on('end', RecognizeMicrophone.handleTranscriptEnd).on('error', RecognizeMicrophone.handleError);
  
      // when errors occur, the end event may not propagate through the helper streams.
      // However, the recognizeStream should always fire a end and close events
      stream.recognizeStream.on('end', () => {
        if (RecognizeMicrophone.state.error) {
          RecognizeMicrophone.handleTranscriptEnd();
        }
      });
  
      // grab raw messages from the debugging events for display on the JSON tab
      stream.recognizeStream
        .on('message', (frame, json) => RecognizeMicrophone.handleRawdMessage({sent: false, frame, json}))
        .on('send-json', json => RecognizeMicrophone.handleRawdMessage({sent: true, json}))
        .once('send-data', () => RecognizeMicrophone.handleRawdMessage({
          sent: true, binary: true, data: true // discard the binary data to avoid waisting memory
        }))
        .on('close', (code, message) => RecognizeMicrophone.handleRawdMessage({close: true, code, message}));
  
      // ['open','close','finish','end','error', 'pipe'].forEach(e => {
      //     stream.recognizeStream.on(e, console.log.bind(console, 'rs event: ', e));
      //     stream.on(e, console.log.bind(console, 'stream event: ', e));
      // });
  }
*/
}

import * as soundworks from 'soundworks/client';
import PlayerRenderer from './PlayerRenderer';
import audioBuffer from './WhiteNoiseSynth';
import WhiteNoiseSynth from './WhiteNoiseSynth';
import ClickNoiseSynth from './ClickNoiseSynth';
import SampleSynth from './SampleSynth';

const viewTemplate = `
  <canvas class="background"></canvas>
  <div class="foreground">
    <div class="section-top flex-middle"></div>
    <div class="section-center flex-center">

      <% if (state === 'stop') { %>

        <p class="big"><%= stopTxt %></p>

      <% } else if (state === 'start') { %>

        <% if (mod === 'touch') { %>
          <p class="big"><%= touchTxt %></p>
        <% } else { %>
          <p class="big"><%= shakeTxt %></p>
        <% } %>

      <% } %>

    </div>
    <div class="section-bottom flex-middle"></div>
  </div>
`;

// this experience plays a sound when it starts, and plays another sound when
// other clients join the experience
export default class PlayerExperience extends soundworks.Experience {
  constructor(assetsDomain, audioFiles) {
    super();

    this.platform = this.require('platform', { features: ['web-audio', 'wake-lock'] });
    this.checkin = this.require('checkin', { showDialog: false });

    this.sync = this.require('sync');
    this.motionInput = this.require('motion-input', { descriptors: ['energy'] });
    this.sharedConfig = this.require('shared-config');

    this.onTouchStart = this.onTouchStart.bind(this);

    this.startSession = this.startSession.bind(this);
    this.stopSession = this.stopSession.bind(this);
    this.onMotionInputStream = this.onMotionInputStream.bind(this);
    this.shakeFlag = false;
    this.threshold = null;

    this.loader = this.require('loader', {
      assetsDomain: assetsDomain,
      files: audioFiles,
    });
  }


  init() {
    // initialize the view
    this.viewTemplate = viewTemplate;

    this.viewContent = {
      touchTxt: `Touch to make noise!`,
      shakeTxt: `Shake to make noise!`,
      stopTxt: 'Wait for the controller to start',
      state: 'stop',
      mod: '',
    };

    this.viewCtor = soundworks.CanvasView;
    this.viewOptions = { preservePixelRatio: true };

    this.view = this.createView();
  }

  onMotionInputStream(data) {
    if (data > this.threshold.high && this.shakeFlag === false)  {
      this.onShake();
      this.shakeFlag = true;
    } else if (data < this.threshold.low) {
      this.shakeFlag = false;
    }
  }


  onShake() {
    const syncTime = this.sync.getSyncTime();
    this.send('user:record', syncTime);

    //this.clickSynth.trigger();
    this.whiteSynth.trigger();
    //this.sampleSynth.trigger();
  }

  onTouchStart() {
    const syncTime = this.sync.getSyncTime();
    this.send('user:record', syncTime);

    //this.clickSynth.trigger();
    //this.whiteSynth.trigger();
    this.sampleSynth.trigger();
    
  }

  startSession(mod) {
    if (mod === 'touch') {
      this.view.installEvents({ 'touchstart': this.onTouchStart }, true);
    } else {
      if (this.motionInput.isAvailable('energy')) {
        this.motionInput.addListener('energy', this.onMotionInputStream);
      } else {
        console.log('Energy not available');
      }
    }

    this.view.content.state = 'start';
    this.view.content.mod = mod;
    this.view.render();
  }

  stopSession() {
    this.view.installEvents({}, true);

    this.view.content.state = 'stop';

    this.view.render();
  }

  start() {
    super.start(); // don't forget this

    if (!this.hasStarted)
      this.init();

    this.show();

    this.threshold = this.sharedConfig.get('threshold');

    this.receive('session:start', this.startSession);
    this.receive('session:stop', this.stopSession);

    this.receive('session:syncStart', () => {
      console.log('onSyncStart');
    });

    this.receive('session:syncStop', () => {
      console.log('onSyncStop');
    });

    this.view.setPreRender(function(ctx, dt) {
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = '#000000';
      ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fill();
      ctx.restore();
    });


    // Create the synths
    this.whiteSynth = new WhiteNoiseSynth();
    this.clickSynth = new ClickNoiseSynth();
    this.sampleSynth = new SampleSynth(this.loader.buffers[0]);

  }
}




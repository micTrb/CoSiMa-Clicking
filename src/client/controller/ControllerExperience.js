import * as soundworks from 'soundworks/client';

const viewTemplate = `
  <div class="wrapper">
  <% if (state === 'session-form') { %>

    <div id="session-form">
      <span id="label-title" class="label-title">Session name:</span>
      <input type="text" id="label"/>

      <span id="mod-title" class="label-title">Modality:</span>
      <div id="radio-toolbar">
        <label class="radio-mod">
          <input type="radio" name="mod" value="touch"/>
          Touch
        </label>

        <label class="radio-mod">
          <input type="radio" name="mod" value="shake"/>
          Shake
        </label>
      </div>
      <button id="send" class="control-btns">Send</button>
    </div>

  <% } else if (state === 'session-control') { %>

    

    <div id="session-control">
      <!--
      <p id="test-label">
        <span>Test if the client are synced:</span>
      </p>
      <button id="testStart" class="control-btns">
        Test start
      </button>
      <button id="testStop" class="control-btns">
        Test stop
      </button>
      -->
      
      <p id="session-label">
      <span>Session:</span>
      "<%= label %>"
      </p>
      <button id="start" class="control-btns">
        Start
      </button>
      <button id="stop" class="control-btns">
        Stop
      </button>
      <button id="end" class="control-btns">
        End session
      </button>
    </div>

  <% } %>
  </div>
`;



class ControllerExperience extends soundworks.Experience {
  constructor() {
    super();
    this.auth = this.require('auth');
    this.sessionStarted = this.sessionStarted.bind(this);
    this.sessionStopped = this.sessionStopped.bind(this);
  }

  init() {
  	this.viewTemplate = viewTemplate;
   	this.viewEvents = {
      'touchstart #send': this.onSend.bind(this),
      'touchstart #start': this.onStart.bind(this),
      'touchstart #stop': this.onStop.bind(this),
      'touchstart #end':this.onEnd.bind(this),
      'touchstart #testStart': this.onTestStart.bind(this),
      'touchstart #testStop': this.onTestStop.bind(this),
      
    };

    this.viewContent = {
      state: 'session-form',
      label: '',
    };

  	//Create the view at the
  	this.view = this.createView();
  }

  onSend(e) {
    const $labeltitle = this.view.$el.querySelector('#label-title');
    const $modtitle = this.view.$el.querySelector('#mod-title');
    const $radiomods = this.view.$el.querySelectorAll('.radio-mod');
    const $label = this.view.$el.querySelector('#label');
    const $mods = this.view.$el.querySelectorAll('[name=mod]');

    const label = $label.value || null;
    let mod = null;

    for (let i = 0; i < $mods.length; i++)
      if ($mods[i].checked) mod = $mods[i];

    // reset errors feedback
    $labeltitle.classList.remove('error');
    $modtitle.classList.remove('error');

    // if ok send to server
    if (label !== null && mod !== null) {
      this.send('session:create', label, mod.value);
    } else {
      // add error feedback
      if (label == null)
        $labeltitle.classList.add('error');

      if (mod == null)
        $modtitle.classList.add('error');
    }
  }

  onStart(e) {
    this.$start.classList.add('selected');
    this.$stop.classList.remove('selected');

    this.send('session:start');
  }

  onStop(e) {
    this.$stop.classList.add('selected');
    this.$start.classList.remove('selected');

    this.send('session:stop');
  }

  onEnd(e) {
    this.send('session:end');
  }

  sessionStarted(label) {
    this.view.content.state = 'session-control';
    this.view.content.label = label;
    this.view.render();
  }

  sessionStopped() {
    this.view.content.state = 'session-form';
    this.view.render();
  }

  onTestStart() {
    this.send('session:testStart');
    console.log('onTest');

    this.$testStart.classList.add('selected2');
    this.$testStop.classList.remove('selected2');
  }

  onTestStop() {
    this.send('session:testStop');
    console.log('onTest');

    this.$testStop.classList.add('selected2');
    this.$testStart.classList.remove('selected2');
  }

  start() {
    super.start(); // don't forget this
    if (!this.hasStarted)
      this.init();

  	this.show();
    this.view.$el.querySelector('#label-title').classList.remove('error');

    // Session Created Channel
    // receiving the sessionID and the Label
    this.receive('session:created', (id, label, mod) => {
      console.log(id, label, mod);
      this.view.content.state = 'session-control';
      this.view.content.mod = mod;
      this.view.content.label = label;
      this.view.render();

      this.$start = this.view.$el.querySelector('#start');
      this.$stop = this.view.$el.querySelector('#stop');

      this.$testStart = this.view.$el.querySelector('#testStart');
      this.$testStop = this.view.$el.querySelector('#testStop');

    });

    this.receive('session:end', () => {
      this.view.content.state = 'session-form';
      this.view.render();
    });

    this.receive('session:start', this.sessionStarted);
    this.receive('session:stop', this.sessionStopped);

  }
}


export default ControllerExperience;

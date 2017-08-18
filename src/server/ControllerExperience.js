import { Experience } from 'soundworks/server';
import databaseService from './databaseService';


class ControllerExperience extends Experience {
  constructor(clientType, session) {
    super(clientType);

    this.session = session;

    // this.require is a super() functions of the soundwork.Activity
    this.auth = this.require('auth');
  }

  start() {
    console.log('start on controller server side');
    console.log(databaseService);
  }

  clearSession() {
    this.session.id = null;
    this.session.state = null;
    this.session.label = null;
    this.session.mod = null;
  }

  enter(client) {
    super.enter(client);

    this.receive(client, 'session:create', (label, mod) => {
      databaseService.insertSessionsRecords(label, mod, (err, sessionId) => {
        if (err) {
          this.send(client, 'session:error');
          this.clearSession();
        } else {
          this.send(client, 'session:created', sessionId, label, mod);
          this.session.id = sessionId;
          this.session.label = label;
          this.session.state = 'stop';
          this.session.mod = mod;
        }
      });
    });

    this.receive(client, 'session:start', () => {
      this.broadcast('player', client, 'session:start', this.session.mod);
      this.session.state = 'start';
    });

    this.receive(client, 'session:stop', () => {
      this.broadcast('player', client, 'session:stop');
      this.session.state = 'stop';
    });

    this.receive(client, 'session:end', () => {
      this.broadcast('player', client, 'session:stop');
      this.session.state = 'stop';
      this.send(client, 'session:end');
      this.clearSession();
    });

    //Broadcast the click to every player
    this.receive(client, 'session:testStart', () => {
      console.log('onTestStart su Server');
      this.broadcast('player', client, 'session:syncStart')
    });

    this.receive(client, 'session:testStop', () => {
      console.log('onTestStop su Server');
      this.broadcast('player', client, 'session:syncStop')
    });

    if (this.session.state === 'start')
      this.send(client, 'session:start', this.session.label);
    else
      this.send(client, 'session:stop');
  
  }
}


export default ControllerExperience;









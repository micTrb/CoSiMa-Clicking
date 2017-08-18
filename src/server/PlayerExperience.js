import { Experience } from 'soundworks/server';
import databaseService from './databaseService';

"use strict";

// server-side 'player' experience.
export default class PlayerExperience extends Experience {
  constructor(clientType, session) {
    super(clientType);

    //Check if the session exists
    this.session = session;
    this.checkin = this.require('checkin');
    this.sharedConfig = this.require('shared-config');
    this.sync = this.require('sync');

    this.userRecords;

    this.sharedConfig.share('threshold', 'player');
  }


  // if anything needs to append when the experience starts
  start() {
    //log on the terminal
    console.log('Start on server');
  }



  // if anything needs to happen when a client enters the performance (*i.e.*
  // starts the experience on the client side), write it in the `enter` method
  enter(client) {
    super.enter(client);

    // send a message to all the other clients of the same type
    this.broadcast(client.type, client, 'play');

    console.log('New client');

    this.receive(client, 'user:record', (timestamp) => {
      databaseService.insertUserRecords(this.session.id, client.uuid, timestamp);
    });


    if (this.session.state === 'start')
      this.send(client, 'session:start', this.session.mod);
    else
      this.send(client, 'session:stop');


    /* * * * * * * * * */
  }


  exit(client) {
    super.exit(client);
  }
}



# Clicking

> Clicking is a collective [*Soundworks*](https://github.com/collective-soundworks/soundworks/) application.

Clickin makes people interacting between each others by making a single impulse of a white noise signal.

Each player can trigger a white noise impulse whether by touching or by shaking the phone.

Finally, the application provides a database service that gather data regarding information about the session of the performance and the user's interactions.


## Starting the application

To start running the Clicking application, enter this sequence of commands in a terminal:

```sh
$ git clone git+ssh://git@git.forge.ircam.fr/cosima-clicking.git
$ cd cosima-clicking
$ npm install
$ npm run watch
```

If you succeeded to execute all commands without errors, you can start connecting clients - on a mobile phone or a browser simulating a mobile user agent and touch events - to the server.

## Client side

The Clicking application provides two types of clients: the player and the controller.
Generally we have one controller and several player that interact between each others.

In the examples below, we assume that the server is reachable at the ip: `10.0.0.1` and that all clients are connected to the same network.

### The Controller

`http://10.0.0.1/controller`

The controller create the session with a label and an interaction modality (touch/shake).
Once a session is created, he or she can start the session, stop it or closing it.

### The Player

`http://10.0.0.1/`

Whenever a session is started by the controller, the player can interact with the application by touching on the screen or by shaking the device.
Each interaction (including shared timestap and user id) is recorded in the database.

## Structure of the database

The database is a relationnal database created with [`sqlite`](link to doc).
The database is composed of 2 tables: `sessions` and `user_records`.

The `sessions` table has the following columns: `id`, `label`, `mod` and `date`.
The `user_records` table has the following columns: `id`, `session_id`, `uuid` and `timestamp`.

The User records table contains informations about every single interactions of the user on the application. Every record reports the user `uuid`, the `timestamp` when he or she makes an interaction and the `id` of the session in which they used the application.

## Query example for database

To retrieve all the data about the sessions and the users interaction
we propose here some queries to select data and retrieve custom tables:

Query selection to get the: session `id` and `label`, user `uuid` and `timestamp`
filtered by a specific session `label` (see the WHERE clause).

```
SELECT u.id, s.label, u.uuid, u.timestamp FROM user_records u
INNER JOIN sessions s
    ON s.id = u.session_id
WHERE s.label = "session label"
```

Query selection to get the: session `id` and `label`, user `uuid` and `timestamp`
of every sessions.

```
SELECT u.id, s.label, u.uuid, u.timestamp FROM user_records u
INNER JOIN sessions s
    ON s.id = u.session_id
```

## Database management tools

A useful tool to manage easily the database is [*SQLite Studio*](http://sqlitestudio.pl).
You can use it, for instance, to view all the data in a preview window.

To do so, open the application and add the database from "Database > Add a Database" (the database is in the `db` folder of the application with the name of `clicknoisedb.sqlite`).

Once you've added a database you can query it first by selecting it and by opening the SQLite editor ("Tool > Open SQLite editor").

Copy and paste in the editor the queries above, run it by click on the play button and you will get the required data.

### Exporting data

You can easily export the resulting table from the query in an external data file (for example `csv`) in order to i;port in another tool (for example Mathlab). 
To do so, open the SQLite Studio application and select a table like the `session` table, the `user_records` table or a resulting table from a query.

##### Exporting an existing table

Click on `Tools` and select `Export`. In the selection panel, check the option `A single table`, then select an existing table from the clicknoise database whether `sessions` or `user_records`.
Select the format and path in which you want to get your file.

##### Exporting a table from a query

Click on `Tools` and select `Export`. In the selection panel, check the option `Query Result`. 
Write a query in the textbox (cf. [Query example for database](#query-example-for-database)), then export your table as in the previous example.





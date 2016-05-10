const dgram = require('dgram');
const moment = require('moment');
const net = require('net');

var musicians = new Map();
var UDPserv = dgram.createSocket('udp4');
var TCPServ = net.createServer();

/* TCP Server configuration */
TCPServ.on('connection', function(socket) {
	socket.write("Welcome in the concert hall !\r\n");
	socket.pipe(socket);
	
	// Check every "registered" musician:
    // if it hasn't played for 5 minutes, remove it from table (1 for test)
    musicians.forEach(function(musician) {
	  if(moment().diff(musician.time, 'seconds') >= 10) {
		console.log("A musician playing " + musician.instrument + " has been deleted");
		musicians.delete(musician.uuid);
	  }
    });
	
	var response = JSON.stringify(Array.from(musicians.values()));
	socket.write(response + "\r\n", function() {
		
		// Close connection after complete sending
		socket.destroy();
	});
});

TCPServ.on('error', function(socket) {
  console.log("An error occured on TCP server !");
  TCPServ.close();
});

TCPServ.listen(2205);


/* UDP Server configuration */ 
UDPserv.on('error', function(socket){
  console.log("An error occured on UDP server !");
  UDPserv.close();
});

UDPserv.on('message', (msg, rinfo) => {
  var content = JSON.parse(msg);
  
  // Add time played
  content.time = moment().format();
  
  // Check if musician already exists
  if(!musicians.get(content.uuid)) {
	  // If it doesn't exists, add it
	  console.log("A new musician plays " + content.instrument);
	  musicians.set(content.uuid, content);
  } else {
	// If it already exists, only update his time
	musicians.get(content.uuid).time = moment().format();
  }
  
  console.log(content.instrument + " : " + content.sound + ", " + content.time);
});

UDPserv.on('listening', () => {
  var address = UDPserv.address();
  console.log("Listening to " + address.address + ":" + address.port);
});

// Serveur UDP à l'écoute du port 8575
UDPserv.bind(8575, function(){
	UDPserv.addMembership("239.0.0.4");
});

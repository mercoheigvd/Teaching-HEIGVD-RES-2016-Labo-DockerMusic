// Gets required packages
const UUID = require('uuid');
const DGRAM = require('dgram');

// Constants
const TIME_GAP = 1000;
const IP_ADDRESS = "239.0.0.4";
const PORT = 8575;

// Create instrument's list
var tabInstruments = new Array();
tabInstruments["piano"] = "ti-ta-ti";
tabInstruments["trumpet"] = "pouet";
tabInstruments["flute"] = "trulu";
tabInstruments["violin"] = "gzi-gzi";
tabInstruments["drum"] = "boum-boum";

// Get error if the number of arguments is wrong (if instrument has not been set)
if(process.argv.length != 3) {
	console.log("Wrong arguments ! ");
	console.log(process.argv);
	return;
}

// Select instrument's sound
var mInstrument = process.argv[2].toLowerCase();

// Check if instruments exists
if(tabInstruments[mInstrument] == undefined){
	console.log("Your instrument isn't recognized !");
		return;
}

// Creates musician object to send through UDP port
var musician = {uuid: UUID.v1(), instrument: mInstrument, sound: tabInstruments[mInstrument]};

// Create socket and packet to send
const client = DGRAM.createSocket('udp4');
const packet = new Buffer(JSON.stringify(musician));

// Send object every second (1000 ms)
setInterval(function(){
	console.log("Musician plays " + musician.instrument + " : " + musician.sound);
	
	client.send(packet, 0, packet.length, PORT, IP_ADDRESS, (err) => {
		if(err){
			console.log(".- error");
		}
	});
}, TIME_GAP);

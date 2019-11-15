/** @type{?function()} */
var puzzle_init;

/** @type{number} */
var wid;

/** @type{Storage} */
var localStorage;

class Message {
    constructor() {
	/** @type{?boolean} */
	this.forward;
	/** @type{?number} */
	this.room;
	/** @type{?string} */
	this.audio;
    }
}

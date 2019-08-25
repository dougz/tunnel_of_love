/** @type{?function()} */
var puzzle_init;

/** @type{number} */
var waiter_id;

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

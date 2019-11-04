goog.require('goog.dom');
goog.require("goog.dom.classlist");
goog.require('goog.events');
goog.require('goog.net.XhrIo');
goog.require("goog.json.Serializer");

var serializer = null;

/** @param{Message} msg */
function tunnel_handle(msg) {
    if (msg.audio) {
	var audio = new Audio(msg.audio);
	audio.play();
    }
    var el = goog.dom.getElement("forward");
    if (msg.forward) {
	el.style.visibility = "visible";
    } else {
	el.style.visibility = "hidden";
    }

    el = goog.dom.getElement("room");
    el.innerHTML = "Room " + msg.room;
}

function tunnel_click(which) {
    goog.net.XhrIo.send("/tunmove/" + wid + "/" + which,
			function(e) {
     			    var code = e.target.getStatus();
     			    if (code == 200) {
				var msg = /** @type{Message} */ (e.target.getResponseJson());
				tunnel_handle(msg);
     			    } else if (code == 400) {
				alert("bad request!");
			    }
			}, "GET");
}

puzzle_init = function() {
    serializer = new goog.json.Serializer();

    var b;
    b = goog.dom.getElement("left");
    goog.events.listen(b, goog.events.EventType.CLICK, goog.bind(tunnel_click, null, "left"));
    b = goog.dom.getElement("forward");
    goog.events.listen(b, goog.events.EventType.CLICK, goog.bind(tunnel_click, null, "forward"));
    b = goog.dom.getElement("right");
    goog.events.listen(b, goog.events.EventType.CLICK, goog.bind(tunnel_click, null, "right"));
    b = goog.dom.getElement("startover");
    goog.events.listen(b, goog.events.EventType.CLICK, goog.bind(tunnel_click, null, "startover"));

    tunnel_click("startover");
}


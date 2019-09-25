/**
 * This JS file contains SPOILERS. 
 *
 * During the real hunt, the spoiler-y part of this 
 * logic was hidden on a server. 
 */

/**
 * Generated from the Phaser Sandbox
 *
 * //phaser.io/sandbox/kUOZroxi
 *
 * This source requires Phaser 2.6.2
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'tunneldiv', { preload: preload, create: create, update: update, render: render });

var sound_names = [
    'bell',
    'chicken',
    'clock',
    'crickets',
    'echo',
    'grammar',
    'growl',
    'hallelujah',
    'horn',
    'hounds',
    'intro',
    'panama',
    'soldiers',
    'surprise',
    ];

function preload() {
    var i;
    [
	'forward', 'start', 'start_over', 'turn_left', 'turn_right', 'forward'
    ].forEach(function(n) {
	game.load.image(n, document.getElementById(n).src)
    })
    
    sound_names.forEach(function(n) {
	game.load.audio(n, document.getElementById(n).src)
    })
}


var grid = [
    ['', '', 'panama', '', '', '', '', '', '', '', 'bell', '', 'echo'],
    ['bell', '', '', '', '', '', '', '', '', '', 'hounds', 'crickets', ''],
    ['grammar', 'surprise', '', '', '', '', '', '', 'hallelujah', '', 'bell', '', 'bell'],
    ['', '', '', '', '', '', '', '', 'bell', '', '', 'soldiers', 'clock'],
    ['bell', '', '', '', 'bell', '', '', '', '', 'horn', '', '', ''],
    ['', '', '', '', 'chicken', '', '', '', '', '', '', 'bell', ''],
    ['', '', '', 'bell', '', '', '', 'growl', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '']
]

var forward_sprite;
var turn_left_sprite;
var turn_right_sprite;
var start_over_sprite;
var start_new_sprite;
var room_number_text;

const directions = {
    NORTH:0,
    EAST:1,
    SOUTH:2,
    WEST:3,
}

var START_ROW = 4;
var START_COL = 6;

var cur_row;
var cur_col;
var cur_heading = directions.NORTH;
var BUTTON_OFFSET = 200;
var START_OVER_BUTTON_OFFSET = 25;

var intro_sound;
var sounds = {};

function create() {
    var i;
    
    forward_sprite = game.add.sprite(0, 0, 'forward');
    forward_sprite.anchor = new Phaser.Point(0.5, 0.5);
    forward_sprite.scale = new Phaser.Point(0.15, 0.15);
    forward_sprite.x = game.width/2;
    forward_sprite.y = game.height/2 - BUTTON_OFFSET;
    forward_sprite.inputEnabled = true;
    forward_sprite.events.onInputUp.add(onForwardUp, this);
    forward_sprite.visible = false;
    
    turn_left_sprite = game.add.sprite(0, 0, 'turn_left');
    turn_left_sprite.anchor = new Phaser.Point(0.5, 0.5);
    turn_left_sprite.scale = new Phaser.Point(0.15, 0.15);
    turn_left_sprite.x = game.width/2 - BUTTON_OFFSET;
    turn_left_sprite.y = game.height/2;
    turn_left_sprite.inputEnabled = true;
    turn_left_sprite.events.onInputUp.add(onTurnLeftUp, this);
    turn_left_sprite.visible = false;
    
    turn_right_sprite = game.add.sprite(0, 0, 'turn_right');
    turn_right_sprite.anchor = new Phaser.Point(0.5, 0.5);
    turn_right_sprite.scale = new Phaser.Point(0.15, 0.15);
    turn_right_sprite.x = game.width/2 + BUTTON_OFFSET;
    turn_right_sprite.y = game.height/2;
    turn_right_sprite.inputEnabled = true;
    turn_right_sprite.events.onInputUp.add(onTurnRightUp, this);
    turn_right_sprite.visible = false;
    
    start_over_sprite = game.add.sprite(0,0, 'start_over');
    start_over_sprite.anchor = new Phaser.Point(0, 1.0);
    start_over_sprite.scale = new Phaser.Point(0.1, 0.1);
    start_over_sprite.x = START_OVER_BUTTON_OFFSET;
    start_over_sprite.y = game.height - START_OVER_BUTTON_OFFSET;    
    start_over_sprite.inputEnabled = true;
    start_over_sprite.events.onInputUp.add(onStartOverUp, this);
    start_over_sprite.visible = false;
    
    start_new_sprite = game.add.sprite(0,0, 'start');
    start_new_sprite.anchor = new Phaser.Point(0.5, 0.5);
    start_new_sprite.scale = new Phaser.Point(0.2, 0.2);
    start_new_sprite.x = game.width/2;
    start_new_sprite.y = game.height/2;    
    start_new_sprite.inputEnabled = true;
    start_new_sprite.events.onInputUp.add(onStartNewUp, this);
    
    intro_sound = game.add.audio('intro');
    sound_names.forEach(function(sound_name) {
	sounds[sound_name] = game.add.audio(sound_name);
    })
}

function onStartNewUp() {
    start_new_sprite.visible = false;
    start_over_sprite.visible = true;
    forward_sprite.visible = true;
    turn_left_sprite.visible = true;
    turn_right_sprite.visible = true;
    
    room_number_text = game.add.text(100, 100, "Room 1", {
        font: "24px Arial",
        fill: "#ff0044",
        align: "left"
    });
    start_new_game();
}

function onStartOverUp() {
    start_new_game();
}

function onTurnRightUp() {
    if (cur_heading === directions.WEST) {
        cur_heading = directions.NORTH;
    } else {
        cur_heading++;
    }
    update_button_visibility();
}

function onTurnLeftUp() {
    if (cur_heading === directions.NORTH) {
        cur_heading = directions.WEST;
    } else {
        cur_heading--;
    }
    update_button_visibility();
}

function onForwardUp() {
    // move forward
        
    switch (cur_heading) {
        case directions.NORTH:
            cur_row--;
            break;
        case directions.EAST:
            cur_col++;
            break;
        case directions.SOUTH:
            cur_row++;
            break;
        case directions.WEST:
            cur_col--;
            break;
    }
    update_button_visibility();
    
    // check for audio
    var sound_name = grid[cur_row][cur_col];
    
    if (sound_name.length > 0) {
        var sound = sounds[sound_name];
        game.sound.stopAll();
        sound.play();
    }
}

function start_new_game() {
    cur_row = START_ROW;
    cur_col = START_COL;
    cur_heading = directions.NORTH;

    game.sound.stopAll();
    intro_sound.play();
    
    update_button_visibility();
}

function update_button_delay() {
    forward_sprite.visible = true;
    turn_left_sprite.visible = true;
    turn_right_sprite.visible = true;
    room_number_text.visible = true;
    
    room_number_text.setText("Room " + ((cur_row)* 13 + (cur_col+1)))
    
    switch (cur_heading) {
        case directions.NORTH:
            if (cur_row === 0) {
                forward_sprite.visible = false;
            }
            break;
        case directions.EAST:
            if (cur_col === grid[0].length - 1) {
                forward_sprite.visible = false;
            }
            break;
        case directions.SOUTH:
            if (cur_row === grid.length - 1) {
                forward_sprite.visible = false;
            }
            break;
        case directions.WEST:
            if (cur_col === 0) {
                forward_sprite.visible = false;
            }
            break;
    }
}

function update_button_visibility() {
    
    forward_sprite.visible = false;
    turn_left_sprite.visible = false;
    turn_right_sprite.visible = false;
    room_number_text.visible = false;
    
    game.time.events.add(Phaser.Timer.SECOND * 0.2, update_button_delay, this);
}



function update() {

}

function render() {

}

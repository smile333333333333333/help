/* =========================================================
   UNFINISHED
   FIXED game.js
   ========================================================= */

"use strict";

/* ---------------------------------------------------------
   SAFE ELEMENT HELPER
--------------------------------------------------------- */

function el(id) {
    return document.getElementById(id);
}

function onClick(id, fn) {
    const element = el(id);
    if (element) element.addEventListener("click", fn);
}


/* ---------------------------------------------------------
   CANVAS
--------------------------------------------------------- */

const canvas = el("gameCanvas");

let ctx = null;

if (canvas) {
    ctx = canvas.getContext("2d");
}

function resizeCanvas() {
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


/* ---------------------------------------------------------
   GAME STATE
--------------------------------------------------------- */

const game = {

    running: false,
    paused: false,
    ending: false,

    room: 0,

    build: "0.0.0",

    items: [],
    clues: [],

    flags: {},
    talkedTo: {},
    puzzlesSolved: {},
    drawings: {},

    secretLevel: 0,
    fear: 0,

    player: {
        x: 120,
        y: 300,
        speed: 3,
        runSpeed: 5
    }

};


/* ---------------------------------------------------------
   INPUT
--------------------------------------------------------- */

const keys = {};

window.addEventListener("keydown", function(e) {

    keys[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === "e") {
        interact();
    }

    if (e.key.toLowerCase() === "i") {
        toggleInventory();
    }

    if (e.key === "Escape") {
        togglePause();
    }

});

window.addEventListener("keyup", function(e) {
    keys[e.key.toLowerCase()] = false;
});


/* ---------------------------------------------------------
   ROOMS
--------------------------------------------------------- */

const rooms = [

    {
        name: "LOBBY",
        description: "The place where development started.",
        color: "#151719",

        objects: [
            ["PROJECT BOARD", 220, 180, 110, 70, "board"],
            ["BOX 01", 500, 180, 80, 60, "box"],
            ["EXIT", 900, 300, 50, 150, "exit"]
        ]
    },

    {
        name: "HALLWAY",
        description: "This hallway was not in the first build.",
        color: "#111315",

        objects: [
            ["TEAM PHOTO", 180, 170, 90, 100, "photo"],
            ["CLOCK", 430, 150, 70, 70, "clock"],
            ["DOOR", 700, 200, 100, 140, "door"]
        ]
    },

    {
        name: "BEDROOM",
        description: "A room nobody remembers creating.",
        color: "#171719",

        objects: [
            ["BED", 220, 210, 170, 70, "bed"],
            ["DRAWING DESK", 560, 190, 110, 70, "drawing"],
            ["MIRROR", 770, 250, 60, 120, "mirror"],
            ["CHEST", 430, 430, 90, 60, "chest"]
        ]
    },

    {
        name: "DEVELOPMENT ROOM",
        description: "Where the developers built the game.",
        color: "#101415",

        objects: [
            ["TERMINAL", 180, 180, 120, 80, "terminal"],
            ["PARTS CABINET", 470, 180, 110, 100, "cabinet"],
            ["BLUEPRINT", 740, 170, 110, 80, "blueprint"]
        ]
    },

    {
        name: "STORAGE",
        description: "Unused assets were stored here.",
        color: "#121314",

        objects: [
            ["CRATE", 180, 180, 100, 80, "crate"],
            ["OLD MONITOR", 430, 180, 100, 70, "monitor"],
            ["CHARACTER FILE", 700, 180, 110, 80, "charfile"],
            ["VENT", 820, 400, 80, 100, "vent"]
        ]
    },

    {
        name: "CAFETERIA",
        description: "The characters used to eat here.",
        color: "#171719",

        objects: [
            ["TABLE", 300, 220, 180, 70, "table"],
            ["VENDING MACHINE", 700, 180, 90, 140, "vending"],
            ["MILO", 500, 420, 50, 80, "milo"]
        ]
    },

    {
        name: "EMPLOYEE LOUNGE",
        description: "Someone has been waiting here.",
        color: "#141618",

        objects: [
            ["SOFA", 250, 190, 190, 80, "sofa"],
            ["TELEVISION", 650, 180, 130, 80, "tv"],
            ["IRIS", 500, 420, 50, 80, "iris"]
        ]
    },

    {
        name: "ARCHIVE",
        description: "Deleted things aren't always gone.",
        color: "#0e1011",

        objects: [
            ["FILE CABINET", 180, 180, 110, 130, "files"],
            ["TAPE PLAYER", 450, 180, 110, 80, "tape"],
            ["NUMBER WALL", 730, 180, 120, 100, "numbers"],
            ["SAM", 500, 430, 50, 80, "sam"]
        ]
    },

    {
        name: "ART ROOM",
        description: "Every character started as a drawing.",
        color: "#171719",

        objects: [
            ["EASEL", 220, 180, 80, 120, "easel"],
            ["PAINT TABLE", 480, 180, 170, 80, "paint"],
            ["MISSING PORTRAIT", 760, 190, 100, 130, "portrait"],
            ["SKETCHBOOK", 500, 420, 90, 60, "sketchbook"]
        ]
    },

    {
        name: "SERVER ROOM",
        description: "The game exists somewhere inside these machines.",
        color: "#09100d",

        objects: [
            ["SERVER A", 170, 180, 70, 150, "serverA"],
            ["SERVER B", 350, 180, 70, 150, "serverB"],
            ["SERVER C", 530, 180, 70, 150, "serverC"],
            ["MAIN SERVER", 760, 230, 110, 210, "mainserver"]
        ]
    },

    {
        name: "TEST CHAMBER",
        description: "Unfinished characters were tested here.",
        color: "#111416",

        objects: [
            ["TEST BUTTON", 200, 180, 80, 80, "testbutton"],
            ["WINDOW", 600, 170, 170, 100, "window"],
            ["CHAIR", 400, 410, 80, 90, "chair"],
            ["ZERO", 700, 430, 50, 80, "zero"]
        ]
    },

    {
        name: "THEATER",
        description: "The ending was supposed to happen here.",
        color: "#120f11",

        objects: [
            ["PROJECTOR", 200, 180, 110, 80, "projector"],
            ["SCREEN", 650, 160, 190, 110, "screen"],
            ["SEAT", 400, 430, 80, 50, "seat"],
            ["CURTAIN", 520, 140, 70, 360, "curtain"]
        ]
    },

    {
        name: "DEVELOPER OFFICE",
        description: "The last room they worked in.",
        color: "#131516",

        objects: [
            ["DESK", 250, 200, 160, 80, "desk"],
            ["COMPUTER", 650, 180, 110, 80, "computer"],
            ["FINAL NOTE", 450, 400, 90, 60, "finalnote"],
            ["PHONE", 800, 410, 70, 60, "phone"]
        ]
    },

    {
        name: "BACKSTAGE",
        description: "Behind the finished world.",
        color: "#0b0c0d",

        objects: [
            ["PROP BOX", 190, 170, 100, 80, "props"],
            ["BROKEN DOOR", 500, 170, 100, 130, "brokendoor"],
            ["CHARACTER SLOT", 760, 180, 90, 110, "slot"],
            ["VOID", 450, 450, 140, 80, "void"]
        ]
    },

    {
        name: "ROOM 15",
        description: "This room should not be here.",
        color: "#020202",

        objects: [
            ["CHAIR", 450, 220, 80, 100, "finalchair"],
            ["CHARACTER 06", 450, 390, 55, 85, "finalnpc"],
            ["EXIT", 900, 300, 50, 150, "finalexit"]
        ]
    }

];


/* ---------------------------------------------------------
   ITEMS
--------------------------------------------------------- */

const itemData = {

    key: {
        name: "OLD KEY",
        description: "A brass key marked 01."
    },

    screwdriver: {
        name: "SCREWDRIVER",
        description: "A small screwdriver."
    },

    fuse: {
        name: "FUSE",
        description: "A replacement fuse."
    },

    tape: {
        name: "UNKNOWN TAPE",
        description: "The label says PLAY ME LAST."
    },

    redchip: {
        name: "RED MEMORY CHIP",
        description: "A fragment of deleted data."
    },

    bluechip: {
        name: "BLUE MEMORY CHIP",
        description: "The label has been scratched away."
    },

    drawing: {
        name: "CHARACTER DRAWING",
        description: "A drawing you made."
    },

    password: {
        name: "PASSWORD NOTE",
        description: "A strange sequence of numbers."
    },

    film: {
        name: "FILM REEL",
        description: "An unfinished ending."
    }

};


/* ---------------------------------------------------------
   ITEM FUNCTIONS
--------------------------------------------------------- */

function hasItem(id) {
    return game.items.indexOf(id) !== -1;
}

function giveItem(id) {

    if (!itemData[id]) return;

    if (!hasItem(id)) {

        game.items.push(id);

        updateInventory();

        notify("ITEM FOUND: " + itemData[id].name);

    }

}

function removeItem(id) {

    const index = game.items.indexOf(id);

    if (index >= 0) {
        game.items.splice(index, 1);
        updateInventory();
    }

}


/* ---------------------------------------------------------
   CLUES
--------------------------------------------------------- */

function addClue(text) {

    if (game.clues.indexOf(text) === -1) {

        game.clues.push(text);

        game.secretLevel++;

        notify("ARG CLUE DISCOVERED");

    }

}


/* ---------------------------------------------------------
   NOTIFICATION
--------------------------------------------------------- */

let notificationTimeout = null;

function notify(text) {

    const box = el("notification");

    if (!box) {
        console.log(text);
        return;
    }

    box.textContent = text;
    box.classList.add("show");

    clearTimeout(notificationTimeout);

    notificationTimeout = setTimeout(function() {
        box.classList.remove("show");
    }, 2800);

}


/* ---------------------------------------------------------
   UPDATE UI
--------------------------------------------------------- */

function updateBuild() {

    const build = el("buildNumber");

    if (build) {
        build.textContent = game.build;
    }

}

function updateRoomName() {

    const room = el("roomName");

    if (room) {
        room.textContent = rooms[game.room].name;
    }

}

function updateInventory() {

    const count = el("inventoryCount");

    if (count) {
        count.textContent = game.items.length;
    }

    const list = el("inventoryItems");

    if (!list) return;

    list.innerHTML = "";

    if (game.items.length === 0) {

        list.innerHTML =
            "<div class='inventoryItem'>INVENTORY EMPTY</div>";

        return;
    }

    game.items.forEach(function(id) {

        const data = itemData[id];

        if (!data) return;

        const div = document.createElement("div");

        div.className = "inventoryItem";

        div.innerHTML =
            "<b>" + data.name + "</b><br>" +
            "<small>" + data.description + "</small>";

        list.appendChild(div);

    });

}


/* ---------------------------------------------------------
   LOAD ROOM
--------------------------------------------------------- */

function loadRoom(index) {

    if (index < 0 || index >= rooms.length) return;

    game.room = index;

    game.player.x = 100;

    game.player.y =
        canvas ?
        canvas.height / 2 :
        300;

    updateRoomName();

    updateBuild();

    notify("LOADED: " + rooms[index].name);

}


/* ---------------------------------------------------------
   MOVEMENT
--------------------------------------------------------- */

function updatePlayer() {

    if (!game.running) return;
    if (game.paused) return;
    if (game.ending) return;

    const speed =
        keys.shift ?
        game.player.runSpeed :
        game.player.speed;

    if (keys.w) game.player.y -= speed;
    if (keys.s) game.player.y += speed;
    if (keys.a) game.player.x -= speed;
    if (keys.d) game.player.x += speed;

    if (canvas) {

        game.player.x =
            Math.max(
                25,
                Math.min(
                    canvas.width - 25,
                    game.player.x
                )
            );

        game.player.y =
            Math.max(
                45,
                Math.min(
                    canvas.height - 35,
                    game.player.y
                )
            );

        if (game.player.x >= canvas.width - 35) {
            attemptExit();
        }

    }

}


/* ---------------------------------------------------------
   EXIT
--------------------------------------------------------- */

function attemptExit() {

    if (game.room === 0) {

        if (hasItem("key")) {

            loadRoom(1);

        } else {

            notify("THE EXIT IS LOCKED.");

            game.player.x -= 30;

        }

        return;
    }

    if (game.room < 14) {

        loadRoom(game.room + 1);

        return;

    }

    if (game.room === 14) {

        if (game.flags.finalReady) {

            startEnding();

        } else {

            notify("YOU HAVEN'T FINISHED THE GAME.");

            game.player.x -= 30;

        }

    }

}


/* ---------------------------------------------------------
   INTERACTION
--------------------------------------------------------- */

function interact() {

    if (!game.running || game.paused || game.ending) {
        return;
    }

    const objects = rooms[game.room].objects;

    let closest = null;
    let closestDistance = Infinity;

    objects.forEach(function(obj) {

        const dx =
            game.player.x - obj[1];

        const dy =
            game.player.y - obj[2];

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (
            distance < closestDistance &&
            distance < 130
        ) {

            closest = obj;
            closestDistance = distance;

        }

    });

    if (closest) {
        useObject(closest[5]);
    }

}


/* ---------------------------------------------------------
   OBJECTS
--------------------------------------------------------- */

function useObject(type) {

    switch (type) {

        case "exit":
            attemptExit();
            break;


        case "board":

            showDocument(
                "PROJECT BOARD",
`PROJECT: UNFINISHED

ROOMS PLANNED: 15

CHARACTERS PLANNED: 6

ENDING: ???

Someone wrote:

"WE NEVER FINISHED IT.

IT FINISHED US."`
            );

            addClue("15 ROOMS");

            break;


        case "box":

            if (!hasItem("key")) {

                giveItem("key");

                showDocument(
                    "BOX 01",
                    "A brass key is inside."
                );

            } else {

                notify("THE BOX IS EMPTY.");

            }

            break;


        case "photo":

            showDocument(
                "TEAM PHOTO",
`THE DEVELOPMENT TEAM

Five chairs.

Four people.

One chair has been scratched out.

On the back:

"HE WAS NEVER ON THE TEAM."

17-04-09`
            );

            addClue("17-04-09");

            break;


        case "clock":

            puzzle(
                "BROKEN CLOCK",
                "The clock is stuck at 3:17.\n\nThe team photo contained the clue.",
                "ENTER TIME",
                "1704",
                function() {

                    game.puzzlesSolved.clock = true;

                    game.build = "0.0.3";

                    addClue("17:04");

                    notify("THE CLOCK STARTED MOVING.");

                }
            );

            break;


        case "door":

            if (game.puzzlesSolved.clock) {

                loadRoom(2);

            } else {

                notify("THE DOOR IS LOCKED.");

            }

            break;


        case "bed":

            showDocument(
                "BED",
`The sheets are disturbed.

A note is underneath.

"I've been waiting since the last build.

Please finish me."`
            );

            game.fear++;

            break;


        case "drawing":

            openDrawing();

            break;


        case "mirror":

            showDocument(
                "MIRROR",
`You look into the mirror.

For a second...

the reflection doesn't move.

Then everything is normal.`
            );

            game.fear += 2;

            break;


        case "chest":

            puzzle(
                "LOCKED CHEST",
                "The lock has four numbers.\n\nHint: the first four characters.",
                "FOUR DIGITS",
                "1234",
                function() {

                    game.puzzlesSolved.chest = true;

                    giveItem("bluechip");

                }
            );

            break;


        case "terminal":

            openTerminal();

            break;


        case "cabinet":

            if (!hasItem("screwdriver")) {

                giveItem("screwdriver");

            } else {

                giveItem("fuse");

            }

            break;


        case "blueprint":

            showDocument(
                "BLUEPRINT",
`ROOM 15

The blueprint shows a room behind Room 14.

The room has been crossed out.

"DO NOT REBUILD."

Someone added:

"PLEASE."`
            );

            addClue("DO NOT REBUILD");

            break;


        case "crate":

            giveItem("screwdriver");

            break;


        case "monitor":

            showDocument(
                "OLD MONITOR",
`BUILD ERROR

CHARACTER_04

FILE NOT FOUND

SEARCHING...

FILE FOUND

LOCATION:
ART ROOM

WARNING:

CHARACTER IS ACTIVE`
            );

            game.fear += 2;

            break;


        case "charfile":

            showDocument(
                "CHARACTER_04.DAT",
`NAME: [CORRUPTED]

STATUS: WAITING

LAST ACTIVE:
2,912 DAYS AGO

FINAL MESSAGE:

"I DON'T WANT TO BE DELETED AGAIN."`
            );

            addClue("CHARACTER_04");

            break;


        case "vent":

            puzzle(
                "VENT",
                "The screws have numbers on them.",
                "ENTER ORDER",
                "1704",
                function() {

                    giveItem("password");

                }
            );

            break;


        case "table":

            showDocument(
                "CAFETERIA TABLE",
`Someone carved four names:

MILO
IRIS
SAM
ZERO

Below them:

"THEY WERE NEVER SUPPOSED TO SPEAK."`
            );

            break;


        case "vending":

            puzzle(
                "VENDING MACHINE",
                "A strange four-digit code is required.",
                "FOUR DIGITS",
                "0506",
                function() {

                    giveItem("tape");

                }
            );

            break;


        case "milo":

            talkMilo();

            break;


        case "sofa":

            showDocument(
                "SOFA",
`Five seats.

One has a name scratched into it:

REBECCA

Nobody named Rebecca is in the game.`
            );

            addClue("REBECCA");

            break;


        case "tv":

            showDocument(
                "TELEVISION",
`STATIC.

For one frame:

ROOM 8

17

09

04`
            );

            addClue("ROOM 8 / 17 / 09 / 04");

            break;


        case "iris":

            talkIris();

            break;


        case "files":

            showDocument(
                "FILE CABINET",
`FILE 001 — COMPLETE
FILE 002 — COMPLETE
FILE 003 — COMPLETE
FILE 004 — DELETED
FILE 005 — DELETED
FILE 006 — MISSING
FILE 007 — NEVER CREATED

"COUNT THE EMPTY FILES."`
            );

            addClue("COUNT THE EMPTY FILES");

            break;


        case "tape":

            giveItem("tape");

            break;


        case "numbers":

            puzzle(
                "NUMBER WALL",
                "17 04 09 15 03 01\n\nEnter the sequence.",
                "SEQUENCE",
                "1709150301",

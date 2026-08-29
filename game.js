/* =========================================================
   UNFINISHED
   game.js
   ========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let W = window.innerWidth;
let H = window.innerHeight;

canvas.width = W;
canvas.height = H;

window.addEventListener("resize", () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
});


/* =========================================================
   GAME STATE
   ========================================================= */

const game = {

    running: false,
    paused: false,

    room: 0,

    build: "0.0.0",

    items: [],

    clues: [],

    flags: {},

    repaired: {},

    talkedTo: {},

    puzzlesSolved: {},

    drawings: {},

    choices: {},

    secretLevel: 0,

    fear: 0,

    ending: false,

    player: {
        x: 120,
        y: 360,
        speed: 2.7,
        runningSpeed: 4.3
    }

};


/* =========================================================
   INPUT
   ========================================================= */

const keys = {};

window.addEventListener("keydown", e => {

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

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});


/* =========================================================
   ROOMS
   ========================================================= */

const rooms = [

    {
        name: "LOBBY",
        subtitle: "The place where development started.",
        color: "#17191b",

        objects: [
            ["PROJECT BOARD", 220, 180, 100, 70, "board"],
            ["BOX 01", 520, 180, 70, 60, "box"],
            ["EXIT", 850, 300, 50, 150, "exit"]
        ]
    },

    {
        name: "HALLWAY",
        subtitle: "This hallway was not in the first build.",
        color: "#141619",

        objects: [
            ["TEAM PHOTO", 180, 150, 80, 90, "photo"],
            ["CLOCK", 450, 120, 65, 65, "clock"],
            ["ROOM 2", 700, 180, 90, 50, "door2"],
            ["ROOM 3", 700, 360, 90, 50, "door3"]
        ]
    },

    {
        name: "BEDROOM",
        subtitle: "A room that nobody remembers creating.",
        color: "#151517",

        objects: [
            ["BED", 220, 210, 150, 70, "bed"],
            ["DRAWING DESK", 570, 190, 100, 60, "drawing"],
            ["MIRROR", 760, 250, 60, 120, "mirror"],
            ["LOCKED CHEST", 420, 430, 80, 60, "chest"]
        ]
    },

    {
        name: "DEVELOPMENT ROOM",
        subtitle: "Where the developers built the game.",
        color: "#101413",

        objects: [
            ["TERMINAL", 180, 180, 120, 80, "terminal"],
            ["PARTS CABINET", 500, 180, 100, 100, "cabinet"],
            ["BLUEPRINT", 760, 160, 100, 80, "blueprint"],
            ["ELEVATOR", 760, 410, 70, 120, "elevator"]
        ]
    },

    {
        name: "STORAGE",
        subtitle: "Unused assets were stored here.",
        color: "#121314",

        objects: [
            ["CRATE", 190, 170, 100, 80, "crate"],
            ["OLD MONITOR", 430, 170, 90, 70, "monitor"],
            ["CHARACTER FILE", 700, 180, 80, 70, "charfile"],
            ["VENT", 820, 400, 70, 90, "vent"]
        ]
    },

    {
        name: "CAFETERIA",
        subtitle: "The characters used to eat here.",
        color: "#181719",

        objects: [
            ["TABLE", 300, 220, 180, 70, "table"],
            ["VENDING MACHINE", 700, 170, 70, 130, "vending"],
            ["NPC", 500, 420, 45, 65, "milo"]
        ]
    },

    {
        name: "EMPLOYEE LOUNGE",
        subtitle: "Somebody has been waiting here.",
        color: "#151719",

        objects: [
            ["SOFA", 250, 180, 180, 70, "sofa"],
            ["TELEVISION", 650, 180, 120, 70, "tv"],
            ["NPC", 500, 420, 45, 65, "iris"]
        ]
    },

    {
        name: "ARCHIVE",
        subtitle: "Deleted things aren't always gone.",
        color: "#101112",

        objects: [
            ["FILE CABINET", 180, 180, 100, 120, "files"],
            ["TAPE PLAYER", 450, 180, 100, 70, "tape"],
            ["NUMBER WALL", 730, 170, 100, 100, "numbers"],
            ["NPC", 500, 430, 45, 65, "sam"]
        ]
    },

    {
        name: "ART ROOM",
        subtitle: "Every character started as a drawing.",
        color: "#171719",

        objects: [
            ["EASEL", 220, 180, 70, 110, "easel"],
            ["PAINT TABLE", 470, 180, 160, 70, "paint"],
            ["MISSING PORTRAIT", 760, 180, 100, 130, "portrait"],
            ["SKETCHBOOK", 500, 420, 70, 50, "sketchbook"]
        ]
    },

    {
        name: "SERVER ROOM",
        subtitle: "The game exists somewhere inside these machines.",
        color: "#09100c",

        objects: [
            ["SERVER A", 170, 170, 70, 150, "serverA"],
            ["SERVER B", 350, 170, 70, 150, "serverB"],
            ["SERVER C", 530, 170, 70, 150, "serverC"],
            ["MAIN SERVER", 760, 220, 100, 200, "mainserver"]
        ]
    },

    {
        name: "TEST CHAMBER",
        subtitle: "This room was used to test unfinished characters.",
        color: "#121416",

        objects: [
            ["TEST BUTTON", 200, 180, 80, 80, "testbutton"],
            ["OBSERVATION WINDOW", 600, 160, 150, 100, "window"],
            ["CHAIR", 400, 400, 70, 90, "chair"],
            ["NPC", 700, 430, 45, 65, "zero"]
        ]
    },

    {
        name: "THEATER",
        subtitle: "The ending was supposed to happen here.",
        color: "#120f11",

        objects: [
            ["PROJECTOR", 200, 180, 100, 70, "projector"],
            ["SCREEN", 650, 160, 180, 100, "screen"],
            ["SEAT", 400, 430, 70, 50, "seat"],
            ["RED CURTAIN", 500, 120, 70, 350, "curtain"]
        ]
    },

    {
        name: "DEVELOPER OFFICE",
        subtitle: "The last room they worked in.",
        color: "#131415",

        objects: [
            ["DESK", 250, 200, 150, 80, "desk"],
            ["COMPUTER", 650, 180, 100, 80, "computer"],
            ["NOTE", 450, 400, 70, 50, "finalnote"],
            ["PHONE", 800, 410, 60, 50, "phone"]
        ]
    },

    {
        name: "BACKSTAGE",
        subtitle: "Behind the finished world.",
        color: "#0c0d0e",

        objects: [
            ["PROP BOX", 190, 170, 100, 80, "props"],
            ["BROKEN DOOR", 500, 170, 90, 130, "brokendoor"],
            ["CHARACTER SLOT", 760, 180, 80, 100, "slot"],
            ["VOID", 450, 450, 120, 70, "void"]
        ]
    },

    {
        name: "ROOM 15",
        subtitle: "This room should not be here.",
        color: "#020202",

        objects: [
            ["CHAIR", 450, 220, 80, 100, "finalchair"],
            ["PERSON", 450, 390, 45, 70, "finalnpc"],
            ["EXIT", 800, 280, 50, 150, "finalexit"]
        ]
    }

];


/* =========================================================
   ITEMS
========================================================= */

const itemData = {

    key: {
        name: "OLD KEY",
        description: "A brass key with the number 01 scratched into it."
    },

    screwdriver: {
        name: "SCREWDRIVER",
        description: "A small screwdriver from the development room."
    },

    fuse: {
        name: "FUSE",
        description: "A replacement fuse for old electrical equipment."
    },

    tape: {
        name: "UNKNOWN TAPE",
        description: "The label says: PLAY ME LAST."
    },

    redchip: {
        name: "RED MEMORY CHIP",
        description: "It contains a fragment of deleted data."
    },

    bluechip: {
        name: "BLUE MEMORY CHIP",
        description: "The label has been scratched away."
    },

    drawing: {
        name: "CHARACTER DRAWING",
        description: "Your drawing of the missing character."
    },

    gear: {
        name: "METAL GEAR",
        description: "A part from an unfinished machine."
    },

    password: {
        name: "PASSWORD NOTE",
        description: "The note contains a strange sequence of numbers."
    },

    film: {
        name: "FILM REEL",
        description: "An unfinished ending."
    }

};


/* =========================================================
   UTILITY
========================================================= */

function hasItem(id) {
    return game.items.includes(id);
}

function giveItem(id) {

    if (!hasItem(id)) {

        game.items.push(id);

        updateInventory();

        notify(
            "ITEM FOUND: " +
            itemData[id].name
        );

    }
}

function removeItem(id) {

    const index = game.items.indexOf(id);

    if (index !== -1) {

        game.items.splice(index, 1);

        updateInventory();

    }

}

function addClue(text) {

    if (!game.clues.includes(text)) {

        game.clues.push(text);

        game.secretLevel++;

        notify("ARG CLUE DISCOVERED");

    }

}


/* =========================================================
   ROOM LOADING
========================================================= */

function loadRoom(index) {

    if (index < 0 || index >= rooms.length) return;

    game.room = index;

    game.player.x = 100;
    game.player.y = H / 2;

    document.getElementById("roomName").textContent =
        rooms[index].name;

    document.getElementById("buildNumber").textContent =
        game.build;

    roomArrival(index);

}


function roomArrival(index) {

    switch (index) {

        case 0:
            notify("THE GAME HAS BEEN WAITING.");
            break;

        case 1:
            notify("HALLWAY LOADED.");
            break;

        case 2:
            notify("ROOM FILE RECOVERED.");
            break;

        case 3:
            notify("DEVELOPMENT DATA DETECTED.");
            break;

        case 4:
            notify("UNUSED ASSETS.");
            break;

        case 5:
            notify("EMPLOYEE AREA.");
            break;

        case 6:
            notify("SOMEONE IS STILL HERE.");
            break;

        case 7:
            notify("ARCHIVE ACCESS.");
            break;

        case 8:
            notify("ART ASSETS RECOVERED.");
            break;

        case 9:
            notify("SERVER CONNECTION ESTABLISHED.");
            break;

        case 10:
            notify("TEST CHAMBER ACTIVE.");
            break;

        case 11:
            notify("ENDING ASSETS FOUND.");
            break;

        case 12:
            notify("LAST DEVELOPER FILE.");
            break;

        case 13:
            notify("BEHIND THE WORLD.");
            break;

        case 14:
            notify("ROOM FILE CORRUPTED.");
            game.fear += 3;
            break;

    }

}


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function updatePlayer() {

    if (!game.running || game.paused || game.ending) return;

    let speed =
        keys.shift ?
        game.player.runningSpeed :
        game.player.speed;

    if (keys.w) game.player.y -= speed;
    if (keys.s) game.player.y += speed;
    if (keys.a) game.player.x -= speed;
    if (keys.d) game.player.x += speed;

    game.player.x =
        Math.max(30, Math.min(W - 30, game.player.x));

    game.player.y =
        Math.max(40, Math.min(H - 35, game.player.y));


    if (game.player.x > W - 30) {

        attemptExit();

    }

}


/* =========================================================
   ROOM EXIT
========================================================= */

function attemptExit() {

    const r = game.room;

    if (r === 0) {

        if (hasItem("key")) {
            loadRoom(1);
        } else {
            notify("THE EXIT IS LOCKED.");
            game.player.x = W - 50;
        }

        return;
    }

    if (r >= 1 && r < 14) {

        loadRoom(r + 1);

        return;

    }

    if (r === 14) {

        if (game.flags.finalReady) {
            startEnding();
        } else {
            notify("THE DOOR DOESN'T OPEN.");
            game.player.x = W - 50;
        }

    }

}


/* =========================================================
   INTERACTION
========================================================= */

function interact() {

    if (!game.running || game.paused) return;

    const objects = rooms[game.room].objects;

    let closest = null;
    let distance = Infinity;

    for (const obj of objects) {

        const dx = game.player.x - obj[1];
        const dy = game.player.y - obj[2];

        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < distance && d < 120) {

            distance = d;
            closest = obj;

        }

    }

    if (closest) {

        useObject(closest[5]);

    }

}


/* =========================================================
   OBJECT SYSTEM
========================================================= */

function useObject(type) {

    switch (type) {

        case "board":
            showDocument(
                "PROJECT BOARD",
                `PROJECT UNFINISHED

ROOMS PLANNED: 15

ROOMS FINISHED: 4

CHARACTERS PLANNED: 6

CHARACTERS FINISHED: 3

ENDING: ???

Someone has written underneath:

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
                    "A key.\n\nWhy was this stored here?"
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

Written on the back:

"HE WAS NEVER ON THE TEAM."

Under that:

17-04-09`
            );

            addClue("17-04-09");
            break;


        case "clock":

            showPuzzle(
                "BROKEN CLOCK",
                `The clock is stuck at 3:17.

Three buttons are underneath.

Set the clock to the correct time.

Hint:

The team photo contains the first clue.`,
                `
                <input
                    id="puzzleAnswer"
                    class="puzzleInput"
                    placeholder="ENTER TIME"
                    maxlength="5">
                `
            );

            break;


        case "door2":

            if (!game.puzzlesSolved.clock) {

                notify("THE DOOR IS LOCKED.");

            } else {

                loadRoom(2);

            }

            break;


        case "door3":

            if (game.puzzlesSolved.clock) {

                loadRoom(3);

            } else {

                notify("THE DOOR IS LOCKED.");

            }

            break;


        case "bed":

            showDocument(
                "BED",
                `The sheets are disturbed.

There is a note underneath.

"I've been waiting since the last build.

Please finish me."

There is no signature.`
            );

            game.fear++;

            break;


        case "drawing":

            openDrawing();

            break;


        case "mirror":

            mirrorEvent();

            break;


        case "chest":

            if (game.puzzlesSolved.chest) {

                giveItem("bluechip");

            } else {

                showPuzzle(
                    "LOCKED CHEST",
                    `The lock has four symbols.

A note says:

"THE ORDER THEY WERE CREATED."`,
                    `
                    <input
                        id="puzzleAnswer"
                        class="puzzleInput"
                        placeholder="ENTER FOUR DIGITS">
                    `
                );

            }

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

At the bottom:

"DO NOT REBUILD."

Someone added:

"PLEASE."`
            );

            addClue("DO NOT REBUILD");
            break;


        case "elevator":

            if (hasItem("fuse")) {

                removeItem("fuse");

                game.flags.elevatorFixed = true;

                game.build = "0.1.2";

                updateBuild();

                notify("ELEVATOR REPAIRED.");

            } else {

                notify("THE ELEVATOR NEEDS A FUSE.");

            }

            break;


        case "crate":

            giveItem("gear");

            break;


        case "monitor":

            showDocument(
                "OLD MONITOR",
                `BUILD ERROR:

CHARACTER_04

FILE NOT FOUND

SEARCHING...

FILE FOUND

LOCATION:
ART_ROOM

WARNING:
CHARACTER IS ACTIVE`
            );

            game.fear += 2;

            break;


        case "charfile":

            showDocument(
                "CHARACTER_04.DAT",
                `NAME: [CORRUPTED]

AGE: UNKNOWN

STATUS:
WAITING

LAST ACTIVE:
2,912 DAYS AGO

FINAL MESSAGE:

"I DON'T WANT TO BE DELETED AGAIN."`
            );

            addClue("CHARACTER_04");
            break;


        case "vent":

            showPuzzle(
                "VENT",
                `A strange sound is coming from inside.

There are four screws.

Remove them in the correct order.

The order is hidden somewhere in the building.`,
                `
                <input
                    id="puzzleAnswer"
                    class="puzzleInput"
                    placeholder="FOUR DIGITS">
                `
            );

            break;


        case "table":

            showDocument(
                "CAFETERIA TABLE",
                `Someone carved names into the table.

MILO
IRIS
SAM
ZERO

Below them:

"THEY WERE NEVER SUPPOSED TO SPEAK."`
            );

            break;


        case "vending":

            showPuzzle(
                "VENDING MACHINE",
                `The machine accepts a four digit code.

A sticker says:

"LOOK AT THE PEOPLE WHO AREN'T HERE."`,
                `
                <input
                    id="puzzleAnswer"
                    class="puzzleInput"
                    placeholder="FOUR DIGITS">
                `
            );

            break;


        case "milo":

            talkMilo();

            break;


        case "sofa":

            showDocument(
                "SOFA",
                `There are five seats.

One has a name written on it:

REBECCA

Nobody named Rebecca is in the game.`
            );

            addClue("REBECCA");
            break;


        case "tv":

            if (!hasItem("tape")) {

                showDocument(
                    "TELEVISION",
                    `The television only displays static.

For one frame, you see:

ROOM 8

17

09

04`
                );

                addClue("ROOM 8 / 17 / 09 / 04");

            } else {

                notify("THE SCREEN IS BLANK.");

            }

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

Someone has written:

"COUNT THE EMPTY FILES."`
            );

            addClue("COUNT THE EMPTY FILES");

"use strict";

/* =========================================================
   UNFINISHED — STARTUP FIX
   Everything waits for the HTML to finish loading.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("UNFINISHED: HTML loaded.");
    console.log("UNFINISHED: Starting JavaScript...");

    /* -----------------------------------------------------
       HELPERS
    ----------------------------------------------------- */

    function get(id) {
        return document.getElementById(id);
    }

    function show(id) {
        const element = get(id);
        if (element) {
            element.classList.remove("hidden");
            element.style.display = "";
        }
    }

    function hide(id) {
        const element = get(id);
        if (element) {
            element.classList.add("hidden");
        }
    }

    /* -----------------------------------------------------
       GAME DATA
    ----------------------------------------------------- */

    const game = {
        running: false,
        room: 0,
        items: [],
        clues: [],
        fear: 0,
        build: "0.0.0",

        player: {
            x: 120,
            y: 300,
            speed: 3
        }
    };

    const rooms = [
        {
            name: "LOBBY",
            description: "The unfinished beginning.",
            objects: [
                ["PROJECT BOARD", 250, 200, "board"],
                ["BOX 01", 500, 200, "box"],
                ["EXIT", 900, 300, "exit"]
            ]
        },
        {
            name: "HALLWAY",
            description: "This hallway wasn't in the original build.",
            objects: [
                ["TEAM PHOTO", 250, 200, "photo"],
                ["BROKEN CLOCK", 500, 180, "clock"],
                ["DOOR", 800, 300, "door"]
            ]
        },
        {
            name: "BEDROOM",
            description: "Someone has been waiting here.",
            objects: [
                ["BED", 250, 220, "bed"],
                ["DRAWING DESK", 550, 200, "drawing"],
                ["MIRROR", 800, 250, "mirror"]
            ]
        },
        {
            name: "DEVELOPMENT ROOM",
            description: "The developers built the game here.",
            objects: [
                ["TERMINAL", 250, 200, "terminal"],
                ["CABINET", 500, 200, "cabinet"],
                ["BLUEPRINT", 750, 200, "blueprint"]
            ]
        },
        {
            name: "STORAGE",
            description: "Unused things were left behind.",
            objects: [
                ["CRATE", 250, 200, "crate"],
                ["OLD MONITOR", 500, 200, "monitor"],
                ["CHARACTER FILE", 750, 200, "file"]
            ]
        },
        {
            name: "CAFETERIA",
            description: "The characters used to eat here.",
            objects: [
                ["TABLE", 300, 220, "table"],
                ["VENDING MACHINE", 700, 200, "vending"],
                ["MILO", 500, 400, "milo"]
            ]
        },
        {
            name: "EMPLOYEE LOUNGE",
            description: "Someone is still sitting here.",
            objects: [
                ["SOFA", 300, 220, "sofa"],
                ["TELEVISION", 700, 200, "tv"],
                ["IRIS", 500, 400, "iris"]
            ]
        },
        {
            name: "ARCHIVE",
            description: "Deleted files aren't always gone.",
            objects: [
                ["FILE CABINET", 250, 200, "files"],
                ["TAPE PLAYER", 500, 200, "tape"],
                ["SAM", 500, 400, "sam"]
            ]
        },
        {
            name: "ART ROOM",
            description: "Every character began as a drawing.",
            objects: [
                ["EASEL", 250, 200, "easel"],
                ["PAINT TABLE", 500, 200, "paint"],
                ["MISSING PORTRAIT", 750, 200, "portrait"]
            ]
        },
        {
            name: "SERVER ROOM",
            description: "The game exists somewhere in these machines.",
            objects: [
                ["SERVER A", 200, 250, "server"],
                ["SERVER B", 400, 250, "server"],
                ["SERVER C", 600, 250, "server"],
                ["MAIN SERVER", 800, 300, "mainserver"]
            ]
        },
        {
            name: "TEST CHAMBER",
            description: "Unfinished characters were tested here.",
            objects: [
                ["TEST BUTTON", 250, 200, "button"],
                ["WINDOW", 700, 200, "window"],
                ["ZERO", 500, 400, "zero"]
            ]
        },
        {
            name: "THEATER",
            description: "The original ending was supposed to happen here.",
            objects: [
                ["PROJECTOR", 250, 200, "projector"],
                ["SCREEN", 700, 180, "screen"],
                ["CURTAIN", 500, 400, "curtain"]
            ]
        },
        {
            name: "DEVELOPER OFFICE",
            description: "The last place the developers worked.",
            objects: [
                ["DESK", 300, 220, "desk"],
                ["COMPUTER", 700, 200, "computer"],
                ["FINAL NOTE", 500, 400, "note"]
            ]
        },
        {
            name: "BACKSTAGE",
            description: "Behind the finished world.",
            objects: [
                ["PROP BOX", 250, 200, "props"],
                ["BROKEN DOOR", 500, 200, "broken"],
                ["VOID", 700, 350, "void"]
            ]
        },
        {
            name: "ROOM 15",
            description: "This room should not exist.",
            objects: [
                ["CHARACTER 06", 500, 350, "finalnpc"],
                ["EXIT", 900, 300, "finalexit"]
            ]
        }
    ];

    /* -----------------------------------------------------
       CANVAS
    ----------------------------------------------------- */

    const canvas = get("gameCanvas");
    let ctx = null;

    if (canvas) {
        ctx = canvas.getContext("2d");

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener("resize", resize);
    }

    /* -----------------------------------------------------
       SCREEN CONTROL
    ----------------------------------------------------- */

    function startGame() {

        console.log("START BUTTON WORKED!");

        game.running = true;
        game.room = 0;
        game.player.x = 120;

        hide("mainMenu");
        hide("menuScreen");
        hide("titleScreen");

        show("gameScreen");
        show("game");

        updateRoom();

        notify("WELCOME TO UNFINISHED.");

    }

    /* -----------------------------------------------------
       FIND THE START BUTTON
       
       This doesn't rely on one specific ID.
       It looks for several possible IDs AND buttons
       whose text says START or NEW GAME.
    ----------------------------------------------------- */

    function connectStartButton() {

        const possibleIDs = [
            "newGameButton",
            "startButton",
            "startGame",
            "playButton",
            "newGame",
            "start",
            "play"
        ];

        let found = false;

        for (let i = 0; i < possibleIDs.length; i++) {

            const button = get(possibleIDs[i]);

            if (button) {

                button.addEventListener(
                    "click",
                    startGame
                );

                console.log(
                    "START BUTTON FOUND:",
                    possibleIDs[i]
                );

                found = true;
            }
        }

        /* Search every button as a backup. */

        const buttons =
            document.querySelectorAll("button");

        buttons.forEach(function(button) {

            const text =
                button.textContent
                    .trim()
                    .toUpperCase();

            if (
                text === "START" ||
                text === "NEW GAME" ||
                text === "PLAY"
            ) {

                button.addEventListener(
                    "click",
                    startGame
                );

                console.log(
                    "START BUTTON FOUND BY TEXT:",
                    text
                );

                found = true;
            }

        });

        if (!found) {

            console.error(
                "UNFINISHED: NO START BUTTON FOUND."
            );

        }

    }

    /* -----------------------------------------------------
       ROOM
    ----------------------------------------------------- */

    function updateRoom() {

        const room = rooms[game.room];

        const roomName = get("roomName");

        if (roomName) {
            roomName.textContent = room.name;
        }

        const roomDescription =
            get("roomDescription");

        if (roomDescription) {
            roomDescription.textContent =
                room.description;
        }

        draw();
    }

    function nextRoom() {

        if (game.room < rooms.length - 1) {

            game.room++;

            game.player.x = 100;

            updateRoom();

            notify(
                "ENTERED: " +
                rooms[game.room].name
            );

        } else {

            ending();

        }

    }

    /* -----------------------------------------------------
       NOTIFICATION
    ----------------------------------------------------- */

    let notificationTimer;

    function notify(message) {

        const notification =
            get("notification");

        if (!notification) {

            console.log(message);

            return;
        }

        notification.textContent =
            message;

        notification.style.display =
            "block";

        clearTimeout(
            notificationTimer
        );

        notificationTimer =
            setTimeout(function () {

                notification.style.display =
                    "none";

            }, 2500);

    }

    /* -----------------------------------------------------
       INTERACTION
    ----------------------------------------------------- */

    function interact() {

        if (!game.running) return;

        const room =
            rooms[game.room];

        let closest = null;
        let distance = Infinity;

        room.objects.forEach(function(object) {

            const dx =
                game.player.x - object[1];

            const dy =
                game.player.y - object[2];

            const d =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                d < distance &&
                d < 140
            ) {

                distance = d;
                closest = object;

            }

        });

        if (closest) {

            useObject(
                closest[3]
            );

        }

    }

    /* -----------------------------------------------------
       OBJECT INTERACTIONS
    ----------------------------------------------------- */

    function useObject(type) {

        switch (type) {

            case "board":

                documentMessage(
                    "PROJECT BOARD",
`PROJECT: UNFINISHED

15 ROOMS

6 CHARACTERS

1 ENDING

STATUS:
ABANDONED

Someone wrote:

"THEY WERE WAITING FOR SOMEONE TO FINISH IT."`
                );

                addClue("15 ROOMS");

                break;


            case "box":

                if (
                    game.items.indexOf("key") === -1
                ) {

                    game.items.push("key");

                    notify(
                        "FOUND: OLD KEY"
                    );

                } else {

                    notify(
                        "THE BOX IS EMPTY."
                    );

                }

                break;


            case "photo":

                documentMessage(
                    "TEAM PHOTO",
`Five chairs.

Four people.

One person has been scratched out.

On the back:

"HE WAS NEVER ON THE TEAM."

17-04-09`
                );

                addClue("17-04-09");

                break;


            case "clock":

                puzzle(
                    "BROKEN CLOCK",
                    "The clock is stuck at 3:17.",
                    "1704",
                    function () {

                        addClue("17:04");

                        notify(
                            "THE CLOCK STARTED."
                        );

                    }
                );

                break;


            case "door":

                if (
                    game.room < rooms.length - 1
                ) {
                    nextRoom();
                }

                break;


            case "bed":

                documentMessage(
                    "BED",
`A note is underneath.

"I've been waiting since the last build.

Please finish me."`
                );

                break;


            case "drawing":

                drawingPrompt();

                break;


            case "mirror":

                documentMessage(
                    "MIRROR",
`You look into the mirror.

Your reflection doesn't move.

Then it does.`
                );

                game.fear++;

                break;


            case "terminal":

                terminal();

                break;


            case "file":

                documentMessage(
                    "CHARACTER_04.DAT",
`STATUS: DELETED

LAST ACTIVE:
2,912 DAYS AGO

FINAL MESSAGE:

"I DON'T WANT TO BE DELETED AGAIN."`
                );

                addClue("CHARACTER_04");

                break;


            case "monitor":

                documentMessage(
                    "OLD MONITOR",
`BUILD ERROR

CHARACTER_04

FILE FOUND

STATUS:
ACTIVE`
                );

                game.fear++;

                break;


            case "milo":

                dialogue(
                    "MILO",
                    "Oh. You're real.",
                    [
                        "WHO ARE YOU?",
                        "WHERE ARE THE DEVELOPERS?",
                        "GOODBYE"
                    ]
                );

                break;


            case "iris":

                dialogue(
                    "IRIS",
                    "Do you know what happens when a character never gets an ending?",
                    [
                        "THEY WAIT.",
                        "THEY DISAPPEAR."
                    ]
                );

                break;


            case "sam":

                dialogue(
                    "SAM",
                    "Have you found the deleted file?",
                    [
                        "NO",
                        "CHARACTER 04?"
                    ]
                );

                break;


            case "zero":

                dialogue(
                    "ZERO",
                    "I just want this waiting to stop.",
                    [
                        "I'LL HELP YOU.",
                        "I CAN'T."
                    ]
                );

                break;


            case "finalnpc":

                game.finalReady = true;

                dialogue(
                    "CHARACTER 06",
                    "You actually finished it.",
                    [
                        "WHO ARE YOU?",
                        "I'M NOT LEAVING YOU HERE.",
                        "I'M READY."
                    ]
                );

                break;


            default:

                notify(
                    "NOTHING HAPPENS."
                );

        }

    }

    /* -----------------------------------------------------
       DIALOGUE
    ----------------------------------------------------- */

    function dialogue(
        speaker,
        text,
        choices
    ) {

        const message =
            speaker +
            "\n\n" +
            text +
            "\n\n" +
            choices.join("\n");

        documentMessage(
            speaker,
            message
        );

    }

    /* -----------------------------------------------------
       DOCUMENT
    ----------------------------------------------------- */

    function documentMessage(
        title,
        text
    ) {

        const screen =
            get("documentScreen");

        if (!screen) {

            alert(
                title +
                "\n\n" +
                text
            );

            return;
        }

        const titleElement =
            get("documentTitle");

        const textElement =
            get("documentText");

        if (titleElement) {
            titleElement.textContent =
                title;
        }

        if (textElement) {
            textElement.textContent =
                text;
        }

        screen.classList.remove(
            "hidden"
        );

    }

    /* -----------------------------------------------------
       PUZZLE
    ----------------------------------------------------- */

    function puzzle(
        title,
        description,
        answer,
        success
    ) {

        const input =
            prompt(
                title +
                "\n\n" +
                description +
                "\n\nENTER CODE:"
            );

        if (
            input &&
            input.trim() === answer
        ) {

            success();

        } else {

            notify(
                "WRONG CODE."
            );

        }

    }

    /* -----------------------------------------------------
       DRAWING
    ----------------------------------------------------- */

    function drawingPrompt() {

        const drawing =
            prompt(
`THE CHARACTER HAS NO FACE.

DRAWING SYSTEM ERROR.

For this prototype,
type what you want the character's face to look like.`
            );

        if (drawing) {

            game.items.push(
                "character drawing"
            );

            addClue(
                "THE PLAYER DREW CHARACTER 04"
            );

            notify(
                "CHARACTER FACE RESTORED."
            );

        }

    }

    /* -----------------------------------------------------
       TERMINAL
    ----------------------------------------------------- */

    function terminal() {

        const command =
            prompt(
`DEVELOPER TERMINAL

COMMANDS:

ROOMS
CHARACTERS
ARCHIVE
MEMORY
STATUS`
            );

        if (!command) return;

        switch (
            command.toUpperCase()
        ) {

            case "ROOMS":

                documentMessage(
                    "TERMINAL",
                    "ROOMS FOUND: 15"
                );

                break;

            case "CHARACTERS":

                documentMessage(
                    "TERMINAL",
`MILO — ACTIVE
IRIS — ACTIVE
SAM — ACTIVE
ZERO — ACTIVE
CHARACTER 04 — DELETED
CHARACTER 06 — WAITING`
                );

                break;

            case "ARCHIVE":

                documentMessage(
                    "TERMINAL",
`ARCHIVE:

DEVLOG_001
DEVLOG_004
DEVLOG_009
FINAL_NOTE
PLAYER.DAT`
                );

                addClue(
                    "PLAYER.DAT"
                );

                break;

            case "MEMORY":

                documentMessage(
                    "TERMINAL",
`17
04
09
15

THESE ARE NOT ROOM NUMBERS.

THEY ARE DATES.`
                );

                addClue(
                    "THE NUMBERS ARE DATES"
                );

                break;

            case "STATUS":

                documentMessage(
                    "TERMINAL",
`BUILD: ${game.build}

ROOM: ${

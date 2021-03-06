window.onload = function() {
    Crafty.init(798, 435, document.getElementById('game')); // init

    window.resizeTo(815, 475);
    Crafty.timer.FPS(30);

    // Checking HTAs
    window.isHTA = false;
    var htaApp = document.getElementsByTagName("HTA:APPLICATION")
    if (!htaApp.length) {
        htaApp = document.getElementsByTagName("APPLICATION");
    }
    if (htaApp.length == 1 && htaApp[0]) {
        window.isHTA = typeof htaApp[0].commandLine !== "undefined";
    }


    Crafty.redirectToURL = function(url) {
        document.getElementById("page").value = url;
        if (!window.isHTA) {
            location.hash = url;
        }
        Crafty.trigger("UpdateContent");
    }


    window.loadingScreen = Crafty.e("HTML")
        .append("<h1>Loading...</h1>");

    Crafty.load({ // Loading images
        "images": [
            "images/UI/back.png", "images/UI/Loading.gif", "images/UI/AboutStartup/OutlookBrand.png", "images/UI/Outlook/mail1.png", "images/UI/Go.png", "images/UI/Home.png", "images/UI/Close.png", // UI
            "images/screens/StartupPage.png", "images/screens/Bing.png", "images/screens/404.png", "images/screens/Outlook/1.png", // Pages
            "images/alerts/StartupMsg.png",
            "images/users/1.png", "images/users/2.png", "images/users/3.png", "images/users/4.png", "images/users/5.png", "images/users/6.png", "images/users/7.png", "images/users/8.png", "images/users/9.png", "images/users/10.png", "images/users/11.png", "images/users/12.png" // Users
        ]
    }, function() {

        Crafty.audio.add("background", "audio/background.mp3");
        Crafty.audio.add("critical", "audio/Critical.mp3");
        Crafty.audio.add("alert", "audio/Alert.mp3");

        // Definitions
        window.ui = {}
        window.alerts = {}
        window.game = { coins: 0 };
        window.troll_pages = [{
                "url": "firefox.com",
                "Title": "Firefox - Download",
                "action": "Alert the user:</p><p> \"A firefox bite your internet cable.\nPlease try again later\"",
                "len": "350"
            },
            {
                "url": "google.com",
                "Title": "Google",
                "action": "Redirect to Bing",
                "len": "150"

            },
            {
                "url": "adobe.com/flash-player",
                "Title": "Download Adobe Flash player",
                "action": "Alert the user:</p><p> \"Adobe Flash player is required to see this content.\"",
                "len": "350"
            },
            {
                "url": "kaperski.com/download",
                "Title": "Download Kaperski Antivirus",
                "action": "Alert the user:</p><p> \"A virus was detected while downloading this page.\"",
                "len": "350"
            },
            {
                "url": "twitter.com",
                "Title": "Twitter - Social networking",
                "action": "Redirect to MSN",
                "len": "150"
            },
            {
                "url": "gameurl.com/play",
                "Title": "LAST LEVEL OF THE HARDEST GAME IN THE WORLD",
                "action": "Alert the user:</p><p> \"Internet Explorator has stoped working.\"",
                "len": "350"
            },
            {
                "url": "steampowered.com",
                "Title": "Steam - THE Game store",
                "action": "Redirect to the Windovs Store",
                "len": "200"
            },
        ]


        window.pages = {};




        // Internet Explorator UI
        window.ui.contener = Crafty.e('2D, DOM, Image') // Page content
            .attr({ x: 0, y: 118, w: 797, h: 317, oldPage: "404" })
            .image("images/screens/StartupPage.png")
            .bind("UpdateContent", function() {
                page = document.getElementById("page").value;
                if (page !== window.ui.contener.oldPage) {
                    window.ui.contener.visible = false;
                    window.pages[window.ui.contener.oldPage].leave();
                    window.ui.loading.visible = true
                    setTimeout(function() {
                        page = document.getElementById("page").value;
                        if (window.pages[page] == undefined) {
                            page = "404";
                        }
                        infos = window.pages[page];
                        infos.enter();
                        window.ui.title.text(infos.title.length > 14 ? infos.title.substr(0, 14) + "..." : infos.title);
                        window.ui.contener.visible = true
                        window.ui.loading.visible = false;
                        window.ui.contener.oldPage = page;
                    }, 5000)
                }
            });

        window.ui.pageinput = Crafty.e("HTML") // Page input
            .append("<input type='text' id='page' class='urlbar' onkeyup='if(event.which == 13) {Crafty.trigger(\"UpdateContent\");}' />" +
                "<select class='urlbar' onchange='Crafty.redirectToURL(this.value);this.value=\"\";'><option value='about:startup'></option><option value='outlook.com'>Outlook</option></select>");

        window.ui.loading = Crafty.e('2D, DOM, Image') // Loading gif
            .attr({ x: 180, y: 120, w: 441, h: 291, visible: false })
            .image("images/UI/Loading.gif")

        window.ui.back = Crafty.e('2D, DOM, Image, Mouse') // Loading back button
            .attr({ x: 8, y: 55, w: 79, h: 33 })
            .image("images/UI/back.png")
            .bind('Click', function(MouseEvent) {
                alert("Did you really thought Internet Explorator 8 saved history?");
            });

        window.ui.go = Crafty.e('2D, DOM, Image, Mouse') // Loading go -> button
            .attr({ x: 686, y: 93, w: 60, h: 22 })
            .image("images/UI/Go.png")
            .bind("Click", function(ev) { Crafty.trigger("UpdateContent") });

        window.ui.close = Crafty.e('2D, DOM, Image, Mouse') // Loading the X
            .attr({ x: 771, y: 4, w: 23, h: 23 })
            .image("images/UI/Close.png")
            .bind("Click", function(ev) { window.close() });

        window.ui.home = Crafty.e('2D, DOM, Image, Mouse') // Loading the home button
            .attr({ x: 199, y: 58, w: 27, h: 27 })
            .image("images/UI/Home.png")
            .bind("Click", function(ev) {
                document.getElementById("page").value = "about:startup";
                Crafty.trigger("UpdateContent");
            });

        window.ui.pause = Crafty.e('2D, DOM, Mouse') // Loading the Pause button
            .attr({ x: 725, y: 4, w: 23, h: 23 })
            .bind("Click", function() {
                Crafty.pause();
            })

        window.ui.fps = Crafty.e('2D, DOM, Image, Mouse, HTML') // Loading the FPS setting
            .attr({ x: 450, y: 54, w: 40, h: 40 })
            .image("images/UI/FPS.png")
            .append("<select style='opacity: 0.1; width: 40px; height: 40px;' onchange='Crafty.timer.FPS(this.value)'><option value='120'>120</option><option value='60'>60</option><option value='30'>30</option><option value='15'>15</option></select>")

        window.ui.title = Crafty.e('2D, DOM, Text') // Loading the Title
            .attr({ x: 23, y: 8, w: 103 })
            .text("New page")
            .css("font", "15px Arial")

        window.ui.score = Crafty.e('2D, DOM, HTML') // Loading the Score bar
            .attr({ x: 381, y: 64, w: 200, score: 0 })
            .append("0 <img src='images/UI/rage.png' class='rage'></img>")
            .css({ "font": "13px Calibri", "color": "black", "vertical-align": "middle" })
            .bind("GainCoin", function(data) {
                this.score += data.gain;
                this.replace(this.score + "<img src='images/UI/rage.png' class='rage'></img>")
            })





        // Page related content

        // Registering pages...
        new Page("Bing research", "bing.com", "images/icons/404.png", function() { window.ui.contener.image("images/screens/Bing.png") }, function() {});
        new Page("New page", "about:startup", "images/icons/404.png", function() { window.ui.contener.image("images/screens/StartupPage.png"); }, function() {});
        new Page("Google", "google.com", "images/icons/404.png", function() { Crafty.redirectToURL("bing.com") }, function() {});
        new Page("Outlook Mail", "outlook.com", "images/icons/404.png", function() { window.ui.contener.image("images/screens/Outlook/1.png"); }, function() {});
        new Page("You've been hired! - Outlook Mail", "outlook.com/mail/ThisIsTheBestMailMessageUrlEver", "images/icons/404.png", function() { window.ui.contener.image("images/screens/Outlook/2.png"); }, function() {});
        new Page("Misrocoft - Work Online", "misrocoft.com/work-online/errorer", "images/icons/404.png", function() {
            window.ui.contener.image("images/screens/Error/1.png");
            Crafty.audio.play("background", -1, 0.01);
        }, function() {
            Crafty.audio.pause('background');
        });
        new Page("404 NOT FOUND", "404", "images/icons/404.png", function() { window.ui.contener.image("images/screens/404.png"); }, function() {});

        // Registering pages elements.
        window.pages["about:startup"].addEntity(Crafty.e('2D, DOM, Image, Mouse') // Outlook link
            .attr({ x: 54, y: 318, w: 118, h: 116, visible: true })
            .image("images/UI/AboutStartup/OutlookBrand.png")
            .bind('Click', function(ev) {
                Crafty.redirectToURL("outlook.com");
            }));

        window.pages["outlook.com"].addEntity(Crafty.e('2D, DOM, Image, Mouse') // Mail link
            .attr({ x: 251, y: 257, w: 467, h: 31 })
            .image("images/UI/Outlook/mail1.png")
            .bind('Click', function(ev) {
                Crafty.redirectToURL("outlook.com/mail/ThisIsTheBestMailMessageUrlEver");
            }));

        window.pages["outlook.com/mail/ThisIsTheBestMailMessageUrlEver"].addEntity(Crafty.e('2D, DOM, Mouse, HTML') // Loading the Link
            .attr({ x: 211, y: 379, w: 300, h: 14 })
            .append("misrocoft.com/work-online/errorer")
            .bind('Click', function(ev) {
                Crafty.redirectToURL("misrocoft.com/work-online/errorer");
            })
            .css({ color: "blue", "font": "10px DengXian", "-ms-user-select": "all", "user-select": "all" }));



        // Game UI
        window.pages["misrocoft.com/work-online/errorer"].addEntity(Crafty.e('2D, DOM, User').attr({ y: 130 }).createText({ x: 10, y: 260, w: 300 })) // Loading Left User
        window.pages["misrocoft.com/work-online/errorer"].addEntity(Crafty.e('2D, DOM, User').attr({ y: 130, x: 700 }).createText({ x: 498, y: 260, w: 300 })) // Loading Right User
        window.pages["misrocoft.com/work-online/errorer"].addEntity(Crafty.e('2D, DOM, User').attr({ y: 270, x: 350 }).createText({ x: 250, y: 250, w: 300 })) // Loading center User
        Crafty("User").get(0)._children[0].append("<div id='progress'><div id='progress2'></div></div>");
        Crafty("User").get(1)._children[0].css("text-align", "right").append("<div id='progress' style='float: right;'><div id='progress2'></div></div>");
        Crafty("User").get(2)._children[0].css("text-align", "center").append("<div id='progress' style='margin: auto;'><div id='progress2'></div></div>");
        window.pages["misrocoft.com/work-online/errorer"].addEntity(Crafty.e('2D, DOM, Action').attr({ y: 200, baseY: function() { return 200; } })) // Loading First Action
        window.pages["misrocoft.com/work-online/errorer"].addEntity(Crafty.e('2D, DOM, Action').attr({ y: 350, baseY: function() { return 350; }, baseX: function() { return 0; } })) // Loading Second Action
        window.pages["misrocoft.com/work-online/errorer"].addEntity(Crafty.e('2D, DOM, Action').attr({ y: 350, x: 458, baseY: function() { return 350; }, baseX: function() { return 458; } })) // Loading last Action
        Crafty("Action").get(0).x = 399 - (Crafty("Action").get(0).w / 2)
        Crafty("Action").get(0).baseX = function() { return 399 - (Crafty("Action").get(0).w / 2) }


        // From Launching.
        Crafty.e('Alert')
            .attr({ x: 10, y: 10, w: 606, h: 424 })
            .image("images/alerts/StartupMsg.png")
            .button({ x2: 492, y2: 373, w: 80, h: 24, onclick: function() { window.alerts[1].dismiss() } }); // Creating the "OK" button





        window.loadingScreen.replace("");


        if (location.hash.length > 1) {
            Crafty.redirectToURL(location.hash.substr(1));
            window.alerts[1].dismiss();
        } else {
            Crafty.redirectToURL("about:startup");
        }

    });
}
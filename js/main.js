window.onload = function() {
    Crafty.init(798, 435, document.getElementById('game')); // init

    window.resizeTo(815, 475);


    window.loadingScreen = Crafty.e("HTML")
        .append("<h1>Loading...</h1>");

    Crafty.load({ // Loading images
        "images": [
            "images/UI/back.png", "images/UI/Loading.gif", "images/UI/AboutStartup/OutlookBrand.png", "images/UI/Outlook/mail1.png", "images/UI/Go.png", "images/UI/Home.png", "images/UI/Close.png", // UI
            "images/screens/StartupPage.png", "images/screens/Bing.png", "images/screens/404.png", "images/screens/Outlook/1.png", // Pages
            "images/alerts/StartupMsg.png"
        ]
    }, function() {

        window.ui = {}
        window.alerts = {}

        window.ui.contener = Crafty.e('2D, DOM, Image') // Page content
            .attr({ x: 0, y: 118, w: 797, h: 317, oldPage: "about:startup" })
            .image("images/screens/StartupPage.png")
            .bind("UpdateContent", function() {
                page = document.getElementById("page").value;
                if (page !== window.ui.contener.oldPage) {
                    window.ui.contener.css("display", "none");
                    window.pages[window.ui.contener.oldPage].leave();
                    window.ui.loading.css("display", "block")
                    setTimeout(function() {
                        page = document.getElementById("page").value;
                        if (window.pages[page] == undefined) {
                            page = "404";
                        }
                        console.log(window.pages[page].url);
                        infos = window.pages[page];
                        infos.enter();
                        window.ui.title.text(infos.title.length > 14 ? infos.title.substr(0, 12) + "..." : infos.title);
                        window.ui.contener.css("display", "block")
                        window.ui.loading.css("display", "none");
                        window.ui.contener.oldPage = page;
                    }, 5000)
                }
            });


        Crafty.redirectToURL = function(url) {
            document.getElementById("page").value = url;
            location.hash = url;
            Crafty.trigger("UpdateContent");
        }


        window.troll_pages = [{
                "url": "firefox.com",
                "Title": "Firefox - Download",
                "action": "Alert the user: \"A firefox bite your internet cable.\nPlease try again later\""
            },
            {
                "url": "google.com",
                "Title": "google",
                "action": "Redirect to Bing"

            },
            {
                "url": "adobe.com/flash-player",
                "Title": "Download Adobe Flash player",
                "action": "Alert the user: \"Adobe Flash player is required to see this content.\""
            }
        ]


        window.pages = {};

        // Registering pages...
        new Page("Bing research", "bing.com", "images/icons/404.png", function() { window.ui.contener.image("images/screens/Bing.png") }, function() {});
        new Page("New page", "about:startup", "images/icons/404.png", function() { window.ui.contener.image("images/screens/StartupPage.png"); }, function() {});
        new Page("Google", "google.com", "images/icons/404.png", function() { Crafty.redirectToURL("bing.com") }, function() {});
        new Page("Outlook Mail", "outlook.com", "images/icons/404.png", function() { window.ui.contener.image("images/screens/Outlook/1.png"); }, function() {});
        new Page("You've been hired! - Outlook Mail", "outlook.com/mail/ThisIsTheBestMailMessageUrlEver", "images/icons/404.png", function() { window.ui.contener.image("images/screens/Outlook/2.png"); }, function() {});
        new Page("Misrocoft - Work Online", "misrocoft.com/work-online/errorer", "images/icons/404.png", function() { window.ui.contener.image("images/screens/Error/1.png"); }, function() {});
        new Page("404 NOT FOUND", "404", "images/icons/404.png", function() { window.ui.contener.image("images/screens/404.png"); }, function() {});

        // Registering pages elements.
        window.pages["about:startup"].addEntity(Crafty.e('2D, DOM, Image, Mouse') // Outlook link
            .attr({ x: 54, y: 318, w: 118, h: 116 })
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
            .attr({ x: 211, y: 379, w: 300 })
            .append("misrcoft.com/work-online/errorer")
            .bind('Click', function(ev) {
                Crafty.redirectToURL("misrcoft.com/work-online/errorer");
            })
            .css({ color: "blue", "font": "10px DengXian", "-ms-user-select": "all", "user-select": "all" }));



        // Game UI Test
        window.pages["misrocoft.com/work-online/errorer"].addEntity(Crafty.e('2D, DOM, User').attr({ y: 200 })) // Loading Test User
        window.pages["misrocoft.com/work-online/errorer"].addEntity(Crafty.e('2D, DOM, Action').attr({ y: 200, x: 200 })) // Loading Test Action





        window.ui.pageinput = Crafty.e("HTML") // Page input
            .append("<input type='text' id='page' class='urlbar' onkeyup='if(event.which == 13) {Crafty.trigger(\"UpdateContent\");}' />" +
                "<select class='urlbar' onchange='Crafty.redirectToURL(this.value);this.value=\"\";'><option value='about:startup'></option><option value='outlook.com'>Outlook</option></select>");

        window.ui.loading = Crafty.e('2D, DOM, Image') // Loading gif
            .attr({ x: 180, y: 120, w: 441, h: 291 })
            .image("images/UI/Loading.gif")
            .css("display", "none");

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

        window.ui.title = Crafty.e('2D, DOM, Text') // Loading the Title
            .attr({ x: 23, y: 8, w: 103 })
            .text("New page")
            .css("font", "15px Arial")

        window.game = { coins: 0 };




        window.loadingScreen.replace("");


        if (location.hash.length > 1) {
            Crafty.redirectToURL(location.hash.substr(1));
        }

    });
}
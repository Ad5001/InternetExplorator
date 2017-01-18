window.onload = function() {
    Crafty.init(798, 435, document.getElementById('game')); // init

    window.resizeTo(815, 475);


    window.loadingScreen = Crafty.e("HTML")
        .append("<h1>Loading...</h1>");

    Crafty.load({ // Loading images
        "images": [
            "images/UI/back.png", "images/UI/Loading.gif", "images/UI/OutlookBrand.png", // UI
            "images/sreens/StartupPage.png", "images/sreens/Bing.png", // Pages
            "images/alerts/StartupMsg.png"
        ]
    }, function() {


        Crafty.redirectToURL = function(url) {
            document.getElementById("page").value = url;
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


        new Page("Bing research", "bing.com", "images/icons/404.png", function() { window.ui.contener.image("images/screens/Bing.png") }, function() {});
        new Page("New page", "about:startup", "images/icons/404.png", function() { window.ui.contener.image("images/screens/StartupPage.png"); }, function() {});
        new Page("Google", "google.com", "images/icons/404.png", function() { Crafty.redirectToURL("bing.com") }, function() {});
        new Page("Outlook", "outlook.com", "images/icons/404.png", function() { window.ui.contener.image("images/screens/Outlook.png"); }, function() {});


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
                        typeof window.pages[page] !== "undefined" ? infos = window.pages[page] : { "title": "404 Not found", "icon": "images/icons/404.png", "action": function() { window.ui.contener.image("images/screens/404.png") } };
                        infos.enter();
                        window.ui.title.text(infos.title);
                        window.ui.contener.css("display", "block")
                        window.ui.loading.css("display", "none");
                        window.ui.contener.oldPage = page;
                    }, 5000)
                }
            });




        window.ui.pageinput = Crafty.e("HTML") // Page input
            .append("<input type='text' id='page' class='urlbar' onkeyup='if(event.which == 13) {Crafty.trigger(\"UpdateContent\");}' />" +
                "<select class='urlbar' onmouseout='this.style.left = \"668px\";this.style.width = \"10px\";' onclick='this.style.left = \"90px\";this.style.width = \"590px\";' onchange='Crafty.redirectToURL(this.value);this.value=\"\";'><option value='about:startup'></option><option value='outlook.com'>Outlook</option></select>");

        window.pages["about:startup"].addEntity(Crafty.e('2D, DOM, Image, Mouse') // Outlook link
            .attr({ x: 54, y: 318, w: 118, h: 116 })
            .image("images/UI/OutlookBrand.png")
            .bind('Click', function(ev) {
                Crafty.redirectToURL("outlook.com");
            }));

        window.ui.loading = Crafty.e('2D, DOM, Image') // Loading gif
            .attr({ x: 180, y: 120, w: 441, h: 291 })
            .image("images/UI/Loading.gif")
            .css("display", "none");

        window.ui.back = Crafty.e('2D, DOM, Image, Mouser') // Loading back button
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




        window.loadingScreen.replace("");

    });
}
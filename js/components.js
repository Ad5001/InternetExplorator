// Create users default class:
Crafty.c("User", {
    init: function() {
        this.requires("2D, DOM, Color, Image");
        this.w = 70;
        this.h = 70;
        this.image("images/users/" + Math.floor(Math.random() * 5) + ".png")
        this.page = window.troll_pages[Math.floor(Math.random() * window.troll_pages.length)];
        this.title = Crafty.e('2D, DOM, Text')
            .attr({
                x: this.x + this.w + 10,
                y: this.y + (this.h / 2)
            }).text(this.page.title);

    },
});


// Action of user when erroring.
Crafty.c("Action", {
    init: function() {
        this.requires("WinDrag, 2D, DOM, Color, Text");
        this.h = 30;
        this.color("lime");
        this._textFont.family = "DengXian";
        this._textFont.lineHeight = 3;
        this.css("border", "solid 1px lime");
        this.css("border-radius", "5px");
        this.css("z-index", "5");
        this.css("text-align", "center");
        this.css("vertical-align", "middle");
        this.css("font-size", "13px");
        this.css("font-family", "DengXian");
        users = Crafty("User");
        i = users.length;
        rand = Math.floor(Math.random() * i);
        this.page = Crafty(users[rand]).page;
        this.text("<p>" + this.page.action + "</p>");
        this.w = this.page.action.length * 6;
        this.bind("StopDrag", function() {
            et = Crafty.findClosestEntityByComponent("User", this.x, this.y);
            if (et !== undefined) {
                // if (!((et.x - et.w) > this.x /* Entity is upper on x than the current action*/ || et.x < (this.x - this.w) /* Entity is too lower on X than the current action*/ ||
                // (et.y - et.h) > this.x /* Entity is upper on y than the current action*/ || et.y < (this.y - this.h) /* Entity is too lower on Y than the current action*/ )) {
                // If here, the user is touching the action.
                et.visible = false;
                this.visible = false;
                gain = 1;
                if (this.page == et.page) {
                    gain = 4;
                }
                window.game.coin += gain;
            };
        })
    }
});


// WinDrag Class
Crafty.c("WinDrag", {
    init: function() {
        this.requires("MouseDrag, 2D, DOM, Text");
        this.canBeAboveScreen = false;
        this.css("user-select", "none");
        this.css("cursor", "move");
        this.mousePos = { x: function(ele) { return ele.w / 2 }, y: function(ele) { return ele.y / 2 } }
        this.bind("Dragging", function(ev) {
            if (this.mousePos.x instanceof Function) {
                MouseX = this.mousePos.x(this);
            } else {
                MouseX = this.mousePos.x;
            }
            if (this.mousePos.y instanceof Function) {
                MouseY = this.mousePos.y(this);
            } else {
                MouseY = this.mousePos.y;
            }
            this.x = ev.clientX - MouseX;
            toY = ev.clientY - MouseY;
            if (toY < 118 && !this.canBeAboveScreen) toY = 118; // To not go out of the content page
            this.y = toY;
            this.dragCallback();
        })
        this.dragCallback = function() {};
    }
});


// Alert Class
// x2 And y2 are relative to the alert start
Crafty.c("Alert", {
    init: function() {
        this.requires("WinDrag, 2D, DOM, HTML, Image");
        this.mousePos = { x: function(ele) { return ele.w / 2; }, y: 15 };
        this.buttons = [];
        this.canBeAboveScreen = true;
        this.alertId = Crafty("Alert").length;
        console.log(this.alertId)
        window.alerts[this.alertId] = this;
        window.currentAlert = this;
        setTimeout(function() {
            window.currentAlert.append("<img src='images/UI/WinTop/1.png' style='width: " + window.currentAlert.w + "px; height: 29px'></img><img src='images/UI/WinTop/2.png' style='position: absolute; float: right; width: 72px; height: 24px'></img>");
        }, 2000)

        this.dragCallback = function() {
            this.append("<img src='images/UI/WinTop/1.png' style='width: " + this.w + "px; height: 29px'></img><img src='images/UI/WinTop/2.png' style='position: absolute; float: right; width: 72px; height: 24px'></img>");
        }
    },
    button: function(prop) {
        prop.x = this.x + prop.x2;
        prop.y = this.y + prop.y2;
        prop.owner = this;
        this.buttons.push(Crafty.e("2D, DOM, Button, Mouse, Color").attr(prop).css("opacity", "1").color("lime").bind("Click", prop.onclick).bind("EnterFrame", function() {
            this.x = this.owner.x + this.x2;
            this.y = this.owner.y + this.y2;
        }));
    },
    dismiss: function() {
        this.css("display", "none");
        this.buttons.forEach(function(b) {
            b.css("display", "none")
        })
    }
});


Page = function(title, url, icon, action, leave) {
    hash = {
        title: title,
        url: url,
        icon: icon,
        _action: action,
        _leave: leave,
        elements: [],

        addEntity: function(entity) {
            entity.css("display", "none");
            this.elements[entity.getId()] = entity;
            return this;
        },

        removeEntity: function(id) {
            this.elements[id] = undefined;
            return this;
        },

        getEntities: function() {
            return this.elements;
        },

        getEntity: function(id) {
            return this.elements[id];
        },

        getName: function() { return this.name; },

        getTitle: function() { return this.title; },

        getUrl: function() { return this.url; },

        getIcon: function() { return this.icon; },

        enter: function() {
            this._action();
            this.elements.forEach(function(ele) {
                ele.css("display", "block")
            })
        },

        leave: function() {
            this._action();
            this.elements.forEach(function(ele) {
                ele.css("display", "none")
            })
        }
    };
    window.pages[url] = hash;
    return hash;
}
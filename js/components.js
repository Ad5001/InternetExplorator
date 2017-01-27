// Custom functions
Math.__proto__.rnd = function(n, by) {
    n *= (10 * by)
    n = Math.round(n);
    return n / (10 * by);
}

// Create users default class:
Crafty.c("User", {
    init: function() {
        this.requires("2D, DOM, Color, Image");
        this.w = 128;
        this.h = 128;
        this.image("images/users/" + Math.floor(Math.random() * 13) + ".png")
        this.page = window.troll_pages[Math.floor(Math.random() * window.troll_pages.length)];
    },
    createText: function(prop) {
        et = Crafty.e('2D, DOM, HTML')
            .attr(prop).css({ "color": "black", "user-select": "none" }).append(this.page.Title + "<br>" + this.page.url + "<br>") // Page and URL
        et._element.setAttribute("onselectstart", "return false");
        et._element.setAttribute("unselectable", "on");
        et.owner = this;
        this.css("opacity", " 0");
        et.css("opacity", " 0");
        et.css({ "-moz-user-select": "none", "-webkit-user-select": "none", "-ms-user-select": "none", "user-select": "none" }); // WHAT ELSE IS NEEDED TO MAKE UNSELECTABLE CONTENT :O?
        et.progress = 0;
        et.bind("EnterFrame", function() {
            if (this.visible) {
                this.progress += 6 / Crafty.timer.FPS() * (Math.random() * 3);
                if (this.progress <= 10 && this.progress > 0) {
                    this.css("opacity", Math.rnd(this.progress / 10, 3).toString());
                    this.owner.css("opacity", Math.rnd(this.progress / 10, 3).toString());
                }
                if (this.progress >= 89 || this.progress <= 0) {
                    this.css("opacity", Math.rnd((100 - this.progress) / 10, 3).toString());
                    this.owner.css("opacity", Math.rnd((100 - this.progress) / 10, 3).toString());
                    if (this.progress <= 0 && this.progress >= -0.1) {
                        this.owner.page = window.troll_pages[Math.floor(Math.random() * window.troll_pages.length)];
                        this.owner.image("images/users/" + Math.floor(Math.random() * 13) + ".png");
                        parts = this._element.innerHTML.split("<br>");
                        this._element.innerHTML = this.owner.page.Title + "<br>" + this.owner.page.url + "<br>" + parts[parts.length - 1];
                        this.progress = 0;
                    }
                }
                if (this.progress > 99.9) {
                    gain = -3;
                    Crafty.trigger("GainCoin", { gain: gain });
                    this.owner.page = window.troll_pages[Math.floor(Math.random() * window.troll_pages.length)];
                    this.owner.image("images/users/" + Math.floor(Math.random() * 13) + ".png");
                    parts = this._element.innerHTML.split("<br>");
                    this._element.innerHTML = this.owner.page.Title + "<br>" + this.owner.page.url + "<br>" + parts[parts.length - 1];
                    this.progress = 0;
                }
                this._element.childNodes[this._element.childNodes.length - 1].childNodes[0].style.width = this.progress + "%";
            }
        })
        window.pages["misrocoft.com/work-online/errorer"].addEntity(et)
        this.attach(et);
        return this;
    }
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
        this._element.setAttribute("onselectstart", "Crafty(this.parentNode.id.substr(3)).trigger('Dragging');return false");
        this._element.setAttribute("unselectable", "on");
        this.css({ "-moz-user-select": "none", "-webkit-user-select": "none", "-ms-user-select": "none", "user-select": "none" }); // WHAT ELSE IS NEEDED TO MAKE UNSELECTABLE CONTENT :O?
        users = Crafty("User");
        i = users.length;
        this.redo = 0;
        rand = Math.floor(Math.random() * i);
        this.page = Crafty(users[rand]).page;
        this.text("<p>" + this.page.action + "</p>");
        this.w = this.page.len;
        this.h = this.page.action.split("<p></p>").length * 30 + 10;
        this.bind("StopDrag", function() {
            et = Crafty.findClosestEntityByComponent("User", this.x + (this.w / 2), this.y + (this.h / 2));
            if (et !== undefined) {
                // If here, the user is touching the action.
                et._children[0].progress = -10;
                this.redo = 200;
                gain = 1;
                if (this.page == et.page) {
                    gain = 4;
                    Crafty.audio.play("critical")
                } else {
                    Crafty.audio.play("alert", 0.5)
                }
                Crafty.trigger("GainCoin", { gain: gain });
            };
        })
        this.bind("EnterFrame", function() {
            if (this.redo > 100) { // Go not visible
                this.redo -= 300 / Crafty.timer.FPS();
                this.css("opacity", Math.rnd((this.redo - 100) / 100, 2).toString());
            } else if (this.redo > 0) {
                this.redo -= 300 / Crafty.timer.FPS();
                this.css("opacity", Math.rnd((100 - this.redo) / 100, 2).toString());
            }
            if (this.redo == 100) {
                users = Crafty("User");
                i = users.length;
                rand = Math.floor(Math.random() * i);
                this.page = Crafty(users[rand]).page;
                this.text("<p>" + this.page.action + "</p>");
                this.w = this.page.len;
                this.h = this.page.action.split("<p></p>").length * 30 + 10;
                this.x = this.baseX();
                this.y = this.baseY();
            }
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
        this.mousePos = { x: function(ele) { return ele.w / 2 }, y: function(ele) { return ele.h / 2 } }
        this.bind("StopDrag", function(ev) {})
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
            this.move("w", this.x);
            this.move("e", ev.clientX - MouseX);
            toY = ev.clientY - MouseY;
            if (toY < 118 && !this.canBeAboveScreen) toY = 118; // To not go out of the content page
            this.move("n", this.y);
            this.move("s", toY);
            window.currentAlert = this;
            setTimeout(function() {
                window.currentAlert.dragCallback(); // Temporary working solution
            }, 100)
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
        window.alerts[this.alertId] = this;
        this.attach(Crafty.e("2D, DOM, Image").image('images/UI/WinTop/1.png').attr({ w: this.w, h: 29, x: this.x, y: this.y }));

        this.dragCallback = function() {}
    },
    button: function(prop) {
        prop.x = this.x + prop.x2;
        prop.y = this.y + prop.y2;
        prop.owner = this;
        this.buttons.push(Crafty.e("2D, DOM, Button, Mouse, Color").attr(prop).css({ opacity: "0.1", cursor: "pointer" }).bind("Click", prop.onclick).bind("EnterFrame", function() {
            this.x = this.owner.x + this.x2;
            this.y = this.owner.y + this.y2;
        }));
    },
    dismiss: function() {
        this.visible = false;
        this.buttons.forEach(function(b) {
            b.visible = false
        })
        this._children.forEach(function(b) {
            b.visible = false
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
            entity.visible = false;
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
                ele.visible = true;
            })
        },

        leave: function() {
            this._leave();
            this.elements.forEach(function(ele) {
                ele.visible = false;
            })
        }
    };
    window.pages[url] = hash;
    return hash;
}
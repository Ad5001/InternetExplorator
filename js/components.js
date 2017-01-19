// Create users default class:
Crafty.c("User", {
    init: function() {
        this.w = 70;
        this.h = 70;
        this.page = window.troll_pages[Math.floor(Math.random() * window.troll_pages.length)];
        this.title = Crafty.e('2D, DOM, Text')
            .attr({
                x: this.x + this.w + 10,
                y: this.y + (this.h / 2)
            }).text(this.page.title);

    },
});


Crafty.c("Action", {
    init: function() {
        this.requires("Draggable, 2D, DOM, Color, Text");
        this.h = 30;
        this.color("lime");
        this._textFont.family = "DengXian";
        this._textFont.lineHeight = 3;
        this.css("border", "solid 1px lime");
        this.css("border-radius", "5");
        this.css("z-index", "5");
        this.css("text-align", "center");
        this.css("vertical-align", "middle");
        this.css("font-size", "13px");
        this.css("font-family", "DengXian");
        this.css("user-select", "none");
        this.css("cursor", "move");
        users = Crafty("User");
        i = 0;
        while (users[i] !== undefined) {
            i++;
        }
        i--; // Getting the justbefore element
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


// Draggable Class
Crafty.c("Draggable", {
    init: function() {
        this.requires("MouseDrag, 2D, DOM, Text");
        this.bind("Dragging", function(ev) {
            /*this.css("transform", "translate3d(" + ev.clientX + "px, " + ev.clientY + "px, 0px)");*/
            this.x = ev.clientX - (this.w / 2);
            toY = ev.clientY - (this.h / 2);
            if (toY < 118) toY = 118; // To not go out of the content page
            this.y = toY;
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
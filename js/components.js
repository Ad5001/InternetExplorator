// Create users default class:
Crafty.c("User", {
    init: function() {
        this.w = 70;
        this.h = 70;
        this.page = window.troll_pages[Math.floor(Math.random() * window.troll_pages.length)];
        this.bind("EnterFrame", this.enterframe());
        this.title = Crafty.e('2D, DOM, Text')
            .attr({
                x: this.x + this.w + 10,
                y: this.y + (this.h / 2)
            }).text(this.page.title);

    },
    enterframe: function() {

    }
});


Crafty.c("Action", {
    init: function() {
        this.requires("MouseDrag, 2D, DOM, Text");
        this.h = 30;
        this.color("lime");
        this.css("border", "solid 1px lime");
        this.css("border-radius", "5");
        this.page = Crafty("User")[Math.floor(Math.random() * Crafty("User").length)].page;
    }
});


class Page {
    constructor(title, url, icon, action, leave) {
        this.title = title;
        this.url = url;
        this.icon = icon;
        this._action = action;
        this._leave = leave;
        this.elements = [];
        window.pages[this.url] = this;
    }

    addEntity(entity) {
        entity.css("display", "none");
        this.elements[entity.getId()] = entity;
        return this;
    }

    removeEntity(id) {
        this.elements[id] = undefined;
        return this;
    }

    getEntities() {
        return this.elements;
    }

    getEntity(id) {
        return this.elements[id];
    }

    getName() { return this.name; }

    getTitle() { return this.title; }

    getUrl() { return this.url; }

    getIcon() { return this.icon; }

    enter() {
        this._action();
        this.elements.forEach(function(ele) {
            ele.css("display", "block")
        })
    }

    leave() {
        this._action();
        this.elements.forEach(function(ele) {
            ele.css("display", "none")
        })
    }
}
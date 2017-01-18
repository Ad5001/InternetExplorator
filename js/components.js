// Create users default class:
Crafty.c("User", {
    init: function() {
        this.w = 70;
        this.h = 70;
        page: window.troll_pages[Math.floor(Math.random() * window.troll_pages.length)],
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
}
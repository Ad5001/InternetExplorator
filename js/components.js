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
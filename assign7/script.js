"use strict";
const root = document.documentElement;
const global = {
    screen: {
        width:  0,
        height: 0,
    }
}

function updatePageSize() {
    global.screen.width  = window.innerWidth  * window.devicePixelRatio;
    global.screen.height = window.innerHeight * window.devicePixelRatio;
    root.style.setProperty("--r-w",  `${global.screen.width}px`);
    root.style.setProperty("--r-h",  `${global.screen.height}px`);
}

$(document).ready(function () {
    console.log("jQuery is ready!");

    updatePageSize();
    window.addEventListener("resize", updatePageSize);

    $("#btn-change").click(function () {
        $("#text-id").text("ID text was eliminated");
        $(".text-class").html("<b>that's bold move for them!</b>");
        $("p.text-scope").css({
            "color": "var(--c-text-scope)",
            "border": "var(--u-sm) dashed var(--c-border)",
            "padding": "calc(var(--fs-p) * 0.25)"
        });
    });

    $("#btn-hide").click(() => $("#visible-text").hide());
    $("#btn-show").click(() => $("#visible-text").show());
    $("#btn-toggle").click(() => $("#visible-text").toggle());

    $("#btn-fadein").click(() => $("#fade-img").fadeIn());
    $("#btn-fadeout").click(() => $("#fade-img").fadeOut());
    $("#btn-fadetoggle").click(() => $("#fade-img").fadeToggle());

    $("#btn-slide-toggle").click(() => $(".panel").slideToggle());

    $("#btn-add").click(() => {
        const index = $("#list li").length;
        $("#list").append(`<li>New Item #${index + 1}</li>`);
    });
    $("#btn-remove").click(() => $("#list li:last").remove());

    $("#btn-change-img").click(() => {
        $("#attr-img").attr("src", "kitty3.jpg");
    });
    $("#btn-change-link").click(() => {
        $("#dynamic-link").attr("href", "/").text("Visit coolest website!");
    });

    $("#name").on("input", function () {
        $("#live-name").text($(this).val());
    });
    $("#email").on("input", function () {
        $("#live-email").text($(this).val());
    });

    $("#btn-anim").click(function () {
        $("#anim-box").animate({
            left: "100px",
            width: "150px",
            height: "150px"
        }, 1000);
    });

    $("#btn-seq").click(function () {
        $("#seq-box")
            .animate({ left: "100px" }, 500)
            .animate({ top: "100px" }, 500)
            .animate({ width: "50px", height: "50px" }, 500)
            .animate({ left: "0px", top: "0px", width: "100px", height: "100px" }, 500);
    });

    $("#btn-combo").click(function () {
        $("#combo-box").animate({
            opacity: 0.5,
            left: "100px",
            top: "50px",
            width: "200px",
            height: "200px"
        }, 1000);
    });

    $(".accordion-header").click(function () {
        const content = $(this).next(".accordion-content");
        $(".accordion-content").not(content).slideUp();
        content.slideToggle();
    });
});

(function($){
    $(function(){
        // update copyright years
        var y = new Date().getFullYear();
        $("#year").text(y);

        // contact form bootstrap validation
        var contact = document.getElementById("contactForm");
        if (contact) {
            contact.addEventListener("submit", function(e) {
                if(!contact.checkValidity()){
                    e.preventDefault();
                    e.stopPropagation();
                    contact.classList.add("was-validated");
                } else {
                    e.preventDefault();
                    // fake submit, because I don't have server
                    alert("Thank you! Your message was sent.");
                    contact.reset();
                    contact.classList.remove("was-validated");
                }
            }, false);
        }

        // simple smooth scroll for anchor links
        $("a[href^='#']").on("click", function(e){
            var target = $(this.getAttribute("href"));
            if (target.length > 0) {
                e.preventDefault();
                $("html, body").stop().animate({
                    scrollTop: target.offset().top - 60
                }, 400);
            }
        });

        // search and filter post cards by title text
        $("#searchForm").on("submit", function(e){
            e.preventDefault();
            var q = $("#searchInput").val().toLowerCase();
            if(!q){ $(".post-card").show(); return; }
            $(".post-card").each(function(){
                var title = $(this).find(".card-title").text().toLowerCase();
                $(this).toggle(title.indexOf(q) !== -1);
            });
        });

        // highlight active nav link
        var path = location.pathname.split("/").pop() || "index.html";
        $(".navbar-nav .nav-link").each(function(){
            if($(this).attr("href") === path) {
                $(this).addClass("active");
            }
        });
    });
})(jQuery);

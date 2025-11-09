$(function(){
    // fade in post cards as a jQuery effect
    $('.post-card')
        .hide()
        .each(function(i) {
            $(this).delay(120*i).fadeIn(300);
        });
});

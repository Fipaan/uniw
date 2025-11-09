$(function() {
    $(".thumb").on("click", function(){
        $("#modalImg").attr("src", $(this).attr("src"));
    });
});

$(function(){
    // simple client-side comment handling (no backend)
    $("#commentForm").on("submit", function(e){
        e.preventDefault();
        var name = $("#cName").val().trim();
        var email = $("#cEmail").val().trim();
        var text = $("#cText").val().trim();
        if(!name || !email || !text){
            alert("Please fill all fields.");
            return;
        }
        var comment = $("<div class='comment'><strong>"+escapeHtml(name)+"</strong><p>"+escapeHtml(text)+"</p></div>");
        // append and reveal with jQuery fade effect
        $("#commentsList").prepend(comment.hide());
        comment.fadeIn(400);
        $("#commentForm")[0].reset();
    });

    // small helper
    function escapeHtml(str){
        return str.replace(/[&<>\"']/g, function(s){
            return ({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","\"":"&#39;"})[s];
        });
    }
});

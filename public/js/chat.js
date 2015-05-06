"use strict";
var chat = {
    send: function(chat,message){
        console.log(user.info); // displayname exists here
        socket.emit("chat:send",{chat:chat,message:message,token:user.info.token, name: user.info.displayname});
    },
    modal: {
        global: $( "div#chatGlobal" ).dialog({
            autoOpen: false,
            height: 400,
            width: "40%",
            modal: true,
/*
            buttons: {
                "Clear": function(){
                    // Clear current message
                    $(".chat#chatGlobal input.chatMessage").val("");
                },
                "Submit": function(){
                    // Send current message
                    chat.send("global",$(".chat#chatGlobal input.chatMessage").val());
                    $(".chat#chatGlobal input.chatMessage").val("");
                }
            },
*/
            open: function(event,ui){
                socket.emit("chat:join",{room:"global",token:user.info.token});
            },
            close: function() {
                // Clear current message too
                chat.modal.global.dialog( "close" );
                socket.emit("chat:leave",{room:"global",token:user.info.token});
            }
        })
    },
    eventHandlers: function () {
        //Override nav clicks
        $("a#chatGlobal").on("click", function(event) {
            event.preventDefault();
            chat.modal.global.dialog("open");
        });
        //Override form submissions
        chat.modal.global.find("form").on("submit",function(event){
            event.preventDefault();
            // Assuming pressing enter because user is logging in, must use mouse to register
            chat.send("global",$(".chat#chatGlobal input.chatMessage").val());
            $(".chat#chatGlobal input.chatMessage").val("");
        });
        // Socket event listeners
        socket.on("chat:receive",function(msg){
            console.log({type:"chat",msg:msg});
//            if(msg.chat === "global"){
                  $(".chat#chatGlobal .messages").append(
                    $("<div>").append(
                        $("<span>").addClass("user").append(msg.user),": ",
                        $("<span>").addClass("text").append(msg.text)
                    )
                );
                // TODO Make this autoscroll to bottom of modal pop-up since messages are appended here
                $('.chat#chatGlobal')[0].scrollTop = $('.chat#chatGlobal')[0].scrollHeight;
                  // The input field and button still scroll with it, those need to be put somewhere else.
//            }
        });
    }
};
$(document).ready(function () {
    chat.eventHandlers();
    socket.emit("chat:","Test");
});

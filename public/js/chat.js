/**
 * 
 * Script controlador do box de chat
 */

$(document).ready(function(){
    var mainChat = '<div id="chat"> <div class="topo"> <div class="titulo"> Vaga: Desenvolvedor Front-end </div><div class="botoes"> <div class="minimize"></div><div class="close"></div></div></div><div class="conteudo"> <div class="chat"> <div id="scrollbar1" class="nano"><div id="boxchat" class="nano-content"></div></div></div><div class="mensagem"> <textarea placeholder="Digite aqui sua mensagem"></textarea> </div></div></div>';
    var boxChatVisitor = '<div><div id="${id}" class="linechat"><ul><li class="messages" id="${userid}"></li><li><div class="foto"><img src="../static/img/profiles/${userid}.jpg"></div></li></ul></div></div>';
    var boxChat = '<div><div id="${id}" class="linechat"><ul><li><div class="foto esq"><img src="../static/img/profiles/${userid}.jpg"></div></li><li class="messages" id="${userid}"></li></ul></div></div>';
    
    var boxMessageVisitor = '<div><div class="setadir"><div class="box"><div class="conversa"><div class="sentencas">${message}</div><div class="perfil">${name}</div><div class="visualizacao ${alreadyRead}"><div class="horario">enviado as ${time}</div></div></div></div></div></div>';
    var boxMessage = '<div><div class="setaesq"><div class="box"><div class="conversa"><div class="sentencas">${message}</div><div class="perfil"><div class="nome">${name}</div><div class="empresa">${company}</div></div><div class="visualizacao"><div class="horario">enviado as ${time}</div></div></div></div></div></div>';  
    
    $.template( "mainChat", mainChat );
    $.template( "boxChatVisitor", boxChatVisitor );
    $.template( "boxChat", boxChat );
    $.template( "boxMessageVisitor", boxMessageVisitor );
    $.template( "boxMessage", boxMessage );
    
    $.tmpl( "mainChat" ).appendTo( "section" );    
    
    $('#scrollbar1').nanoScroller();
    
    // chamada para fechar o box do chat
    $("#chat > div.topo > div.botoes > div.close").click(function(event){
    	event.preventDefault();
    	$("#chat").remove();
    })
    
    // chamada para minimizar e restaurar o box do chat
    $("#chat > div.topo > div.botoes > div.minimize").click(function(event){
    	event.preventDefault();
    	if($("#chat > div.conteudo").css('display') != 'none'){
    		$("#chat > div.conteudo").css("display","none");            
        	$("#chat").css("height","36px");
        	$("#chat > div.topo > div.botoes > div.minimize").css('background-position', '-211px 1px');
    	}else{
    		$("#chat > div.conteudo").css("display","block");            
        	$("#chat").css("height","544px");
        	$("#chat > div.topo > div.botoes > div.minimize").css('background-position', '-150px 1px');    		
    	}  	    	
    })
    
    var formatDate = function(str,stamp){
    	var date = stamp ? new Date(str*1000) : new Date();
    	var hours = date.getHours();
    	var minutes = "0" + date.getMinutes();
    	var seconds = "0" + date.getSeconds();
    	var formattedTime = hours + 'h' + minutes.substr(-2); /* + ':' + seconds.substr(-2);*/    	
    	return formattedTime;    	
    }
    
    var read = function(str){    	
    		r = str == true ? 'lido' : 'nlido'; 
    		return r;   	
    }
    
    
    var localUser = {};
    var sequencia;
    var identificador;
    
    var putMessage = function(json){    	
    	var val = json[0];
    	if(!val.company){   		
    			
	    		localUser.userid = val.userid;
	    		localUser.name = val.name;
	    		localUser.company = false;
	    		localUser.username = val.username;
	    		
			  if(sequencia == val.userid){
				  sequencia = val.userid;
				  $(boxMessageVisitor).tmpl(json).appendTo("#"+identificador+" > ul > li.messages");
			  }else{
				  identificador = val.id;
				  localUser.id = identificador;
				  $(boxChatVisitor).tmpl(json).appendTo( "#boxchat" );
				  $(boxMessageVisitor).tmpl(json).appendTo("#"+val.id+" > ul > li.messages");
				  sequencia = val.userid;	    					  
			  }
		  }else{
			  if(sequencia == val.userid){
				  sequencia = val.userid;
				  $(boxMessage).tmpl(json).appendTo("#"+identificador+" > ul > li.messages");
			  }else{
				  identificador = val.id;
				  localUser.id = identificador;
				  $(boxChat).tmpl(json).appendTo( "#boxchat" );
				  $(boxMessage).tmpl(json).appendTo("#"+val.id+" > ul > li.messages");
				  sequencia = val.userid;	    					  
			  }  
		  }
    	
    	$(".nano").nanoScroller();
    	$(".nano").nanoScroller({scroll:'bottom'});
    }
    
    var loadChat = function(){
    	$.getJSON( "/static/json/talk.json", function( data ) {
    		  if(data.talkMessages.length > 0){
	    		  $.each( data.talkMessages, function( key, val ) {
	    			  company = val.company ? val.company.name : ''; 
	    			  	    			  
	    			  var insert = [
		    			                { "id": val.id, 
		    			                	"userid": val.user.id,
		    			                	"name": val.user.name,
		    			                	"company": company, 
		    			                	"username": val.user.name,
		    			                	"alreadyRead": read( val.message.alreadyRead),
		    			                	"message": val.message.message,
		    			                	"time":formatDate(val.message.time, true)
		    			                }
	    			                ];	    
  			  
	    			  putMessage(insert);	    			  
	      		  }	);
    		  }    		
    		});    	 
    }
    
    $(function() {
        $("#chat textarea").keypress(function (e) {
            if(e.which == 13) {
            	
            	var insert = [
  			                { "id": localUser.userid + 1, 
  			                	"userid": localUser.userid,
  			                	"name": localUser.name,
  			                	"company": localUser.company, 
  			                	"username": localUser.username,
  			                	"alreadyRead": read(),
  			                	"message": $(this).val(),
  			                	"time":formatDate()
  			                }
			    ];           	
            	
            	putMessage(insert);
     
            	$(this).val("");
                e.preventDefault();
            }
        });
    });
    
    loadChat();
    
});
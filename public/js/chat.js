/**
 * 
 * Script controlador do box de chat
 */

$(document).ready(function(){
    var scrollbar = $("#scrollbar1");
    var mainChat = '<div id="chat"> <div class="topo"> <div class="titulo"> Vaga: Desenvolvedor Front-end </div><div class="botoes"> <div class="minimize"></div><div class="close"></div></div></div><div class="conteudo"> <div class="chat"> <div id="scrollbar1"> <div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div><div class="viewport"> <div class="overview"> <div id="boxchat"> </div></div></div></div></div><div class="mensagem"> <textarea placeholder="Digite aqui sua mensagem"></textarea> </div></div></div>';
    var boxChatVisitor = '<div><div id="${id}" class="linechat"><ul><li class="messages"></li><li><div class="foto"><img src="../static/img/profiles/${userid}.jpg"></div></li></ul></div></div>';
    var boxChat = '<div><div id="${id}" class="linechat"><ul><li><div class="foto esq"><img src="../static/img/profiles/${userid}.jpg"></div></li><li class="messages"></li></ul></div></div>';
    
    var boxMessageVisitor = '<div><div class="setadir"><div class="box"><div class="conversa"><div class="sentencas">${message}</div><div class="perfil">${name}</div><div class="visualizacao ${alreadyRead}"><div class="horario">enviado as ${time}</div></div></div></div></div></div>';
    var boxMessage = '<div><div class="setaesq"><div class="box"><div class="conversa"><div class="sentencas">${message}</div><div class="perfil"><div class="nome">${name}</div><div class="empresa">${company}</div></div><div class="visualizacao"><div class="horario">enviado as ${time}</div></div></div></div></div></div>';  
    
    $.template( "mainChat", mainChat );
    $.template( "boxChatVisitor", boxChatVisitor );
    $.template( "boxChat", boxChat );
    $.template( "boxMessageVisitor", boxMessageVisitor );
    $.template( "boxMessage", boxMessage );
    
    $.tmpl( "mainChat" ).appendTo( "section" );    
    
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
    
    var formatDate = function(str){
    	var date = new Date(str*1000);
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
    
    var loadChat = function(){
    	$.getJSON( "/static/json/talk2.json", function( data ) {    		
    		  var sequencia;
    		  var identificador;
    		  
    		  if(data.talkMessages.length > 0){
	    		  $.each( data.talkMessages, function( key, val ) {
	    			  company = val.company ? val.company.name : ''; 
	    			  alreadyRead = read( val.message.alreadyRead);
	    			  	    			  
	    			  var insert = [
		    			                { id: val.id, 
		    			                	userid: val.user.id,
		    			                	name: val.user.name,
		    			                	company: company, 
		    			                	username: val.user.name,
		    			                	alreadyRead: alreadyRead,
		    			                	message: val.message.message,
		    			                	time:formatDate(val.message.time)
		    			                }
	    			                ];	    			  
	    			  if(!val.company){	    				 
	    				  if(sequencia == val.user.id){
	    					  sequencia = val.user.id;
	    					  $(boxMessageVisitor).tmpl(insert).appendTo("#"+identificador+" > ul > li.messages");
	    				  }else{
	    					  identificador = val.id;
	    					  $(boxChatVisitor).tmpl(insert).appendTo( "#boxchat" );
	    					  $(boxMessageVisitor).tmpl(insert).appendTo("#"+val.id+" > ul > li.messages");
	    					  sequencia = val.user.id;	    					  
	    				  }
	    			  }else{
	    				  if(sequencia == val.user.id){
	    					  sequencia = val.user.id;
	    					  $(boxMessage).tmpl(insert).appendTo("#"+identificador+" > ul > li.messages");
	    				  }else{
	    					  identificador = val.id;
	    					  $(boxChat).tmpl(insert).appendTo( "#boxchat" );
	    					  $(boxMessage).tmpl(insert).appendTo("#"+val.id+" > ul > li.messages");
	    					  sequencia = val.user.id;	    					  
	    				  }  
	    			  }
	      		  }	);
    		  }
    		
    		});
    	 
    }
    
    loadChat();
    

    scrollbar.tinyscrollbar();

    
    
    
    
});
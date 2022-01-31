function start() {

    $("#beginning").hide();

    $("#backgroundGame").append("<div id='player' class='animation1' ></div>");
    $("#backgroundGame").append("<div id='enemy1' class='animation2'></div>");
    $("#backgroundGame").append("<div id='enemy2'></div>");
    $("#backgroundGame").append("<div id='friend' class='animation3'></div>");
    $("#backgroundGame").append("<div id='scoreboard'></div>");
    $("#backgroundGame").append("<div id='energy'></div>");


    // Game's variables
    
    var canShoot=true;    
    var endGame=false;
    var points=0;
    var saved=0;
    var Lost=0;
    var actualEnergy=3;
    var game = {}
    var velocity=5;
    var positionY = parseInt(Math.random() * 334);
    var keyboardKey = {
        W: 87,
        S: 83,
        D: 68
    }

    game.pressed = []; 
    
    //sounds

    var soundExplosion=document.getElementById("soundExplosion");
    var music=document.getElementById("music");
    var soundGameover=document.getElementById("soundGameover");
    var soundLost=document.getElementById("soundLost");
    var soundRescue=document.getElementById("soundRescue");

    //Music Loop
    music.addEventListener("ended", function(){ music.currentTime = 0; music.play(); }, false);
    music.play();

    // verify if the player tap the keyboard key
    $(document).keydown(function(e){
        game.pressed[e.which] = true;
        });
        
        
    $(document).keyup(function(e){
        game.pressed[e.which] = false;
    });
    
	
	//Game Loop

	game.timer = setInterval(loop,30);
	
	function loop() {
	
        moveBackground();
        movePlayer();
        moveEnemy1();
        moveEnemy2();
        moveFriend();
        collision();
        scoreboard();
        energy();
	
	} // the end's of the loop()

    function moveBackground() {
	
        left = parseInt($("#backgroundGame").css("background-position"));
        $("#backgroundGame").css("background-position",left-2);
        
    } // the end's of the moveBackground()

    function movePlayer() {
	
        if (game.pressed[keyboardKey.W]) {
            
            var top = parseInt($("#player").css("top"));
            $("#player").css("top",top-10);

            if (top <= 0){
                $("#player").css("top",top+10);
            }
        }
        
        if (game.pressed[keyboardKey.S]) {
            
            var top = parseInt($("#player").css("top"));
            $("#player").css("top",top+10);	

            if(top >= 434){
                $("#player").css("top",top-10);	
            }
        }
        
        if (game.pressed[keyboardKey.D]) {
            
            shoot();	
        }
    }

    function moveEnemy1() {

        positionX = parseInt($("#enemy1").css("left"));
        $("#enemy1").css("left",positionX-velocity);
        $("#enemy1").css("top",positionY);
            
            if (positionX<=0) {
            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left",694);
            $("#enemy1").css("top",positionY);
                
            }
    }

    function moveEnemy2() {

        positionX = parseInt($("#enemy2").css("left"));
        $("#enemy2").css("left",positionX-3);
            
            if (positionX<=0) {
            $("#enemy2").css("left",775);                
            }
    }

    function moveFriend() {

        positionX = parseInt($("#friend").css("left"));
        $("#friend").css("left",positionX+1);
            
            if (positionX > 906) {
            $("#friend").css("left",0);                
            }
    }

    function shoot() {
	
        if (canShoot==true) {
           
            canShoot=false;
            
            var top = parseInt($("#player").css("top"))
            positionX= parseInt($("#player").css("left"))
            shotX = positionX + 190;
            topShot=top+37;
            $("#backgroundGame").append("<div id='shoot'></div");
            $("#shoot").css("top",topShot);
            $("#shoot").css("left",shotX);
            
            var timeShoot=window.setInterval(executeShoot, 30);
        
        } 
     
        function executeShoot() {
        positionX = parseInt($("#shoot").css("left"));
        $("#shoot").css("left",positionX+15); 
    
            if (positionX>900) {
                            
                window.clearInterval(timeShoot);
                timeShoot=null;
                $("#shoot").remove();
                canShoot=true;                        
            }
        } 
    }

    function collision() {
        var collision1 = ($("#player").collision($("#enemy1")));
        var collision2 = ($("#player").collision($("#enemy2")));
        var collision3 = ($("#shoot").collision($("#enemy1")));
        var collision4 = ($("#shoot").collision($("#enemy2")));
        var collision5 = ($("#player").collision($("#friend")));
        var collision6 = ($("#enemy2").collision($("#friend")));
          
        // player with the enemy1
        if (collision1.length>0) {
               
            velocity=velocity+0.3;
            actualEnergy--;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            explosion1(enemy1X,enemy1Y);
        
            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left",694);
            $("#enemy1").css("top",positionY);
        }

        // player with enemy2 
        if (collision2.length>0) {
	
            velocity=velocity+0.3;
            actualEnergy--;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            explosion2(enemy2X,enemy2Y);
                    
            $("#enemy2").remove();
                
            repositionEnemy2();
            
        }

        // Shoot with enemy1
		
        if (collision3.length>0) {
            
            points += 100;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
                
            explosion1(enemy1X,enemy1Y);
            $("#shoot").css("left",950);
                
            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left",694);
            $("#enemy1").css("top",positionY);
            
        }

        // Shoot with enemy2
		
	    if (collision4.length>0) {
		
            points += 50;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            $("#enemy2").remove();
        
            explosion2(enemy2X,enemy2Y);
            $("#shoot").css("left",950);
            
            repositionEnemy2();
            
        }

        // jogador with friend
		
        if (collision5.length>0) {
            
            saved++;
            soundRescue.play();
            repositionFriend();
            $("#friend").remove();
        }

        
        // Enemy2 with friend
                
        if (collision6.length>0) {
                
            Lost++;
            soundLost.play();
            friendX = parseInt($("#friend").css("left"));
            friendY = parseInt($("#friend").css("top"));
            explosion3(friendX,friendY);
            $("#friend").remove();
                    
            repositionFriend();
                    
            }
    }

    //explosion1

    function explosion1(enemy1X,enemy1Y) {
        soundExplosion.play();
        $("#backgroundGame").append("<div id='explosion1'></div");
        $("#explosion1").css("background-image", "url(imgs/explosion.png)");
        var div=$("#explosion1");
        div.css("top", enemy1Y);
        div.css("left", enemy1X);
        div.animate({width:200, opacity:0}, "slow");
            
        var timeExplosion=window.setInterval(removeExplosion, 1000);
            
        function removeExplosion() {
                    
            div.remove();
            window.clearInterval(timeExplosion);
            timeExplosion=null;
                    
        }
                
    }

    

    //reposition Friend
	
	function repositionFriend() {
	
        var timeFriend=window.setInterval(reposition6, 6000);
        
            function reposition6() {
            window.clearInterval(timeFriend);
            timeFriend=null;
            
            if (endGame==false) {
            
            $("#backgroundGame").append("<div id='friend' class='animation3'></div>");
            
            }
            
        }
    }

    //reposition enemy2	

    function repositionEnemy2() {

        var timeCollision4=window.setInterval(reposition4, 5000);
                
        function reposition4() {
            window.clearInterval(timeCollision4);
            timeCollision4=null;
                
            if (endGame==false) {
                
                $("#backgroundGame").append("<div id=enemy2></div");
                
            }
            
        }	
    }

    //Explosion2
	
	function explosion2(enemy2X,enemy2Y) {
        soundExplosion.play();
        $("#backgroundGame").append("<div id='explosion2'></div");
        $("#explosion2").css("background-image", "url(imgs/explosion.png)");
        var div2=$("#explosion2");
        div2.css("top", enemy2Y);
        div2.css("left", enemy2X);
        div2.animate({width:200, opacity:0}, "slow");
        
        var timeExplosion2=window.setInterval(removeExplosion2, 1000);
        
        function removeExplosion2() {
                
            div2.remove();
            window.clearInterval(timeExplosion2);
            timexplosion2=null;
                
        }
    }

    //explosion3
	
    function explosion3(friendX,friendY) {
        $("#backgroundGame").append("<div id='explosion3' class='animation4'></div");
        $("#explosion3").css("top",friendY);
        $("#explosion3").css("left",friendX);
        var timeExplosion3=window.setInterval(resetExplosion3, 1000);
        function resetExplosion3() {
        $("#explosion3").remove();
        window.clearInterval(timeExplosion3);
        timeExplosion3=null;
                
        }
    }

    //scoreboard

    function scoreboard() {

        $("#scoreboard").html("<h2> Points: " + points + " Salved: " + saved + " Lost: " + Lost + "</h2>");
        
    }

    //energy

    function energy() {
        if (actualEnergy==3) {
			
			$("#energy").css("background-image", "url(imgs/energy3.png)");
		}
	
		if (actualEnergy==2) {
			
			$("#energy").css("background-image", "url(imgs/energy2.png)");
		}
	
		if (actualEnergy==1) {
			
			$("#energy").css("background-image", "url(imgs/energy1.png)");
		}
	
		if (actualEnergy==0) {
			
			$("#energy").css("background-image", "url(imgs/energy0.png)");
			
			gameOver();
		}
    }

    //gameOver

    function gameOver() {
        endGame=true;
        music.pause();
        soundGameover.play();
        
        window.clearInterval(game.timer);
        game.timer=null;
        
        $("#player").remove();
        $("#enemy1").remove();
        $("#enemy2").remove();
        $("#friend").remove();
        
        $("#backgroundGame").append("<div id='end'></div>");
        
        $("#end").html("<h1> Game Over </h1><p>Your score was: " + points + "\nyou save: " + saved + "</p>" + "<div id='restart' onClick=restartGame()><h3>Play again</h3></div>");
        } 
}

function restartGame() {
	soundGameover.pause();
	$("#end").remove();
	start();
	
}

var app ={
	inicio:function(){
		 DIAMETRO_BOLA = 50;
		 DIAMETRO_OBJETIVO = 50;
		 dificultad = 1;
		 velocidadX = 0;
		 velocidadY = 0;
		 puntuacion =  0;
		 //variable para el cambio de color/ siguiente paso linea 51
		 colisionLimites = 0;
		 alto = document.documentElement.clientHeight;
		 ancho = document.documentElement.clientWidth ;
		 app.vigilaSensores();
		 app.iniciaJuego();
		 
		 
		},
    iniciaJuego:function(){
		
		function preload() {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			
			game.stage.backgroundColor = '#f27d0c';
			game.load.image('bola', 'assets/bola.png');
			game.load.image('objetivo', 'assets/objetivo.png');
			game.load.image('objetivoB', 'assets/objetivoB.png');
		}
		function create(){
			scoreText = game.add.text(20, 20, puntuacion, {fontSize: '100px', fill: '#757676'});
			objetivo = game.add.sprite( app.inicioX(), app.inicioY(), 'objetivo' );
			objetivoB = game.add.sprite( app.inicioX(), app.inicioY(), 'objetivoB' );
		    bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
			game.physics.arcade.enable(objetivo);
			game.physics.arcade.enable(objetivoB);
			game.physics.arcade.enable(bola);

			bola.body.collideWorldBounds = true;
			bola.body.onWorldBounds= new Phaser.Signal();
			bola.body.onWorldBounds.add( app.decrementaPuntuacion, this);
			 
			 
		  
		}
		
	
	
	function update(){
		var factorDificultad = (300 + (dificultad * 100));
		bola.body.velocity.y = (velocidadY * factorDificultad);
		bola.body.velocity.x = (velocidadX * (-1 * (factorDificultad)));
		//cambio de color y devuelvo la variable a su valor inicial/ultimo paso en la funcion decrementa
		if(colisionLimites === 1){game.stage.backgroundColor='#ff3300',colisionLimites = 0}
		else{game.stage.backgroundColor = '#f27d0c';}
		
		
	 
		game.physics.arcade.overlap(bola, objetivoB, app.incrementaPuntuacionB, null, this);
		game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
	}
	
	var estados = { preload: preload, create: create, update: update };
	var game = new Phaser.Game(ancho , alto, Phaser.CANVAS, 'phaser', estados);
		
},

  
  

   
    
	decrementaPuntuacion: function(){ 
	 //aumento la variable 
	 colisionLimites = 1
	 
		
		puntuacion = puntuacion-1;
		scoreText.text = puntuacion;
		 
		
	},
	
	incrementaPuntuacion: function() {
		puntuacion = puntuacion +1;
		scoreText.text = puntuacion;
		
		objetivo.body.x = app.inicioX();
		objetivo.body.y = app.inicioY();
		
		if (puntuacion > 0){
			dificultad = dificultad + 1;
		}
	},
	
	incrementaPuntuacionB: function(){
		puntuacion = puntuacion + 10;
		scoreText.text = puntuacion;
		
		objetivoB.body.x = app.inicioX();
		objetivoB.body.y = app.inicioY();
		
		if(puntuacion > 0){
			difucultad = dificultad + 2;
		}
		
	},

	inicioX: function(){
		return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
	},
	inicioY: function(){
		return app.numeroAleatorioHasta( alto - DIAMETRO_BOLA);
		
	},
	
	numeroAleatorioHasta:function(limite){
		return Math.floor(Math.random()* limite);
	},
	
	vigilaSensores: function(){
		function onError(){
			console.log('onError!');
		}
		
	 function onSucces(datosAceleracion){
		app.detectaAgitacion(datosAceleracion);
		app.registraDireccion(datosAceleracion);
	}
	
	navigator.accelerometer.watchAcceleration(onSucces ,onError, {frequency: 10});
	},
	 
	
	 
	
	
	detectaAgitacion:function(datosAceleracion){
		agitacionX = datosAceleracion.x > 10;
		agitacionY = datosAceleracion.y > 10;
		
		if(agitacionX || agitacionY){
			 setTimeout(app.recomienza, 1000);
	}
  },
	 
	recomienza: function(datosAceleracion){
		document.location.reload(true);
	},
	
	registraDireccion: function(datosAceleracion){
		velocidadX = datosAceleracion.x;
		velocidadY = datosAceleracion.y;
		 
	}

};

if('addEventListener' in document){
	document.addEventListener('deviceready', function() {
		app.inicio();
	}, false);
}
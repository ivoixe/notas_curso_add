var app = {

  model: {
    "notas": [{"titulo": "Comprar pan", "contenido": "Oferta en la panaderia de la esquina", "fechaLimite": "17/02/2017"}]
  },

  firebaseConfig: {
    apiKey: "AIzaSyCAYC_iDPpXUGauve9QkHwO8dl9v7578Mk",
    authDomain: "mooc-notes.firebaseio.com",
    databaseURL: "https://notas-c2a5a.firebaseio.com",
    storageBucket: "notas-c2a5a.appspot.com",
    messagingSenderId: "959153750656"
  },

  inicio: function(){
    this.iniciaFastClick();
    this.iniciaFirebase();
    this.iniciaBotones();
    this.refrescarLista();
 
  },

  iniciaFastClick: function() {
    FastClick.attach(document.body);
  },

  iniciaFirebase: function() {
    firebase.initializeApp(this.firebaseConfig);
  },

  iniciaBotones: function() {
    var salvar = document.querySelector('#salvar');
    var anadir = document.querySelector('#anadir');

    anadir.addEventListener('click' ,this.mostrarEditor ,false);
    salvar.addEventListener('click' ,this.salvarNota ,false);
  },

  mostrarEditor: function() {
    document.getElementById('titulo').value = "";
    document.getElementById('comentario').value = "";
    document.getElementById("note-editor").style.display = "block";
    document.getElementById('titulo').focus();
  },

  salvarNota: function() {
    app.construirNota();
    app.ocultarEditor();
    app.refrescarLista();
    app.grabarDatos();
    app.verificarConexion();
  },

  construirNota: function() {
    var notas = app.model.notas;
    notas.push({"titulo": app.extraerTitulo() , "fechaLimite": app.extraerFecha(), "contenido": app.extraerComentario()});
  },
   extraerFecha: function() {
    return document.getElementById('fecha').value;
  },
  extraerTitulo: function() {
    return document.getElementById('titulo').value;
  },

  extraerComentario: function() {
    return document.getElementById('comentario').value;
  },

  ocultarEditor: function() {
    document.getElementById("note-editor").style.display = "none";
  },

  refrescarLista: function() {
    var div = document.getElementById('notes-list');
    div.innerHTML = this.anadirNotasALista();
  },

  anadirNotasALista: function() {
    var notas = this.model.notas;
    var notasDivs = '';

    for (var i in notas) { 

      var titulo = notas[i].titulo;
      var comentario = notas[i].contenido;
      var fechaLimite = notas[i].fechaLimite;
      notasDivs = notasDivs + this.anadirNota(i, titulo,comentario,fechaLimite);
    }
    return notasDivs;
  },

  anadirNota: function(id, titulo,contenido,fechaLimite) {
   notas = '<div class="note-item" id="notas[' + id + ']">';
    notas += '<div>titulo:'+ titulo +'<br>Fecha límite: ' + fechaLimite + '<br>Descripción: '+ contenido + '</div>';
    return notas;
  },


  grabarDatos: function() {
    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.gotFS, this.fail);
  },

  gotFS: function(fileSystem) {
    fileSystem.getFile("files/"+"model.json", {create: true, exclusive: false}, app.gotFileEntry, app.fail);
  },

  gotFileEntry: function(fileEntry) {
    fileEntry.createWriter(app.gotFileWriter, app.fail);
  },

  gotFileWriter: function(writer) {
    writer.onwriteend = function(evt) {
      console.log("datos grabados en externalApplicationStorageDirectory");

    if(app.hayWifi()) {
        app.salvarFirebase();
      }
    };
    writer.write(JSON.stringify(app.model));
  },

  salvarFirebase: function() {
    var ref = firebase.storage().ref('model.json');
    ref.putString(JSON.stringify(app.model));
  },

  hayWifi: function() {

    return navigator.connection.type==='wifi';
  },

  leerDatos: function() {
    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.obtenerFS, this.fail);
  },

  obtenerFS: function(fileSystem) {
    fileSystem.getFile("files/"+"model.json", null, app.obtenerFileEntry, app.noFile);
  },

  obtenerFileEntry: function(fileEntry) {
    fileEntry.file(app.leerFile, app.fail);
  },

  leerFile: function(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
      var data = evt.target.result;
      app.model = JSON.parse(data);
      app.inicio();
    };
    reader.readAsText(file);
  },

  noFile: function(error) {
    app.inicio();
  },

  fail: function(error) {
    console.log(error.code);
  },
  /***********PRUEBA***********************/
 verificarConexion:function () {
     if(navigator.connection.type==Connection.NONE){
         alert("No hay conexion");
     }
    }
};

if ('addEventListener' in document) {
  document.addEventListener("deviceready", function() {
 
    app.leerDatos();
  }, false);
};
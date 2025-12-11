let hayUsuarioLogueado = false;
const baseURL = "https://babytracker.develotion.com";
const imgURL = "https://babytracker.develotion.com/imgs";
const MENU = document.querySelector("#menu");
const RUTEO = document.querySelector("#ruteo");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const EVENTOS = document.querySelector("#pantalla-eventos");
const HISTORIAL = document.querySelector("#pantalla-historial");
const aEVENTO = document.querySelector("#pantalla-aEvento")
const INFORME = document.querySelector("#pantalla-informe");
const NAV = document.querySelector("ion-nav");
////////////////////////////////////
const hoy = new Date(); 
const hoyFormateado = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, "0")}-${(hoy.getDate().toString().padStart(2, "0"))}`;
////////////////////////////////////
navigator.geolocation.getCurrentPosition(guardarUbicacion, mostrarMensaje); 
let latitud;
let longitud;
let categorias = [];
Inicio();

/*  "usuario": "275021",
    "password":"12345678",
    "id": 3616
} */

function Inicio(){ 
  EventosHtml();
  ArmarMenu();
  TraerCategorias();
}

//#region BURGUER
function ArmarMenu() {
  let HayToken = localStorage.getItem('token');

  let menu = `<ion-item href="/" onclick="cerrarMenu()">Home</ion-item>`;

  if (HayToken) {
      menu += ` <ion-item href="/eventos" onclick="cerrarMenu()">Ver eventos</ion-item>
                <ion-item href="/agregarEvento" onclick="cerrarMenu()">Agregar evento</ion-item>
                <ion-item href="/informe" onclick="cerrarMenu()">Informe</ion-item>
      <ion-item  onclick="Logout()">Logout</ion-item>`
  } else {
      menu += ` <ion-item href="/login" onclick="cerrarMenu()">Login</ion-item>
  <ion-item href="/registro" onclick="cerrarMenu()">Registro</ion-item>`
  }
  document.querySelector("#menuOpciones").innerHTML = menu;
}



//#region SIGNIN
function Signin(u, d, c, p) {
  let usuario = new Object();
  usuario.usuario = u;
  usuario.departamento = d;
  usuario.ciudad = c;
  usuario.password = p;
  PrenderLoader("Registrando usuario")
  fetch(`${baseURL}/usuarios.php`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
  })
      .then(function (response) {
          console.log(response);
          return response.json();

      }).then(function (data) {
          console.log(data);
          ApagarLoader();
          if (data.error == "") {
              document.querySelector("#regRes").innerHTML = "Alta correcta";
          } else {
              document.querySelector("#regRes").innerHTML = data.error;
          }
      })
}


function ListarDepartamentos(){
  fetch(`${baseURL}/departamentos.php`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
         },
  }).then(function (response) {
    console.log(response);
    return response.json();
  }).then(function (data) {
    console.log(data);
    for(let i=0;i < data.departamentos.length;i++){
document.querySelector("#slcDepartamento").innerHTML+=`<ion-select-option value=${data.departamentos[i].id}>${data.departamentos[i].nombre}</ion-select-option>`;
       /*  if(document.getElementById("#slcDepartamento") !== null){
          ListarCiudades(document.getElementById("#slcDepartamento"));
        } */
     // ListarCiudades(data.departamentos[i].id);
    }
}) 
.catch(mostrarMensaje)
}


function ListarCiudades(evt){
  let idB = evt.detail.value;

  fetch(`${baseURL}/ciudades.php?idDepartamento=${idB}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
      },
  }).then(function (response) {
  console.log(response);
  return response.json();
  }).then(function (data) {
  console.log(data);
  document.querySelector("#slcCiudad").innerHTML = " ";
  for(let i=0;i < data.ciudades.length;i++){
  document.querySelector("#slcCiudad").innerHTML+=`<ion-select-option value=${data.ciudades[i].id}>${data.ciudades[i].nombre}</ion-select-option>`;
    }
  }) 
  .catch(mostrarMensaje)
 }  

//#region LOGIN

function Login(e, p) {
  let usuario = new Object();
  usuario.usuario = e;
  usuario.password = p;
  PrenderLoader("Iniciando sesión");
  fetch(`${baseURL}/login.php`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)

  }).then(function (response) {
      return response.json();

  }).then(function (data) {
    if(data.codigo == 200){
       ApagarLoader();
      console.log(data);
      localStorage.setItem("token", data.apiKey);   
      localStorage.setItem("idUser", data.id)  
      ArmarMenu();
     
      NAV.push("pantalla-eventos")
      mostrarMensaje("Inicio correcto",3000)
    }else{
      console.log(data);
      mostrarMensaje(data.error);
      ApagarLoader()
    }
  })
  .catch(mostrarMensaje)
  ApagarLoader()
}


//#region Ingresar Evento
function AgregarEvento(c, d, f){

let token = localStorage.getItem("token");
let idUser = localStorage.getItem("idUser");
let nuevaF = new Date(f);
let nuevaFformateada = `${nuevaF.getFullYear()}-${(nuevaF.getMonth() + 1).toString().padStart(2, "0")}-${(nuevaF.getDate().toString().padStart(2, "0"))}`;
if(nuevaFformateada <= hoyFormateado){
  let evento = new Object(); 
  evento.idCategoria = c;
  evento.idUsuario = idUser;
  evento.detalle = d;
  evento.fecha = f;
  PrenderLoader("Registrando evento");
  fetch(`${baseURL}/eventos.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': token,
        'iduser': idUser
      },
      body: JSON.stringify(evento)
    })
      .then(function (response){
          console.log(response);
          return response.json();
    }).then(function (data) {
          console.log(data);
          ApagarLoader();
          if (data.codigo == 200) {
              document.querySelector("#aEventoRes").innerHTML = "Alta correcta";
          } else {
              document.querySelector("#aEventoRes").innerHTML = data.error;
          }
      })
    }else{
      document.querySelector("#aEventoRes").innerHTML = "La fecha debe ser hoy o anterior";
    }
 }




function ListarCategorias(){
  fetch(`${baseURL}/categorias.php`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'apikey': localStorage.getItem("token"),
        'iduser': localStorage.getItem("idUser")
       },
  }).then(function (response) {
  console.log(response);
  return response.json();
  }).then(function (data) {
    if(data.codigo == 200){
  console.log(data);
  for(let i=0;i < data.categorias.length;i++){
  document.querySelector("#slcCategorias").innerHTML+=`<ion-select-option value=${data.categorias[i].id}>${data.categorias[i].tipo}</ion-select-option>`;
    }
  }else mostrarMensaje(data.error);
   })
  .catch(mostrarMensaje)
   }  

 
//#region Lista Eventos

async function ListarEventos() {
  NAV.push("pantalla-eventos")
  let token = localStorage.getItem("token");
  let idUser = localStorage.getItem("idUser");
  if (token != null && token != ""){

     fetch(`${baseURL}/eventos.php?idUsuario=${idUser}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'apikey': token,
          'iduser': idUser
    }}).then(function (response) {
          console.log(response);
          if (response.status == 401) {
            return Promise.reject("Debes iniciar sesión nuevamente");
          }
          return response.json();
      }).then(function (data) {
        let eventos = data.eventos;
          console.log(data);
          cadena = ``;
          eventos.forEach(e =>{
            for (let i = 0; i < categorias.length; i++){
              if(categorias[i].id == e.idCategoria){
                imgCateg = categorias[i].imagen;
                tipoCateg = categorias[i].tipo;
              }
            }
            if(e.fecha.includes(hoyFormateado)){ 
              cadena += 
      `   <ion-item>
          <img src="${imgURL}/${imgCateg}.png" alt="Icono del evento"  style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" slot="start">
          <ion-label>${tipoCateg}</ion-label> 
          <ion-label>Detalle: ${e.detalle}</ion-label>
          <ion-label>Fecha: ${e.fecha}</ion-label>
          <ion-button slot="end" color="danger" onclick="BorrarEvento(${e.id})">
          <ion-icon name="trash-outline"></ion-icon>Eliminar
          </ion-button>
          </ion-item>
      `
       }})
          document.querySelector("#lista-eventos").innerHTML = cadena;
          ApagarLoader();
      })
      .catch(mostrarMensaje)
  }
}


 function TraerCategorias(){

    fetch(`${baseURL}/categorias.php`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'apikey': localStorage.getItem("token"),
          'iduser': localStorage.getItem("idUser")
      },
  }).then(function (response){
    console.log(response);
    return response.json();
  }).then(function (data){
    console.log(data);
      categorias = data.categorias;
    
      })  
  } 


async function ListarHistorial() {
  NAV.push("pantalla-historial")
  let token = localStorage.getItem("token");
  let idUser = localStorage.getItem("idUser");
  if (token != null && token != ""){
  //PrenderLoader("Obteniendo lista");
   fetch(`${baseURL}/eventos.php?idUsuario=${idUser}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'apikey': token,
          'iduser': idUser
    }}).then(function (response) {
          console.log(response);
          if (response.status == 401) {
            return Promise.reject("Debes iniciar sesión nuevamente");
          }
          return response.json();
      }).then(function (data) {
        let eventos = data.eventos;
          console.log(data);
          cadena = ``;
          eventos.forEach( e =>{
            for (let i = 0; i < categorias.length; i++){
              if(categorias[i].id == e.idCategoria){
                imgCateg = categorias[i].imagen;
                tipoCateg = categorias[i].tipo;
              }
            }
            if(!e.fecha.includes(hoyFormateado)){ 
              cadena += 
    `   <ion-item>
          <img src="${imgURL}/${imgCateg}.png" alt="Icono del evento"  style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" slot="start">
          <ion-label>${tipoCateg}</ion-label> 
          <ion-label>Detalle: ${e.detalle}</ion-label>
          <ion-label>Fecha: ${e.fecha}</ion-label>
          <ion-button slot="end" color="danger" onclick="BorrarEvento(${e.id})">
          <ion-icon name="trash-outline"></ion-icon>Eliminar
          </ion-button>
          </ion-item>
      `
       }})
          document.querySelector("#lista-historial").innerHTML = cadena;
          ApagarLoader();
      })
      .catch(mostrarMensaje)
  }
}

  //#region Borrar Evento
function BorrarEvento(id) {
    let token = localStorage.getItem("token");
    if (token != null && token != "") {
      fetch(baseURL + "/eventos.php?idEvento=" + id,{
          method: 'DELETE',
          headers: {
            "Content-type": "application/json",
            'apikey': localStorage.getItem("token"),
            'iduser': localStorage.getItem("idUser")
          }
        }
      )
        .then(function (response) {
          if (response.status == 404) {
            return Promise.reject("El evento no es correcto");
          }
          if (response.status == 401) {
            mostrarMensaje("Debes iniciar sesión nuevamente");
            setTimeout(() => {cerrarSesion();}, 2500);
          }
          else{
            return response.json();
          }
        })
        .then(function (data) {
          if (EVENTOS.style.display = "block") {
            console.log(data);
            RUTEO.push("/eventos");
            NAV.push("pantalla-eventos")
            mostrarMensaje("Evento borrado con exito");
          }else if(HISTORIAL.style.display = "block"){
            console.log(data);
            RUTEO.push("/historial");
            NAV.push("pantalla-historial")
            mostrarMensaje("Historial borrado con exito");
          }
        })
        .catch(mostrarMensaje)
    }
    else {
      mostrarMensaje("Debes iniciar sesión");
    }
  }

  
//#region Informe

async function Informe() {
  NAV.push("pantalla-informe")
  let token = localStorage.getItem("token");
  let idUser = localStorage.getItem("idUser");
  let contadorBiberones = 0;/* timer de milisegundos = new GetDate() - ultimoBiberonDate */    
  let contadorPaña = 0;
  let timerBibe = 0;
  let timerPaña = 0;
  if (token != null && token != ""){
 
   return await fetch(`${baseURL}/eventos.php?idUsuario=${idUser}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'apikey': token,
          'iduser': idUser
    }}).then(function (response) {
          console.log(response);
          if (response.status == 401) {
            return Promise.reject("Debes iniciar sesión nuevamente");
          }
          return response.json();
      }).then(function (data) {
          console.log(data);
        for(let e of data.eventos){

          let fechaEntrada = new Date(e.fecha);
          let fechaEntradaString = fechaEntrada.toISOString().split('T')[0];
         // console.log(fechaEntradaString);
        //let nuevaF = data.eventos[i].fecha;   // "2024-08-12 11:43:00"
        //slice(indexStart, indexEnd)
          
            if(e.idCategoria == 35 && fechaEntradaString == hoyFormateado){
                contadorBiberones++;
                ultimoBibe = fechaEntrada;
                timerBibe = CalcTimer(ultimoBibe);
            }
      
            if(e.idCategoria == 33 && fechaEntradaString == hoyFormateado){
                contadorPaña++;
                ultimoPaña = fechaEntrada;
                timerPaña = CalcTimer(ultimoPaña);
            }
        }
        document.querySelector("#divInforme").innerHTML =
        `<ion-card>
          <ion-card-header>
               <ion-card-title>Biberones</ion-card-title>  
               <ion-icon name="beer-outline"></ion-icon>
          </ion-card-header>
               <ion-card-subtitle>Cantidad de biberones diarios: ${contadorBiberones}</ion-card-subtitle>
              <ion-card-subtitle>Tiempo desde ultimo biberones: ${timerBibe}</ion-card-subtitle>
          </ion-card>
          
        <ion-card>
          <ion-card-header>
             <ion-card-title>Pañaless</ion-card-title> 
             <ion-icon name="cash-outline"></ion-icon>
          </ion-card-header>
               <ion-card-subtitle>Cantidad de pañales diarios: ${contadorPaña}</ion-card-subtitle>
              <ion-card-subtitle>Tiempo desde ultimo pañales: ${timerPaña}</ion-card-subtitle>
        </ion-card>`
    
      })
      .catch(mostrarMensaje)
  }
}

function CalcTimer(fechaDada){

   let ahora = new Date();
   let diferencia = ahora - fechaDada;
   let minutosTotales = Math.floor(diferencia / (1000 * 60));
   let horas = Math.floor(minutosTotales / 60);
   let minutos = minutosTotales % 60;
   
   let horasFormateadas = String(horas).padStart(2, '0');
   let minutosFormateados = String(minutos).padStart(2, '0');
   
   return `${horasFormateadas} HS : ${minutosFormateados} MINS`;
}



//#region RUTEO
function Navegar(evt) {
  console.log(evt);
  const RUTA = evt.detail.to;

  OcultarPantallas();
  if (RUTA == "/") {
      setTimeout(() => {
        dibujaMapa();
      }, 2000);
    
      HOME.style.display = "block";
  } else if (RUTA == "/login") {
      LOGIN.style.display = "block";
  } else if (RUTA == "/registro") {
      REGISTRO.style.display = "block";
      ListarDepartamentos();
  } else if (RUTA == "/eventos") {
      EVENTOS.style.display = "block";
      ListarEventos();
  } else if (RUTA == "/historial") {
      HISTORIAL.style.display = "block";
      ListarHistorial();
  }else if (RUTA == "/agregarEvento") {
      aEVENTO.style.display = "block";
      ListarCategorias();
  }else if (RUTA == "/informe") {
      INFORME.style.display = "block";
      Informe();
  }
 }



//#region OTROS

function LimpiarCampos() {
  document.querySelector("#txtREmail").value = "";
  document.querySelector("#slcDepartamento").value = "";
  document.querySelector("#slcCiudad").value = "";
  document.querySelector("#txtRPassword").value = "";
}


function cerrarSesion() {
  localStorage.clear();
  document.querySelector("#menuLogin").style.display = "inline";
  document.querySelector("#menuRegistro").style.display = "inline";
  document.querySelector("#menuCerrarSesion").style.display = "none";
  document.querySelector("#menuInicio").style.display = "none";
  RUTEO.push("/login");
}


function OcultarPantallas() {
  HOME.style.display = "none";
  LOGIN.style.display = "none";
  REGISTRO.style.display = "none";
  EVENTOS.style.display = "none";
  HISTORIAL.style.display = "none";
  aEVENTO.style.display = "none";
  INFORME.style.display = "none";
}



function verificarRespuesta(response){   
  if(response.ok){
      return response.json();
  }
  return Promise.reject("Datos incorrectos");
}


function cerrarMenu() {
  MENU.close();
}


function Logout() {
  localStorage.clear();
  NAV.push("pantalla-home");
  ArmarMenu();
  cerrarMenu();
}

function cerrarMenu() {
  MENU.close();
}


function EventosHtml() {
  RUTEO.addEventListener('ionRouteDidChange', Navegar);
  document.querySelector("#btnRegistrar").addEventListener('click', TomarDatosRegistro);
  document.querySelector("#btnLogin").addEventListener('click', TomarDatosLogin);
  document.querySelector("#btnaEvento").addEventListener('click', TomarDatosNuevoEvento);
  document.querySelector("#slcDepartamento").addEventListener('ionChange', ListarCiudades);
}

function OcultarSecciones() {
  let divs = document.querySelectorAll(".ion-page");
  for (let i = 1; i < divs.length; i++) {
    divs[i].style.display = "none";
  }
}

function TomarDatosRegistro() {
  let u = document.querySelector("#txtREmail").value;
  let d = document.querySelector("#slcDepartamento").value;
  let c = document.querySelector("#slcCiudad").value;
  let p = document.querySelector("#txtRPassword").value;
  if(u != null && d != null && c != null && p != null){  Signin(u, d, c, p);}
}

function TomarDatosLogin() {
  let e = document.querySelector("#txtLEmail").value;
  let p = document.querySelector("#txtLPassword").value;
  if(e != null && p != null){  Login(e, p);}

}

function TomarDatosNuevoEvento(){
  let c = document.querySelector("#slcCategorias").value;
  let d = document.querySelector("#txtDetalle").value;
  let f = document.querySelector("#eventoFecha").value;
  if(c != null && d != null && f != null){  AgregarEvento(c, d, f);}
}



//#region loader
const loading = document.createElement('ion-loading');

function ApagarLoader() {
    loading.dismiss();
}


function PrenderLoader(texto) {
    loading.cssClass = 'my-custom-class';
    loading.message = texto;
   /*  loading.duration = 2000; */
    document.body.appendChild(loading);
    loading.present();
}

function Alertar(titulo, subtitulo, mensaje) {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = titulo;
    alert.subHeader = subtitulo;
    alert.message = mensaje;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    alert.present();
}

  function mostrarMensaje(texto) {
    let toast = document.createElement("ion-toast");
    toast.message = texto;
    toast.duration = 2000;
    toast.position = "middle";
    toast.present();
    document.body.appendChild(toast);
  }
  

//#region Mapa
function guardarUbicacion(position){
  console.log(position);
  latitud=position.coords.latitude;
  longitud=position.coords.longitude;
}

function dibujaMapa(){
  if(latitud == undefined || longitud == undefined  ){ 
    latitud = -34.90362730041884;
    longitud = -56.190645976670865;
  }
  var map = L.map('map').setView([latitud,longitud], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
  var marker = L.marker([latitud, longitud]).addTo(map);
  marker.bindPopup("<b>tas k</b>");

  MarcarPlazas(map);
}


function MarcarPlazas(map) {
  let token = localStorage.getItem("token");
  let idUser = localStorage.getItem("idUser");
  fetch(`${baseURL}/plazas.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'apikey': token,
      'iduser': idUser
    },
    }).then(function (response) {
    return response.json();
    }).then(function (data) {
      console.log('Plazas:', data);
      data.plazas.forEach(plaza => {
        const lat = plaza.latitud;
        const lon = plaza.longitud;
        if (!lat || !lon) {
          console.warn("Latitud o longitud faltante para la plaza:", plaza);
          return;
        }
        const accesible = plaza.accesible === 1 ? "Accesible" : "No accesible";
        const mascotas = plaza.aceptaMascotas === 1 ? "Permite mascotas" : "No permite mascotas";

        const popupContent = `<strong>Plaza</strong><br>${accesible}<br>${mascotas}`;

        const iconColor = accesible === "Accesible" ? "green" : "red";
        const plazaIcon = new L.Icon({
          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        L.marker([lat, lon], { icon: plazaIcon }).addTo(map).bindPopup(popupContent);
      });
    }).catch(function (error) {
    console.error("Error al obtener las plazas:", error);
    });
  }




/* 
  {
    "codigo": 200,
    "plazas": [
        {
            "idPlaza": 87423,
            "latitud": -34.8744554000000022142558009363710880279541015625,
            "longitud": -55.11719719999999966830728226341307163238525390625,
            "accesible": 1,
            "aceptaMascotas": 1
        },
        {
            "idPlaza": 87424,
            "latitud": -33.6941800700000015922341844998300075531005859375,
            "longitud": -53.455824849999999059946276247501373291015625,
            "accesible": 1,
            "aceptaMascotas": 1
        }, 
*/



 // if(navigator.geolocation){}  //pregunta si el navegador permite geolocalizacion




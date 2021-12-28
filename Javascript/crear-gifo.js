api_Key = "xjYxIlrLZQq1z0cRFUWc09N9xH66Z4hs"
let btnComenzar = document.getElementById('comenzar')
let btnGrabar = document.getElementById('grabar')
let btnFinalizar = document.getElementById('finalizar')
let btnSubirGifo = document.getElementById('subir')

let pasoActivo = document.querySelectorAll('#num')
let contadorGrabacion = document.getElementById('contador-grabacion')
let repetirCaptura = document.getElementById('contador-repetircaptura')

let modeCargando = document.getElementById('mode-video')
let iconoCargando = document.getElementById('mode-video-icon')
let textoCargando = document.getElementById('mode-video-parrafo')
let accionesCargando = document.getElementById('mode-video-actions')
let modeActions = document.getElementById('mode-video-actions')

let recorder;
let blob;
let dateStarted;

let form = new FormData()
let misGifosArray = []
let misGifosString = localStorage.getItem("misGifos")
let video = document.getElementById('grabacion-video')
let gifGrabado = document.getElementById('gif-grabado')

//Paso 1: clickeo COMENZAR, se cambia el texto de la pantalla y se pide el permiso. paso 1 activo
btnComenzar.addEventListener('click', comenzarGifo)

function comenzarGifo() {
    btnComenzar.style.display = "none"
    let tituloGrabar = document.getElementById('text-title-pantalla')
    let textoGrabar = document.getElementById('text-crea-tu-gifo')
    tituloGrabar.innerHTML = "¿Nos das acceso </br>a tu cámara?"
    textoGrabar.innerHTML = "El acceso a tu camara será válido sólo </br>por el tiempo en el que estés creando el GIFO."
    pasoActivo[0].classList.add('paso-activo')
        //funcion pedir permisos camara
    navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 480, height: 320 } })
//Paso 2: doy acceso: aparece la camara y el boton GRABAR. paso 2 activo
        .then(function(mediaStream) {
            //borro el texto
            tituloGrabar.style.display = "none"
            textoGrabar.style.display = "none"
            btnGrabar.style.display = "flex"
            pasoActivo[0].classList.remove('paso-activo')
            pasoActivo[1].classList.add('paso-activo')
                //aparece el video
            video.style.display = "block"
            video.srcObject = mediaStream
            video.onloadedmetadata = function(e) {
                video.play()
            }
            recorder = RecordRTC(mediaStream, {
                type: 'gif'
            })
        })
}

//Paso 3: clickeo el boton GRABAR: comienza la grabacion del gif, el boton cambia a FINALIZAR, aparece el contador de segundos
btnGrabar.addEventListener('click', grabarGifo);

function grabarGifo() {
    recorder.startRecording();
    console.log("grabando gif");
    btnGrabar.style.display = "none";
    btnFinalizar.style.display = "flex";
    contadorGrabacion.style.display = "flex";
    repetirCaptura.style.display = "none";
        //contador
    dateStarted = new Date().getTime();
        (function looper() {
            if (!recorder) {
                return;
            }
            contadorGrabacion.innerHTML = calculateTimeDuration((new Date().getTime() - dateStarted) / 1000);
            setTimeout(looper, 1000);
        })();
}

//Paso 4: clickeo FINALIZAR: boton cambia a SUBIR GIFO, el contador se va y aparece "repetir captura"
btnFinalizar.addEventListener('click', finalizarGifo)

function finalizarGifo() {
    console.log("gif terminado")
    btnFinalizar.style.display = "none"
    btnSubirGifo.style.display = "flex"
    contadorGrabacion.style.display = "none"
    repetirCaptura.style.display = "block"
    recorder.stopRecording(function() {
        video.style.display = "none"
        gifGrabado.style.display = "block"
        blob = recorder.getBlob()
        gifGrabado.src = URL.createObjectURL(recorder.getBlob())
        form.append('file', recorder.getBlob(), 'myGif.gif')
        form.append('api_key', api_Key)
    })
}

//Paso 5: clickeo SUBIR GIFO: aparece mode con icono loading y texto. paso 3 activo
btnSubirGifo.addEventListener('click', subirGifo)

function subirGifo() {
    //muestro pantalla cargando y paso activo
    modeCargando.style.display = "flex"
    btnSubirGifo.style.display = "none"
    pasoActivo[1].classList.remove('paso-activo')
    pasoActivo[2].classList.add('paso-activo')
    repetirCaptura.style.display = "none"
    fetch(`https://upload.giphy.com/v1/gifs`, {
            method: 'POST',
            body: form,
        })
        .then(response => {
            return response.json()
        })
//Paso 6: gifo subido con exito: cambia icono y texto del mode, aparecen los botones para descargar o link
    .then(objeto => {
            console.log(objeto)
            let miGifId = objeto.data.id
                //muestro elementos del DOM subiendo gifo
            accionesCargando.style.display = "flex"
            iconoCargando.setAttribute("src", "Recursos/SpecExport-SketchMeasure2.4_files/check.svg")
            textoCargando.innerText = "GIFO subido con éxito"
            modeActions.innerHTML = `
                <button class="mode-video-button" id="btn-creargifo-descargar" onclick="descargarGifCreado('${miGifId}')">
                <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-download.svg" alt="download">
                </button>
                <button class="mode-video-button" id="btn-creargifo-link">
                <img src="Recursos/SpecExport-SketchMeasure2.4_files/icon-link-normal.svg" alt="link">
                </button>
                `
                //si en el local storage no hay nada, el array queda vacio
            if (misGifosString == null) {
                misGifosArray = []
            } else {
                //si tengo contenido, necesito parsearlo para agregar uno nuevo
                misGifosArray = JSON.parse(misGifosString)
            }
            misGifosArray.push(miGifId)
                //vuelvo a pasar a texto el array para subirlo al LS
            misGifosString = JSON.stringify(misGifosArray)
            localStorage.setItem("misGifos", misGifosString)
        })
        .catch(error => console.log("error al subir gif a GIPHY" + error))
}

//FUNCION DESCARGAR GIF
async function descargarGifCreado(gifImg) {
    let blob = await fetch(gifImg).then(img => img.blob())
    invokeSaveAsDialog(blob, "migifo.gif")
}

//repetir captura: funcion grabar
repetirCaptura.addEventListener('click', repetirGifo)

function repetirGifo() {
    recorder.clearRecordedData()
    console.log("re-grabando gif")
    repetirCaptura.style.display = "none"
        //sacar boton subir gifo
    btnSubirGifo.style.display = "none"
        //se va la imagen
    gifGrabado.style.display = "none"
        //funciones comenzar gifo pero sin texto
        //aparece boton grabar gifo
    btnGrabar.style.display = "flex"
        //funcion pedir permisos camara
    navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 480, height: 320 } })
        //doy acceso: aparece la camara y el boton GRABAR. paso 2 activo
        .then(function(mediaStream) {
            //aparece el video
            video.style.display = "block"
            video.srcObject = mediaStream
            video.onloadedmetadata = function(e) {
                video.play()
            }
            recorder = RecordRTC(mediaStream, {
                type: 'gif'
            })
        })
}

//funcion para calcular el tiempo
function calculateTimeDuration(secs) {
    let hr = Math.floor(secs / 3600)
    let min = Math.floor((secs - (hr * 3600)) / 60)
    let sec = Math.floor(secs - (hr * 3600) - (min * 60))
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return hr + ':' + min + ':' + sec
}
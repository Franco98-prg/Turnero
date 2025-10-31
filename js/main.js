

// Array principal
const turnos = []

// Recuperar turnos guardados al inicio
const turnosGuardados = localStorage.getItem("Clientes")
if (turnosGuardados) {
    const turnosArray = JSON.parse(turnosGuardados)
    for (const turno of turnosArray) {
    turnos.push(turno)
    }
}

// Clase para crear los turnos
class Cliente {
    constructor(nombre, numdni, dia, horario, plan) {
        this.nombre = nombre
        this.numdni = numdni
        this.dia = dia
        this.horario = horario
        this.plan = plan
    }
}

//Inputs
let nombreInput = document.getElementById ("nombreInput")
let dniInput = document.getElementById ("dniInput")
let diaInput = document.getElementById ("diasInput")
let horarioInput = document.getElementById ("horarioInput")
let planesInput = document.getElementById("planesInput")
let botonEnviar = document.getElementById ("button-enviar")
let dniBuscarInput = document.getElementById("dniBuscarInput")
//boton
let buttonBuscar = document.getElementById("button-buscar")
let botonEliminar = document.getElementById ("button-eliminar")
let botonModificar = document.getElementById("button-modificar")

nombreInput.addEventListener("keypress", (e) => {
    const char = e.key
    if (!/^[a-zA-ZÑñ\s]$/.test(char)) {
        e.preventDefault() // Evita que se escriban numeros en el input
    }
})

//FETCH CARDS PLANES
const URL = "./db/data.json"
let cardContainer = document.getElementById ("cardContainer")
let planesinp = document.getElementById ("planesInput")

function obtenerPlan () {
    fetch(URL)
        .then(response => response.json())
        .then (data => {
            renderizarPlanes (data)
        })
        .catch(error => console.log ("Hubo un error"))
        .finally(() => console.log ())
}
obtenerPlan()

function renderizarPlanes (listaPlanes) {
    listaPlanes.forEach (planes =>{
        let card = document.createElement ("div")
        card.innerHTML = `      <div class="col-sm-12 col-xl-12 mb-3 mb-sm-0">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">${planes.tipo}- "${planes.titulo}"</h5>
                                            <h6 class="card-text">${planes.dirigido}</h6>
                                            <p>${planes.rutinas}</p>
                                            <p>A${planes.modalidad}</p>
                                            <p>${planes.dias}</p>
                                            <h6>${planes.enfoque}</h6>
                                            <a href="#solicitar-turno" class="btn btn-primary">Inscribite</a>
                                        </div>
                                    </div>
                                </div>`
        cardContainer.append(card)
        let addPlan = document.createElement ("div")
        addPlan.innerHTML = `<option value="${planes.tipo}">${planes.tipo}</option>`
        planesinp.append(addPlan)
        
    })
}

//Funcion para limpiar
function limpiarInputs () {
    nombreInput.value = ""
    dniInput.value = ""
    diaInput.value = ""
    horarioInput.value = ""
    planesInput.value = ""
    dniBuscarInput.value = ""
}
//PARA EVITAR FECHAS VIEJAS
const hoy = new Date().toISOString().split("T")[0]
diaInput.min = hoy

function limpiarMensajes () {
    let contenedor = document.getElementById("contenedor")
    contenedor.innerHTML = ""
    contenedor.className = ""
}
//funcion alertas
function mostrarMensaje(contenedor, tipo, mensaje, tiempo = 8000) {
    contenedor.className = `alert alert-${tipo}`
    contenedor.innerHTML = `<span>${mensaje}</span>`
    setTimeout(() => {
        contenedor.className = ""
        contenedor.innerHTML = ""
    }, tiempo)
}


//funcion calendario
const calendarInput = document.querySelector('#input');
new Calendar(calendarInput, {
  inputMode: true,
});;

//CARGAR TURNOS
botonEnviar.onclick = () => {
    const nombre = nombreInput.value
    const numdni = dniInput.value
    const dia = diaInput.value
    const horario = horarioInput.value
    const plan = planesInput.value


    let contenedor = document.getElementById("contenedor") 

    //limpiar mensajes
    limpiarMensajes ()


    //validar
    if (!nombre) { 
        mostrarMensaje(contenedor, "danger", "Debe ingresar un nombre válido")
        return
    }
    if (isNaN(numdni) || numdni <= 10000000){
        mostrarMensaje(contenedor, "danger", "Debe ingresar un numero de DNI")
        return
    }

    if (dia === "") {
        mostrarMensaje(contenedor, "danger", "Debe ingresar una fecha válido")
        return
    }

    if (horario === "") {
        mostrarMensaje(contenedor, "danger", "Debe ingresar un horario válido")
        return
    }

    if (plan === "") {
        mostrarMensaje(contenedor, "danger", "Debe ingresar un plan")
        return
    }

    let dniExistente = turnos.some(turno => turno.numdni === numdni)
    if (dniExistente) {
        mostrarMensaje(contenedor, "danger", "Ya existe un turno con su DNI")
        return
    }

    let turnoOcupado = turnos.some(turno => turno.dia === dia && turno.horario === horario)
    if (turnoOcupado) {
        mostrarMensaje(contenedor, "danger", "Este turno ya esta ocupado para otro Usuario, elija otra fecha u horario")
        return
    }


    
    const turnoAsignado = new Cliente(nombre, numdni, dia, horario, plan)
    turnos.push (turnoAsignado)
    localStorage.setItem("Clientes", JSON.stringify(turnos))


    // mostrarMensaje(contenedor, "success", `Su turno para el "${plan}" se registró correctamente, ${nombre} el dia ${dia}, a las ${horario}.`)

    Swal.fire({
        position: "center",
        title: "Turno registrado correctamente",
        html: `
            <h6>Su turno se registró correctamente</h6>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Fecha:</strong> ${dia}</p>
            <p><strong>Horario:</strong> ${horario}</p>
        `,
        icon: "success",
        showConfirmButton: true,
    })

    limpiarInputs ()


}














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
    constructor(nombre, numdni, dia, horario) {
        this.nombre = nombre
        this.numdni = numdni
        this.dia = dia
        this.horario = horario
    }
}

//Inputs
let nombreInput = document.getElementById ("nombreInput")
let dniInput = document.getElementById ("dniInput")
let diaInput = document.getElementById ("diasInput")
let horarioInput = document.getElementById ("horarioInput")
let botonEnviar = document.getElementById ("button-enviar")
let dniBuscarInput = document.getElementById("dniBuscarInput")
//boton
let buttonBuscar = document.getElementById("button-buscar")
let botonEliminar = document.getElementById ("button-eliminar")



//Funcion para limpiar
function limpiarInputs () {
    nombreInput.value = ""
    dniInput.value = ""
    diaInput.value = ""
    horarioInput.value = ""
    dniBuscarInput.value = ""
}

function limpiarMensajes () {
    let contenedor = document.getElementById("contenedor")
    contenedor.innerHTML = ""
    contenedor.className = ""
}


//CARGAR TURNOS
botonEnviar.onclick = () => {
    const nombre = nombreInput.value
    const numdni = dniInput.value
    const dia = diaInput.value
    const horario = horarioInput.value


    let contenedor = document.getElementById("contenedor")

    //limpiar mensajes
    limpiarMensajes ()


    //validar
    if (!nombre) { 
        contenedor.className = "alert alert-danger"
        contenedor.innerHTML = "<span>Debe ingresar un Nombre</span>"
        return
    }
    if (isNaN(numdni) || numdni <= 10000000){
        contenedor.className = "alert alert-danger"
        contenedor.innerHTML = "<span>Debe ingresar un numero de DNI</span>"
        return
    }

    if (dia === "") {
        contenedor.className = "alert alert-danger"
        contenedor.innerHTML = "<span>Debe seleccionar un Día</span>"
        return
    }

    if (horario === "") {
        contenedor.className = "alert alert-danger"
        contenedor.innerHTML = "<span>Debe seleccionar un Horario</span>"
        return
    }

    let dniExistente = turnos.some(turno => turno.numdni === numdni)
    if (dniExistente) {
        contenedor.className = "alert alert-danger"
        contenedor.innerHTML = "<span>Ya esta registrado un turno con su dni</span>"
        return
    }


    
    const turnoAsignado = new Cliente(nombre, numdni, dia, horario)
    turnos.push (turnoAsignado)
    localStorage.setItem("Clientes", JSON.stringify(turnos))



    contenedor.className = "alert alert-success"
    contenedor.innerText = `Su turno se registró correctamente, ${nombre} a las ${horario}.`

    console.log (turnos)

    limpiarInputs ()


}


//BUSCAR TURNOS SOLICITANDO DNI


buttonBuscar.onclick = () => {
    let contenedorBuscar = document.getElementById("contenedorBuscar")
    const numdni = dniBuscarInput.value

    //limpiar mensajes
    contenedorBuscar.innerHTML = ""
    contenedorBuscar.className = ""

    const filtrados = turnos.filter((turno) => turno.numdni == numdni) // BUSCA EL TURNO

    if (filtrados.length > 0) { //LO DEVUELVE SI HAY O NO EN UN DIV
        contenedorBuscar.className = "alert alert-success"
        contenedorBuscar.innerHTML = `<span>Turno encontrado: ${filtrados[0].nombre} - ${filtrados[0].horario}</span>`
    } else {
        contenedorBuscar.className = "alert alert-danger"
        contenedorBuscar.innerHTML = "<span>No se encontró ningún turno con ese DNI.</span>"
    }

    limpiarInputs ()

}

//ELIMINAR UN TURNO


botonEliminar.onclick = () => {
    const contenedorBuscar = document.getElementById("contenedorBuscar")
    const numdni = dniBuscarInput.value

        //limpiar mensajes
    contenedorBuscar.innerHTML = ""
    contenedorBuscar.className = ""

    const turno = turnos.find(turno => turno.numdni == numdni)

    if (turno) {
        // Eliminar el turno filtrando el array
        const nuevosTurnos = turnos.filter(t => t.numdni != numdni)
        turnos.length = 0 // limpiar el array original
        turnos.push(...nuevosTurnos) // recargar con los que quedaron
        localStorage.setItem("Clientes", JSON.stringify(turnos))

        contenedorBuscar.className = "alert alert-success"
        contenedorBuscar.innerHTML = `<span>Turno de ${turno.nombre} (${turno.dia} - ${turno.horario}) eliminado correctamente.</span>`

    } else {
        contenedorBuscar.className = "alert alert-danger"
        contenedorBuscar.innerHTML = "<span>No se encontró ningún turno con ese DNI para eliminar.</span>"
    }

    limpiarInputs()
}












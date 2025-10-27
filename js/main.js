

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
let botonModificar = document.getElementById("button-modificar")

nombreInput.addEventListener("keypress", (e) => {
    const char = e.key
    if (!/^[a-zA-ZÑñ\s]$/.test(char)) {
        e.preventDefault() // Evita que se escriban numeros en el input
    }
})



//Funcion para limpiar
function limpiarInputs () {
    nombreInput.value = ""
    dniInput.value = ""
    diaInput.value = ""
    horarioInput.value = ""
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

function mostrarMensaje(contenedor, tipo, mensaje, tiempo = 5000) {
    contenedor.className = `alert alert-${tipo}`
    contenedor.innerHTML = `<span>${mensaje}</span>`
    setTimeout(() => {
        contenedor.className = ""
        contenedor.innerHTML = ""
    }, tiempo)
}

function mostrarMensajeBuscar(contenedorBuscar, tipo, mensaje, tiempo = 5000) {
    contenedorBuscar.className = `alert alert-${tipo}`
    contenedorBuscar.innerHTML = `<span>${mensaje}</span>`
    setTimeout(() => {
        contenedorBuscar.className = ""
        contenedorBuscar.innerHTML = ""
    }, tiempo)
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


    
    const turnoAsignado = new Cliente(nombre, numdni, dia, horario)
    turnos.push (turnoAsignado)
    localStorage.setItem("Clientes", JSON.stringify(turnos))


    mostrarMensaje(contenedor, "success", `Su turno se registró correctamente, ${nombre} el dia ${dia}, a las ${horario}.`)



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
        mostrarMensajeBuscar(contenedorBuscar, "success", `Turno encontrado: ${filtrados[0].nombre} - ${filtrados[0].dia} - ${filtrados[0].horario}`)
    } else {
        mostrarMensajeBuscar(contenedorBuscar, "danger", "No se encontró ningún turno con ese DNI.")
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

        mostrarMensajeBuscar(contenedorBuscar, "success", `Turno de ${turno.nombre} (${turno.dia} - ${turno.horario}) eliminado correctamente.`)

    } else {
        mostrarMensajeBuscar(contenedorBuscar, "danger", "No se encontró ningún turno con ese DNI para eliminar.")
    }

    limpiarInputs()
}


botonModificar.onclick = () => {
    const contenedorBuscar = document.getElementById("contenedorBuscar")
    const numdni = dniBuscarInput.value

    contenedorBuscar.innerHTML = ""
    contenedorBuscar.className = ""

    const turno = turnos.find(turno => turno.numdni == numdni)
    
    if (!turno) {
        mostrarMensajeBuscar(contenedorBuscar, "danger", "No se encontró ningún turno con su DNI")
        return
    }

    contenedorBuscar.className = "alert alert-info"
    contenedorBuscar.innerHTML = `
        <p>Modificando el turno de <strong>${turno.nombre}</strong></p>
        <label>Nuevo día:</label>
        <input type="date" class="form-control" id="nuevoDia" value="${turno.dia}" max="2025-12-31">
        <label>Nuevo horario:</label>
        <select class="form-select" id="nuevoHorario">
            <option value="">Seleccione un nuevo horario</option>
            <option value="7:30">7:30</option>
            <option value="8:30">8:30</option>
            <option value="9:30">9:30</option>
            <option value="10:30">10:30</option>
            <option value="11:30">11:30</option>
            <option value="16:30">16:30</option>
            <option value="17:30">17:30</option>
            <option value="18:30">18:30</option>
            <option value="19:30">19:30</option>
            <option value="20:30">20:30</option>
        </select>
        <button id="guardarCambios" class="btn btn-success mt-2">Guardar Cambios</button>
    `

    const nuevoDiaInput = document.getElementById("nuevoDia")
    const nuevoHorarioSelect = document.getElementById("nuevoHorario")

    const hoy = new Date().toISOString().split("T")[1]
    nuevoDiaInput.min = hoy

    // Función para deshabilitar horarios ocupados
    function actualizarHorarios(diaInputElement, horarioSelectElement, dniExcluido) {
        const opciones = horarioSelectElement.querySelectorAll("option")
        opciones.forEach(op => op.disabled = false)

        const diaSeleccionado = diaInputElement.value
        if (!diaSeleccionado) return

        const horariosOcupados = turnos
            .filter(t => t.dia === diaSeleccionado && t.numdni !== dniExcluido)
            .map(t => t.horario)

        opciones.forEach(op => {
            if (horariosOcupados.includes(op.value)) {
                op.disabled = true
            }
        })
    }

    // Actualizar horarios al cargar la modificación
    actualizarHorarios(nuevoDiaInput, nuevoHorarioSelect, numdni)

    // Actualizar horarios cada vez que el usuario cambie la fecha
    nuevoDiaInput.addEventListener("change", () => {
        actualizarHorarios(nuevoDiaInput, nuevoHorarioSelect, numdni)
    })

    // Guardar cambios
    document.getElementById("guardarCambios").onclick = () => {
        const nuevoDia = nuevoDiaInput.value
        const nuevoHorario = nuevoHorarioSelect.value

        if (!nuevoDia || !nuevoHorario) {
            mostrarMensaje(contenedorBuscar, "danger", "Debe seleccionar un día y horario")
            return
        }

        // Actualizar los datos del turno
        turno.dia = nuevoDia
        turno.horario = nuevoHorario

        // Guardar en localStorage
        localStorage.setItem("Clientes", JSON.stringify(turnos))

        mostrarMensaje(contenedorBuscar, "success", `Turno de ${turno.nombre} modificado correctamente a ${nuevoDia} - ${nuevoHorario}.`)
        limpiarInputs()
    }
}



// Deshabilitar horarios ocupados según el día elegido
diaInput.addEventListener("change", () => {
    const diaSeleccionado = diaInput.value
    const opciones = horarioInput.querySelectorAll("option")

    opciones.forEach(op => op.disabled = false)

    if (diaSeleccionado) {
        const horariosOcupados = turnos
            .filter(turno => turno.dia === diaSeleccionado)
            .map(turno => turno.horario)

        opciones.forEach(op => {
            if (horariosOcupados.includes(op.value)) {
                op.disabled = true
            }
        })
    }
})
    













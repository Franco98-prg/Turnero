


//mostrar turnos
function mostrarTurnos() {
    let contenedorTurnos = document.getElementById("contenedorTurnos")

    // si el contenedor no existe en el HTML, evitamos errores
    if (!contenedorTurnos) return

    contenedorTurnos.innerHTML = "" // limpiar antes de mostrar

    if (turnos.length === 0) {
        contenedorTurnos.innerHTML = "<p>No hay turnos registrados.</p>"
        return
    }

    // recorrer el array de turnos y mostrarlos
    turnos.forEach(turno => {
        const div = document.createElement("div")
        div.classList.add("card","mt-1")
        div.innerHTML = `   <strong>${turno.nombre}</strong> 
                            <p>DNI: ${turno.numdni}</p>
                            <p>Día: ${turno.dia}- Hora: ${turno.horario}</p>
                            <p>Plan: ${turno.plan}</p>
                            <div class="mt-2">
                                <button class="button-eliminar" id="${turno.numdni}">Eliminar su Turno</button>
                                <button class="button-modificar" id="${turno.numdni}">Modificar Turno</button>
                            </div>`
        contenedorTurnos.appendChild(div)
    })

    const botonesEliminar = document.querySelectorAll(".button-eliminar")
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", () => {
            const dni = boton.id // el id es el DNI en los botones
            eliminarTurno(dni)
            
        })
    })

        //eventos para MODIFICAR
    const botonModificar = document.querySelectorAll(".button-modificar")
    botonModificar.forEach(boton => {
        boton.addEventListener("click", () => {
            const dni = boton.id //el id es el DNI en los botones
            modificarTurno(dni)
        })
    })
}

function eliminarTurno(numdni) {
    const turno = turnos.find(turno => turno.numdni == numdni)
    if (turno) {
        Swal.fire({
            title: "Esta seguro que deseas eliminiar su turno?",
            html: ` <h6>Su turno se eliminara, sin posibilidad de recuperarlo</h6>
                    <p>turno: ${turno.nombre}</p>
                    <p>plan: ${turno.plan}</p>
                    <p>fecha: ${turno.dia}</p>
                    <p>Horario: ${turno.horario}</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar"
        }).then((result) => {
            if (result.isConfirmed) {
            // Eliminar el turno filtrando el array
                const nuevosTurnos = turnos.filter(t => t.numdni != numdni)
                turnos.length = 0 // limpiar el array original
                turnos.push(...nuevosTurnos) // recargar con los que quedaron
                localStorage.setItem("Clientes", JSON.stringify(turnos))
                Swal.fire({
                title: "Eliminado!",
                html: ` <h6>Su turno se elimino correctamente</h6>
                        <p>turno: ${turno.nombre}</p>
                        <p>plan: ${turno.plan}</p>
                        <p>fecha: ${turno.dia}</p>
                        <p>Horario: ${turno.horario}</p>`,
                icon: "success"
                })
                mostrarTurnos()
                
            }
            
        })
    }

}


function modificarTurno(numdni) {
    let contenedorBuscar = document.getElementById("contenedorBuscar")

    contenedorBuscar.innerHTML = ""
    contenedorBuscar.className = ""

    const turno = turnos.find(turno => turno.numdni == numdni)
    

    contenedorBuscar.className = "alert alert-info"
    contenedorBuscar.innerHTML = `  <p>Modificando el turno de <strong>${turno.nombre}</strong></p>
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
                                    <label>Nuevo Plan:</label>
                                    <select class="form-select" id="nuevoPlan">
                                        <option value="" selected>Seleccione un plan</option>
                                        <option value="Plan Inicial">Plan Inicial</option>
                                        <option value="Plan Progreso">Plan Progreso</option>
                                        <option value="Plan Full">Plan Full</option>
                                    </select>
                                    <button id="guardarCambios" class="btn btn-success mt-2">Guardar Cambios</button>`

    let nuevoDiaInput = document.getElementById("nuevoDia")
    let nuevoHorarioSelect = document.getElementById("nuevoHorario")
    let nuevoPlanSelect = document.getElementById("nuevoPlan")
    let botonGuardarCambios = document.getElementById("guardarCambios")

   

    const hoy = new Date().toISOString().split("T")[0]
    nuevoDiaInput.min = hoy

    // Función para deshabilitar horarios ocupados
    function actualizarHorarios(diaInputElement, horarioSelectElement, dniExcluido) {
        const opciones = horarioSelectElement.querySelectorAll("option")
        opciones.forEach(op => op.disabled = false)

        const diaSeleccionado = diaInputElement.value
        if (!diaSeleccionado) 
            return

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
    actualizarHorarios(nuevoDiaInput, nuevoHorarioSelect, nuevoPlanSelect, numdni)

    // Actualizar horarios cada vez que el usuario cambie la fecha
    nuevoDiaInput.addEventListener("change", () => {
        actualizarHorarios(nuevoDiaInput, nuevoHorarioSelect, nuevoPlanSelect, numdni)
    })

    // Guardar cambios
    botonGuardarCambios.onclick = () => {
        const nuevoDia = nuevoDiaInput.value
        const nuevoHorario = nuevoHorarioSelect.value
        const nuevoPlan = nuevoPlanSelect.value


        if (!nuevoDia || !nuevoHorario || !nuevoPlan) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Debe seleccionar un día, un horario y un plan",
                html: ` <p>Usted no selecciono un dia, horario o un plan</p>`,
                showConfirmButton: false,
                timer: 7000
            });
            return
        }

        // Actualizar los datos del turno
        turno.dia = nuevoDia
        turno.horario = nuevoHorario
        turno.plan = nuevoPlan

        // Guardar en localStorage
        localStorage.setItem("Clientes", JSON.stringify(turnos))
        
        Swal.fire({
            position: "center",
            title: "Modificado",
            html: ` <h6>Su turno se modifico correctamente</h6>
                    <p>turno: ${turno.nombre}</p>
                    <p>plan: ${nuevoPlan}</p>
                    <p>fecha: ${nuevoDia}</p>
                    <p>Horario: ${nuevoHorario}</p>`,
            icon: "success",
            showConfirmButton: true,
            timer: 7000
        });

        mostrarTurnos()

        contenedorBuscar.innerHTML = ""
        contenedorBuscar.className = ""
        
    }
    setTimeout(() => {
        contenedorBuscar.className = ""
        contenedorBuscar.innerHTML = ""
    }, 15000)
}

mostrarTurnos()

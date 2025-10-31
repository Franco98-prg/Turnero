

//BUSCAR TURNOS SOLICITANDO DNI
buttonBuscar.onclick = () => {
    let contenedorBuscar = document.getElementById("contenedorBuscar")
    const numdni = dniBuscarInput.value

    //limpiar mensajes
    contenedorBuscar.innerHTML = ""
    contenedorBuscar.className = ""

    const filtrados = turnos.filter((turno) => turno.numdni == numdni) // BUSCA EL TURNO

    if (filtrados.length > 0) { //LO DEVUELVE SI HAY O NO EN UN DIV
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Usted ya esta registrado",
            html: ` <h4>Su turno es:</h4>
                    <p>turno: ${filtrados[0].nombre}</p>
                    <p>plan: ${filtrados[0].plan}</p>
                    <p>fecha: ${filtrados[0].dia}</p>
                    <p>Horario: ${filtrados[0].horario}</p>`,
            showConfirmButton: false,
            timer: 8000
        });
        // mostrarMensajeBuscar(contenedorBuscar, "success", `Turno encontrado: ${filtrados[0].nombre} \n ${filtrados[0].dia} - ${filtrados[0].horario} \n ${filtrados[0].plan}`)
    } else {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Usted no posee un turno",
            html: ` <p>Usted no posee turnos con su dni</p>`,
            showConfirmButton: false,
            timer: 7000
        });
        // mostrarMensajeBuscar(contenedorBuscar, "danger", "No se encontró ningún turno con ese DNI.")
    }

    limpiarInputs ()

}



//ELIMINAR UN TURNO
botonEliminar.onclick = () => {
    let contenedorBuscar = document.getElementById("contenedorBuscar")
    const numdni = dniBuscarInput.value

        //limpiar mensajes
    contenedorBuscar.innerHTML = ""
    contenedorBuscar.className = ""

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
                });
            }
        });




    } else {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Usted no posee un turno",
            html: ` <p>No se encontró ningún turno con su DNI para eliminar</p>`,
            showConfirmButton: false,
            timer: 7000
        });

    }

    limpiarInputs()
}


botonModificar.onclick = () => {
    let contenedorBuscar = document.getElementById("contenedorBuscar")
    const numdni = dniBuscarInput.value

    contenedorBuscar.innerHTML = ""
    contenedorBuscar.className = ""

    const turno = turnos.find(turno => turno.numdni == numdni)
    
    if (!turno) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Usted no posee un turno",
            html: ` <p>Usted no posee turnos con su dni</p>`,
            showConfirmButton: false,
            timer: 7000
        });
        // mostrarMensajeBuscar(contenedorBuscar, "danger", "No se encontró ningún turno con su DNI")
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
        <label>Nuevo Plan:</label>
        <select class="form-select" id="nuevoPlan">
            <option value="" selected>Seleccione un plan</option>
            <option value="Plan Inicial">Plan Inicial</option>
            <option value="Plan Progreso">Plan Progreso</option>
            <option value="Plan Full">Plan Full</option>
        </select>
        <button id="guardarCambios" class="btn btn-success mt-2">Guardar Cambios</button>
    `

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
            
            // mostrarMensaje(contenedorBuscar, "danger", "Debe seleccionar un día, un horario y un plan")
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


        limpiarInputs()

        contenedorBuscar.innerHTML = ""
        contenedorBuscar.className = ""
        
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
    




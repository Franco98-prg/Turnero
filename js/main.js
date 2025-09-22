

const horarios = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]

const turnos = []
//Funcion para sacar turnos
const sacarTurno = () =>{
    let nombre = prompt("Ingrese su nombre")
    if (!nombre) {
        alert ("Debe ingresar un nombre")
        return;
    }


//Mostrar horarios disponibles
    let mensaje = "Horarios disponibles: \n";
    for (let i = 0; i < horarios.length; i++){
        mensaje += (i + 1) + "- " + horarios[i] + "\n"
    }


    let opciones = parseInt (prompt(mensaje + "Elija el numero del horario que deseas asignarte"));
    if (opciones < 1 || opciones > horarios.length){
        alert ("Opcion incorrecta")
        return;
    }
    //obtener horario
    let horarioElegido = horarios[opciones - 1]; 
    //guarda en turnos
    turnos.push(nombre + " es a las " + horarioElegido) 

    alert ( nombre + " a las " + horarioElegido)
}

//Funcion para ver los turnos ocupados
const turnosOcupados = () =>{
    if (turnos.length ===0){
        alert ("Todavia no hay turnos reservados")
        return
    }else {
        let mensaje = "Turnos reservados: \n"
        for (let i = 0; i < turnos.length; i++)
            mensaje += turnos[i] + "\n"

        alert(mensaje); 
    }

}


//function para cancelar un turno
const cancelarTurno = () => {
    if (turnos.length === 0) {
        alert("Todavía no hay turnos para cancelar")
        return
    }

    let mensaje = "Turnos reservados:\n"
    for (let i = 0; i < turnos.length; i++) {
        mensaje += (i + 1) + "- " + turnos[i] + "\n"
    }

    let opcion = parseInt(prompt(mensaje + "Elija el número del turno que desea cancelar:"))

    if (opcion < 1 || opcion > turnos.length) {
        alert("Opción incorrecta")
        return
    }
     // elimina 1 turno
    let turnoCancelado = turnos.splice(opcion - 1, 1)
    alert("Se canceló el turno: " + turnoCancelado)
}


//Menu principal
let menu = parseInt(prompt("Bienvenido que desea realizar:\n1-Sacar un turno\n2-Ver turnos reservados\n3-Cancela turnos\n4-Salir"))

while (menu !== 4){
    switch (menu){
        case 1: 
            sacarTurno()
            break;
        case 2: 
            turnosOcupados()
            break;
        case 3: 
            cancelarTurno()
            break;

        default: 
            alert("Opcion ivalida.")

    }

    menu = parseInt(prompt("Bienvenido que desea realizar:\n1-Sacar un turno\n2-Ver turnos ocupados\n3-Cancelar turnos\n4-Salir"))
}

alert ("Graciasss por elegirnos!!")


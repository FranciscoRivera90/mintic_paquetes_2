var hasError = false
var alertTrigger = false
//
function validation(){
    var emailR =document.getElementById("inputEmail4R").value;
    var passR =document.getElementById("inputPassword4R").value;
    var CityR =document.getElementById("CityR").value;
    var AddressR =document.getElementById("AddressR").value;
    var PhoneR =document.getElementById("PhoneR").value;
    var inputEmail4D =document.getElementById("inputEmail4D").value;
    var CityD =document.getElementById("CityD").value;
    var AddressD =document.getElementById("AddressD").value;
    var PhoneD =document.getElementById("PhoneD").value;
    var Value =document.getElementById("Value").value;
    var Date =document.getElementById("Date").value;
    var package =document.getElementById("package").value;
    var inputPassword4D =document.getElementById("inputPassword4D").value;
    if( emailR == '' ||
        passR == '' ||
        CityR == '' ||
        AddressR == '' ||
        PhoneR == '' ||
        inputEmail4D == '' ||
        CityD == '' ||
        AddressD == '' ||
        PhoneD == '' ||
        Value == '' ||
        Date == '' ||
        package == '' ||
        inputPassword4D == ''
    ){
        alert('¡No puede subir el formulario con campos vacios!');
        return false;

    }else{
        return true;
    }

}

function crearEnvio(){

    if(validation()){
        db.collection("envios").add({

            //Datos del remitente provenientes del formulario
            nombre_remitente: document.getElementById("inputEmail4R").value,
            cedula_remitente: document.getElementById("inputPassword4R").value,
            direccion_remitente: document.getElementById("AddressR").value,
            telefono_remitente: document.getElementById("PhoneR").value,
            ciudad_origen: document.getElementById("CityR").value,
            //End Datos de remitente provenientes del formulario

            //Datos del destinatario proveniente del formulario
            nombre_destinatario: document.getElementById("inputEmail4D").value,
            cedula_destinatario: document.getElementById("inputPassword4D").value,
            direccion_destinatario : document.getElementById("AddressD").value,
            telefono_destinatario: document.getElementById("PhoneD").value,
            ciudad_destinatario: document.getElementById("CityD").value,
            //End Datos del destinatario proveniente del formulario.

            //Datos complementarios del formulario
            fecha_envio: document.getElementById("Date").value,
            tipo_paquete: document.getElementById("package").value,
            valor: document.getElementById("Value").value,
            //End Datos complementarios del formulario
        })
        .then((docRef) => {
            localStorage.setItem("idEnvio", docRef.id);
            alert("Registro de Envio Creado");
            window.location.replace("./formularioPaquete.html");
        })
        .catch((error) => {
            alert("Exite un Error");
        });
    }
}

function crearPaquete(){

    //Capturar el dato del input radio con el name Fragil
    var tagFragil = document.getElementsByName("fragil");
    var selectFragil;
    for (var i = 0; i < tagFragil.length; i++) {
        if(tagFragil[i].checked == true){
            if(i == 0){
                selectFragil = true
            }else{
                selectFragil = false;
            }
        }
    }
    //End Capturar el dato del input radio con el name Fragil

    db.collection("paquetes").add({

        //Datos del paquete provenientes del formulario
        peso: document.getElementById("peso").value,
        largo: document.getElementById("largo").value,
        ancho:document.getElementById("ancho").value,
        alto: document.getElementById("alto").value,
        fragil: selectFragil,
        detalles: document.getElementById("detalles").value,
        id_envio: localStorage.getItem('idEnvio')
        //End Datos del paquete provenientes del formulario

    }).then((docRef) => {
        localStorage.setItem("idEnvio", docRef.id);
    })
    .catch((error) => {
        alert("Exite un Error");
    });
}

function calcularCotizacion(){
    alert("Su pedido fue creado con éxito");
    window.location.replace("./historial.html");
}

function leerRegistrosEnvios(){
    db.collection("envios").get().then((querySnapshot) => { //Traer todos lor registros correspondientes a la colección enviós del firebase

        //Ocultar mensaje de No registros, cuando al menos hay un registros
        if(querySnapshot.size > 0){
            var mensajeNoRegistros = document.getElementById("mensajeNoRegistros").hidden = true;
        }
        //End Ocultar mensaje de No registros, cuando al menos hay un registros

        var tbody = document.getElementById("envios_registros");    //ubicarse en la etiqueta donde se trabajará el DOM

        //Recorrer todos los registros de la colección envios
        var i = 0;
        querySnapshot.forEach((doc) => {

            //Restructurar array
            var arrayEnvios = new Array();
            arrayEnvios['numero'] = i + 1
            arrayEnvios['guia'] = doc.id
            arrayEnvios['origen'] = doc.data().ciudad_origen
            arrayEnvios['destino'] = doc.data().ciudad_destinatario
            arrayEnvios['fecha'] = doc.data().fecha_envio
            arrayEnvios['valor'] = doc.data().valor
            arrayEnvios['acciones'] = ""
            //End Restructurar array

            var tr = document.createElement("tr");
            tr.setAttribute("class", "text-center");

            Object.entries(arrayEnvios).forEach((value, index)=>{
                var td = document.createElement("td");
                var newContent = document.createTextNode(value[1]);

                //Agregar Botones de Acciones
                if(index == 6){
                    var viewButton = document.createElement("button");
                    viewButton.setAttribute("id", "detalle")
                    viewButton.setAttribute("class", "btn btn-info bi bi-eye-fill")
                    viewButton.setAttribute("onclick", `capturaridRegistro("${doc.id}", 1)`)
                    viewButton.setAttribute("style",'margin-right: 4px;')

                    var editedButton = document.createElement("button");
                    editedButton.setAttribute("id", "editar")
                    editedButton.setAttribute("class", "btn btn-warning bi bi-pencil-fill")
                    editedButton.setAttribute("onclick", `capturaridRegistro("${doc.id}", 2)`)
                    editedButton.setAttribute("style",'margin-right: 4px;')

                    var deleteButton = document.createElement("button");
                    deleteButton.setAttribute("id", "borrar")
                    deleteButton.setAttribute("class", "btn btn-danger bi bi-trash3-fill")
                    deleteButton.setAttribute("onclick", `eliminarRegistroEnvio ("${doc.id}")`)

                    td.append(viewButton);
                    td.append(editedButton);
                    td.append(deleteButton);
                }
                //End Agregar Botones de Acciones

                td.append(newContent);
                tr.append(td);
            });

            tbody.append(tr);
            i++;
        });
        //End Recorrer todos los registros de la colección envios
    });
}

function eliminarRegistroEnvio (id){
    eliminarPaquete(id)
    db.collection("envios").doc(id).delete().then((docRef)=>{
        alert("Registro Eliminado");
        window.location.replace("./historial.html");
    });
}

function eliminarPaquete(id){
    db.collection("paquetes").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var idRef = doc.data().id_envio;

            if(id == idRef){
                var idPaquete = doc.id;
                db.collection("paquetes").doc(idPaquete).delete()
            }

        })
    });
}

function capturaridRegistro(id, caseFunction){
    if(caseFunction == 1){
        localStorage.setItem("caseFunction", caseFunction);
        localStorage.setItem("id", id);
    }else if(caseFunction == 2){
        localStorage.setItem("caseFunction", caseFunction);
        localStorage.setItem("id", id);
    }else{
        localStorage.setItem("caseFunction", caseFunction);
    }
    window.location.replace("./formularioEnviosDetalles.html");
}

function search(){
    var num_cols, display, input, filter, table_body, tr, td, i, txtValue;
    num_cols = 3;
    input = document.getElementById("q");
    filter = input.value.toUpperCase();
    table_body = document.getElementById("envios_registros");
    tr = table_body.getElementsByTagName("tr");

    for(i=0; i< tr.length; i++){
        display = "none";
        for(j=0; j < num_cols; j++){
            td = tr[i].getElementsByTagName("td")[j];
            if(td){
                txtValue = td.textContent || td.innerText;
                if(txtValue.toUpperCase().indexOf(filter) > -1){
                    display = "";
                }
            }
        }
        tr[i].style.display = display;
    }
}

function visualizarDetalleEnvio(id){
    db.collection("envios").doc(id).get().then((querySnapshot) => {
        var formulario = document.getElementById("formularioDetalles");
        formulario['nombreR'].value = querySnapshot.data().nombre_remitente
        formulario['cedulaR'].value = querySnapshot.data().cedula_remitente
        formulario['ciudadR'].value = querySnapshot.data().ciudad_origen
        formulario['direccionR'].value = querySnapshot.data().direccion_remitente
        formulario['telefonoR'].value = querySnapshot.data().telefono_remitente

        formulario['nombreD'].value = querySnapshot.data().nombre_destinatario
        formulario['cedulaD'].value = querySnapshot.data().cedula_destinatario
        formulario['ciudadD'].value = querySnapshot.data().ciudad_destinatario
        formulario['direccionD'].value = querySnapshot.data().direccion_destinatario
        formulario['telefonoD'].value = querySnapshot.data().telefono_destinatario

        formulario['valorEnvio'].value = querySnapshot.data().valor
        formulario['fechaEnvio'].value = querySnapshot.data().fecha_envio
    });
}

function visualizarCotizacion(id){
    var valorFormateado = "";
    db.collection("envios").doc(id).get().then((querySnapshot) => {
        var formulario = document.getElementById("formularioDetalles");
        var ciudadOrigen = querySnapshot.data().ciudad_origen +" - "+ querySnapshot.data().direccion_remitente;
        var ciudadDestino = querySnapshot.data().ciudad_destinatario +" - "+ querySnapshot.data().direccion_destinatario;

        //Origen y Destino del paquete
        document.getElementById("ciudadO").innerHTML = ciudadOrigen;
        document.getElementById("ciudadD").innerHTML = ciudadDestino;
        //End Origen y Destino del paquete

        //Datos del Remitente
        document.getElementById("nombreR").innerHTML = '<b>Nombre:</b> ' + querySnapshot.data().nombre_remitente;
        document.getElementById("cedulaR").innerHTML = '<b>C.C.:</b> ' + querySnapshot.data().cedula_remitente;
        document.getElementById("telefonoR").innerHTML = '<b>Tel:</b> ' + querySnapshot.data().telefono_remitente;
        //End Datos del Remitente

        //Datos del Destinatario
        document.getElementById("nombreD").innerHTML =  '<b>Nombre:</b> ' + querySnapshot.data().nombre_destinatario;
        document.getElementById("cedulaD").innerHTML = '<b>C.C.:</b> ' + querySnapshot.data().cedula_destinatario;
        document.getElementById("telefonoD").innerHTML = '<b>Tel:</b> ' + querySnapshot.data().telefono_destinatario;
        //Datos del Destinatario

        //Fecha de Envio y Paquete
        document.getElementById("fecha_envio").innerHTML = querySnapshot.data().fecha_envio;
        valorNoFormateado = parseInt(querySnapshot.data().valor, 0);
        valorFormateado = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(valorNoFormateado);
        document.getElementById("valor").innerHTML = valorFormateado;
        //End Origen y Destino del paquete
        localStorage.setItem("id", localStorage.getItem("idEnvio"));
    });
}

function actualizarRegistro(){
    var registro = db.collection("envios").doc(localStorage.getItem('id')).set({
        //Datos del remitente provenientes del formulario
        nombre_remitente: document.getElementById("inputEmail4R").value,
        cedula_remitente: document.getElementById("inputPassword4R").value,
        direccion_remitente: document.getElementById("AddressR").value,
        telefono_remitente: document.getElementById("PhoneR").value,
        ciudad_origen: document.getElementById("CityR").value,
        //End Datos de remitente provenientes del formulario

        //Datos del destinatario proveniente del formulario
        nombre_destinatario: document.getElementById("inputEmail4D").value,
        cedula_destinatario: document.getElementById("inputPassword4D").value,
        direccion_destinatario : document.getElementById("AddressD").value,
        telefono_destinatario: document.getElementById("PhoneD").value,
        ciudad_destinatario: document.getElementById("CityD").value,
        //End Datos del destinatario proveniente del formulario

        //Datos complementarios del formulario
        fecha_envio: document.getElementById("Date").value,
        tipo_paquete: document.getElementById("package").value,
        valor: document.getElementById("Value").value,
        //End Datos complementarios del formulario
    }).then((docRef) => {
        alert("Registro Actualizado");
        window.location.replace("./historial.html");
    })
    .catch((error) => {
    });
}

function revisarCotizacion(){
    window.location.replace("./formularioEnviosDetalles.html");
    localStorage.setItem("caseFunction", 2);
}

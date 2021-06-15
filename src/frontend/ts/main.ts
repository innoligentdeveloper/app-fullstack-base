class Main implements EventListenerObject, HandlerPost{
    public myFramework: MyFramework;
    public main(): void {
        this.myFramework = new MyFramework();
        this.mostrarDispositivos();
    }
    //PROCEDIMIENTO AJAX PARA MOSTRAR LOS DISPOSITIVOS EN EL DASHBOAR DE LA PAGINA
    public mostrarDispositivos(){
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let listaDis: Array<Device> = JSON.parse(xhr.responseText);
                    for (let disp of listaDis ){
                        let listaDisp = this.myFramework.getElementById("listaDisp");
                        //DEPENDIENDO DEL TIPO MUESTRO UN INNERHTML U OTRO. 
                        if (disp.type==1){
                            //ESTEINNER ES PARA LOS DIMMERS
                            listaDisp.innerHTML += `<li class="collection-item avatar">
                            <img src="./static/images/dimmer.png" alt="" class="circle">
                            <span id="nombre_${disp.id}" class="nombreDisp">${disp.name}</span>
                            <p id="descripcion_${disp.id}">${disp.description}
                            </p>
                            <a href="#!" class="secondary-content">
                                <div>
                                    <div>
                                        <p class="range-field">
                                            <input type="range" name="range" id="rango_${disp.id}" min="0" max="100" value="${disp.state}"/>
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <input id="tipodispositivo_${disp.id}" type="text" value="${disp.type}" hidden>
                            <a id="edit_${disp.id}" class="waves-effect waves-light modal-trigger btn" href="#modal1">Editar</a>
                            <a id="del_${disp.id}" class="waves-effect waves-light btn">Borrar</a>
                          </li>`;
                        }else{
                            let estado="";
                            if (disp.state){
                                estado="checked";
                            }
                            //ESTE INNER ES PARA LOS DISPOSITIVOS TIPO ON/OFF
                            listaDisp.innerHTML += `<li class="collection-item avatar">
                            <img src="./static/images/lightbulb.png" alt="" class="circle">
                            <span id="nombre_${disp.id}" class="nombreDisp">${disp.name}</span>
                            <p id="descripcion_${disp.id}">${disp.description}
                            </p>
                            <a href="#!" class="secondary-content">
                                <div class="switch">
                                    <label >
                                        Off
                                        <input id="check_${disp.id}" type="checkbox" ${estado} >
                                        <span class="lever"></span>
                                        On
                                    </label>
                                </div>
                            </a>
                            <input id="tipodispositivo_${disp.id}" type="text" value="${disp.type}" hidden>
                            <a id="edit_${disp.id}" class="waves-effect waves-light modal-trigger btn" href="#modal1">Editar</a>
                            <a id="del_${disp.id}" class="waves-effect waves-light btn">Borrar</a>
                            </li>`;
                        }
                    }
                    
                    //RECORRO TODA LA LISTA DE DISPOSITIVOS Y CREO LOS EVENT LISTENERS
                    for (let disp of listaDis) {
                        if (disp.type==1){
                            //LISTENERS DE DIMMERS
                            let rangeDisp = this.myFramework.getElementById("rango_" + disp.id);
                            rangeDisp.addEventListener("change", this);
                        }else{
                            //LISTENERS DE ON/OFF
                            let checkDisp = this.myFramework.getElementById("check_" + disp.id);
                            checkDisp.addEventListener("click", this);
                        }
                        //LISTENERS DE BOTONES EDITAR Y BORRAR
                        let editar = this.myFramework.getElementById("edit_" + disp.id);
                        editar.addEventListener("click", this);
                        let borrar= this.myFramework.getElementById("del_" + disp.id);
                        borrar.addEventListener("click", this);
                    }
                } else {
                    alert("error!!")
                }
            }
        }
        xhr.open("POST","http://localhost:8000/show_devices",true)
        xhr.send();
    }
    //PROCEDIMIENTO PARA MANEJAR LOS EVENTOS QUE SUCEDAN
    public handleEvent(ev: Event) {
        let objetoClick: HTMLInputElement = <HTMLInputElement>ev.target;
        let tipo:string = objetoClick.type.toLowerCase()
        //SI EL EVENTO ES DE UN DIMMER O DE UN ON/OFF ACTUALIZO LA BASE DE DATOS CON EL NUEVO ESTADO
        if (tipo == "range"){
            let datos = {"id":objetoClick.id,"status":objetoClick.value };
            this.myFramework.requestPOST("http://localhost:8000/devices_update", this,datos);
        }
        if (tipo == "checkbox"){
            let datos = {"id":objetoClick.id,"status":objetoClick.checked};
            this.myFramework.requestPOST("http://localhost:8000/devices_update", this,datos);
        }
        let eventodisparado:string = objetoClick.id.split('_')[0];
        let iddeldispositivo:string = objetoClick.id.split('_')[1];
        //SI EL EVENTO ES DE ALGUN BOTON REALIZO ALGUNA DE LAS SIGUIENTES ACCIONES:
        switch (eventodisparado){
            //SI ES EL BOTON "NUEVO" SE PROCEDE A LIMPIAR EL FORMULARIO
            case "nuevo":
                (<HTMLInputElement>this.myFramework.getElementById('titulo_modal')).innerHTML="Ingrese el nuevo dispositivo";
                (<HTMLInputElement>this.myFramework.getElementById('nombre_dispositivo')).value="";
                (<HTMLInputElement>this.myFramework.getElementById('descripcion_dispositivo')).value="";
                (<HTMLInputElement>this.myFramework.getElementById('tipo_dispositivo')).value="";
                break;  
            //SI SE HACE CLICK EN EL BOTON DEL MODAL GUARDAR INGRESAMOS AQUI...
            case "modalsave":
                //...TANTO SEA PARA UNA ACTUALIZACION DE DATOS O UNA NUEVA INSERCIÓN
                let nombre:string = (<HTMLInputElement>this.myFramework.getElementById('nombre_dispositivo')).value;
                let descripcion:string = (<HTMLInputElement>this.myFramework.getElementById('descripcion_dispositivo')).value;
                let tipo:string = (<HTMLInputElement>this.myFramework.getElementById('tipo_dispositivo')).value;
                let id_mod:string=(<HTMLInputElement>this.myFramework.getElementById('id_dispositivo')).value;
                let data={"id":"","name":"","description":"","state":"","type":""};
                let titulosplit:string = (<HTMLBodyElement>this.myFramework.getElementById('titulo_modal')).innerHTML.split(' ')[0];
                //DEPENDIENDO DE QUE ES LO QUE SE ESTA QUERIENDO HACER SE PREPARAN LOS DATOS CORRESPONDIENTES
                if(titulosplit=="Ingrese"){
                    //INSERTAR NUEVO
                    data = {"id":"","name":`${nombre}`,"description":`${descripcion}`,"state":"0","type":`${tipo}`};
                }else{
                    //MODIFICAR EXISTENTE
                    data = {"id":`${id_mod}`,"name":`${nombre}`,"description":`${descripcion}`,"state":"0","type":`${tipo}`};  
                }
              //  alert("ID:"+data.id + " Name: " + data.name+ " - " + data.description+ " State: " + data.state+ " Type: " + data.type)
                this.myFramework.requestPOST(`http://localhost:8000/insertupdate/`, this, data);
                break;   
            //CUANDO SE PRESIONA EL BOTON "EDITAR" SE INGRESA POR AQUI:
            case "edit":
                this.myFramework.getElementById('titulo_modal').innerHTML="Editar el dispositivo";
                //ESTA PARTE NO LOGRE HACERLA FUNCIONAR, NO HAY FORMA DE SETEAR EL VALOR DEL COMBO-BOX --------------
                console.log("PROFE LE RECUERDO QUE ESTA PARTE ES LA QUE TIENE QUE REVISAR QUE NO FUNCIONA BIEN");
                let elemento = this.myFramework.getElementById("tipo_dispositivo").children;
                for (let opt of elemento) {
                    let optC = <HTMLOptionElement>opt;
                    if (optC.value == this.myFramework.getElementById(`tipodispositivo_${iddeldispositivo}`).value) {
                        optC.selected = true;
                        console.log("entro al if " + optC.value);
                    }  
                }
                console.log("termino el select");
                // HASTA ACA SERIA EL PROBLEMA -----------------------------------------------------------------------
                (<HTMLInputElement>this.myFramework.getElementById('nombre_dispositivo')).value=<string>this.myFramework.getElementById(`nombre_${iddeldispositivo}`).textContent;
                (<HTMLInputElement>this.myFramework.getElementById('descripcion_dispositivo')).value=<string>this.myFramework.getElementById(`descripcion_${iddeldispositivo}`).textContent;
                (<HTMLInputElement>this.myFramework.getElementById('id_dispositivo')).value=iddeldispositivo;
                break;
            //CUANDO SE PRESIONA EL BOTON BORRAR SE INGRESA AQUI:
            case "del":
                let dispositivo:string=<string>this.myFramework.getElementById(`nombre_${iddeldispositivo}`).textContent;
                let confirmar:boolean = confirm(`Desea eliminar el dispositivo ${dispositivo}?`);
                if (confirmar===true){
                    let datos = {"id":`${iddeldispositivo}`};
                    this.myFramework.requestPOST(`http://localhost:8000/eliminar`,this, datos);
                }
                break;
        }
    }
    responsePost(status: number, response: string) {
        alert(response);
        console.log(response);
        //SE REFRESCA EL FORMULARIO PARA QUE SE ACTUALICEN LOS CAMBIOS REALIZADOS
        location.reload();
    }
}
//PROCEDIMIENTO INICIAL QUE SE EJECUTA EN LA ACCION "LOAD"
window.addEventListener("load", ()=> {
    let miObjMain: Main = new Main();
    miObjMain.main();
    //CREO LISTENER PARA BOTON DE CREAR "NUEVO" DISPOSITIVO
    let boton:HTMLElement = miObjMain.myFramework.getElementById("nuevo");
    boton.addEventListener("click", miObjMain);
    //CREO LISTENER PARA FORMULARIO MODAL
    let modal: HTMLElement = miObjMain.myFramework.getElementById("modal1");
    modal.addEventListener("click", miObjMain);
});

class Main{
    public main():void {
        console.log("SE EJECUTO EL MAIN");
        let listaUsr:Array<User> = new Array<User>();
        let usr1:User= new User(1, "Leandro", "leandro@ciribe.com.ar", true);
        let usr2:User=new User(2, "Juan", "juan@ciribe.com.ar", false);
        let usr3:User=new User(3, "Pablo", "pablo@ciribe.com.ar", true);
        listaUsr.push(usr1);
        listaUsr.push(usr2);
        listaUsr.push(usr3);
        for (let obj in listaUsr){
            listaUsr[obj].printInfo();
        }
        let myFramework:MyFramework= new MyFramework();
        let boton=myFramework.getElementById();
        boton.textContent="cambio de nombre"
    }
}
window.onload=function inicializar() {
    let miObjMain:Main = new Main();
    miObjMain.main();
  //  let boton = miObjMain.getElementById();
    //boton.textContent="NUEVO TEXTO"
};
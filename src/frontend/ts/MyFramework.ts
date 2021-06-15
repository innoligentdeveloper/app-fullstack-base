class MyFramework{
  //PROCEDIMIENTO PARA OBTENER LOS ELEMENTOS HTML POR ID
  public getElementById(id:string): HTMLElement{
    return document.getElementById(id);
  }
  //PROCEDIMIENTO AJAX PARA TRANSMITIR LOS DATOS EN FORMATO JSON POR POST
  public requestPOST(url: string, response: HandlerPost, datos: any) {
    let xlm: XMLHttpRequest = new XMLHttpRequest();
    xlm.onreadystatechange = () => {
      if (xlm.readyState == 4) {
        response.responsePost(xlm.status, xlm.responseText);
      }
    }
    xlm.open("POST", url, true);
    xlm.setRequestHeader("Content-Type", "application/json");
    xlm.send(JSON.stringify(datos));
  }
}
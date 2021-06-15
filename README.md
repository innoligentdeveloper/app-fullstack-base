![header](doc/header.png)

Bienvenidos a nuestro repositorio de código!!!
En este caso, nos encontramos realizando un trabajo práctico para la Especialización en IoT de la Universidad de Buenos Aires.
A través de estas líneas de código podrás levantar una página web para el monitoreo de una Casa Inteligente.
Sin más preámbulos, los dejamos con la guía de instalación y puesta en marcha.

Indice de contenidos:
- [Instalación](#instalación)
- [Frontend](#frontend)
- [Backend](#backend)
- [Base de datos](#base-de-datos)
- [Licencia](#licencia)

# Instalación 
Para la instalación necesitaremos ejecutar los comandos que se describen a continuación para cada una de las correspondientes tareas.

Descargar del siguiente repositorio los archivos de la aplicación web y copiarlos en una carpeta de su preferencia.
https://github.com/innoligentdeveloper/app-fullstack-base.git

En nuestro caso los copiaremos a modo de ejemplo en 'cd /home/usuario/app-fullstack-base'. Donde 'usuario' debe reemplazarse por el nombre de usuario correspondiente de la terminal linux.

Instalación de Docker:

Se instalará docker y docker-compose, teniendo en cuenta que la distribución Linux deberá ser debian 9 o superior.
```sh
sudo apt-get update 
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```
Importar clave y verificar huella
```sh
curl -fsSL https://download.docker.com/linux/ubuntu/gpg |sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
```
Agregar repositorio de docker e instalar
```sh
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```
Configurar permisos y grupo
```sh
sudo groupadd docker
sudo usermod -aG docker $USER
sudo gpasswd -a $USER docker
```
Reiniciar servicio
```sh
sudo service docker restart
```
Verificar la instalación
```sh
sudo docker run hello-world
```
Si la instalación ha concluido exitosamente, se mostrará por consola el mensaje de saludo del hello-world.


Instalar ahora el Docker-compose:

Descargar y dar permisos al programa
```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
``` 
Verificar la versión
```sh
docker-compose --version
```
Deberá mostrarse la versión `1.26.2`

A continuación se deberá reiniciar el sistema.
```sh
sudo reboot
```

Descargar imágenes:

Se deberán descargar las siguientes imágenes de docker para que nuestra aplicación pueda correr.

```sh
docker pull harmish/typescript
docker pull mysql:5.7
docker pull phpmyadmin/phpmyadmin
docker pull abassi/nodejs-server:10.0-dev
```
Una vez finalizada la descarga, se deberá levantar el servicio de docker desde la ruta de la carpeta del fork, por ejemplo 'cd /home/usuario/app-fullstack-base'.

```sh
docker-compose up
```

Esto iniciará los siguientes servicios:
- Mysql server
- PhpMyadmin
- NodeJs server y monitor
- Monitor de Typescript

Otros comandos útiles de docker-compose que cabe destacar (solo para referencia):

Para iniciar docker compose:
```sh 
docker-compose up
```
Para ver los procesos:
```sh 
docker-compose ps
```
Para detener el servicio:
```sh 
docker-compose stop
```
Para reiniciar el servicio:
```sh 
docker-compose restart
```

# Frontend
Una vez realizada la instalación anterior, ingrese desde un navegador de internet a la url: http://localhost:8000 para visualizar la página web.

Para el frontend del sistema se utilizó el framework CSS de Materialize (https://materializecss.com)
Para la programación se utilizó Typescript y HTML.

La funcionalidad del sistema es administrar (ABM) una lista de dispositivos eléctricos de una casa inteligente.
Se pueden agregar dispositivos nuevos, modificar existentes y eliminarlos.
El sistema permite la carga de 2 tipos de dispositivos, dispositivos de accionamiento tipo interruptor y dispositivos dimmer.

En la siguiente figura se muestra la página inicial con algunos dispositivos y el botón para agregar uno nuevo.
![frontend](doc/domotica.png)

En la siguiente figura se muestra la página al ingresar un nuevo dispositivo.
![frontend](doc/modalinsert.png)

En la figura se muestra la página al editar un dispositivo existente.
![frontend](doc/modaledit.png)

También se puede realizar el dimerizado o el encendido y apagado de cada dispositivo. Dicho cambio impacta directamente en la base de datos.

En un futuro, ese cambio impactará en los dispositivos reales. Para esto, será necesario agregar campos a la base de datos y nuevos procedimientos del lado del servidor.

Dentro del código del programa se pueden ver las notas de documentación sobre qué es lo que hace cada pedacito de código en particular.

En la figura se muestra un ejemplo de estas notas sobre la funcionalidad del código en cada caso.
![frontend](doc/docucode.png)


# Backend
En el lado del backend se programaron las llamadas a la base de datos para que se inserten, actualicen y borren los datos de los dispositivos. También se realiza el envío de la respuesta al frontend con los datos necesarios en formato JSON.

En el código se podrán observar todos los métodos encargados de guardar los datos provenientes del frontend.
Se optó por utilizar solo recepción de métodos por POST y no GET, debido a que en el POST los datos viajan ocultos en el body. Para los métodos POST, se recojen los datos desde el objeto `req.body`.

Dentro del código del programa del backen se optó por la misma metodología de documentación a través de notas sobre qué es lo que hace cada pedacito de código en particular.

# Base de datos
Como vimos anteriormente en la instalación, se utiliza una base de datos MySQL que consta de una tabla llamada `Devices` con la siguiente estructura:
- `id` int(11) NOT NULL
- `name` varchar(64) NOT NULL
- `description` varchar(128) NOT NULL
- `state` int(11) NOT NULL
- `type` int(11) NOT NULL

El campo `id` se utiliza como clave primaria. 

El campo `state` almacena el estado del dispositivo, si es encendido y apagado utilizará los valores 1 y 0, respectivamente. En cambio para el tipo dimmer el valor del estado puede variar desde 0 a 100.

El campo `type` en 0 indica interruptor y en 1 indica dimmer.

Para acceder al administrador de base de datos phpmyadmin, ingrese desde un navegador de internet a la url: http://localhost:8001 con usuario 'root' y contraseña 'userpass'.

# Licencia
Este proyecto está bajo Licencia ([MIT](https://choosealicense.com/licenses/mit/)). Podés ver el archivo [LICENSE.md](LICENSE.md) para más detalles sobre el uso de este material.

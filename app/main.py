from fastapi import FastAPI
from pydantic import BaseModel
from uuid import uuid4      #genera de forma automatica un código

app = FastAPI()

class Student(BaseModel):
    id: str
    name: str
    lastname: str

students = []

class Envio(BaseModel):
    id: str
    nombre_remitente: str
    cedula_remitente: str
    direccion_remitente: str
    telefono_remitente: str
    ciudad_remitente:str
    nombre_destinatario: str
    cedula_destinatario: str
    direccion_destinatario: str
    telefono_destinatario: str
    ciudad_destinatario:str
    fecha_envio: str
    tipo_paquete: str
    valor: str

envios = []

class Paquete(BaseModel):
    id: str
    peso: str
    largo: str
    ancho: str
    alto: str
    fragi: str
    detalle: str
    id_envio: str

paquetes = []

@app.post("/crear_envio")
def save_envio(envio: Envio):
    envio.id = str(uuid4())
    envios.append(envio.dict())
    return {'id': envio.id}

@app.post("/crear_paquete")
def save_paquete(paquete: Paquete):
    paquete.id = str(uuid4())
    paquetes.append(paquete.dict())
    return {'id': paquete.id}

@app.get("/envios")
def get_envios():
    return envios

@app.get("/paquetes")
def get_paquetes():
    return paquetes

@app.get("/envios/{id}")
def get_envio(id: str):
    for envio in envios:
        if envio["id"] == id:
            return envio
    return "No existe el envio"

@app.get("/paquetes/{id}")
def get_paquete(id: str):
    for paquete in paquetes:
        if paquete["id"] == id:
            return paquetes
    return "No existe el paquetes"

@app.put("/envios/{id}")
def update_envio(updated_updated: Envio, id:str):
    for envio in envios:
        if envio["id"] == id:
            envio["nombre_remitente"] = updated_updated.nombre_remitente
            envio["cedula_remitente"] = updated_updated.cedula_remitente
            envio["direccion_remitente"] = updated_updated.direccion_remitente
            envio["telefono_remitente"] = updated_updated.telefono_remitente
            envio["ciudad_remitente"] = updated_updated.ciudad_remitente
            envio["nombre_destinatario"] = updated_updated.nombre_destinatario
            envio["cedula_destinatario"] = updated_updated.cedula_destinatario
            envio["direccion_destinatario"] = updated_updated.direccion_destinatario
            envio["telefono_destinatario"] = updated_updated.telefono_destinatario
            envio["ciudad_destinatario"] = updated_updated.ciudad_destinatario
            envio["fecha_envio"] = updated_updated.fecha_envio
            envio["tipo_paquete"] = updated_updated.tipo_paquete
            envio["valor"] = updated_updated.valor
            return "Envio modificado"
    return "No existe el envio"

@app.put("/paquetes/{id}")
def update_paquete(updated_updated: Paquete, id:str):
    for paquete in paquetes:
        if paquete["id"] == id:
            paquete["peso"] = updated_updated.peso
            paquete["largo"] = updated_updated.largo
            paquete["ancho"] = updated_updated.ancho
            paquete["alto"] = updated_updated.alto
            paquete["fragil"] = updated_updated.fragil
            paquete["detalle"] = updated_updated.detalle
            paquete["id_envio"] = updated_updated.id_envio
            return "Paquete modificado"
    return "No existe el paquete"

@app.delete("/envios/{id}")
def delete_envio(id: str):
    for envio in envios:
        if envio["id"] == id:
            envios.remove(envio)
            return "Envio eliminado"
    return "No existe el envio"

@app.delete("/paquetes/{id}")
def delete_paquete(id: str):
    for paquete in paquetes:
        if paquete["id"] == id:
            paquetes.remove(paquete)
            return "Paquete eliminado"
    return "No existe el paquetes"
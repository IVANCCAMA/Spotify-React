import React from 'react';
import { useState } from 'react';
import { SubirCancion } from '../firebase/config';

function AñadirCancion() {
    const [file, setFile] = useState(null);
    
    const ValidarForm = async (e) => {
        e.preventDefault();
        // validar campos
        // code

        // validar formato
        const Formatos = ["mpeg", "wav"]; // mpeg === mp3
        let flag = false;

        for (let i = 0; i < Formatos.length && !flag; i++) {
            if (file.type.includes(Formatos[i])) {
                flag = true;
            }
        }

        if (flag) { 
            // otra funcion (?)

            // add en firebase
            try {
                const url = await SubirCancion(file);
                console.log(url);
                alert(`Archivo subido correctamente.`);
            } catch (error) {
                console.log(error);
                alert(`Error al subir el archivo.`);
            }

            // add en db

            // ventana para confirmar de subida
            window.location.reload();

        } else {
            alert(`Formato del archivo no admitido.`);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Crear Lista</h2>
    
            <form onSubmit={ ValidarForm }>
                <div className="mb-4">
                    <label htmlFor="imagen" className="block text-gray-700">Seleccionar archivo con los formatos: mp3 o wav.</label>
                    {/* <input type="file" className="w-full" name="archivo" id="archivo" onChange={e => SubirCancion(e.target.files[0])}/> */}
                    {/* accept="image/jpeg, image/png" */}
                    <input type="file" className="w-full" name="archivo" id="archivo" accept=".mp3, audio/wav" onChange={e => setFile(e.target.files[0])}/>
                </div>
    
                <div className="flex justify-between">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Aceptar</button>
                    <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Cancelar</button>
                </div>
            </form>
        </div>
    );
};
  
export default AñadirCancion;


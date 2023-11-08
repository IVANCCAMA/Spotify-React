import React from "react";
import { Icon } from '@iconify/react';
import './perfilUsuario.css';

function PerfilUsuario() {
    return (
        <div>
            <div className="user-profile-container">
                <div className="user-profile-column">
                    <Icon icon="gg:profile" color="white" width="130px" height="120" />
                </div>
                <div className="user-info-row">
                    <div>perfil</div>
                    <div className="user-profile-alias">
                        <div className="contenedor-alias">Alias del oyente</div>
                        <div className= "contenedor-editar">
                            <Icon icon="material-symbols:edit-outline" color="white" width={16} height={16} />
                            <div>Editar</div>
                        </div>
                    </div>
                    <div>n listas de reproducción</div>
                </div>
            </div>
        </div>
    );
}

export default PerfilUsuario;
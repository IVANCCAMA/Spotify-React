import React from "react";

function Busqueda (){

  return(
<div className="box">

<div className="container-1" style={{ textAlign: 'left', marginTop: '5%', marginLeft: '20%', marginRight: '55%', position: 'relative' }}>
    <input  //entrada de texto
        type="search"
        id="search"
        placeholder="Buscar canción"
        style={{
            width: '100%', 
            height: '2.5em',
            fontSize: '1em',
            padding: '0.5em',
            border: '2px solid #000',
            marginRight: '1em'
        }}   />
   
    <button //boton buscar
        className="icon" 
        style={{
            position: 'absolute', 
            top: 0, 
            right: 0, 
            height: '100%', 
            width: '2.5em', 
            fontSize: '1.5em', 
            border: '2px solid #000',
        }}
    >
        <i className="fa fa-search"></i>
    </button>
</div>

<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet"></link>

</div>)
};

export default Busqueda;

    

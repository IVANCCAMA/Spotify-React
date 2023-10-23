export const OPTIONS = {
  alfanumerico: /[a-zA-Z0-9]+/,
  acentos: /[áéíóúÁÉÍÓÚ]+/,
  letras: /[a-zA-Z]+/,
  numeros: /[0-9]+/,
  mayusculas: /[A-Z]+/,
  minusculas: /[a-z]+/,
  specialChars: /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\¿¡/·¬çªº]+/,
  agrupacion: /[(){}\[\]]+/,
  matematicas: /[+*/-=]+/,
  comillas: /['"`]+/,
  mail: /[a-zA-Z]+[a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/
};

/**
 * Valida una cadena de texto según las opciones especificadas.
 *
 * @param {string} str - La cadena de texto que se va a validar.
 * @param {string} [charsToOmit=""] - Los caracteres a omitir del texto antes de la validación.
 * @param {string} [validOption="alfanumerico"] - Las opciones de validación permitidas.
 * @returns {string} True si la cadena cumple con las opciones de validación, de lo contrario, false.
 *
 * @example
 * const cadena = "it's a string";
 * const caracteresAOmitir = "' ";
 *
 * const esValido = eliminarCaracteres(cadena, caracteresAOmitir);
 * console.log("Con caracteres omitidos:", esValido ? "Válido" : "No válido");
 * Con caracteres omitidos: Válido
 */
function eliminarCaracteres(str, charsToOmit = "", validOption = "alfanumerico") {
  let stringResult = str.split('').filter(char => !charsToOmit.includes(char)).join('');

  const validOptions = validOption.split(" ");
  validOptions.forEach(opt => {
    const regex = OPTIONS[opt];
    if (regex) {
      while (regex.test(stringResult)) {
        stringResult = stringResult.replace(regex, '');
      }
    }
  });
  
  return stringResult;
}

export const alfanumerico = (valor) => {
  return eliminarCaracteres(valor, " Ññ", "alfanumerico acentos").length === 0;
  if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]*$/.test(valor)) {
    return false;
  }
  return true;
};

export const alfanumericoVarios = (valor) => {
  if (!/^[a-zA-Z0-9\s,áéíóúÁÉÍÓÚñÑ]*$/.test(valor)) {
    return false;
  } else if (/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]*$/.test(valor)) {
    return true;
  } else if (/,+[\s]*$/.test(valor)) {
    return false;
  } else if (/[,a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]*$/.test(valor)) {
    return true;
  }
  return false;
};

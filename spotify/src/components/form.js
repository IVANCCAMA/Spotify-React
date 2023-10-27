export const OPTIONS = {
  default: /^[a-zA-Z0-9]+$/,
  alfanumerico: /[a-zA-Z0-9]+/,
  acentos: /[áéíóúÁÉÍÓÚ]+/,
  letras: /[a-zA-Z]+/,
  numeros: /[0-9]+/,
  mayusculas: /[A-Z]+/,
  minusculas: /[a-z]+/,
  empiezaMinusculas: /^[a-z]+/,
  empiezaMayusculas: /^[A-Z]+/,
  espacio: /\s/,
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
 * @returns {string} La cadena luego de haber eliminado las opciones.
 *
 * @example
 * const cadena = "it's a string with email: examle@localhost.com";
 * const caracteresAOmitir = "' :";
 *
 * const stringResult = eliminarCaracteres(cadena, caracteresAOmitir);
 * console.log("Con caracteres omitidos: ${stringResult}");
 * Con caracteres omitidos: it's a string with email: 
 */
function eliminarCaracteres(str, charsToOmit = "", validOption = "alfanumerico") {
  const regex = new RegExp(`[${charsToOmit}]`, 'g');
  let stringResult = str.replace(regex, '');

  const validOptions = validOption.split(" ");
  for (const opt of validOptions) {
    const regex = OPTIONS[opt];
    if (regex) {
      stringResult = stringResult.replace(regex, '');
    }
  };

  return stringResult;
}

/**
 * Valida una cadena de texto según las opciones especificadas.
 *
 * @param {string} str - La cadena de texto que se va a validar.
 * @param {string} [charsToOmit=""] - Los caracteres a omitir del texto antes de la validación.
 * @param {string} [validOption="default"] - Las opciones de validación permitidas.
 * @returns {boolean} True si la cadena cumple con las opciones de validación, de lo contrario, false.
 *
 * @example
 * const cadena = "it's a string";
 * const caracteresAOmitir = "' ";
 *
 * const esValido = verificarString(cadena, caracteresAOmitir);
 * console.log("Con caracteres omitidos:", esValido ? "Válido" : "No válido");
 * Con caracteres omitidos: Válido
 */
export function verificarString(str, charsToOmit = "", validOption = "default") {
  const regexToOmit = new RegExp(`[${charsToOmit}]`, 'g');
  const cleanStr = str.replace(regexToOmit, '');

  const validOptions = validOption.split(" ");
  for (const opt of validOptions) {
    const regex = OPTIONS[opt];
    if (regex) {
      if (!regex.test(cleanStr)) {  
        console.log(`<${opt}>`);
        return false;
      }
    }
  };

  return true;
}

export const alfanumerico = (valor) => {
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

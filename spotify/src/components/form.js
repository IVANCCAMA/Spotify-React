const alfanumerico = (valor) => {
  if (!/^[a-zA-Z0-9\s]*$/.test(valor)) {
    return false;
  }
  return true;
};

const alfanumericoVarios = (valor) => {
  if (!/^[a-zA-Z0-9\s,]*$/.test(valor)) {
    return false;
  } else if (/^[a-zA-Z0-9\s]*$/.test(valor)) {
    return true;
  } else if (/,+[\s]*$/.test(valor)) {
    return false;
  } else if (/[,a-zA-Z0-9\s]*$/.test(valor)) {
    return true;
  }
  return false;
};

const isNumber = (value: any) => {
  if (!value || isNaN(+value)) {
    return false;
  }

  return true;
};

export default isNumber;

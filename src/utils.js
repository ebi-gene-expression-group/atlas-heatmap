const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.substr(1);
const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export {capitalizeFirstLetter, numberWithCommas};

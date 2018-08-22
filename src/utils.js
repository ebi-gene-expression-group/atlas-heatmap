import {groupBy} from 'lodash'

const groupIntoPairs = (arr,f) => Object.entries(groupBy(arr,f))

const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.substr(1)

// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberWithCommas = x => {
  const parts = x.toString().split(`.`)
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, `,`)
  return parts.join(`.`)
}

export {capitalizeFirstLetter, numberWithCommas,groupIntoPairs}

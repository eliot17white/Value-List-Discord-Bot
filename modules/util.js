/*
modules/util.js
Purpose: Provide global utility functions usable by command scripts
Written by Zolohyr
*/

function capitalizeFirstLetter(string) {
  let reconstructed = ''
  let words = string.split(' ')
  // splits string into words to capitalize
  words.forEach(word => {
    reconstructed += word.charAt(0).toUpperCase() + word.slice(1) + ' '
    // capitalize the first letter and re-adds spaces
  })
  // returns string after removing final space
  return reconstructed.slice(0, -1)
}

function nFormatter(number){
  var letters = ["", "k", "M", "B", "T", "Qa", "Q"]
  // One letter per 3 digits
  
    var tier = Math.log10(Math.abs(number)) / 3 | 0;
  // figures out tier

    if(tier == 0) return number;

    var suffix = letters[tier];
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;
  // finds suffix, scales numbers

    return scaled.toFixed(2).replace(/[.,]00$/, "") + suffix;
  // scales to 2 decimal places, removes if .00, adds suffix
}

function makeString(name, info, flags) {
  // take vehicle and parse into one line (ex: Brulee - 1 Brulee ($10M) [Fluctuating])
  let n = capitalizeFirstLetter(name) // capitalizes first letter of each word in name to display, saves as n
  let p = info.Currency == 'b' && info.Price || `$${nFormatter(info.Price)}`
  // gets price: if currency is brulees, get price. if cash, format
  let c = info.Currency == 'b' && (info.Price == 1 && 'Brulee' || 'Brulees') || 'Cash' 
  // if currency is brulee, put brulee/brulees depending on amnt. otherwise cash
  let mv = info.Currency == 'b' && `($${nFormatter(mp * info.Price)})` || `` 
  // if brulees, add value in cash in parentheses. multiply by current brulee price (mp)
  let f = info.Flag && `[${flags[info.Flag] || `err`}]` || ``
  // show flag if it has one

  return `\n${n} - ${p} ${c} ${mv} ${f}`
  // format and return
}

function parseString(string) {
  // parse string by returning compute string (ex: volt4x4) and display string (ex: Volt 4x4)
  return {
    compute: string.replace(/_/g, "").toLowerCase(), // remove underscores and make lowercase
    display: capitalizeFirstLetter(string.replace(/_/g, ' ')) // replace underscores by spaces and capitalize each word
  }
}

function parseInput(valueList, input) {
  // parse user input and find vehicle
  let send = {}

  // we have to check if input IS the name, then if not, if it is part of the name. this is to avoid stuff like volt returning volt4x4 instead of the correct item

  // the first one could be just a valueList[parsedInput] but we also need to get the name of the vehicle without underscores (parsedName.compute) if user didn't use them so we have to iterate

  for (const [name, info] of Object.entries(valueList)) {
    // For each vehicle in value list,
    let parsedInput = parseString(input).compute
    let parsedName = parseString(name)
    // parse both user input and current iteration name

    if(parsedName.compute == parsedInput) {
      // if the input is the current interation, return info as well as compute and display names
     return {
       name: parsedName.compute,
       display: parsedName.display,
       info: info
     }
    }
    
  } 

  // if it has not already returned, input does not exactly match. check if it is part of a vehicle name. 
    
  for (const [name, info] of Object.entries(valueList)) {
    let parsedInput = parseString(input).compute
    let parsedName = parseString(name)

    if(parsedName.compute.includes(parsedInput)) {
     send = {
       name: parsedName.compute,
       display: parsedName.display,
       info: info
     }

      return send
    }
    
  }

  // if nothing, return nil and error on frontend

  return
}

module.exports = {
  capitalizeFirstLetter: capitalizeFirstLetter,
  nFormatter: nFormatter,
  parseInput: parseInput,
  makeString: makeString,
  parseString: parseString
}

// export functions
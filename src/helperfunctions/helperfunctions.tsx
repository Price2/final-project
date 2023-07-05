
import { useState } from 'react';
 
const getRandomColor = ()=>{
    let colorValues = ["fuchsia","lime", "olive ", "navy ", "teal " , 
    "aqua "  ,"maroon ","red", "blue", "green", "yellow"];
    return colorValues[Math.floor(Math.random() * colorValues.length)];
  }
export default getRandomColor;
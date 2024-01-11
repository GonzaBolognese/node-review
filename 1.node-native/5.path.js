const path = require('node:path')

//barra separadora de carpetas segun SO
console.log(path.sep);

//unir rutas con path.join
const filePath = path.join('content', 'subfolder', 'text.txt')
// '/content/subfolder/test.txt' en linux, macOS
// '\content\subfolder\test.txt' en windows
console.log(filePath);

const base = path.basename(filePath)
console.log(base) // text.txt

//Le podemos sacar la extension y que solo aparezca el nombre del fichero
const fileName = path.basename(filePath, '.txt')
console.log(fileName);//text

//Y si yo no se cual es la extension
const extension = path.extname(base)
console.log(extension);//.txt

//Entonces podria hacer
const file = path.basename(filePath, path.extname(base))
console.log(file); //text

//También este nos puede servir para saber cual es la extension correcta
//Si tenemos un archivo que se llame
const extension2 = path.extname('my.first.super.image.jpg')
console.log(extension2);//jpg
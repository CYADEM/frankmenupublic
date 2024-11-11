// Datos a reemplazar
const data = {
    NAME: "MoreBar",
    PLAN: "Pro",
    LOCATION: "Belgrano S. 1234",
    // ... otros datos
  };
  
  // Función para reemplazar variables en una cadena
  function replaceVariables(template, data) {
    let result = template;
    for (const key in data) {
      const regex = new RegExp(`\\$\\{${key}\\}`, 'g'); // Expresión regular para buscar variables
      result = result.replace(regex, data[key]);
      console.log("variable reemplazada " + key + " > " + data[key])
    }
    return result;
  }
  
  // Obtener el contenido de demo.html
  fetch('demo.html')
    .then(response => response.text())
    .then(template => {
      const html = replaceVariables(template, data);
  
      // Mostrar el resultado en un elemento con el id 'result'
      document.getElementById('result').innerHTML = html;
    })
    .catch(error => {
      console.error('Error al cargar la plantilla:', error);
    });
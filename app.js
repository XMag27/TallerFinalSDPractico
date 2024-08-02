// app.js

// Configura AWS S3
AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    sessionToken:"",
    region: "",
  });
fetch("https://jokq6wmiwb.execute-api.us-east-1.amazonaws.com/default/envioFormulario?TableName=taller_magallanes_herrera")
    .then(response => response.json())
    .then(data => {
        const registradosDiv = document.getElementById("Registrados");
        data.Items.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card");

            const cedula = document.createElement("p");
            cedula.textContent = `Cedula: ${item.cedula}`;

            const nombre = document.createElement("p");
            nombre.textContent = `Nombre: ${item.nombre}`;

            const apellido = document.createElement("p");
            apellido.textContent = `Apellido: ${item.apellido}`;

            const correo = document.createElement("p");
            correo.textContent = `Correo: ${item.correo}`;

            const url = document.createElement("p");
            url.textContent = `URL: ${item.url}`;

            card.appendChild(cedula);
            card.appendChild(nombre);
            card.appendChild(apellido);
            card.appendChild(correo);
            card.appendChild(url);

            registradosDiv.appendChild(card);
        });
    });

  const tableName = "taller_magallanes_herrera";
  const s3 = new AWS.S3();
  const bucketName = "tallerfinals3finalisimo";
  var bucketurl;
  
  // FunciÃ³n para subir archivos
  document.getElementById("sendPhoto").addEventListener("click", () => {
    const files = document.getElementById("foto").files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const params = {
        Bucket: bucketName,
        Key: file.name,
        Body: file,
        ACL: "public-read", // Para hacer las imÃ¡genes pÃºblicamente accesibles
      };
  
      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error subiendo el archivo:", err);
        } else {
          console.log("Archivo subido con Ã©xito:", data.Location);
            bucketurl = data.Location;
        }
      });
    }
  });
  
    document.getElementById("loginform").addEventListener("submit", function(event){
        event.preventDefault();
        var cedula = document.getElementById("cedula").value;
        var nombres = document.getElementById("nombres").value;
        var apellidos = document.getElementById("apellidos").value;
        var correo = document.getElementById("correo").value;
        var url = "test.com/holi"

        var apiurl = "https://jokq6wmiwb.execute-api.us-east-1.amazonaws.com/default/envioFormulario";
        
        var form = JSON.stringify({
            TableName: tableName,
            Item: {
                cedula: cedula,
                nombre: nombres,
                apellido: apellidos,
                correo: correo,
                url: bucketurl
            }
        });

        fetch(apiurl, {
            method: "POST",
            body: form
        }).then(response => response.json())
        .then(data => {
            console.log(data);
        });
    });
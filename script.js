/* ===========================
          MQTT CONFIG
=========================== */
const broker = "wss://aa9c972896c34ce58762b2d6763a3355.s1.eu.hivemq.cloud:8884/mqtt";

const options = {
  username: "esp32_user",
  password: "esp32_pasS",
  clean: true,
  reconnectPeriod: 2000,
  connectTimeout: 4000,
};

const client = mqtt.connect(broker, options);

client.on("connect", () => {
  console.log("MQTT conectado!");
  client.subscribe("invernadero/data");
});

/* ===========================
        RECIBIR DATA
=========================== */
client.on("message", (topic, msg) => {
  try {
    let j = JSON.parse(msg.toString());

    update("tBig", j.temp);
    updateBar("tBar", j.temp, 0, 40);

    update("hBig", j.hum);
    updateBar("hBar", j.hum, 0, 100);

    update("sBig", j.suelo);
    updateBar("sBar", j.suelo, 0, 100);

    update("nBig", j.nivel);
    updateBar("nBar", j.nivel, 0, 20);

  } catch(e){
    console.log("JSON ERROR:", e);
  }
});

/* ===========================
        FUNCIONES
=========================== */
function update(id, val){
  document.getElementById(id).textContent = val;
}

function updateBar(id, val, min, max){
  let pct = Math.max(0, Math.min(100, (val-min)/(max-min)*100));
  document.getElementById(id).style.width = pct + "%";
}

/* ===========================
       ENVIAR COMANDOS
=========================== */
function send(dev, val){
  let obj = { device: dev, value: val };
  client.publish("invernadero/ctrl", JSON.stringify(obj));
}

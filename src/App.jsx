import { useState, useEffect } from "react";
import "./App.css";
import correct from "./assets/check.svg";
import incorrect from "./assets/x.svg";
import Auth from "./Login-Register.jsx";
import Old from "./Old.jsx";
import rolex from "./assets/history.svg";
import url from "./ruta.js";

const urlPeticiones = url;
console.log(urlPeticiones);
/// NUMERO AL AZAR "let random = Math.floor(Math.random()* (129 - 0) + 0)"

/// UNIR ARRAY arrayName.join('')

/// CONVERTIR BINARIO EN NUMERO parseInt(numeroBinario, 2)
localStorage.setItem("usuario", "");
localStorage.removeItem("FK");
const CajitaNumber = ({ children, upDateTable, index }) => {
  const handleclick = () => {
    upDateTable(index);
  };
  return (
    <span onClick={handleclick} className="cubito">
      {children}
    </span>
  );
};
const CajitaList = ({ binario, caso, index, largo, number }) => {
  document.getElementById("listaCaso").scrollTop =
    -document.getElementById("listaCaso").scrollHeight;
  return (
    <li className={`itemResultado ${index == largo ? "primero" : ""}`}>
      <span className="aleatorio">{number}</span>
      <span className="resultadoBin">
        {binario.map((e, index) => (
          <span className="binarioNum" key={index}>
            {e}
          </span>
        ))}
      </span>
      <span
        className={`resultadoCaso ${caso == "x" ? "incorrect" : "correct"}`}
      >
        <img src={caso == "x" ? incorrect : correct} />
      </span>
    </li>
  );
};
const Historial = ({ number, binario, caso }) => {
  return (
    <li className={`itemResultado historial`}>
      <span className="aleatorio">{number}</span>
      <span className="resultadoBin">{binario}</span>
      <span
        className={`resultadoCaso ${caso == "x" ? "incorrect" : "correct"}`}
      >
        <img src={caso == "x" ? incorrect : correct} />
      </span>
    </li>
  );
};
function App() {
  const [forceRefresh, setForceRefresh] = useState(false);
  const [logReg, setLogReg] = useState("log");
  const [table, setTable] = useState(Array(8).fill(0));
  const [listTable, setList] = useState([]);
  const [random, setRandom] = useState(
    Math.floor(Math.random() * (129 - 0) + 0)
  );
  const [viejo, setViejo] = useState("");
  const [mostrarHistory, setMostrarHistory] = useState(false);

  async function historial() {
    setMostrarHistory(mostrarHistory == true ? false : true);
    const buscar = localStorage.getItem("usuario");
    const res = await fetch(
      `${urlPeticiones}/api/historial?usuario=${encodeURIComponent(buscar)}`
    );
    const resJson = await res.json();
    setViejo(resJson);
  }
  const subir = (bin, cas) => {
    fetch(`${urlPeticiones}/api/subir`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: localStorage.getItem("usuario"),
        number: random,
        binario: bin,
        caso: cas,
        id_usuario: localStorage.getItem("FK"),
      }),
    });
  };
  useEffect(() => {
    setRandom(Math.floor(Math.random() * (129 - 0) + 0));
    setForceRefresh((prev) => !prev);
    setTable(Array(8).fill(0));
  }, [listTable]);
  const comprobar = (binario) => {
    setForceRefresh((prev) => !prev);
    parseInt(binario, 2) === random
      ? setList([...listTable, { azar: random, numero: table, caso: "o" }])
      : setList([...listTable, { azar: random, numero: table, caso: "x" }]);
    parseInt(binario, 2) === random ? subir(binario, "o") : subir(binario, "x");
  };
  const upDateTable = (index) => {
    let newTable = [...table];
    newTable[index] =
      newTable[index] === 0 ? (newTable[index] = 1) : (newTable[index] = 0);
    setTable(newTable);
  };
  const close = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("FK");
    window.location.reload();
  };
  return (
    <>
      <header id="headerBody">
        <h1>Numero binario</h1> <span id="saludarUser"></span>
        <button
          id="closeBtn"
          onClick={() => {
            close();
          }}
        >
          Cerrar sesion
        </button>
        <button
          id="historyBtn"
          onClick={() => {
            historial();
          }}
        >
          <img src={rolex} />
        </button>
      </header>
      <div
        id="backgroundModal"
        className={`${localStorage.getItem("usuario") ? "" : "active"}`}
      >
        <section id="modalUser">
          {!localStorage.getItem("usuario") ? (
            logReg == "log" ? (
              <Auth.Login />
            ) : (
              <Auth.Register />
            )
          ) : (
            ""
          )}
          <button
            id="btnCambio"
            onClick={() =>
              logReg == "log" ? setLogReg("reg") : setLogReg("log")
            }
          >
            {logReg == "log"
              ? "¿No tienes cuenta? Registrate ahora"
              : "¿Ya tienes cuenta? Incia sesion ahora"}
          </button>
        </section>
      </div>
      <h2 id="ranTittle">Calcula el siguiente numero: {random}</h2>
      <div id="numerosEntBin">
        <span className="numerosEnteros-child">128</span>
        <span className="numerosEnteros-child">64</span>
        <span className="numerosEnteros-child">32</span>
        <span className="numerosEnteros-child">16</span>
        <span className="numerosEnteros-child">8</span>
        <span className="numerosEnteros-child">4</span>
        <span className="numerosEnteros-child">2</span>
        <span className="numerosEnteros-child">1</span>
        {table.map((valor, index) => {
          return (
            <CajitaNumber
              key={index}
              index={index}
              children={table[index]}
              upDateTable={upDateTable}
            />
          );
        })}
      </div>
      <button onClick={() => comprobar(table.join(""))}>Comprobar</button>
      <div id="lateral">
        <h2>Resultados</h2>
        <section id="listaCaso">
          {listTable == ""
            ? "no hay nada :("
            : listTable.map((valor, index) => {
                return (
                  <CajitaList
                    key={index}
                    largo={listTable.length - 1}
                    index={index}
                    number={valor.azar}
                    binario={valor.numero}
                    caso={valor.caso}
                  />
                );
              })}
        </section>
      </div>
      <Old forceRefresh={forceRefresh} />
      <div className={`conteinerHistorial ${mostrarHistory ? "active" : ""}`}>
        <h3>historial</h3>
        <section id="conteinerHistorial-caja">
          {viejo == ""
            ? ""
            : viejo.map((valor, index) => {
                return (
                  <Historial
                    key={index}
                    index={index}
                    number={valor.number}
                    binario={valor.binario}
                    caso={valor.caso}
                  />
                );
              })}
        </section>
      </div>
    </>
  );
}

export default App;

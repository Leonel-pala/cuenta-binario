import React, { useEffect, useState } from "react";
import eyes from "./assets/eye.svg";
import eyesOff from "./assets/eye-off.svg";
import url from "./ruta.js";
const urlPeticiones = url;
let jugadores;

const recargar = (x) => {
  function getUser() {
    return fetch(`${urlPeticiones}/auth/user`)
      .then((res) => res.json())
      .then((resJson) => resJson);
  }
  getUser().then((resultado) => {
    jugadores = resultado;
    if (x != undefined && x != null) {
      const llave = resultado.find((lol) => lol.nombre == x);
      localStorage.setItem("FK", parseFloat(llave.Id));
      localStorage.setItem("usuario", x);
      document.getElementById("backgroundModal").classList.remove("active");
      document.getElementById("saludarUser").innerText = `Hola ${x}!`;
    }
  });
};

const auth = (usuario) => {
  if (usuario != "") {
    recargar(usuario);
  }
};
function Login() {
  const [fallo, setFallo] = useState("");
  const [ver, setVer] = useState("nover");
  useEffect(() => {
    const formLogin = document.querySelector("#formLogin");
    const handleSubmit = (e) => {
      e.preventDefault();
      const valor = e.target.children;
      const verificar = jugadores.find(
        (usuario) => usuario.nombre === valor.user.value.trim()
      );
      if (valor.user.value.trim() != "" && valor.password.value.trim() != "") {
        if (verificar != undefined) {
          if (verificar.contraseña == valor.password.value) {
            auth(valor.user.value);
          } else {
            setFallo("Contraseña incorrecta");
          }
        } else {
          setFallo("El usuario no existe");
        }
      } else {
        setFallo("Rellena todos los campos");
      }
    };

    formLogin.addEventListener("submit", handleSubmit);
    return () => {
      formLogin.removeEventListener("submit", handleSubmit);
    };
  }, []);

  return (
    <>
      <form id="formLogin">
        <h2>Iniciar Sesion</h2>
        <label htmlFor="user">Nombre</label>
        <input type="text" placeholder="nombre de usuario" id="user" />
        <label htmlFor="password">
          <span>Contraseña </span>
          <img
            id="eyes"
            src={ver == "ver" ? eyes : eyesOff}
            onClick={() => (ver == "ver" ? setVer("nover") : setVer("ver"))}
          ></img>
        </label>
        <input
          type={ver == "ver" ? "text" : "password"}
          placeholder="password"
          id="password"
        />
        <span id="cartelAdvertencia" className={fallo == "" ? "" : "mostrar"}>
          {fallo}
        </span>
        <button type="submit" id="sendLogin">
          Iniciar sesion
        </button>
      </form>
    </>
  );
}

recargar();
function Register() {
  const [fallo, setFallo] = useState("");
  const [ver, setVer] = useState("nover");

  useEffect(() => {
    const formSignUp = document.querySelector("#formSignUp");
    const handleSubmit = async (e) => {
      e.preventDefault();

      const valor = e.target.children;
      const verificar = jugadores.find(
        (usuario) => usuario.nombre === valor.user.value.trim()
      );
      recargar();
      if (valor.password.value.trim() != "" && valor.user.value.trim() != "") {
        if (verificar == undefined) {
          if (
            valor.confirmPassword.value.trim() == valor.password.value.trim()
          ) {
            enviar(valor);
            auth(valor.user.value);
          } else {
            setFallo("La contraseña no coincide");
          }
        } else {
          setFallo("El usuario ya existe");
        }
      } else {
        setFallo("Rellena todos los campos");
      }
    };

    formSignUp.addEventListener("submit", handleSubmit);
    return () => {
      formSignUp.removeEventListener("submit", handleSubmit);
    };
  }, []);

  return (
    <>
      <form id="formSignUp">
        <h2>Registrarse</h2>
        <label htmlFor="user">Nombre</label>
        <input type="text" placeholder="nombre de usuario" id="user" />
        <label htmlFor="password">
          <span>Contraseña </span>
          <img
            id="eyes"
            src={ver == "ver" ? eyes : eyesOff}
            onClick={() => (ver == "ver" ? setVer("nover") : setVer("ver"))}
          ></img>
        </label>
        <input
          type={ver == "ver" ? "text" : "password"}
          placeholder="Contraseña"
          id="password"
        />
        <label htmlFor="confirmPassword">Confirmar contraseña</label>
        <input
          type={ver == "ver" ? "text" : "password"}
          placeholder="Confirmar contraseña"
          id="confirmPassword"
        />
        <span id="cartelAdvertencia" className={fallo == "" ? "" : "mostrar"}>
          {fallo}
        </span>
        <button type="submit" id="sendSignUp">
          Registrarse
        </button>
      </form>
    </>
  );
}

export default { Login, Register };
<button
  onClick={() => auth(document.getElementById("modalUser-input").value.trim())}
>
  Iniciar
</button>;

const enviar = async (lista) => {
  const res = await fetch(`${urlPeticiones}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: lista.user.value,
      password: lista.password.value,
    }),
  });
};

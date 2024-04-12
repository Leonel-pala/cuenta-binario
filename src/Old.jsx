import React, { useState, useEffect } from "react";
import { getTop } from "./lista.js";
import "./score.css";
import correct from "./assets/check.svg";
import incorrect from "./assets/x.svg";
function Old({ forceRefresh }) {
  const [scoreList, setScoreList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const scores = await getTop();
        console.log("Lista cargada con exito");
        setScoreList(scores);
      } catch (error) {
        console.error("Error al obtener la lista de puntajes:", error);
      }
    };
    fetchData();
  }, [forceRefresh]);
  return (
    <>
      <div id="score">
        <h2>Top jugadores</h2>
        <table id="conteinerDatoOld">
          <tr className="topListHead">
            <th>Top</th>
            <th className="nombre">Nombre</th>
            <th>
              <img src={correct} className="correct" />
            </th>
            <th>
              <img src={incorrect} className="incorrect" />
            </th>
            <th>Pts</th>
          </tr>
          {scoreList.map((score, id) => (
            <tr className="topList" key={id}>
              <td>{id + 1}</td>
              <td className="nombre">{score.user}</td>
              <td>{score.correct}</td>
              <td>{score.incorrect}</td>
              <td>{score.top}</td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}
export default Old;

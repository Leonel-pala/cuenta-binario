import url from "./ruta.js";
const urlPeticiones = url;
export async function getTop() {
  const res = await fetch(`${urlPeticiones}/score`);
  const resJson = await res.json();
  return resJson;
}

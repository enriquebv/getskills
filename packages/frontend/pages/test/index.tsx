import { testPetition } from "infrastructure/api";

export default function Test() {
  function sendPetition() {
    testPetition();
  }

  return (
    <div>
      <button onClick={sendPetition}>Prueba</button>
    </div>
  );
}

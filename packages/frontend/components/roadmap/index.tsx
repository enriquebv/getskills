export default function Roadmap() {
  return (
    <>
      <h2>Roadmap</h2>
      <em>Updated: 25-03-2021, version 1.0.0-alpha</em>

      <p>
        GetSkills.live is a project created to provide professional and quality
        tools to streamers, to help them create new viewing experiences, in a
        simple and user-friendly way.
      </p>

      <h3>Completed</h3>

      <label>
        <ul>
          <li>
            <input type="checkbox" readOnly checked /> Design and develop the
            application base (backend & frontend).
          </li>
          <li>
            <input type="checkbox" readOnly checked /> Twitch Sign-in.
          </li>
          <li>
            <input type="checkbox" readOnly checked /> Channel Points Giveaway
            MVP.
          </li>
        </ul>
      </label>

      <h3>Current objectives</h3>
      <em>Next version will be 1.1.0-alpha</em>

      <br />
      <br />

      <li>
        <input type="checkbox" readOnly checked={false} /> Add options to{" "}
        <em>Channel Points Giveaway MVP</em>.
      </li>
      <li>
        <input type="checkbox" readOnly checked={false} /> Bits Giveaway MVP.
      </li>
      <li>
        <input type="checkbox" readOnly checked={false} /> Random Loots when
        viewers redeem Channel Points or Bits.
      </li>

      <h2></h2>
    </>
  );
}

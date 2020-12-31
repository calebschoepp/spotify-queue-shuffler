import React, { useState } from "react";
import Shuffler from "./Shuffler";
import BuyMeACoffee from "./BuyMeACoffee";
import Help from "./Help";

// TODO remove this link
// https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6
// https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow

function App() {
  return (
    <div>
      <h1 className="text-2xl">Spotify Queue Shuffler</h1>
      <Shuffler />
      <BuyMeACoffee />
      <Help />
    </div>
  );
}

export default App;

import React, { useState } from "react";
import Shuffler from "./Shuffler";
import BuyMeACoffee from "./BuyMeACoffee";
import Help from "./Help";

// TODO remove this link
// https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6
// https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow

function App() {
  // State
  const [accessToken, setAccessToken] = useState(null);

  // TODO use cookie to check if it is the first time
  return (
    <div>
      <h1 className="text-2xl">Spotify Queue Shuffler</h1>
      <Shuffler hasAuthenticatedBefore={false} accessToken={accessToken} />
      <BuyMeACoffee />
      <Help />
    </div>
  );
}

export default App;

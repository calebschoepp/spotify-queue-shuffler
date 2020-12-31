import React, { useState } from "react";
import Shuffler from "./Shuffler";
import BuyMeACoffee from "./BuyMeACoffee";
import Help from "./Help";

// TODO remove this link
// https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6
// https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow

function App() {
  // State
  const [accessToken, setAccessToken] = useState(
    "BQB1DSAl0i7OVK_06dca7j2CuzT1mfTDx-zjXLE9Sj6f8GTNHKZGryfh0vi8EVDiK4RQ7xEa8wU8led4VKt4deNRlldJvqPwKh3J_g11fJz_CNf0NlxdeMpzaLH2ID54HU-b6zAwtG6jDsMvSvnH9KAPqjzUiKM"
  );

  // TODO use cookie to check if it is the first time
  return (
    <div>
      <h1 className="text-2xl">Spotify Queue Shuffler</h1>
      <Shuffler accessToken={accessToken} />
      <BuyMeACoffee />
      <Help />
    </div>
  );
}

export default App;

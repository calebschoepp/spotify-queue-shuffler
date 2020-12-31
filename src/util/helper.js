function parseHash(hash) {
  // Returns [isValid, state, token]
  const tokenRegex = /#access_token=([^&]*)/;
  const tokenFound = hash.match(tokenRegex);
  if (!tokenFound) {
    return [false, null, null];
  }

  const stateRegex = /&state=([^&]*)/;
  const stateFound = hash.match(stateRegex);
  if (!stateFound) {
    return [false, null, null];
  }

  return [true, stateFound[1], tokenFound[1]];
}

function parseSearch(search) {
  // Returns [isValid, state, error]
  const errorRegex = /\?error=([^&]*)/;
  const errorFound = search.match(errorRegex);
  if (!errorFound) {
    return [false, null, null];
  }

  const stateRegex = /&state=([^&]*)/;
  const stateFound = search.match(stateRegex);
  if (!stateFound) {
    return [false, null, null];
  }

  return [true, stateFound[1], errorFound[1]];
}

function randNonce(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export { parseHash, parseSearch, randNonce };

import { parseHash, parseSearch, randNonce } from "./helper";

test("that parseHash handles happy-path", () => {
  const input =
    "#access_token=BQCsfZC7lt7dVyiwoPm29R0MmfGX1C5Nt9gl6IlrBqf76AcpM0g8P5fip3SRu7ITURwfKV-zwtNKP821C6m4X0vGPc2YsT8xJet6brqRWUqm4YAFBjjYQlqpYkYlZS57s6NuNe8mntPHGOA7THCM8fKHLF274yU&token_type=Bearer&expires_in=3600&state=123";
  const correctToken =
    "BQCsfZC7lt7dVyiwoPm29R0MmfGX1C5Nt9gl6IlrBqf76AcpM0g8P5fip3SRu7ITURwfKV-zwtNKP821C6m4X0vGPc2YsT8xJet6brqRWUqm4YAFBjjYQlqpYkYlZS57s6NuNe8mntPHGOA7THCM8fKHLF274yU";
  const [isValid, state, token] = parseHash(input);
  expect(isValid).toEqual(true);
  expect(state).toEqual("123");
  expect(token).toEqual(correctToken);
});

test("that parseHash handles almost happy-path", () => {
  const input =
    "#access_tokenBQCsfZC7lt7dVyiwoPm29R0MmfGX1C5Nt9gl6IlrBqf76AcpM0g8P5fip3SRu7ITURwfKV-zwtNKP821C6m4X0vGPc2YsT8xJet6brqRWUqm4YAFBjjYQlqpYkYlZS57s6NuNe8mntPHGOA7THCM8fKHLF274yU&token_type=Bearer&expires_in=3600&state=123";
  const [isValid, state, token] = parseHash(input);
  expect(isValid).toEqual(false);
});

test("that parseHash handles completely invalid input", () => {
  const input = "#aYsT8xJet6qRWUqm4YAFse=123";
  const [isValid, state, token] = parseHash(input);
  expect(isValid).toEqual(false);
});

test("that parseSearch handles happy-path", () => {
  const input = "?error=access_denied&state=13982329";
  const correctError = "access_denied";
  const [isValid, state, error] = parseSearch(input);
  expect(isValid).toEqual(true);
  expect(state).toEqual("13982329");
  expect(error).toEqual(correctError);
});

test("that parseSearch handles almost happy-path", () => {
  const input = "?error=access_deniedstate=13982329";
  const [isValid, state, token] = parseSearch(input);
  expect(isValid).toEqual(false);
});

test("that parseSearch handles completely invalid input", () => {
  const input = "sta82329";
  const [isValid, state, token] = parseSearch(input);
  expect(isValid).toEqual(false);
});

test("that randomNonce returns correct length", () => {
  const rand = randNonce(10);
  expect(rand.length).toEqual(10);
});

test("that randomNonce returns random values", () => {
  const randA = randNonce(10);
  const randB = randNonce(10);
  expect(randA).not.toEqual(randB);
});

import React, { useState } from "react";
import Modal from "react-modal";

try {
  Modal.setAppElement("#root");
} catch (error) {}

function Help() {
  const [showModal, setShowModal] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "640px",
    },
  };

  return (
    <>
      <img
        src="/Help.png"
        alt="Help"
        width="50"
        height="50"
        className="m-4"
        onClick={() => setShowModal(true)}
      />
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button
          className="absolute top-0 right-0 mt-4 mr-4"
          onClick={() => setShowModal(false)}
        >
          <img src="Close.svg" alt="X" />
        </button>
        <h2 className="font-header font-bold text-xl">
          Doesn't Spotify already shuffle songs?
        </h2>
        <p className="font-body text-offblack">
          Yes it does, but only for playlists or albums. This app is useful when
          you want to shuffle the songs you have lined up in your queue.
        </p>

        <h2 className="font-header font-bold text-xl mt-2">
          How does this work?
        </h2>
        <p className="font-body text-offblack">
          First, the app removes all of the songs from your queue. Then it
          shuffles them and adds them back. This is all done very quickly but
          you'll often hear bits of songs playing as the app works.
        </p>

        <h2 className="font-header font-bold text-xl mt-2">
          Do I need to login with Spotify?
        </h2>
        <p className="font-body text-offblack">
          Yes. However, only the required permissions are requested and no
          private information is accessed.
        </p>

        <h2 className="font-header font-bold text-xl mt-2">
          How much does this cost?
        </h2>
        <p className="font-body text-offblack">
          It's completely free! Feel free to{" "}
          <a
            className="text-spotifygreen underline"
            href="https://buymeacoffee.com/calebschoepp"
          >
            buy me a coffee
          </a>{" "}
          though.
        </p>

        <h2 className="font-header font-bold text-xl mt-2">Who made this?</h2>
        <p className="font-body text-offblack">
          This was made by{" "}
          <a
            className="text-spotifygreen underline"
            href="https://calebschoepp.com"
          >
            Caleb Schoepp
          </a>
        </p>
      </Modal>
    </>
  );
}

export default Help;

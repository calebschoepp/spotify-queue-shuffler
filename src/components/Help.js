import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

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
          Doesn't Spotify already shuffle?
        </h2>
        <p className="font-body text-offblack">
          Yes it does, but only for things like playlists or albums. This is
          useful when you want to listen to the songs you have queued up in a
          different order.
        </p>

        <h2 className="font-header font-bold text-xl mt-2">
          How does this work?
        </h2>
        <p className="font-body text-offblack">
          This works by skipping through and recording all of the songs in your
          queue and then subsequently re-adding them to the queue in a shuffled
          order.
        </p>

        <h2 className="font-header font-bold text-xl mt-2">
          Must I login with Spotify?
        </h2>
        <p className="font-body text-offblack">
          Yes, without doing so your queue cannot be shuffled. However, only the
          required permissions are requested and no private information is
          accessed.
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

import React, { useState } from "react";
import { Modal, Button, Checkbox } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function ChooseSitePopup() {
  const [opened, setOpened] = useState(true);
  const [rememberSelection, setRememberSelection] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Choose Viewing Experience"
        trapFocus={false}
      >
        <Button
          onClick={() => setOpened(false)}
          fullWidth
          mb={10}
          autoFocus={false}
          styles={{
            root: {
              height: "auto",
              whiteSpace: "normal",
              padding: "12px",
            },
            label: {
              whiteSpace: "normal",
              lineHeight: 1.4,
            },
          }}
        >
          Interactive, visual layout
        </Button>
        <Button
          onClick={() => navigate("/plaintext")}
          fullWidth
          mb={10}
          autoFocus={false}
          styles={{
            root: {
              height: "auto",
              whiteSpace: "normal",
              padding: "12px",
            },
            label: {
              whiteSpace: "normal",
              lineHeight: 1.4,
            },
          }}
        >
          Informative, plaintext layout
        </Button>
        <Checkbox
          label="Remember choice"
          checked={rememberSelection}
          onChange={(event) =>
            setRememberSelection(event.currentTarget.checked)
          }
        />
      </Modal>
    </>
  );
}

import React, { useState } from "react";
import { Modal, Button, Checkbox } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../utils/appContext";
import { AppViews } from "../utils/types";

export default function ChooseSitePopup() {
  // Constants and helpers
  const {
    appInformation: appInformation,
    setAppInformation: setAppInformation,
  } = useAppContext();
  const [rememberSelection, setRememberSelection] = useState(false);
  const [selectedView, setSelectedView] = useState<AppViews>(undefined);
  const navigate = useNavigate();

  const handleClose = () => {
    if (rememberSelection) {
      setAppInformation({
        isViewingSelectOpen: false,
        defaultView: selectedView,
      });
    } else {
      setAppInformation({
        isViewingSelectOpen: false,
        defaultView: selectedView,
      });
    }
  };

  // Redirect on page load if applicable
  if (appInformation.defaultView == "plaintext") {
    navigate("/plaintext");
  }

  return (
    <>
      <Modal
        opened={appInformation.isViewingSelectOpen}
        onClose={handleClose}
        title="Choose Viewing Experience"
        trapFocus={false}
      >
        <Button
          onClick={() => {
            setSelectedView("interactive");
            handleClose();
          }}
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
          Interactive, Visual Layout
        </Button>
        <Button
          onClick={() => {
            setSelectedView("plaintext");
            navigate("/plaintext");
          }}
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
          Informative, Plaintext Layout
        </Button>
        <Checkbox
          label="Remember Viewing Selection"
          checked={rememberSelection}
          onChange={(event) =>
            setRememberSelection(event.currentTarget.checked)
          }
        />
      </Modal>
    </>
  );
}

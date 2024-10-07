import React, { useState } from "react";
import { Modal, Button, Checkbox } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../utils/appContext";
import { AppViews } from "../utils/types";

export default function ChooseSitePopup() {
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
        ...appInformation,
        isViewingSelectOpen: false,
      });
    }
  };

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
            handleClose;
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
          Interactive, visual layout
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

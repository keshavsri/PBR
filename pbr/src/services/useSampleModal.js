import * as React from "react";
const SampleModalContext = React.createContext();

export function useSampleModal() {
  const [payload, setPayload] = React.useState({});
  const [visibility, setVisibility] = React.useState(false);

  React.useEffect(() => {}, []);

  let openModal = () => {
    setVisibility(true);
  };

  let closeModal = () => {
    setVisibility(false);
  };

  const [nextButtonAction, setNextButtonAction] = React.useState(closeModal());
  const [prevButtonAction, setPrevButtonAction] = React.useState(closeModal());

  return {
    payload,
    setPayload,
    visibility,
    openModal,
    closeModal,
    nextButtonAction,
    prevButtonAction,
    setNextButtonAction,
    setPrevButtonAction,
  };
}

export function SampleModalProvider({ children }) {
  const sampleModal = useSampleModal();

  return (
    <SampleModalContext.Provider value={sampleModal}>
      {children}
    </SampleModalContext.Provider>
  );
}

export default function SampleModalConsumer() {
  return React.useContext(SampleModalContext);
}

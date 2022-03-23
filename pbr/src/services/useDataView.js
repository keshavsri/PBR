import * as React from "react";
const DataViewContext = React.createContext();

export function useDataView() {
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

export function DataViewProvider({ children }) {
  const dataview = useDataView();

  return (
    <DataViewContext.Provider value={dataview}>
      {children}
    </DataViewContext.Provider>
  );
}

export default function DataViewConsumer() {
  return React.useContext(DataViewContext);
}

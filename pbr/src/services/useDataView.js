import * as React from "react";

const DataViewContext = React.createContext();

export function useDataView() {
  const [samplePayload, setSamplePayload] = React.useState({});
  const [sampleModalVisibility, setSampleModalVisibility] =
    React.useState(false);
  const [sampleModalScreen, setSampleModalScreen] = React.useState(0);
  const [error, setError] = React.useState({});
  const [timestamp, setTimestamp] = React.useState(Date.now());

  const [generalDetails, setGeneralDetails] = React.useState({
    organizationID: "",
    flockName: "",
    species: "",
    strain: "",
    gender: "",
    sourceID: "",
    productionType: "",
    ageNumber: "",
    ageUnit: "",
    flagged: false,
    comments: "",
  });
  const [machineDetails, setMachineDetails] = React.useState([]);

  let openSampleModal = () => {
    setSampleModalVisibility(true);
  };

  let closeSampleModal = () => {
    setSampleModalScreen(0);
    setGeneralDetails({
      organizationID: "",
      flockName: "",
      species: "",
      strain: "",
      gender: "",
      sourceID: "",
      productionType: "",
      ageNumber: "",
      ageUnit: "",
      flagged: false,
      comments: "",
    });
    setSamplePayload({});
    setSampleModalVisibility(false);
  };

  let samplePrevAction = () => {
    if (sampleModalScreen > 0) {
      setSampleModalScreen(sampleModalScreen - 1);
    } else {
      closeSampleModal();
    }
  };

  let sampleNextAction = () => {
    setSampleModalScreen(sampleModalScreen + 1);
  };

  let restartSample = () => {
    setSampleModalScreen(0);
    setSamplePayload({});
    setError({});
  };

  React.useEffect(() => {
    console.log("useDataView useEffect");
    // Keep the timestamp live
    setInterval(() => {
      setTimestamp(Date.now());
    }, 1000);
  }, []);

  return {
    samplePayload,
    setSamplePayload,
    generalDetails,
    setGeneralDetails,
    machineDetails,
    setMachineDetails,
    sampleModalVisibility,
    sampleModalScreen,
    setSampleModalScreen,
    openSampleModal,
    closeSampleModal,
    samplePrevAction,
    sampleNextAction,
    error,
    setError,
    restartSample,
    timestamp,
    setTimestamp,
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

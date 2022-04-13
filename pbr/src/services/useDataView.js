import * as React from "react";

const DataViewContext = React.createContext();

export function useDataView() {
  const [sampleLoading, setSampleLoading] = React.useState(false);
  const [samplePayload, setSamplePayload] = React.useState({});
  const [sampleModalVisibility, setSampleModalVisibility] =
    React.useState(false);
  const [sampleModalScreen, setSampleModalScreen] = React.useState(0);
  const [sampleValidationErrors, setSampleValidationErrors] = React.useState(
    {}
  );
  const [error, setError] = React.useState({});
  const [timestamp, setTimestamp] = React.useState(Date.now());
  React.useState(false);

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
  const [sampleType, setSampleType] = React.useState("");

  let openSampleModal = () => {
    setSampleModalVisibility(true);
  };

  let closeSampleModal = () => {
    console.log("Closing Sample Modal");
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
    setMachineDetails([]);
    setSamplePayload({});
    setSampleValidationErrors({});
    setSampleType("");
    setSampleModalVisibility(false);
    setSampleModalScreen(0);
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
    setGeneralDetails({
      organizationID: generalDetails.organizationID,
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
    setMachineDetails([]);
    setSamplePayload({});
    setSampleValidationErrors({});
    setSampleType("");
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
    sampleValidationErrors,
    setSampleValidationErrors,
    sampleType,
    setSampleType,
    sampleLoading,
    setSampleLoading,
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

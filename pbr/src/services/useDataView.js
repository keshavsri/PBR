import * as React from "react";

const DataViewContext = React.createContext();

function useCreateDataView() {
  const [sampleLoading, setSampleLoading] = React.useState(false);
  const [samplePayload, setSamplePayload] = React.useState({});
  const [sampleModalVisibility, setSampleModalVisibility] =
    React.useState(false);
  const [openFilterModal, setOpenFilterModal] = React.useState(false);

  
  let handleOpenFilterModal = () => {
      setOpenFilterModal(true);
    };
  let handleCloseFilterModal = () => {
      setOpenFilterModal(false);
    };
  
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

  const [generalFilterState, setGeneralFilterState] = React.useState({
    flockID: "",
    species: "",
    strain: "",
    gender: "",
    ageRange: "",
    validationStatus: "",
    sampleType: "",
    batch: "",
    dataCollector: "",
    organizationID: "",
  });

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
      console.log("Go Back One Screen");
      setSampleModalScreen(sampleModalScreen - 1);
    } else {
      console.log("Cancel");
      closeSampleModal();
    }
  };

  let sampleNextAction = () => {
    console.log("Advancing to Next Screen");
    setSampleModalScreen(sampleModalScreen + 1);
  };

  let restartSample = () => {
    console.log("Sample Restarted");
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
    generalFilterState,
    setGeneralFilterState,
    openFilterModal, 
    setOpenFilterModal,
    handleOpenFilterModal,
    handleCloseFilterModal,
    sampleValidationErrors,
    setSampleValidationErrors,
    sampleType,
    setSampleModalVisibility,
    setSampleType,
    sampleLoading,
    setSampleLoading,
  };
}

export function DataViewProvider({ children }) {
  const dataview = useCreateDataView();

  return (
    <DataViewContext.Provider value={dataview}>
      {children}
    </DataViewContext.Provider>
  );
}

export function DataViewConsumer({ children }) {
  return (
    <DataViewContext.Consumer>
      {(context) => {
        return children(context);
      }}
    </DataViewContext.Consumer>
  );
}

export default function useDataView() {
  return React.useContext(DataViewContext);
}

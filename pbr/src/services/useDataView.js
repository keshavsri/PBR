import * as React from "react";
const DataViewContext = React.createContext();

export function useDataView() {
  const [samplePayload, setSamplePayload] = React.useState({});
  const [sampleModalVisibility, setSampleModalVisibility] =
    React.useState(false);
  const [openFilterModal, setOpenFilterModal] = React.useState(false);
  const handleOpenFilterModal = () => {
      setOpenFilterModal(true);
    };
  const handleCloseFilterModal = () => {
      setOpenFilterModal(false);
    };
  
  const [sampleModalScreen, setSampleModalScreen] = React.useState(0);
  const [error, setError] = React.useState({});
  const [timestamp, setTimestamp] = React.useState(Date.now());
  const [generalDetails, setGeneralDetails] = React.useState({
    organizationID: "",
    flockID: null,
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
    organiztion: "",
  });

  let openSampleModal = () => {
    setSampleModalVisibility(true);
  };

  let closeSampleModal = () => {
    setSampleModalScreen(0);
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

    // Get the current user's organization
    // await fetch(`/api/organization`, {
    //   method: "GET",
    // })
    //   .then(handleAPIResponse)
    //   .then((data) => {
    //     console.log(data);
    //     setSources(data);
    //   });
    let mockOrganization = {
      id: "1",
      name: "Organization A",
      street_address: "123 Main Street",
      city: "Raleigh",
      state: "NC",
      zip: "27606",
      default: "true",
    };
    setGeneralDetails({
      ...generalDetails,
      organization: mockOrganization,
    });
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
    handleCloseFilterModal  
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

// Stores the unit of recorded age
export const ageUnits = Object.freeze({
  DAYS: "Days",
  WEEKS: "Weeks",
  MONTHS: "Months",
  YEARS: "Years",
});

// Stores the choices for a bird's gender
export const genders = Object.freeze({
  MALE: "Male",
  FEMALE: "Female",
  MIXED: "Mixed",
  UNKNOWN: "Unknown",
});

// Stores the choices for a bird sample type
export const sampleTypes = Object.freeze({
  SURVEILLANCE: "Surveillance",
  DIAGNOSTIC: "Diagnostic",
});

// Stores the potential production types
export const productionTypes = Object.freeze({
  MEAT: "Meat",
  LAYER: "Layer",
  BREEDER: "Breeder",
  BROILER_BREEDER: "Broiler Breeder",
  BYP: "BYP",
});

// Stores the potential production types
export const speciesTypes = Object.freeze({
  CHICKEN: "Chicken",
  TURKEY: "Turkey",
});

// Stores the choices for a bird sample type
export const validationStates = Object.freeze({
  PENDING: "Pending",
  REJECTED: "Rejected",
  VALIDATED: "Validated",
});

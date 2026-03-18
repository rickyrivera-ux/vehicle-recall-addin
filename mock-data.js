// Mock fleet devices (simulating MyGeotab Device objects)
var MOCK_DEVICES = [
  { id: "b1", name: "Truck 101", vehicleIdentificationNumber: "1FTFW1ET5DFC10312" },
  { id: "b2", name: "Van 204", vehicleIdentificationNumber: "2C4RDGCG5HR621382" },
  { id: "b3", name: "Sedan 307", vehicleIdentificationNumber: "3FA6P0H77HR283051" },
  { id: "b4", name: "SUV 412", vehicleIdentificationNumber: "5UXWX7C5XBA123456" },
  { id: "b5", name: "Truck 518", vehicleIdentificationNumber: "1GCGG25K571234567" },
  { id: "b6", name: "Van 623", vehicleIdentificationNumber: "1FBSS31L07DA12345" },
  { id: "b7", name: "Sedan 715", vehicleIdentificationNumber: "WBANE53547CZ98765" },
  { id: "b8", name: "Pickup 802", vehicleIdentificationNumber: "3GCUKREC0JG123456" }
];

// Mock Recall Masters API v2 responses per VIN
// Field names match the official RM API v2 spec (SSDG 3.0, pages 16-19)
var MOCK_RECALLS = {
  "1FTFW1ET5DFC10312": {
    API_request_id: 100201,
    vin: "1FTFW1ET5DFC10312",
    model_year: 2013,
    make: "Ford",
    model_name: "F-150",
    last_updated: "2026-03-15",
    recall_count: 2,
    status: "ok",
    error_description: null,
    recalls: [
      {
        recall_id: 88412,
        recall_last_updated: "2026-01-10",
        recall_age: 2755,
        nhtsa_id: "17V622000",
        oem_id: "80C6",
        motc_id: null,
        government_id: "17V622000",
        name: "Auxiliary Heater",
        description: "Fire risk - Auxiliary heater electrical connector may overheat and melt",
        risk: "Melting wires may usually lead to an open circuit, but can also lead to overheating which can result in a fire.",
        remedy: "Replace the auxiliary heater and, for vehicles that have not yet had the software update performed, perform software update. This work will be performed free of charge.",
        campaign_type: "nhtsa",
        stop_sale: true,
        dont_drive: false,
        effective_date: "2017-10-05",
        expiration_date: null,
        is_remedy_available: true,
        are_parts_available: true,
        are_parts_limited: true,
        parts_number: "JL3Z-18K463-B",
        parts_description: "Auxiliary heater assembly with updated electrical connector",
        parts_available_date: null,
        risk_type: "fire",
        risk_rank: 5,
        profit_rank: 5,
        overall_rank: 5,
        labor_difficulty: 5,
        labor_min: 0.2,
        labor_max: 1.9,
        is_mobile_eligible: false,
        reimbursement: 288.80
      },
      {
        recall_id: 55201,
        recall_last_updated: "2025-12-01",
        recall_age: 890,
        nhtsa_id: "23V456000",
        oem_id: "23S42",
        motc_id: null,
        government_id: "23V456000",
        name: "Transmission Shift Cable",
        description: "Transmission shift cable bushing may detach from the shift cable, preventing transmission from shifting into intended gear.",
        risk: "If the transmission is not in the intended gear position, the vehicle may move in an unintended direction, increasing the risk of a crash.",
        remedy: "Dealers will replace the shift cable bushing, free of charge.",
        campaign_type: "nhtsa",
        stop_sale: false,
        dont_drive: false,
        effective_date: "2023-06-12",
        expiration_date: null,
        is_remedy_available: true,
        are_parts_available: true,
        are_parts_limited: false,
        parts_number: "ML3Z-7E395-A",
        parts_description: "Shift cable bushing kit",
        parts_available_date: null,
        risk_type: "collision",
        risk_rank: 3,
        profit_rank: 4,
        overall_rank: 3,
        labor_difficulty: 4,
        labor_min: 0.5,
        labor_max: 1.25,
        is_mobile_eligible: true,
        reimbursement: 190.00
      }
    ]
  },
  "2C4RDGCG5HR621382": {
    API_request_id: 100202,
    vin: "2C4RDGCG5HR621382",
    model_year: 2017,
    make: "Chrysler",
    model_name: "Pacifica",
    last_updated: "2026-03-14",
    recall_count: 1,
    status: "ok",
    error_description: null,
    recalls: [
      {
        recall_id: 10234,
        recall_last_updated: "2026-02-20",
        recall_age: 120,
        nhtsa_id: "25V100000",
        oem_id: "Z11",
        motc_id: "2025-045",
        government_id: "25V100000",
        name: "Hybrid Battery Pack",
        description: "Battery cells may short circuit internally, which can lead to thermal event.",
        risk: "An internal short circuit in the high-voltage battery can lead to a thermal event, increasing the risk of fire.",
        remedy: "Dealers will update the battery pack software and inspect the battery. If necessary, the battery pack will be replaced. This work will be performed free of charge.",
        campaign_type: "nhtsa",
        stop_sale: true,
        dont_drive: true,
        effective_date: "2025-11-18",
        expiration_date: null,
        is_remedy_available: true,
        are_parts_available: true,
        are_parts_limited: true,
        parts_number: "68492817AB, 68492818AB",
        parts_description: "High-voltage battery pack assembly and software calibration module",
        parts_available_date: "2026-06-01",
        risk_type: "fire",
        risk_rank: 5,
        profit_rank: 3,
        overall_rank: 5,
        labor_difficulty: 5,
        labor_min: 0.75,
        labor_max: 4.5,
        is_mobile_eligible: false,
        reimbursement: 684.00
      }
    ]
  },
  "3FA6P0H77HR283051": {
    API_request_id: 100203,
    vin: "3FA6P0H77HR283051",
    model_year: 2017,
    make: "Ford",
    model_name: "Fusion",
    last_updated: "2026-03-15",
    recall_count: 0,
    status: "ok",
    error_description: null,
    recalls: []
  },
  "5UXWX7C5XBA123456": {
    API_request_id: 100204,
    vin: "5UXWX7C5XBA123456",
    model_year: 2011,
    make: "BMW",
    model_name: "X3",
    last_updated: "2026-03-13",
    recall_count: 1,
    status: "ok",
    error_description: null,
    recalls: [
      {
        recall_id: 44100,
        recall_last_updated: "2025-11-05",
        recall_age: 450,
        nhtsa_id: "24V200000",
        oem_id: "BMW-24-01",
        motc_id: null,
        government_id: "24V200000",
        name: "Passenger Airbag Inflator",
        description: "Takata passenger frontal airbag inflator may explode during deployment due to propellant degradation.",
        risk: "An exploding inflator may result in sharp metal fragments striking the driver or other occupants, potentially causing serious injury or death.",
        remedy: "Dealers will replace the passenger frontal airbag inflator, free of charge.",
        campaign_type: "nhtsa",
        stop_sale: false,
        dont_drive: false,
        effective_date: "2024-08-22",
        expiration_date: null,
        is_remedy_available: true,
        are_parts_available: true,
        are_parts_limited: false,
        parts_number: "72-12-7-000-000",
        parts_description: "Passenger frontal airbag inflator module (non-Takata replacement)",
        parts_available_date: null,
        risk_type: "safety",
        risk_rank: 4,
        profit_rank: 3,
        overall_rank: 4,
        labor_difficulty: 4,
        labor_min: 1.0,
        labor_max: 2.5,
        is_mobile_eligible: false,
        reimbursement: 380.00
      }
    ]
  },
  "1GCGG25K571234567": {
    API_request_id: 100205,
    vin: "1GCGG25K571234567",
    model_year: 2007,
    make: "Chevrolet",
    model_name: "Express 2500",
    last_updated: "2026-03-12",
    recall_count: 2,
    status: "ok",
    error_description: null,
    recalls: [
      {
        recall_id: 33001,
        recall_last_updated: "2025-08-15",
        recall_age: 1380,
        nhtsa_id: "22V800000",
        oem_id: "N222333444",
        motc_id: null,
        government_id: "22V800000",
        name: "Fuel System / Fuel Lines",
        description: "Fuel feed and return lines may corrode and develop a fuel leak.",
        risk: "A fuel leak in the presence of an ignition source can increase the risk of a fire.",
        remedy: "Dealers will inspect the fuel feed and return lines, and replace them if necessary, free of charge.",
        campaign_type: "nhtsa",
        stop_sale: false,
        dont_drive: false,
        effective_date: "2022-10-01",
        expiration_date: null,
        is_remedy_available: true,
        are_parts_available: true,
        are_parts_limited: false,
        parts_number: "19206648, 19206649",
        parts_description: "Stainless steel fuel feed line and return line assembly",
        parts_available_date: null,
        risk_type: "fire",
        risk_rank: 4,
        profit_rank: 2,
        overall_rank: 4,
        labor_difficulty: 5,
        labor_min: 1.5,
        labor_max: 3.0,
        is_mobile_eligible: false,
        reimbursement: 456.00
      },
      {
        recall_id: 77400,
        recall_last_updated: "2024-06-20",
        recall_age: 1900,
        nhtsa_id: "21V100000",
        oem_id: "N212100100",
        motc_id: null,
        government_id: "21V100000",
        name: "Steering Intermediate Shaft",
        description: "Steering intermediate shaft may separate, resulting in a loss of steering control.",
        risk: "Loss of steering control increases the risk of a crash.",
        remedy: "Dealers will replace the steering intermediate shaft, free of charge.",
        campaign_type: "voluntary",
        stop_sale: false,
        dont_drive: false,
        effective_date: "2021-02-15",
        expiration_date: null,
        is_remedy_available: true,
        are_parts_available: true,
        are_parts_limited: false,
        parts_number: "84228019",
        parts_description: "Steering intermediate shaft assembly",
        parts_available_date: null,
        risk_type: "collision",
        risk_rank: 2,
        profit_rank: 3,
        overall_rank: 3,
        labor_difficulty: 4,
        labor_min: 0.75,
        labor_max: 1.5,
        is_mobile_eligible: false,
        reimbursement: 228.00
      }
    ]
  },
  "1FBSS31L07DA12345": {
    API_request_id: 100206,
    vin: "1FBSS31L07DA12345",
    model_year: 2007,
    make: "Ford",
    model_name: "E-350 Super Duty",
    last_updated: "2026-03-15",
    recall_count: 0,
    status: "ok",
    error_description: null,
    recalls: []
  },
  "WBANE53547CZ98765": {
    API_request_id: 100207,
    vin: "WBANE53547CZ98765",
    model_year: 2007,
    make: "BMW",
    model_name: "525i",
    last_updated: "2026-03-10",
    recall_count: 1,
    status: "ok",
    error_description: null,
    recalls: [
      {
        recall_id: 55600,
        recall_last_updated: "2025-09-18",
        recall_age: 340,
        nhtsa_id: "24V350000",
        oem_id: "BMW-24-03",
        motc_id: null,
        government_id: "24V350000",
        name: "Driver Airbag Inflator",
        description: "Takata driver frontal airbag inflator may explode during deployment.",
        risk: "An exploding inflator may result in sharp metal fragments striking occupants, potentially causing serious injury or death.",
        remedy: "Dealers will replace the driver frontal airbag inflator, free of charge.",
        campaign_type: "nhtsa",
        stop_sale: false,
        dont_drive: true,
        effective_date: "2024-04-10",
        expiration_date: null,
        is_remedy_available: true,
        are_parts_available: true,
        are_parts_limited: false,
        parts_number: "32-30-6-000-000",
        parts_description: "Driver frontal airbag inflator module (non-Takata replacement)",
        parts_available_date: null,
        risk_type: "safety",
        risk_rank: 5,
        profit_rank: 2,
        overall_rank: 5,
        labor_difficulty: 4,
        labor_min: 1.0,
        labor_max: 2.0,
        is_mobile_eligible: false,
        reimbursement: 304.00
      }
    ]
  },
  "3GCUKREC0JG123456": {
    API_request_id: 100208,
    vin: "3GCUKREC0JG123456",
    model_year: 2018,
    make: "Chevrolet",
    model_name: "Silverado 1500",
    last_updated: "2026-03-16",
    recall_count: 0,
    status: "ok",
    error_description: null,
    recalls: []
  }
};

// Helper: get severity label from risk_rank
function getSeverityLabel(rank) {
  if (rank === 5) return "EXTREME";
  if (rank === 4) return "HIGH";
  if (rank === 3) return "MODERATE";
  if (rank === 2) return "LOW";
  return "INFO";
}

function getSeverityClass(rank) {
  if (rank === 5) return "severity-extreme";
  if (rank === 4) return "severity-high";
  if (rank === 3) return "severity-moderate";
  if (rank === 2) return "severity-low";
  return "severity-info";
}

// Helper: format hours (float) to human-readable duration
function formatHours(h) {
  if (h == null) return "—";
  var hrs = Math.floor(h);
  var mins = Math.round((h - hrs) * 60);
  if (hrs === 0) return mins + "m";
  if (mins === 0) return hrs + "h";
  return hrs + "h " + mins + "m";
}

// Helper: labor_difficulty int to label
function laborDifficultyLabel(d) {
  var labels = { 1: "Sticker", 2: "Nuisance", 3: "Programming Only", 4: "No Car Lift", 5: "Car Lift" };
  return labels[d] || "Unknown";
}

// Helper: risk_type code to display label
function riskTypeLabel(rt) {
  var labels = { collision: "Collision", fire: "Fire", safety: "Safety", emissions: "Emissions", neutral: "Neutral" };
  return labels[rt] || rt;
}

// Helper: risk_type to CSS class
function riskTypeClass(rt) {
  var map = { fire: "risk-fire", collision: "risk-crash", safety: "risk-injury", emissions: "risk-emissions", neutral: "risk-neutral" };
  return map[rt] || "";
}

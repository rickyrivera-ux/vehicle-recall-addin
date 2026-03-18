// Mock fleet devices (matching real devices on geotabdemo55)
var MOCK_DEVICES = [
  { id: "b117", name: "318 - Walmart", vehicleIdentificationNumber: "1FTFW1ET5DFC10312" },
  { id: "b122", name: "319 - Blumer", vehicleIdentificationNumber: "2GCEG25K081234567" },
  { id: "b123", name: "320 - Nikita", vehicleIdentificationNumber: "3FA6P0H77HR283051" }
];

// Mock Recall Masters API v2 responses per VIN
// Field names match the official RM API v2 spec (SSDG 3.0, pages 16-19)
var MOCK_RECALLS = {
  // 318 - Walmart — EXTREME severity (risk_rank 5)
  "1FTFW1ET5DFC10312": {
    API_request_id: 100201,
    vin: "1FTFW1ET5DFC10312",
    model_year: 2013,
    make: "Ford",
    model_name: "F-150",
    last_updated: "2026-03-17",
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
        description: "Fire risk - Auxiliary heater electrical connector may overheat and melt, potentially igniting surrounding materials.",
        risk: "Melting wires may lead to overheating which can result in a vehicle fire, posing a serious burn and injury risk to occupants.",
        remedy: "Replace the auxiliary heater and perform software update. This work will be performed free of charge.",
        campaign_type: "nhtsa",
        stop_sale: true,
        dont_drive: true,
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
        recall_id: 88450,
        recall_last_updated: "2026-02-28",
        recall_age: 185,
        nhtsa_id: "25V890000",
        oem_id: "25S77",
        motc_id: null,
        government_id: "25V890000",
        name: "Fuel Pump Assembly",
        description: "Fuel pump may fail during operation causing engine stall without warning at any speed.",
        risk: "Engine stall at highway speed without power steering or brake assist greatly increases the risk of a crash.",
        remedy: "Dealers will replace the fuel pump assembly, free of charge.",
        campaign_type: "nhtsa",
        stop_sale: true,
        dont_drive: false,
        effective_date: "2025-09-15",
        expiration_date: null,
        is_remedy_available: true,
        are_parts_available: false,
        are_parts_limited: true,
        parts_number: "PL3Z-9H307-C",
        parts_description: "Fuel pump module assembly",
        parts_available_date: "2026-05-01",
        risk_type: "collision",
        risk_rank: 5,
        profit_rank: 4,
        overall_rank: 5,
        labor_difficulty: 4,
        labor_min: 1.0,
        labor_max: 2.5,
        is_mobile_eligible: false,
        reimbursement: 412.00
      }
    ]
  },

  // 319 - Blumer — HIGH severity (risk_rank 4)
  "2GCEG25K081234567": {
    API_request_id: 100202,
    vin: "2GCEG25K081234567",
    model_year: 2008,
    make: "Chevrolet",
    model_name: "Silverado 2500HD",
    last_updated: "2026-03-17",
    recall_count: 2,
    status: "ok",
    error_description: null,
    recalls: [
      {
        recall_id: 44100,
        recall_last_updated: "2025-11-05",
        recall_age: 450,
        nhtsa_id: "24V200000",
        oem_id: "N242001",
        motc_id: null,
        government_id: "24V200000",
        name: "Passenger Airbag Inflator",
        description: "Takata passenger frontal airbag inflator may rupture during deployment due to propellant degradation from long-term moisture exposure.",
        risk: "A ruptured inflator may propel sharp metal fragments toward the passenger, potentially causing serious injury or death.",
        remedy: "Dealers will replace the passenger frontal airbag inflator, free of charge.",
        campaign_type: "nhtsa",
        stop_sale: false,
        dont_drive: false,
        effective_date: "2024-08-22",
        expiration_date: null,
        is_remedy_available: true,
        are_parts_available: true,
        are_parts_limited: false,
        parts_number: "84857462",
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
      },
      {
        recall_id: 33001,
        recall_last_updated: "2025-08-15",
        recall_age: 1380,
        nhtsa_id: "22V800000",
        oem_id: "N222333444",
        motc_id: null,
        government_id: "22V800000",
        name: "Fuel System / Fuel Lines",
        description: "Fuel feed and return lines may corrode and develop a fuel leak over time.",
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
      }
    ]
  },

  // 320 - Nikita — MODERATE severity (risk_rank 3)
  "3FA6P0H77HR283051": {
    API_request_id: 100203,
    vin: "3FA6P0H77HR283051",
    model_year: 2019,
    make: "International",
    model_name: "LT625",
    last_updated: "2026-03-17",
    recall_count: 1,
    status: "ok",
    error_description: null,
    recalls: [
      {
        recall_id: 55201,
        recall_last_updated: "2025-12-01",
        recall_age: 890,
        nhtsa_id: "23V456000",
        oem_id: "23S42",
        motc_id: null,
        government_id: "23V456000",
        name: "Brake Fluid Pressure Sensor",
        description: "Brake fluid pressure sensor may intermittently provide inaccurate readings to the ABS module, causing delayed brake response under hard braking.",
        risk: "Delayed brake response under hard braking may increase stopping distance and the risk of a collision.",
        remedy: "Dealers will replace the brake fluid pressure sensor and recalibrate the ABS module, free of charge.",
        campaign_type: "nhtsa",
        stop_sale: false,
        dont_drive: false,
        effective_date: "2023-06-12",
        expiration_date: null,
        is_remedy_available: true,
        are_parts_available: true,
        are_parts_limited: false,
        parts_number: "3575776C91",
        parts_description: "Brake fluid pressure sensor with updated calibration firmware",
        parts_available_date: null,
        risk_type: "collision",
        risk_rank: 3,
        profit_rank: 3,
        overall_rank: 3,
        labor_difficulty: 3,
        labor_min: 0.5,
        labor_max: 1.25,
        is_mobile_eligible: true,
        reimbursement: 190.00
      }
    ]
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

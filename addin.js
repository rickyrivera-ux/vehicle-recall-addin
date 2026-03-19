// Vehicle Recall Monitor — Add-in Logic
// Recall data from mock-data.js (Recall Masters API v2 spec, SSDG 3.0)
// Work Request creation uses real WOM API (MaintenanceIssue) when inside MyGeotab,
// falls back to mock toast when running standalone on GitHub Pages.

geotab.addin.addin = function (api, state) {
  "use strict";

  // State
  var currentView = "list";
  var createdWorkRequests = {};
  var initialized = false;
  var geotabApi = null; // stored from lifecycle callbacks
  var eventTypeCache = {}; // cached EventType IDs by name

  // DOM refs (resolved lazily in initialize)
  var summaryBar, listView, detailView, vehicleTbody, detailHeader,
      recallCards, backBtn, searchInput, filterSelect, toast;

  // Build fleet data by joining devices + recalls
  function getFleetData() {
    return MOCK_DEVICES.map(function (device) {
      var recallData = MOCK_RECALLS[device.vehicleIdentificationNumber] || { recalls: [] };
      return {
        device: device,
        vin: device.vehicleIdentificationNumber,
        model_year: recallData.model_year || "—",
        make: recallData.make || "—",
        model_name: recallData.model_name || "—",
        last_updated: recallData.last_updated || null,
        recall_count: recallData.recall_count || 0,
        status: recallData.status || "ok",
        error_description: recallData.error_description || null,
        recalls: recallData.recalls || [],
        maxRisk: (recallData.recalls || []).reduce(function (max, r) { return Math.max(max, r.risk_rank); }, 0)
      };
    });
  }

  // Render summary cards
  function renderSummary(fleet) {
    var totalVehicles = fleet.length;
    var totalRecalls = fleet.reduce(function (sum, v) { return sum + v.recall_count; }, 0);
    var vehiclesWithRecalls = fleet.filter(function (v) { return v.recall_count > 0; }).length;
    var criticalCount = fleet.reduce(function (sum, v) {
      return sum + v.recalls.filter(function (r) { return r.risk_rank >= 4; }).length;
    }, 0);

    summaryBar.innerHTML =
      '<div class="summary-card"><div class="label">Total Vehicles</div><div class="value text-primary">' + totalVehicles + '</div></div>' +
      '<div class="summary-card"><div class="label">Open Recalls</div><div class="value text-danger">' + totalRecalls + '</div></div>' +
      '<div class="summary-card"><div class="label">Vehicles Affected</div><div class="value text-warning">' + vehiclesWithRecalls + '</div></div>' +
      '<div class="summary-card"><div class="label">Critical (High/Extreme)</div><div class="value text-danger">' + criticalCount + '</div></div>';
  }

  // Render vehicle list
  function renderVehicleList(fleet) {
    var search = searchInput.value.toLowerCase();
    var filter = filterSelect.value;

    var filtered = fleet.filter(function (v) {
      if (search) {
        var haystack = (v.device.name + " " + v.vin + " " + v.make + " " + v.model_name).toLowerCase();
        if (haystack.indexOf(search) === -1) return false;
      }
      if (filter === "with-recalls" && v.recall_count === 0) return false;
      if (filter === "clear" && v.recall_count > 0) return false;
      return true;
    });

    filtered.sort(function (a, b) {
      if (b.maxRisk !== a.maxRisk) return b.maxRisk - a.maxRisk;
      return b.recall_count - a.recall_count;
    });

    var html = "";
    filtered.forEach(function (v) {
      var countBadge = v.recall_count > 0
        ? '<span class="recall-count-badge has-recalls">' + v.recall_count + ' open</span>'
        : '<span class="recall-count-badge clear">Clear</span>';

      var severityBadge = "";
      if (v.maxRisk > 0) {
        severityBadge = '<span class="severity-badge ' + getSeverityClass(v.maxRisk) + '">' + getSeverityLabel(v.maxRisk) + '</span>';
        var riskTypes = [];
        v.recalls.forEach(function (r) {
          if (riskTypes.indexOf(r.risk_type) === -1) riskTypes.push(r.risk_type);
        });
        riskTypes.forEach(function (rt) {
          severityBadge += ' <span class="risk-type-tag ' + riskTypeClass(rt) + '">' + riskTypeLabel(rt) + '</span>';
        });
      } else {
        severityBadge = '<span style="color: #7f8c8d;">—</span>';
      }

      html += '<tr data-vin="' + v.vin + '">' +
        '<td><strong>' + v.device.name + '</strong></td>' +
        '<td><span class="vin-text">' + v.vin + '</span></td>' +
        '<td>' + v.model_year + ' ' + v.make + ' ' + v.model_name + '</td>' +
        '<td>' + countBadge + '</td>' +
        '<td>' + severityBadge + '</td>' +
        '</tr>';
    });

    if (filtered.length === 0) {
      html = '<tr><td colspan="5" style="text-align:center; padding:30px; color:#7f8c8d;">No vehicles match your search.</td></tr>';
    }

    vehicleTbody.innerHTML = html;

    var rows = vehicleTbody.querySelectorAll("tr[data-vin]");
    rows.forEach(function (row) {
      row.addEventListener("click", function () {
        showDetail(row.getAttribute("data-vin"), fleet);
      });
    });
  }

  // Show detail view for a vehicle
  function showDetail(vin, fleet) {
    var vehicle = fleet.find(function (v) { return v.vin === vin; });
    if (!vehicle) return;

    currentView = "detail";
    listView.classList.add("hidden");
    detailView.classList.add("active");

    detailHeader.innerHTML =
      '<h2>' + vehicle.device.name + '</h2>' +
      '<div class="vehicle-meta">' +
        '<span>' + vehicle.model_year + ' ' + vehicle.make + ' ' + vehicle.model_name + '</span>' +
        '<span>VIN: ' + vehicle.vin + '</span>' +
        '<span>' + vehicle.recall_count + ' open recall' + (vehicle.recall_count !== 1 ? 's' : '') + '</span>' +
        (vehicle.last_updated ? '<span>Last checked: ' + vehicle.last_updated + '</span>' : '') +
      '</div>';

    if (vehicle.recalls.length === 0) {
      recallCards.innerHTML =
        '<div class="no-recalls-msg">' +
          '<div class="check-icon">&#10003;</div>' +
          '<h3>No Open Recalls</h3>' +
          '<p>This vehicle has no outstanding recalls from Recall Masters.</p>' +
        '</div>';
      return;
    }

    var cardsHtml = "";
    vehicle.recalls.forEach(function (r) {
      cardsHtml += buildRecallCard(r, vehicle);
    });
    recallCards.innerHTML = cardsHtml;

    recallCards.querySelectorAll(".btn-work-request").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        handleCreateWorkRequest(btn.getAttribute("data-recall-id"), vehicle, btn);
      });
    });
  }

  // Build a single recall detail card — all spec fields displayed
  function buildRecallCard(recall, vehicle) {
    // Header tags
    var tags = '<span class="severity-badge ' + getSeverityClass(recall.risk_rank) + '">' + getSeverityLabel(recall.risk_rank) + '</span> ';
    tags += '<span class="recall-card-header component-name">' + recall.name + '</span> ';

    if (recall.campaign_type === "nhtsa") {
      tags += '<span class="recall-tag safety">Safety Recall</span> ';
    } else if (recall.campaign_type === "voluntary") {
      tags += '<span class="recall-tag voluntary">Voluntary</span> ';
    } else if (recall.campaign_type === "warranty") {
      tags += '<span class="recall-tag warranty">Warranty</span> ';
    }
    if (recall.stop_sale) {
      tags += '<span class="recall-tag stop-sale-tag">Stop Sale</span> ';
    }
    if (recall.dont_drive) {
      tags += '<span class="recall-tag dont-drive-tag">Don\'t Drive</span> ';
    }

    // Score color helper
    function scoreClass(val) {
      if (val >= 4) return "score-high";
      if (val >= 3) return "score-med";
      return "score-low";
    }

    var isCreated = createdWorkRequests[recall.recall_id];
    var btnText = isCreated ? "&#10003; Work Request Created" : "Create Work Request";
    var btnDisabled = isCreated ? "disabled" : "";

    return '<div class="recall-card">' +
      // Header
      '<div class="recall-card-header">' + tags + '</div>' +
      '<div class="recall-card-body">' +

        // Row 1: Codes & Scores
        '<div class="code-row">' +
          '<div class="code-cell"><div class="cell-label">NHTSA Code</div><div class="cell-value">' + (recall.nhtsa_id || "—") + '</div></div>' +
          '<div class="code-cell"><div class="cell-label">OEM Code</div><div class="cell-value">' + (recall.oem_id || "—") + '</div></div>' +
          (recall.motc_id ? '<div class="code-cell"><div class="cell-label">MOTC ID</div><div class="cell-value">' + recall.motc_id + '</div></div>' : '') +
          '<div class="code-cell"><div class="cell-label">Overall Rank</div><div class="cell-value ' + scoreClass(recall.overall_rank) + '">' + recall.overall_rank + ' out of 5</div></div>' +
          '<div class="code-cell"><div class="cell-label">Risk Score</div><div class="cell-value ' + scoreClass(recall.risk_rank) + '">' + recall.risk_rank + ' out of 5</div></div>' +
          '<div class="code-cell"><div class="cell-label">Risk Type</div><div class="cell-value"><span class="risk-type-tag ' + riskTypeClass(recall.risk_type) + '">' + riskTypeLabel(recall.risk_type) + '</span></div></div>' +
          '<div class="code-cell"><div class="cell-label">Profit Rank</div><div class="cell-value">' + recall.profit_rank + ' out of 5</div></div>' +
          '<div class="code-cell"><div class="cell-label">Recall Age</div><div class="cell-value">' + recall.recall_age + ' days</div></div>' +
        '</div>' +

        // Row 2: Description / Risk / Remedy
        '<div class="info-block"><div class="info-label">Description</div><div class="info-text">' + recall.description + '</div></div>' +
        '<div class="info-block"><div class="info-label">Risk</div><div class="info-text">' + recall.risk + '</div></div>' +
        '<div class="info-block"><div class="info-label">Remedy</div><div class="info-text">' + recall.remedy + '</div></div>' +

        // Row 3: Status flags
        '<div class="status-flags">' +
          '<div class="status-flag ' + (recall.is_remedy_available ? "flag-yes" : "flag-no") + '"><div class="flag-label">Remedy Available?</div><div class="flag-value">' + (recall.is_remedy_available ? "YES" : "NO") + '</div></div>' +
          '<div class="status-flag ' + (recall.are_parts_available ? "flag-yes" : "flag-no") + '"><div class="flag-label">Parts Available?</div><div class="flag-value">' + (recall.are_parts_available ? "YES" : "NO") + '</div></div>' +
          '<div class="status-flag ' + (recall.are_parts_limited ? "flag-limited" : "flag-no") + '"><div class="flag-label">Parts Limited?</div><div class="flag-value">' + (recall.are_parts_limited ? "YES" : "NO") + '</div></div>' +
          '<div class="status-flag ' + (recall.stop_sale ? "flag-danger" : "flag-no") + '"><div class="flag-label">Stop Sale?</div><div class="flag-value">' + (recall.stop_sale ? "YES" : "NO") + '</div></div>' +
          '<div class="status-flag ' + (recall.dont_drive ? "flag-danger" : "flag-no") + '"><div class="flag-label">Don\'t Drive?</div><div class="flag-value">' + (recall.dont_drive ? "YES" : "NO") + '</div></div>' +
          '<div class="status-flag ' + (recall.is_mobile_eligible ? "flag-yes" : "flag-no") + '"><div class="flag-label">Mobile Eligible?</div><div class="flag-value">' + (recall.is_mobile_eligible ? "YES" : "NO") + '</div></div>' +
        '</div>' +

        // Row 4: Parts details
        (recall.parts_number ? '<div class="parts-detail-row">' +
          '<div class="info-block"><div class="info-label">Part Number(s)</div><div class="info-text mono">' + recall.parts_number + '</div></div>' +
          '<div class="info-block"><div class="info-label">Parts Description</div><div class="info-text">' + (recall.parts_description || "—") + '</div></div>' +
          (recall.parts_available_date ? '<div class="info-block"><div class="info-label">Parts ETA</div><div class="info-text">' + recall.parts_available_date + '</div></div>' : '') +
        '</div>' : '') +

        // Row 5: Dates, Labor & Reimbursement
        '<div class="labor-row">' +
          '<div class="labor-cell"><div class="cell-label">Effective Date</div><div class="cell-value">' + recall.effective_date + '</div></div>' +
          '<div class="labor-cell"><div class="cell-label">Expiration Date</div><div class="cell-value">' + (recall.expiration_date || "N/A") + '</div></div>' +
          '<div class="labor-cell"><div class="cell-label">Labor Min</div><div class="cell-value">' + formatHours(recall.labor_min) + '</div></div>' +
          '<div class="labor-cell"><div class="cell-label">Labor Max</div><div class="cell-value">' + formatHours(recall.labor_max) + '</div></div>' +
          '<div class="labor-cell"><div class="cell-label">Labor Difficulty</div><div class="cell-value">' + laborDifficultyLabel(recall.labor_difficulty) + ' (' + recall.labor_difficulty + ')</div></div>' +
          '<div class="labor-cell"><div class="cell-label">Reimbursement</div><div class="cell-value reimbursement">$' + recall.reimbursement.toFixed(2) + '</div></div>' +
        '</div>' +

        // Recall metadata footer
        '<div class="recall-meta">' +
          '<span>Recall ID: ' + recall.recall_id + '</span>' +
          '<span>Gov ID: ' + (recall.government_id || "—") + '</span>' +
          '<span>Last Updated: ' + (recall.recall_last_updated || "—") + '</span>' +
        '</div>' +

      '</div>' +
      // Action row
      '<div class="action-row">' +
        '<button class="btn-work-request" data-recall-id="' + recall.recall_id + '" ' + btnDisabled + '>' + btnText + '</button>' +
      '</div>' +
    '</div>';
  }

  // Map risk_rank to WOM severity
  function riskRankToSeverity(rank) {
    if (rank >= 5) return 400; // Critical
    if (rank >= 4) return 300; // High
    if (rank >= 3) return 200; // Medium
    return 100; // Low
  }


  // Ensure an EventType with the given name exists, return its ID via callback.
  // Caches results so each name is only looked up / created once per session.
  function ensureEventType(name, callback) {
    if (eventTypeCache[name]) {
      callback(null, eventTypeCache[name]);
      return;
    }

    geotabApi.call("Get", {
      typeName: "EventType",
      search: { name: name }
    }, function (results) {
      if (results && results.length > 0) {
        eventTypeCache[name] = results[0].id;
        callback(null, results[0].id);
      } else {
        geotabApi.call("Add", {
          typeName: "EventType",
          entity: { name: name }
        }, function (id) {
          eventTypeCache[name] = id;
          callback(null, id);
        }, function (err) {
          callback(err);
        });
      }
    }, function (err) {
      callback(err);
    });
  }

  // Handle "Create Work Request" click — one MaintenanceIssue per recall
  function handleCreateWorkRequest(recallId, vehicle, btn) {
    btn.disabled = true;
    btn.innerHTML = "Creating...";

    // Find the specific recall
    var recall = vehicle.recalls.find(function (r) { return String(r.recall_id) === String(recallId); });
    if (!recall) {
      btn.disabled = false;
      btn.innerHTML = "Create Work Request";
      showToast("Recall not found: " + recallId, "error");
      return;
    }

    // Standalone mode — keep mock behavior
    if (!geotabApi) {
      setTimeout(function () {
        createdWorkRequests[recallId] = true;
        btn.innerHTML = "&#10003; Work Request Created";
        showToast(
          "Work Request created: RECALL: " + recall.name + " — " + vehicle.device.name + " (mock)",
          "success"
        );
      }, 800);
      return;
    }

    // Maintenance Type = "RECALL: <specific recall name>"
    var eventTypeName = "RECALL: " + recall.name;

    ensureEventType(eventTypeName, function (err, eventTypeId) {
      if (err) {
        btn.disabled = false;
        btn.innerHTML = "Create Work Request";
        showToast("Failed to create Maintenance Type: " + (err.message || err), "error");
        return;
      }

      geotabApi.call("Add", {
        typeName: "MaintenanceIssue",
        entity: {
          device: { id: vehicle.device.id },
          maintenanceType: { id: eventTypeId },
          severity: riskRankToSeverity(recall.risk_rank),
          source: "Vehicle Recall",
          description: recall.description +
            "\n\nRisk: " + recall.risk +
            "\nRemedy: " + recall.remedy,
          recommendation: recall.remedy,
          metadata: {
            "recall.source": "Vehicle Recall",
            "recall.recall_id": String(recall.recall_id),
            "recall.nhtsa_id": recall.nhtsa_id || "",
            "recall.oem_id": recall.oem_id || "",
            "recall.risk_type": recall.risk_type,
            "recall.risk_rank": String(recall.risk_rank),
            "recall.campaign_type": recall.campaign_type || "",
            "recall.reimbursement": String(recall.reimbursement || 0)
          }
        }
      }, function () {
        createdWorkRequests[recall.recall_id] = true;
        btn.innerHTML = "&#10003; Work Request Created";
        showToast(
          "Work Request created: RECALL: " + recall.name + " — " + vehicle.device.name,
          "success"
        );
      }, function (err) {
        btn.disabled = false;
        btn.innerHTML = "Create Work Request";
        showToast("Failed: " + (err.message || err), "error");
      });
    });
  }

  // Toast
  function showToast(message, type) {
    toast.className = "toast toast-" + (type || "success") + " show";
    toast.textContent = message;
    setTimeout(function () {
      toast.classList.remove("show");
    }, 4000);
  }

  function initApp() {
    if (initialized) return;
    initialized = true;

    summaryBar = document.getElementById("summary-bar");
    listView = document.getElementById("list-view");
    detailView = document.getElementById("detail-view");
    vehicleTbody = document.getElementById("vehicle-tbody");
    detailHeader = document.getElementById("vehicle-detail-header");
    recallCards = document.getElementById("recall-cards");
    backBtn = document.getElementById("back-btn");
    searchInput = document.getElementById("search-input");
    filterSelect = document.getElementById("filter-select");
    toast = document.getElementById("toast");

    // Back button
    backBtn.addEventListener("click", function () {
      currentView = "list";
      detailView.classList.remove("active");
      listView.classList.remove("hidden");
    });

    // Search & filter
    searchInput.addEventListener("input", function () { renderVehicleList(getFleetData()); });
    filterSelect.addEventListener("change", function () { renderVehicleList(getFleetData()); });
  }

  return {
    initialize: function (freshApi, freshState, callback) {
      if (freshApi) { geotabApi = freshApi; }
      initApp();
      callback();
    },
    focus: function (freshApi, freshState) {
      if (freshApi) { geotabApi = freshApi; }
      // Re-render on focus
      var fleet = getFleetData();
      renderSummary(fleet);
      renderVehicleList(fleet);
    },
    blur: function (freshApi, freshState) {
      // Nothing to clean up
    }
  };
};

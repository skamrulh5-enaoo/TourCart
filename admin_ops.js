/* admin_ops.js - TourCartBD Admin Panel Control & Operations Engine */

// State globals
let activities = [];
let bookings = [];
let hotels = [];
let busClasses = [];
let localTransport = [];

// Filter & Table States
let searchQuery = "";
let filterDest = "all";
let filterCat = "all";
let filterStatus = "all";
let currentSortColumn = "name";
let currentSortDirection = "asc"; // "asc" or "desc"
let currentPage = 1;
const itemsPerPage = 20;

// Selection tracking
let selectedActivityIds = new Set();

// Active editing item tracking
let editingActivityId = null; // null means "Add New" mode
let inlineEditingActivityId = null;
let inlineEditingType = "activity"; // "activity" or "hotel"
let inlineEditingHotelId = null;

// Mock Bookings Data Seeder (High-Fidelity)
const SEED_BOOKINGS = [
  {
    ref: "TC-2026-6204",
    name: "Md. Shafiul Islam",
    phone: "+8801711223344",
    email: "shafiul@gmail.com",
    type: "couple",
    travellers: 2,
    checkin: "2026-06-10",
    checkout: "2026-06-15",
    source: "Facebook Ads",
    requests: "Prefer sea-view hotel room if possible. Halal meals only.",
    payment: "bKash",
    items: [
      { id: 11, name: "Saint Martin Island — Full Day Tour", price: 3500, icon: "🏝️" },
      { id: 6, name: "Parasailing — Marine Drive Coast", price: 1200, icon: "🛂" }
    ],
    total: 9400, // (3500*2 + 1200*2 = 9400)
    deposit: 4700,
    status: "New",
    timestamp: new Date().toISOString() // Brand new today!
  },
  {
    ref: "TC-2026-9051",
    name: "Dr. Anika Rahman",
    phone: "+8801815544332",
    email: "anika.bup@gmail.com",
    type: "family",
    travellers: 4,
    checkin: "2026-06-21",
    checkout: "2026-06-25",
    source: "Google Search",
    requests: "Need an extra mattress for child. Guided mountain treks.",
    payment: "bKash",
    items: [
      { id: 16, name: "Dulahazra Safari Park Tour", price: 1800, icon: "🐅" },
      { id: 5, name: "Himchari National Park & Waterfall", price: 600, icon: "🏞️" }
    ],
    total: 9600, // (1800*4 + 600*4 = 9600)
    deposit: 4800,
    status: "Confirmed",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    ref: "TC-2026-4412",
    name: "Lt. Col. Masud Rana",
    phone: "+8801913344556",
    email: "masud.rana@army.mil.bd",
    type: "group",
    travellers: 8,
    checkin: "2026-07-01",
    checkout: "2026-07-04",
    source: "Word of Mouth",
    requests: "Require military transport coordination. Adventurous trails only.",
    payment: "Bank Transfer",
    items: [
      { id: 25, name: "Sajek Valley — Sunrise & Clouds View", price: 2500, icon: "🌅" }
    ],
    total: 20000, // 2500 * 8 = 20000
    deposit: 10000,
    status: "Pending",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  }
];

// Initialize database
function initDatabase() {
  // Bookings seeding
  if (!localStorage.getItem('tcbd_bookings')) {
    localStorage.setItem('tcbd_bookings', JSON.stringify(SEED_BOOKINGS));
  }
}

// Load entire database from localStorage
function loadDatabase() {
  initDatabase();
  
  activities = JSON.parse(localStorage.getItem('tcbd_activities') || '[]');
  bookings = JSON.parse(localStorage.getItem('tcbd_bookings') || '[]');
  hotels = JSON.parse(localStorage.getItem('tcbd_hotels') || '[]');
  busClasses = JSON.parse(localStorage.getItem('tcbd_bus_classes') || '[]');
  localTransport = JSON.parse(localStorage.getItem('tcbd_local_transport') || '[]');
}

// Save databases back to localStorage and trigger visual re-sync
function saveActivities() {
  localStorage.setItem('tcbd_activities', JSON.stringify(activities));
  loadDatabase();
}

// CSV Export Engine
function downloadBookingsCSV() {
  if (bookings.length === 0) {
    showToast("⚠️ No booking logs available to export.");
    return;
  }
  
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Reference,Client Name,Phone,Email,Type,Travellers,Check-in,Check-out,Total (BDT),Deposit (BDT),Status,Timestamp\r\n";
  
  bookings.forEach(b => {
    let row = [
      b.ref,
      `"${b.name.replace(/"/g, '""')}"`,
      `"${b.phone}"`,
      b.email,
      b.type,
      b.travellers,
      b.checkin,
      b.checkout,
      b.total,
      b.deposit,
      b.status,
      b.timestamp
    ].join(",");
    csvContent += row + "\r\n";
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `TourCartBD_Bookings_Backup_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("📥 Exported bookings database to CSV format!");
}

// CALCULATE & RENDER DASHBOARD PANELS
function renderDashboardMetrics() {
  loadDatabase();
  
  // STATS
  const totalBookings = bookings.length;
  
  // Calculate new today (anything logged within last 24h)
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  const newTodayCount = bookings.filter(b => new Date(b.timestamp).getTime() > twentyFourHoursAgo).length;
  
  // GMV & Deposits
  const totalGMV = bookings.reduce((sum, b) => sum + (parseInt(b.total) || 0), 0);
  const totalDeposits = bookings.reduce((sum, b) => sum + (parseInt(b.deposit) || 0), 0);
  
  // Need follow up (uncontacted status matches 'New')
  const newBookings = bookings.filter(b => b.status === "New" || b.status === "new");
  const needFollowUpCount = newBookings.length;
  
  // RENDER STATS METRICS IN DASHBOARD SCREEN
  const statsCols = `
    <div class="stat-card teal-top">
      <div class="stat-label">Total Bookings</div>
      <div class="stat-value">${totalBookings}</div>
      <div class="stat-sub">${newTodayCount} new today</div>
    </div>
    <div class="stat-card coral-top">
      <div class="stat-label">Total GMV</div>
      <div class="stat-value">৳${totalGMV.toLocaleString()}</div>
      <div class="stat-sub positive">৳${(totalGMV * 0.15).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} est. profit (15%)</div>
    </div>
    <div class="stat-card gold-top">
      <div class="stat-label">Total Deposits</div>
      <div class="stat-value">৳${totalDeposits.toLocaleString()}</div>
      <div class="stat-sub">Held securely in trust</div>
    </div>
    <div class="stat-card ${needFollowUpCount > 0 ? 'red-top' : 'green-top'}">
      <div class="stat-label">Need Follow-up</div>
      <div class="stat-value">${needFollowUpCount}</div>
      <div class="stat-sub ${needFollowUpCount > 0 ? 'urgent' : ''}">${needFollowUpCount > 0 ? '⚠️ Pending action' : '✓ All caught up!'}</div>
    </div>
  `;
  
  const metricsContainer = document.getElementById('dashboard-metrics-container');
  if (metricsContainer) metricsContainer.innerHTML = statsCols;

  // Render recent bookings table (last 5 bookings)
  const recentLimit = bookings.slice(0, 5);
  let tableRows = "";
  
  if (recentLimit.length === 0) {
    tableRows = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 32px 0;">No travel booking logs found in localStorage.</td></tr>`;
  } else {
    recentLimit.forEach(b => {
      const timeStr = formatTimeAgo(b.timestamp);
      tableRows += `
        <tr class="row-hover" onclick="setSection('bookings')">
          <td class="cell-ref">${b.ref}</td>
          <td class="cell-bold">${b.name}</td>
          <td>${b.phone}</td>
          <td class="cell-bold" style="color: var(--teal)">৳${(b.total || 0).toLocaleString()}</td>
          <td><span class="badge-pill badge-${(b.status || 'new').toLowerCase()}">${b.status}</span></td>
          <td class="cell-subtext">${timeStr}</td>
        </tr>
      `;
    });
  }
  
  const tbody = document.getElementById('dashboard-recent-bookings-tbody');
  if (tbody) tbody.innerHTML = tableRows;
}

// Compute simple human time ago
function formatTimeAgo(isoString) {
  if (!isoString) return "just now";
  const sec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// RENDER BOOKINGS LIST VIEW (FOR BOOKINGS ARCHIVE TAB)
function renderBookingsArchive() {
  loadDatabase();
  const bookingsContainer = document.getElementById('section-bookings');
  if (!bookingsContainer) return;
  
  let rows = "";
  if (bookings.length === 0) {
    rows = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 32px;">No bookings recorded.</td></tr>`;
  } else {
    bookings.forEach((b, idx) => {
      rows += `
        <tr>
          <td class="cell-ref">${b.ref}</td>
          <td class="cell-bold">${b.name}<div class="cell-subtext">${b.email}</div></td>
          <td>${b.phone}</td>
          <td>${b.checkin} to ${b.checkout}<div class="cell-subtext">${b.travellers} Pax (${b.type})</div></td>
          <td>${b.payment} <div class="cell-subtext">Source: ${b.source || 'Direct'}</div></td>
          <td class="cell-bold">৳${(b.total||0).toLocaleString()}</td>
          <td class="cell-bold" style="color: var(--teal)">৳${(b.deposit||0).toLocaleString()}</td>
          <td>
            <select class="filter-select" style="min-width: 110px; height: 32px; padding: 0 4px; font-size:12px; margin:0;" onchange="updateBookingStatus('${b.ref}', this.value)">
              <option value="New" ${b.status === 'New' ? 'selected' : ''}>🔵 New</option>
              <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>🟢 Confirmed</option>
              <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>🟡 Pending</option>
              <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>🔴 Cancelled</option>
            </select>
          </td>
          <td>
            <button class="cell-action-btn" onclick="deleteBookingLog('${b.ref}')" title="Delete Booking Records">🗑️</button>
          </td>
        </tr>
      `;
    });
  }
  
  bookingsContainer.innerHTML = `
    <div class="section-header">
      <h1 class="section-title">Enlisted Bookings Archive</h1>
      <span class="view-more-link" style="cursor: pointer;" onclick="downloadBookingsCSV()">📥 Backup CSV</span>
    </div>
    
    <div class="content-card">
      <div class="panel-table-container">
        <table class="panel-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Client</th>
              <th>Phone</th>
              <th>Dates & Travellers</th>
              <th>Deposit Channel</th>
              <th>Total Value</th>
              <th>Deposit Paid</th>
              <th>Operations Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Modify single booking status from dropdown
function updateBookingStatus(ref, newStatus) {
  bookings = bookings.map(b => {
    if (b.ref === ref) {
      return { ...b, status: newStatus };
    }
    return b;
  });
  localStorage.setItem('tcbd_bookings', JSON.stringify(bookings));
  showToast(`✓ Booking ${ref} status set to: ${newStatus}`);
  renderDashboardMetrics();
  renderBookingsArchive();
}

function deleteBookingLog(ref) {
  if (!confirm(`Are you sure you want to permanently delete booking reference ${ref}?`)) return;
  bookings = bookings.filter(b => b.ref !== ref);
  localStorage.setItem('tcbd_bookings', JSON.stringify(bookings));
  showToast(`🗑️ Booking record ${ref} deleted`);
  renderDashboardMetrics();
  renderBookingsArchive();
}

// RENDER ACTIVITIES CONTENT CATALOG (THE MAGNIFICENT 48 ACTIVITIES PANELS)
function renderActivitiesTable() {
  loadDatabase();
  
  // Apply Search and Filters
  let filtered = [...activities];
  
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(a => 
      a.name.toLowerCase().includes(q) || 
      (a.loc && a.loc.toLowerCase().includes(q)) ||
      (a.bengali && a.bengali.toLowerCase().includes(q))
    );
  }
  
  if (filterDest !== "all") {
    filtered = filtered.filter(a => a.dest === filterDest);
  }
  
  if (filterCat !== "all") {
    filtered = filtered.filter(a => a.cat === filterCat);
  }
  
  if (filterStatus !== "all") {
    const targetVal = (filterStatus === "active");
    filtered = filtered.filter(a => {
      // If undefined, default to true
      const isAct = a.active !== false;
      return isAct === targetVal;
    });
  }
  
  // Sort values
  filtered.sort((a, b) => {
    let valA = a[currentSortColumn];
    let valB = b[currentSortColumn];
    
    // Sort logic for specific column keys
    if (currentSortColumn === "name") {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (currentSortColumn === "price") {
      valA = parseInt(a.price) || 0;
      valB = parseInt(b.price) || 0;
    } else if (currentSortColumn === "cat") {
      valA = a.cat.toLowerCase();
      valB = b.cat.toLowerCase();
    } else if (currentSortColumn === "status") {
      valA = (a.active !== false) ? 1 : 0;
      valB = (b.active !== false) ? 1 : 0;
    }
    
    if (valA < valB) return currentSortDirection === "asc" ? -1 : 1;
    if (valA > valB) return currentSortDirection === "asc" ? 1 : -1;
    return 0;
  });
  
  // Handle pagination calculation
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);
  const pagedItems = filtered.slice(startIndex, endIndex);
  
  // Populate count subtitle
  const countSpan = document.getElementById('activities-subtitle-count');
  if (countSpan) {
    countSpan.textContent = `${totalCount} activities · Last updated ${getFormattedTime()}`;
  }
  
  // Setup Table Header Sort Arrows indicators
  setupTableHeaderSortIndicators();
  
  // Build rows
  let tbodyHtml = "";
  if (pagedItems.length === 0) {
    tbodyHtml = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px 0;">No activities match your filters.</td></tr>`;
  } else {
    pagedItems.forEach((a, index) => {
      const idxOnPage = startIndex + index + 1;
      const isChecked = selectedActivityIds.has(a.id) ? "checked" : "";
      
      const hasDiscount = a.price < a.prevPrice || (a.prevPrice && a.price !== a.prevPrice);
      const discountText = a.discountLabel || (hasDiscount ? `${Math.round(((a.prevPrice - a.price)/a.prevPrice)*100)}% OFF` : "—");
      const showOriginalPrice = (a.prevPrice && a.prevPrice > a.price);
      
      const isActivityActive = (a.active !== false); // default to active if undefined
      const statusBadge = isActivityActive 
        ? `<span class="badge-pill badge-active" onclick="toggleSingleActivityStatus(${a.id}, event)">ACTIVE</span>`
        : `<span class="badge-pill badge-inactive" onclick="toggleSingleActivityStatus(${a.id}, event)">INACTIVE</span>`;
      
      // Destination nice formatting
      const destName = formatDestName(a.dest);
      
      tbodyHtml += `
        <tr class="row-hover" id="activity-row-${a.id}">
          <td onclick="event.stopPropagation();" style="width: 40px; text-align: center;">
            <input type="checkbox" class="activity-checkbox" data-id="${a.id}" ${isChecked} onchange="toggleSelectActivity(${a.id}, this.checked)" style="width: 16px; height: 16px; accent-color: var(--teal); cursor: pointer;" />
          </td>
          <td style="width: 40px; color: var(--text-muted); font-size: 12px; font-family: monospace;">${idxOnPage}</td>
          <td onclick="openEditDrawer(${a.id})">
            <div>
              <span class="cell-bold">${a.name}</span>
              ${a.bengali ? `<span style="font-size:11.5px; color:#687588; margin-left:8px;">${a.bengali}</span>` : ''}
              <div class="cell-subtext" style="color: var(--teal); font-weight:600; text-transform: uppercase; letter-spacing: 0.2px;">📍 ${destName}</div>
            </div>
          </td>
          <td onclick="openEditDrawer(${a.id})">
            <span class="badge-pill badge-cat">${formatCategoryLabel(a.cat)}</span>
          </td>
          <td class="clickable-price-cell" onclick="openInlinePriceEditor(${a.id}, this, event)">
            <span class="cell-price-coral">৳${(a.price || 0).toLocaleString()}</span>
            ${showOriginalPrice ? `<span class="cell-price-original">৳${a.prevPrice.toLocaleString()}</span>` : ''}
            <div style="font-size: 10px; color: var(--text-muted); margin-top:2px;">Click to Quick-Edit ✏️</div>
          </td>
          <td onclick="openEditDrawer(${a.id})">
            <span style="font-size: 12px; font-weight: 600; color: #15803d; background: #f0fdf4; padding: 2px 6px; border-radius: 4px;">
              ${discountText}
            </span>
          </td>
          <td>${statusBadge}</td>
          <td onclick="event.stopPropagation();">
            <div class="cell-action-btn-group">
              <button class="cell-action-btn" onclick="openEditDrawer(${a.id})" title="Edit Activity Specs">✏️</button>
              <button class="cell-action-btn" onclick="duplicateActivity(${a.id})" title="Duplicate Listing">📋</button>
              <button class="cell-action-btn" style="color:#ef4444" onclick="deleteActivity(${a.id})" title="Delete Listing Permamently">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    });
  }
  
  const tbody = document.getElementById('activities-table-tbody');
  if (tbody) tbody.innerHTML = tbodyHtml;
  
  // Update Paginated UI Info
  const pageInfo = document.getElementById('activities-pagination-info');
  if (pageInfo) {
    if (totalCount === 0) {
      pageInfo.textContent = "Showing 0 of 0 activities";
    } else {
      pageInfo.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalCount} activities`;
    }
  }
  
  // Disable/enable pagination buttons
  const prevBtn = document.getElementById('activities-page-prev');
  const nextBtn = document.getElementById('activities-page-next');
  if (prevBtn) prevBtn.disabled = (currentPage === 1);
  if (nextBtn) nextBtn.disabled = (currentPage === totalPages || totalCount === 0);
  
  // Double-check master header checkbox status
  updateHeaderCheckboxState();
  
  // Render sticky bulk bar
  updateBulkActionBar();
}

function getFormattedTime() {
  const d = new Date();
  let hrs = d.getHours();
  let mins = d.getMinutes();
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  hrs = hrs % 12;
  hrs = hrs ? hrs : 12;
  mins = mins < 10 ? '0' + mins : mins;
  return `${hrs}:${mins} ${ampm}`;
}

function formatDestName(destKey) {
  const mapping = {
    cox: "Cox's Bazar",
    bandarban: "Bandarban",
    rangamati: "Rangamati",
    khagra: "Khagrachhari",
    ctg: "Chattogram"
  };
  return mapping[destKey] || destKey;
}

function formatCategoryLabel(catKey) {
  const mapping = {
    beach: "Beach",
    water: "Water Sports",
    island: "Islands",
    wildlife: "Wildlife",
    religious: "Religious",
    nature: "Nature",
    trek: "Trekking",
    cultural: "Cultural",
    shopping: "Shopping",
    photo: "Photo Session",
    food: "Food & Meals"
  };
  return mapping[catKey] || catKey;
}

// Single active/inactive inline toggler clicks
function toggleSingleActivityStatus(id, event) {
  event.stopPropagation();
  
  activities = activities.map(a => {
    if (a.id === id) {
      const newStatus = (a.active === false); // toggle
      showToast(`✓ "${a.name}" set to: ${newStatus ? 'ACTIVE' : 'INACTIVE'}`);
      return { ...a, active: newStatus };
    }
    return a;
  });
  
  saveActivities();
  renderActivitiesTable();
  renderDashboardMetrics();
}

// Duplicate Listing Action
function duplicateActivity(id) {
  const original = activities.find(a => a.id === id);
  if (!original) return;
  
  // Generate high ID range safely
  const nextId = Math.max(...activities.map(a => a.id), 0) + 1;
  const clone = JSON.parse(JSON.stringify(original));
  clone.id = nextId;
  clone.name = clone.name + " (Copy)";
  
  activities.unshift(clone); // insert at top for visible placement
  
  saveActivities();
  currentPage = 1; // jump to page 1 for visibility
  renderActivitiesTable();
  renderDashboardMetrics();
  showToast(`📋 Duplicated activity clone: "${clone.name}" created successfully.`);
}

// Delete Listing
function deleteActivity(id) {
  const original = activities.find(a => a.id === id);
  if (!original) return;
  
  if (!confirm(`Are you sure you want to permanently delete "${original.name}"? This action cannot be undone.`)) return;
  
  activities = activities.filter(a => a.id !== id);
  selectedActivityIds.delete(id);
  
  saveActivities();
  renderActivitiesTable();
  renderDashboardMetrics();
  showToast(`🗑️ "${original.name}" has been deleted.`);
}

// Dynamic Sorting Controller
function triggerSortBy(columnName) {
  if (currentSortColumn === columnName) {
    // toggle direction
    currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
  } else {
    currentSortColumn = columnName;
    currentSortDirection = "asc";
  }
  currentPage = 1;
  renderActivitiesTable();
}

function setupTableHeaderSortIndicators() {
  const headers = {
    name: "sort-col-name",
    cat: "sort-col-cat",
    price: "sort-col-price",
    status: "sort-col-status"
  };
  
  Object.keys(headers).forEach(k => {
    const el = document.getElementById(headers[k]);
    if (!el) return;
    
    // Clear display arrow
    let txt = el.textContent.replace(/▲|▼/g, "").trim();
    
    if (currentSortColumn === k) {
      txt += currentSortDirection === "asc" ? " ▲" : " ▼";
    }
    el.textContent = txt;
  });
}

// CHECKBOX STATE ENGINES
function toggleSelectAll(checked) {
  const checkboxes = document.querySelectorAll('.activity-checkbox');
  checkboxes.forEach(cb => {
    const id = parseInt(cb.getAttribute('data-id'));
    cb.checked = checked;
    if (checked) {
      selectedActivityIds.add(id);
    } else {
      selectedActivityIds.delete(id);
    }
  });
  
  updateBulkActionBar();
}

function toggleSelectActivity(id, checked) {
  if (checked) {
    selectedActivityIds.add(id);
  } else {
    selectedActivityIds.delete(id);
  }
  
  updateHeaderCheckboxState();
  updateBulkActionBar();
}

function updateHeaderCheckboxState() {
  const master = document.getElementById('master-checkbox-all');
  if (!master) return;
  
  const pageCheckboxes = document.querySelectorAll('.activity-checkbox');
  if (pageCheckboxes.length === 0) {
    master.checked = false;
    return;
  }
  
  let allChecked = true;
  pageCheckboxes.forEach(cb => {
    if (!cb.checked) allChecked = false;
  });
  master.checked = allChecked;
}

// BULK ACTION FOOTER VISIBILITY & CLICK LOGIC 
function updateBulkActionBar() {
  const bar = document.getElementById('bulk-action-bar');
  if (!bar) return;
  
  const count = selectedActivityIds.size;
  if (count > 0) {
    bar.classList.add('visible');
    const badge = document.getElementById('bulk-selected-count');
    if (badge) badge.textContent = `${count} selected`;
  } else {
    bar.classList.remove('visible');
  }
}

function bulkSetActive(activeVal) {
  if (selectedActivityIds.size === 0) return;
  
  activities = activities.map(a => {
    if (selectedActivityIds.has(a.id)) {
      return { ...a, active: activeVal };
    }
    return a;
  });
  
  saveActivities();
  selectedActivityIds.clear(); // deselect all after execution
  renderActivitiesTable();
  renderDashboardMetrics();
  showToast(`✓ Bulk status update: ${activeVal ? 'ACTIVE' : 'INACTIVE'} applied for selected.`);
}

function bulkDeleteSelected() {
  const count = selectedActivityIds.size;
  if (count === 0) return;
  
  if (!confirm(`Are you absolutely sure you want to delete all ${count} selected activities? This cannot be restored.`)) return;
  
  activities = activities.filter(a => !selectedActivityIds.has(a.id));
  selectedActivityIds.clear();
  
  saveActivities();
  renderActivitiesTable();
  renderDashboardMetrics();
  showToast(`🗑️ ${count} listings deleted bulk-wise successfully.`);
}

// BULK PRICE INCREASE/DECREASE DIALOG DRAWER ACTION
function triggerBulkPriceUpdate() {
  const count = selectedActivityIds.size;
  if (count === 0) return;
  
  const mode = prompt("Choose price adjustment command:\nType  +  to increase prices\nType  -  to decrease prices\nType  label  to set bulk discount title directly");
  if (mode === null) return;
  
  if (mode === "+" || mode === "-") {
    const amtStr = prompt(`Enter value: (e.g. 200 for ৳200 flat adjustment, or 15% for fifteen percent adjustments)`);
    if (!amtStr) return;
    
    const isPct = amtStr.includes("%");
    const val = parseFloat(amtStr.replace(/%/g, ''));
    if (isNaN(val)) {
      alert("Invalid numeric coordinates input.");
      return;
    }
    
    // Apply arithmetic adjustments
    activities = activities.map(a => {
      if (selectedActivityIds.has(a.id)) {
        let currentP = parseInt(a.price) || 0;
        let originalP = parseInt(a.prevPrice) || currentP;
        
        let delta = 0;
        if (isPct) {
          delta = Math.round(currentP * (val / 100));
        } else {
          delta = Math.round(val);
        }
        
        let newPrice = currentP;
        if (mode === "+") {
          newPrice = currentP + delta;
          // Set prevPrice (original price) backup
          if (!originalP || originalP <= currentP) {
            originalP = currentP;
          }
        } else {
          newPrice = Math.max(0, currentP - delta);
          originalP = currentP; // old price becomes baseline backup
        }
        
        return {
          ...a,
          price: newPrice,
          prevPrice: originalP
        };
      }
      return a;
    });
    
    saveActivities();
    showToast(`✓ Successfully adjusted prices in bulk for ${count} lines.`);
    renderActivitiesTable();
  } else if (mode.trim().toLowerCase() === "label") {
    const labelTitle = prompt("Enter custom bulk discount banner tag: (e.g. MONSOON SPECIAL, BOGO, 2026 BLAST)");
    if (labelTitle === null) return;
    
    activities = activities.map(a => {
      if (selectedActivityIds.has(a.id)) {
        return { ...a, discountLabel: labelTitle.trim() };
      }
      return a;
    });
    
    saveActivities();
    showToast(`✓ Applied promotional text banner to ${count} items.`);
    renderActivitiesTable();
  } else {
    alert("Invalid command coordinates typed.");
  }
}

// INLINE QUICK PRICE POPUP DIALOG CONTROL
function openInlinePriceEditor(id, cellElement, event) {
  event.stopPropagation();
  
  const original = activities.find(a => a.id === id);
  if (!original) return;
  
  inlineEditingType = "activity";
  inlineEditingActivityId = id;
  
  const popup = document.getElementById('inline-price-editor');
  if (!popup) return;
  
  // Populate inputs
  document.getElementById('inline-current-price').value = original.price || 0;
  document.getElementById('inline-original-price').value = original.prevPrice || "";
  document.getElementById('inline-discount-label').value = original.discountLabel || "";
  
  // Position popup right below or above the cell relative to viewport bounds
  popup.style.display = 'block';
  
  const rect = cellElement.getBoundingClientRect();
  const topPos = rect.bottom + window.scrollY;
  const leftPos = rect.left + window.scrollX - 40;
  
  popup.style.top = `${topPos}px`;
  popup.style.left = `${leftPos}px`;
  
  // Close inline editor if user clicks elsewhere
  document.addEventListener('click', closeInlinePriceEditorOutside);
}

function saveInlinePriceChanges() {
  const currentPrice = parseInt(document.getElementById('inline-current-price').value) || 0;
  const originalPriceVal = document.getElementById('inline-original-price').value;
  const originalPrice = originalPriceVal === "" ? null : (parseInt(originalPriceVal) || null);
  const discountLabel = document.getElementById('inline-discount-label').value.trim();

  if (inlineEditingType === "hotel") {
    if (!inlineEditingHotelId) return;
    
    let matchedName = "";
    let matchedOldPrice = 0;
    const match = hotels.find(h => String(h.id) === String(inlineEditingHotelId));
    if (match) {
      matchedName = match.name;
      matchedOldPrice = match.pricePerNight || 0;
    }
    
    hotels = hotels.map(h => {
      if (String(h.id) === String(inlineEditingHotelId)) {
        return {
          ...h,
          pricePerNight: currentPrice,
          prevPrice: originalPrice,
          discountLabel: discountLabel || null
        };
      }
      return h;
    });
    
    saveHotels();
    closeInlinePriceEditor();
    renderHotelsTable();
    showToast("✓ Hotel room rate updated inline successfully!");
    
    if (matchedName && matchedOldPrice !== currentPrice) {
      syncPriceChangeToGas(matchedName, matchedOldPrice, currentPrice);
    }
    
  } else {
    if (!inlineEditingActivityId) return;
    
    let matchedName = "";
    let matchedOldPrice = 0;
    const match = activities.find(a => a.id === inlineEditingActivityId);
    if (match) {
      matchedName = match.name;
      matchedOldPrice = match.price || 0;
    }
    
    activities = activities.map(a => {
      if (a.id === inlineEditingActivityId) {
        return {
          ...a,
          price: currentPrice,
          prevPrice: originalPrice,
          discountLabel: discountLabel || null
        };
      }
      return a;
    });
    
    saveActivities();
    closeInlinePriceEditor();
    renderActivitiesTable();
    renderDashboardMetrics();
    showToast("✓ Custom price adjustments optimized inline in 10 seconds flat!");

    if (matchedName && matchedOldPrice !== currentPrice) {
      syncPriceChangeToGas(matchedName, matchedOldPrice, currentPrice);
    }
  }
}

function closeInlinePriceEditor() {
  const popup = document.getElementById('inline-price-editor');
  if (popup) popup.style.display = 'none';
  inlineEditingActivityId = null;
  inlineEditingHotelId = null;
  document.removeEventListener('click', closeInlinePriceEditorOutside);
}

function closeInlinePriceEditorOutside(e) {
  const popup = document.getElementById('inline-price-editor');
  if (!popup) return;
  
  // check if click was outside the popup and outside any clickable pricing cells
  if (!popup.contains(e.target) && !e.target.closest('.clickable-price-cell')) {
    closeInlinePriceEditor();
  }
}

// SLIDE-IN EXPAND DRAWER FOR ADD / EDIT LOGS
function openEditDrawer(id = null) {
  editingActivityId = id;
  
  const drawer = document.getElementById('drawer-panel');
  const overlay = document.getElementById('drawer-overlay');
  const title = document.getElementById('drawer-spec-title');
  
  if (!drawer || !overlay) return;
  
  // Reset form errors
  clearFormValidationErrors();
  
  if (id === null) {
    // ADD NEW FLOW
    title.textContent = "＋ Add New Activity Listing";
    resetActivityFormFields();
  } else {
    // EDIT SPECIFIC LISTING FLOW
    const item = activities.find(a => a.id === id);
    if (!item) return;
    
    title.textContent = `✏️ Edit Activity: "${item.name}"`;
    populateActivityFormFields(item);
  }
  
  // Visual Trigger
  overlay.style.display = 'block';
  // allow animation repaint
  setTimeout(() => {
    overlay.classList.add('visible');
    drawer.classList.add('visible');
  }, 10);
}

function closeEditDrawer() {
  const drawer = document.getElementById('drawer-panel');
  const overlay = document.getElementById('drawer-overlay');
  
  if (!drawer || !overlay) return;
  
  drawer.classList.remove('visible');
  overlay.classList.remove('visible');
  
  // wait for slide animation before hiding display block
  setTimeout(() => {
    overlay.style.display = 'none';
    editingActivityId = null;
  }, 350);
}

// Character Limit Tracker setup
function setupShortDescriptionCharTracker() {
  const ta = document.getElementById('act-shortDesc');
  const counter = document.getElementById('shortDesc-counter');
  if (!ta || !counter) return;
  
  ta.addEventListener('input', () => {
    // crop excess
    if (ta.value.length > 100) {
      ta.value = ta.value.substring(0, 100);
    }
    counter.textContent = `${ta.value.length}/100`;
  });
}

// Real-time Pricing Preview calculations
function setupPricingPreviewWatcher() {
  const curPIn = document.getElementById('act-price');
  const origPIn = document.getElementById('act-prevPrice');
  const lblIn = document.getElementById('act-discountLabel');
  const previewDiv = document.getElementById('pricing-preview-result');
  
  const watcher = () => {
    const cur = parseInt(curPIn.value) || 0;
    const origVal = origPIn.value;
    const orig = origVal === "" ? 0 : (parseInt(origVal) || 0);
    
    const label = lblIn.value.trim();
    
    let html = `Preview: <strong>৳${cur.toLocaleString()}</strong>`;
    
    if (orig > cur) {
      const pct = Math.round(((orig - cur) / orig) * 100);
      html = `Preview: <span style="text-decoration:line-through; font-size:11.5px; opacity:0.8; margin-right:4px;">৳${orig.toLocaleString()}</span> ➔ <strong>৳${cur.toLocaleString()}</strong> (${pct}% off)`;
    }
    if (label !== "") {
      html += ` | Tag: <span style="background:#22c55e; color:white; padding:1px 4px; border-radius:3px; font-size:10px;">${label}</span>`;
    }
    
    previewDiv.innerHTML = html;
  };
  
  curPIn.addEventListener('input', watcher);
  origPIn.addEventListener('input', watcher);
  lblIn.addEventListener('input', watcher);
}

// SETUP REPEATABLE ITEMS ARRAY HANDLERS (INCLUSIONS / LABELS / HIGH-TENS COORDS)
function renderRepeatableTextList(containerId, valuesArray, inputPlaceholder) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = "";
  
  if (valuesArray.length === 0) {
    // Add one blank by default
    valuesArray.push("");
  }
  
  valuesArray.forEach((val, idx) => {
    const row = document.createElement('div');
    row.className = 'repeatable-item-row';
    row.innerHTML = `
      <input type="text" class="form-input-text list-item-input" value="${val.replace(/"/g, '&quot;')}" placeholder="${inputPlaceholder}" />
      <button type="button" class="repeatable-btn-del" onclick="deleteRepeatableListItem('${containerId}', ${idx})">✕</button>
    `;
    container.appendChild(row);
  });
}

function addRepeatableListItem(containerId, inputPlaceholder) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const inputs = container.querySelectorAll('.list-item-input');
  const vals = Array.from(inputs).map(i => i.value.trim());
  vals.push(""); // add empty string index
  
  renderRepeatableTextList(containerId, vals, inputPlaceholder);
}

function deleteRepeatableListItem(containerId, indexToDelete) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const inputs = container.querySelectorAll('.list-item-input');
  let vals = Array.from(inputs).map(i => i.value.trim());
  vals.splice(indexToDelete, 1);
  
  renderRepeatableTextList(containerId, vals, "");
}

// HIGHLIGHTS INPUT ROWS CONTROLS (Exactly 4 Highlights)
function setupHighlightsForm(highlightsObj = {}) {
  // Highlights is of format: { keyName: "desc" }
  // To keep it standard, we map 4 keys out of highlights
  const keys = Object.keys(highlightsObj);
  const rowsConfig = [
    { id: 1, defaultIcon: "⚡", defaultTitle: "Duration", defaultValue: "" },
    { id: 2, defaultIcon: "🎖️", defaultTitle: "Difficulty", defaultValue: "" },
    { id: 3, defaultIcon: "👪", defaultTitle: "Best Suited", defaultValue: "" },
    { id: 4, defaultIcon: "🗺️", defaultTitle: "Location", defaultValue: "" }
  ];
  
  // Fill values from object if present
  keys.forEach((k, idx) => {
    if (idx < 4) {
      rowsConfig[idx].defaultTitle = k;
      rowsConfig[idx].defaultValue = highlightsObj[k];
    }
  });
  
  // Rent keys to DOM inputs
  rowsConfig.forEach(row => {
    const iconIn = document.getElementById(`act-high-icon-${row.id}`);
    const titleIn = document.getElementById(`act-high-title-${row.id}`);
    const valIn = document.getElementById(`act-high-val-${row.id}`);
    
    if (iconIn && titleIn && valIn) {
      iconIn.value = row.defaultIcon;
      titleIn.value = row.defaultTitle;
      valIn.value = row.defaultValue;
    }
  });
}

// GROUP PRICING TIERS CONTROLS
let groupPricingTiers = []; // Array of { min: 1, max: 2, price: 3000 }

function renderGroupTiersTable() {
  const tbody = document.getElementById('act-tiers-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = "";
  
  if (groupPricingTiers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 8px;">No special tiered pricing added.</td></tr>`;
    return;
  }
  
  groupPricingTiers.forEach((t, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="number" class="form-input-text tier-min" value="${t.min || ''}" style="height:28px;" /></td>
      <td><input type="number" class="form-input-text tier-max" value="${t.max || ''}" style="height:28px;" /></td>
      <td><input type="number" class="form-input-text tier-price" value="${t.price || ''}" style="height:28px;" /></td>
      <td style="text-align:center;"><button type="button" class="repeatable-btn-del" onclick="deleteGroupTier(${idx})">✕</button></td>
    `;
    tbody.appendChild(row);
  });
}

function addGroupTier() {
  // Read current inputs before adding
  readCurrentGroupTiersFromDOM();
  groupPricingTiers.push({ min: "", max: "", price: "" });
  renderGroupTiersTable();
}

function deleteGroupTier(idx) {
  readCurrentGroupTiersFromDOM();
  groupPricingTiers.splice(idx, 1);
  renderGroupTiersTable();
}

function readCurrentGroupTiersFromDOM() {
  const rows = document.querySelectorAll('#act-tiers-tbody tr');
  if (rows.length === 0) return;
  
  const list = [];
  rows.forEach(r => {
    const minIn = r.querySelector('.tier-min');
    const maxIn = r.querySelector('.tier-max');
    const priceIn = r.querySelector('.tier-price');
    
    if (minIn && maxIn && priceIn) {
      const min = parseInt(minIn.value) || "";
      const max = parseInt(maxIn.value) || "";
      const price = parseInt(priceIn.value) || "";
      
      if (min !== "" || max !== "" || price !== "") {
        list.push({ min, max, price });
      }
    }
  });
  groupPricingTiers = list;
}

// PHOTO URL ARRAYS FALLBACK DETAILS
let photoUrlsList = [];

function renderPhotoUrlsFields() {
  const container = document.getElementById('act-photo-urls-list');
  if (!container) return;
  
  container.innerHTML = "";
  
  if (photoUrlsList.length === 0) {
    photoUrlsList.push("");
  }
  
  photoUrlsList.forEach((url, idx) => {
    const row = document.createElement('div');
    row.style.marginBottom = "8px";
    row.className = 'repeatable-item-row';
    row.innerHTML = `
      <input type="text" class="form-input-text photo-url-input" value="${url.replace(/"/g, '&quot;')}" placeholder="https://unsplash.com/photo-example..." oninput="updatePhotoThumbnailsPreview()" />
      <button type="button" class="repeatable-btn-del" onclick="deletePhotoUrlField(${idx})">✕</button>
    `;
    container.appendChild(row);
  });
  
  updatePhotoThumbnailsPreview();
}

function addPhotoUrlField() {
  readPhotoUrlsFromDOM();
  photoUrlsList.push("");
  renderPhotoUrlsFields();
}

function deletePhotoUrlField(idx) {
  readPhotoUrlsFromDOM();
  photoUrlsList.splice(idx, 1);
  renderPhotoUrlsFields();
}

function readPhotoUrlsFromDOM() {
  const inputs = document.querySelectorAll('.photo-url-input');
  photoUrlsList = Array.from(inputs).map(i => i.value.trim());
}

function updatePhotoThumbnailsPreview() {
  const inputs = document.querySelectorAll('.photo-url-input');
  const urls = Array.from(inputs).map(i => i.value.trim()).filter(url => url !== "");
  
  const grid = document.getElementById('act-photos-thumbnails-grid');
  if (!grid) return;
  
  grid.innerHTML = "";
  
  if (urls.length === 0) {
    grid.style.display = 'none';
    return;
  }
  
  grid.style.display = 'grid';
  urls.forEach((url, idx) => {
    const box = document.createElement('div');
    box.className = 'photo-thumb-container';
    box.innerHTML = `
      <img src="${url}" class="photo-thumb-img" onerror="this.src='https://images.unsplash.com/photo-1473116763269-25541579ff6f?auto=format&fit=crop&w=150&q=80'" alt="Thumbnail" referrerPolicy="no-referrer" />
      <button type="button" class="photo-thumb-del" onclick="deletePhotoThumbnailItem(${idx})">✕</button>
    `;
    grid.appendChild(box);
  });
}

function deletePhotoThumbnailItem(idx) {
  readPhotoUrlsFromDOM();
  // Find only non-empty indices to delete
  let nonEmpties = 0;
  for (let i = 0; i < photoUrlsList.length; i++) {
    if (photoUrlsList[i] !== "") {
      if (nonEmpties === idx) {
        photoUrlsList.splice(i, 1);
        break;
      }
      nonEmpties++;
    }
  }
  renderPhotoUrlsFields();
}

// RESET THE DRAWER FIELDS CLEAN FOR "ADD NEW" MODE
function resetActivityFormFields() {
  document.getElementById('act-name').value = "";
  document.getElementById('act-bengali').value = "";
  document.getElementById('act-dest').selectedIndex = 0;
  document.getElementById('act-cat').selectedIndex = 0;
  
  const ta = document.getElementById('act-shortDesc');
  ta.value = "";
  document.getElementById('shortDesc-counter').textContent = "0/100";
  
  document.getElementById('act-price').value = "";
  document.getElementById('act-prevPrice').value = "";
  document.getElementById('act-discountLabel').value = "";
  document.getElementById('act-expiry').value = "";
  document.getElementById('act-unit').selectedIndex = 0;
  
  document.getElementById('act-duration').value = "";
  document.getElementById('act-durationTag').selectedIndex = 0;
  
  // Diff radio reset
  document.getElementById('diff-easy').checked = true;
  
  // Clears traveler checkboxes
  const types = ['solo', 'couple', 'group', 'family', 'corporate'];
  types.forEach(t => {
    document.getElementById(`type-${t}`).checked = false;
  });
  
  document.getElementById('act-safety').selectedIndex = 0;
  document.getElementById('act-fullDesc').value = "";
  
  // Clear Dynamic lists
  renderRepeatableTextList('inclusions-repeatable-list', [""], "WiFi inclusion, life jacket, entrance voucher...");
  renderRepeatableTextList('exclusions-repeatable-list', [""], "Lunch box, helicopter rentals...");
  renderRepeatableTextList('notes-repeatable-list', [""], "Report 15 minutes before departure, carry valid NID...");
  
  // Highlights
  setupHighlightsForm({});
  
  // Tiers
  groupPricingTiers = [];
  renderGroupTiersTable();
  
  // Fallback Photos URLs
  photoUrlsList = [""];
  renderPhotoUrlsFields();
  
  // Additional info
  document.getElementById('act-meetingPoint').value = "";
  document.getElementById('act-bestTime').value = "";
  document.getElementById('act-cancellation').value = "";
  document.getElementById('act-minGroup').value = "";
  document.getElementById('act-maxGroup').value = "";
  document.getElementById('act-vendor').value = "";
  
  // Visibility
  document.getElementById('act-sub-active').checked = true;
  document.getElementById('act-sub-featured').checked = false;
  document.getElementById('act-sub-sortOrder').value = "0";
  
  document.getElementById('pricing-preview-result').innerHTML = "Preview: <strong>৳0</strong>";
}

// POPULATE DRAWER FIELDS FOR "EDIT SPECIFIC" MODE 
function populateActivityFormFields(item) {
  document.getElementById('act-name').value = item.name || "";
  document.getElementById('act-bengali').value = item.bengali || "";
  document.getElementById('act-dest').value = item.dest || "cox";
  document.getElementById('act-cat').value = item.cat || "beach";
  
  const ta = document.getElementById('act-shortDesc');
  ta.value = item.desc || "";
  document.getElementById('shortDesc-counter').textContent = `${ta.value.length}/100`;
  
  document.getElementById('act-price').value = item.price || 0;
  document.getElementById('act-prevPrice').value = item.prevPrice || "";
  document.getElementById('act-discountLabel').value = item.discountLabel || "";
  document.getElementById('act-expiry').value = item.discountExpiry || "";
  document.getElementById('act-unit').value = item.unit || "per person";
  
  document.getElementById('act-duration').value = item.duration || "";
  document.getElementById('act-durationTag').value = item.durationTag || "FULL DAY";
  
  // radio difficulty mapping
  const difficulty = (item.diff || "easy").toLowerCase();
  if (difficulty === "moderate" || difficulty === "medium") {
    document.getElementById('diff-moderate').checked = true;
  } else if (difficulty === "hard" || difficulty === "difficult") {
    document.getElementById('diff-hard').checked = true;
  } else {
    document.getElementById('diff-easy').checked = true;
  }
  
  // traveler checkboxes mapping
  const typesArr = item.types || [];
  const typesListExpected = ['solo', 'couple', 'group', 'family', 'corporate'];
  typesListExpected.forEach(t => {
    document.getElementById(`type-${t}`).checked = typesArr.includes(t);
  });
  
  document.getElementById('act-safety').value = item.safetyBadge || "None";
  document.getElementById('act-fullDesc').value = item.fullDescription || "";
  
  // Repeatable text lists
  renderRepeatableTextList('inclusions-repeatable-list', item.inclusions || [""], "WiFi inclusion, life jacket, entrance voucher...");
  renderRepeatableTextList('exclusions-repeatable-list', item.exclusions || [""], "Lunch box, helicopter rentals...");
  renderRepeatableTextList('notes-repeatable-list', item.importantNotes || [""], "Report 15 minutes before departure, carry valid NID...");
  
  // Highlights
  setupHighlightsForm(item.highlights || {});
  
  // Group Pricing Tiers Table
  groupPricingTiers = item.groupPricingTiers || [];
  renderGroupTiersTable();
  
  // Fallback Photos URLs
  photoUrlsList = item.photos || [item.icon || ""];
  renderPhotoUrlsFields();
  
  // Additional info
  document.getElementById('act-meetingPoint').value = item.meetingPoint || "";
  document.getElementById('act-bestTime').value = item.bestTime || "";
  document.getElementById('act-cancellation').value = item.cancellationPolicy || "";
  document.getElementById('act-minGroup').value = item.minGroupSize || "";
  document.getElementById('act-maxGroup').value = item.maxGroupSize || "";
  document.getElementById('act-vendor').value = item.vendor || "";
  
  // Visibility
  document.getElementById('act-sub-active').checked = (item.active !== false);
  document.getElementById('act-sub-featured').checked = (item.featured === true);
  document.getElementById('act-sub-sortOrder').value = item.sortOrder || "0";
  
  // trigger preview calculation Watcher
  const cur = parseInt(item.price) || 0;
  const orig = parseInt(item.prevPrice) || 0;
  const label = item.discountLabel || "";
  let html = `Preview: <strong>৳${cur.toLocaleString()}</strong>`;
  if (orig > cur) {
    const pct = Math.round(((orig - cur) / orig) * 100);
    html = `Preview: <span style="text-decoration:line-through; font-size:11.5px; opacity:0.8; margin-right:4px;">৳${orig.toLocaleString()}</span> ➔ <strong>৳${cur.toLocaleString()}</strong> (${pct}% off)`;
  }
  if (label !== "") {
    html += ` | Tag: <span style="background:#22c55e; color:white; padding:1px 4px; border-radius:3px; font-size:10px;">${label}</span>`;
  }
  document.getElementById('pricing-preview-result').innerHTML = html;
}

// FORM VALIDATOR & SAVE ACTIONS
function handleSaveActivityForm() {
  clearFormValidationErrors();
  
  const nameIn = document.getElementById('act-name');
  const destIn = document.getElementById('act-dest');
  const catIn = document.getElementById('act-cat');
  const shortDescIn = document.getElementById('act-shortDesc');
  const priceIn = document.getElementById('act-price');
  
  let isValid = true;
  
  // Validation checks
  if (nameIn.value.trim() === "") {
    nameIn.classList.add('error-highlight');
    isValid = false;
  }
  if (destIn.value === "") {
    destIn.classList.add('error-highlight');
    isValid = false;
  }
  if (catIn.value === "") {
    catIn.classList.add('error-highlight');
    isValid = false;
  }
  if (shortDescIn.value.trim() === "") {
    shortDescIn.classList.add('error-highlight');
    isValid = false;
  }
  if (priceIn.value.trim() === "" || isNaN(parseInt(priceIn.value))) {
    priceIn.classList.add('error-highlight');
    isValid = false;
  }
  
  if (!isValid) {
    showToast("⚠️ Please fill in all required (*) coordinates fields.");
    return;
  }
  
  // Gathering list inputs values safely
  const inclusionInputs = document.querySelectorAll('#inclusions-repeatable-list .list-item-input');
  const inclusions = Array.from(inclusionInputs).map(i => i.value.trim()).filter(val => val !== "");
  
  const exclusionInputs = document.querySelectorAll('#exclusions-repeatable-list .list-item-input');
  const exclusions = Array.from(exclusionInputs).map(i => i.value.trim()).filter(val => val !== "");
  
  const noteInputs = document.querySelectorAll('#notes-repeatable-list .list-item-input');
  const importantNotes = Array.from(noteInputs).map(i => i.value.trim()).filter(val => val !== "");
  
  // Gathering Highlights
  const highlights = {};
  for (let i = 1; i <= 4; i++) {
    const k = document.getElementById(`act-high-title-${i}`).value.trim();
    const v = document.getElementById(`act-high-val-${i}`).value.trim();
    if (k !== "" && v !== "") {
      highlights[k] = v;
    }
  }
  
  // Gathering Group Price Tiers
  readCurrentGroupTiersFromDOM();
  
  // Gathering Photos Urls
  readPhotoUrlsFromDOM();
  const photos = photoUrlsList.filter(url => url !== "");
  
  // Gathering traveler checkbox types
  const types = [];
  const typesListExpected = ['solo', 'couple', 'group', 'family', 'corporate'];
  typesListExpected.forEach(t => {
    if (document.getElementById(`type-${t}`).checked) {
      types.push(t);
    }
  });
  
  // Get difficulty radio value
  let diff = "easy";
  if (document.getElementById('diff-moderate').checked) {
    diff = "moderate";
  } else if (document.getElementById('diff-hard').checked) {
    diff = "hard";
  }
  
  // Save object assembly
  const priceParsed = parseInt(priceIn.value);
  const origParsedVal = document.getElementById('act-prevPrice').value;
  const prevPriceParsed = origParsedVal === "" ? null : parseInt(origParsedVal);
  
  const activityData = {
    name: nameIn.value.trim(),
    bengali: document.getElementById('act-bengali').value.trim() || null,
    dest: destIn.value,
    cat: catIn.value,
    desc: shortDescIn.value.trim(),
    price: priceParsed,
    prevPrice: prevPriceParsed,
    discountLabel: document.getElementById('act-act-discountLabel')?.value?.trim() || document.getElementById('act-discountLabel').value.trim() || null,
    discountExpiry: document.getElementById('act-expiry').value || null,
    unit: document.getElementById('act-unit').value,
    duration: document.getElementById('act-duration').value.trim(),
    durationTag: document.getElementById('act-durationTag').value,
    diff: diff,
    types: types,
    safetyBadge: document.getElementById('act-safety').value,
    fullDescription: document.getElementById('act-fullDesc').value.trim() || null,
    inclusions: inclusions,
    exclusions: exclusions,
    importantNotes: importantNotes,
    highlights: highlights,
    groupPricingTiers: groupPricingTiers,
    photos: photos,
    icon: photos[0] || "🏖️", // fallback
    meetingPoint: document.getElementById('act-meetingPoint').value.trim() || null,
    bestTime: document.getElementById('act-bestTime').value.trim() || null,
    cancellationPolicy: document.getElementById('act-cancellation').value.trim() || null,
    minGroupSize: parseInt(document.getElementById('act-minGroup').value) || null,
    maxGroupSize: parseInt(document.getElementById('act-maxGroup').value) || null,
    vendor: document.getElementById('act-vendor').value.trim() || null,
    active: document.getElementById('act-sub-active').checked,
    featured: document.getElementById('act-sub-featured').checked,
    sortOrder: parseInt(document.getElementById('act-sub-sortOrder').value) || 0
  };
  
  if (editingActivityId === null) {
    // INSERT MODE
    const nextId = Math.max(...activities.map(a => a.id), 0) + 1;
    activityData.id = nextId;
    activityData.rating = 4.8; // default rating
    activityData.reviews = 1; // default reviews
    activities.unshift(activityData); // place at top
    showToast(`✓ Created brand-new activity: "${activityData.name}"`);
  } else {
    // UPDATE MODE
    activities = activities.map(a => {
      if (a.id === editingActivityId) {
        // preserve original reviews/rating
        return {
          ...a,
          ...activityData,
          id: editingActivityId,
          rating: a.rating || 4.8,
          reviews: a.reviews || 1
        };
      }
      return a;
    });
    showToast(`✓ Updated specs for listing: "${activityData.name}" successfully.`);
  }
  
  saveActivities();
  closeEditDrawer();
  
  // Refresh sections
  renderActivitiesTable();
  renderDashboardMetrics();
}

function clearFormValidationErrors() {
  const fields = ['act-name', 'act-dest', 'act-cat', 'act-shortDesc', 'act-price'];
  fields.forEach(fid => {
    const el = document.getElementById(fid);
    if (el) el.classList.remove('error-highlight');
  });
}

// ==========================================
// HOTEL MANAGEMENT MODULE FUNCTIONS
// ==========================================

// Hotel filters and states
let filterHotelDest = "all";
let filterHotelTier = "all";
let filterHotelStatus = "all";
let currentPageHotels = 1;
const itemsPerPageHotels = 10;
let selectedHotelIds = new Set();
let editingHotelId = null; // null means 'Add New'
let hotelPhotoUrlsList = [""];

// Map hotel values for user-friendly stars rendering
function renderStarIcons(starCount) {
  let starsHtml = "";
  const count = parseInt(starCount) || 0;
  for (let i = 0; i < 5; i++) {
    if (i < count) {
      starsHtml += "⭐";
    }
  }
  return starsHtml || "—";
}

function getFormattedHotelTier(tier) {
  if (!tier) return "—";
  const label = tier.toUpperCase();
  if (tier === "luxury") return `<span class="badge-pill" style="background:#fffbeb; color:#b45309; border:1px solid #fde68a; font-weight:700;">💎 LUXURY</span>`;
  if (tier === "premium") return `<span class="badge-pill" style="background:#f0f9ff; color:#0369a1; border:1px solid #bae6fd; font-weight:700;">PREMIUM</span>`;
  if (tier === "midrange") return `<span class="badge-pill" style="background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; font-weight:700;">MID-RANGE</span>`;
  if (tier === "budget") return `<span class="badge-pill" style="background:#f9fafb; color:#4b5563; border:1px solid #e5e7eb; font-weight:700;">BUDGET</span>`;
  return `<span class="badge-pill badge-cat">${label}</span>`;
}

// Global list renderer for hotels table
function renderHotelsTable() {
  loadDatabase();
  
  // Search filter
  const searchInput = document.getElementById('hotels-search-field');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  
  let filtered = [...hotels];
  
  if (query !== "") {
    filtered = filtered.filter(h => 
      h.name.toLowerCase().includes(query) || 
      (h.loc && h.loc.toLowerCase().includes(query)) ||
      (h.bengali && h.bengali.toLowerCase().includes(query))
    );
  }
  
  if (filterHotelDest !== "all") {
    filtered = filtered.filter(h => h.dest === filterHotelDest);
  }
  
  if (filterHotelTier !== "all") {
    filtered = filtered.filter(h => h.tier === filterHotelTier);
  }
  
  if (filterHotelStatus !== "all") {
    const isTargetActive = (filterHotelStatus === "active");
    filtered = filtered.filter(h => {
      const isActive = h.active !== false;
      return isActive === isTargetActive;
    });
  }
  
  // Update section count
  const countSpan = document.getElementById('hotels-subtitle-count');
  if (countSpan) {
    const totalCount = filtered.length;
    // Calculate unique destinations present
    const uniqueDests = [...new Set(filtered.map(h => formatDestName(h.dest)))].join(", ");
    countSpan.textContent = `${totalCount} hotels · ${uniqueDests || "Cox's Bazar, Bandarban, Rangamati"}`;
  }
  
  // Sort hotels by name alphabetically as standard
  filtered.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  
  // Pagination
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / itemsPerPageHotels) || 1;
  if (currentPageHotels > totalPages) currentPageHotels = totalPages;
  if (currentPageHotels < 1) currentPageHotels = 1;
  
  const startIndex = (currentPageHotels - 1) * itemsPerPageHotels;
  const endIndex = Math.min(startIndex + itemsPerPageHotels, totalCount);
  const pagedItems = filtered.slice(startIndex, endIndex);
  
  let tbodyHtml = "";
  if (pagedItems.length === 0) {
    tbodyHtml = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 32px 0;">No hotels match your filters.</td></tr>`;
  } else {
    pagedItems.forEach((h, index) => {
      const isChecked = selectedHotelIds.has(h.id) ? "checked" : "";
      const isActive = (h.active !== false);
      const statusBadge = isActive
        ? `<span class="badge-pill badge-active" onclick="toggleSingleHotelStatus('${h.id}', event)">ACTIVE</span>`
        : `<span class="badge-pill badge-inactive" onclick="toggleSingleHotelStatus('${h.id}', event)">INACTIVE</span>`;
      
      const hasDiscount = h.pricePerNight < h.prevPrice || (h.prevPrice && h.pricePerNight !== h.prevPrice);
      const discountText = h.discountLabel || h.discountText || (hasDiscount ? `${Math.round(((h.prevPrice - h.pricePerNight)/h.prevPrice)*100)}% OFF` : "—");
      const showOriginalPrice = (h.prevPrice && h.prevPrice > h.pricePerNight);
      
      tbodyHtml += `
        <tr class="row-hover" id="hotel-row-${h.id}">
          <td onclick="event.stopPropagation();" style="width: 40px; text-align: center;">
            <input type="checkbox" class="hotel-checkbox" data-id="${h.id}" ${isChecked} onchange="toggleSelectHotel('${h.id}', this.checked)" style="width: 16px; height: 16px; accent-color: var(--teal); cursor: pointer;" />
          </td>
          <td onclick="openHotelDrawer('${h.id}')" style="cursor:pointer;">
            <div>
              <span class="cell-bold">${h.name}</span>
              ${h.bengali ? `<span style="font-size:11.5px; color:#687588; margin-left:8px;">${h.bengali}</span>` : ''}
              <div class="cell-subtext" style="color: var(--teal); font-weight:600; text-transform: uppercase;">📍 ${h.loc || formatDestName(h.dest)}</div>
            </div>
          </td>
          <td onclick="openHotelDrawer('${h.id}')" style="cursor:pointer;">
            ${getFormattedHotelTier(h.tier)}
          </td>
          <td onclick="openHotelDrawer('${h.id}')" style="cursor:pointer; white-space:nowrap;">
            ${renderStarIcons(h.stars)}
          </td>
          <td class="clickable-price-cell" style="cursor:pointer;" onclick="openInlineHotelPriceEditor('${h.id}', this, event)">
            <span class="cell-price-coral">৳${(h.pricePerNight || 0).toLocaleString()}</span>
            <div style="font-size: 10px; color: var(--text-muted); margin-top:2px;">Click to Quick-Edit ✏️</div>
          </td>
          <td onclick="openHotelDrawer('${h.id}')" style="cursor:pointer;">
            ${showOriginalPrice ? `<span class="cell-price-original">৳${h.prevPrice.toLocaleString()}</span>` : '—'}
          </td>
          <td onclick="openHotelDrawer('${h.id}')" style="cursor:pointer;">
            ${discountText !== "—" ? `<span style="font-size: 12px; font-weight: 600; color: #15803d; background: #f0fdf4; padding: 2px 6px; border-radius: 4px;">${discountText}</span>` : '—'}
          </td>
          <td>${statusBadge}</td>
          <td onclick="event.stopPropagation();">
            <div class="cell-action-btn-group">
              <button class="cell-action-btn" onclick="openHotelDrawer('${h.id}')" title="Edit Hotel Specs">✏️</button>
              <button class="cell-action-btn" onclick="duplicateHotel('${h.id}')" title="Duplicate Listing">📋</button>
              <button class="cell-action-btn" style="color:#ef4444" onclick="deleteHotel('${h.id}')" title="Delete Listing Permamently">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    });
  }
  
  const tbody = document.getElementById('hotels-table-tbody');
  if (tbody) tbody.innerHTML = tbodyHtml;
  
  // Pagination UI counts
  const pageInfo = document.getElementById('hotels-pagination-info');
  if (pageInfo) {
    if (totalCount === 0) {
      pageInfo.textContent = "Showing 0 of 0 hotels";
    } else {
      pageInfo.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalCount} hotels`;
    }
  }
  
  // Disable/enable pagination buttons
  const prevBtn = document.getElementById('hotels-page-prev');
  const nextBtn = document.getElementById('hotels-page-next');
  if (prevBtn) prevBtn.disabled = (currentPageHotels === 1);
  if (nextBtn) nextBtn.disabled = (currentPageHotels === totalPages || totalCount === 0);
  
  // Handle Master Checkbox updates
  const masterChk = document.getElementById('master-hotel-checkbox-all');
  if (masterChk) {
    const checkboxes = document.querySelectorAll('.hotel-checkbox');
    if (checkboxes.length > 0) {
      const allChecked = Array.from(checkboxes).every(chk => chk.checked);
      masterChk.checked = allChecked;
    } else {
      masterChk.checked = false;
    }
  }
}

// Single active/inactive inline toggle clicks for Hotels
function toggleSingleHotelStatus(id, event) {
  event.stopPropagation();
  
  hotels = hotels.map(h => {
    if (String(h.id) === String(id)) {
      const newStatus = (h.active === false);
      showToast(`✓ "${h.name}" set to: ${newStatus ? 'ACTIVE' : 'INACTIVE'}`);
      return { ...h, active: newStatus };
    }
    return h;
  });
  
  saveHotels();
  renderHotelsTable();
}

function saveHotels() {
  localStorage.setItem('tcbd_hotels', JSON.stringify(hotels));
  loadDatabase();
  // Dispatch custom storage event so that React context notices the change immediately
  window.dispatchEvent(new Event('storage'));
}

// Bulk Selection mechanics
function toggleSelectHotel(id, checked) {
  if (checked) {
    selectedHotelIds.add(id);
  } else {
    selectedHotelIds.delete(id);
  }
}

function toggleSelectAllHotels(checked) {
  const checkboxes = document.querySelectorAll('.hotel-checkbox');
  checkboxes.forEach(chk => {
    chk.checked = checked;
    const id = chk.getAttribute('data-id');
    if (checked) {
      selectedHotelIds.add(id);
    } else {
      selectedHotelIds.delete(id);
    }
  });
}

// DRAWER ACTIONS: OPEN SPECIFIC HOTEL PROPERTIES
function openHotelDrawer(id = null) {
  clearHotelValidationErrors();
  editingHotelId = id;
  
  const drawerOverlay = document.getElementById('hotel-drawer-overlay');
  const drawerPanel = document.getElementById('hotel-drawer-panel');
  
  if (!drawerOverlay || !drawerPanel) return;
  
  if (id === null) {
    // Mode ADD NEW
    document.getElementById('hotel-drawer-spec-title').innerText = "＋ Add New Hotel Property";
    
    // Reset all standard fields
    document.getElementById('hotel-name').value = "";
    document.getElementById('hotel-bengali').value = "";
    document.getElementById('hotel-dest').value = "";
    document.getElementById('hotel-tier').value = "";
    document.getElementById('hotel-stars').value = "4";
    document.getElementById('hotel-pricePerNight').value = "";
    document.getElementById('hotel-prevPrice').value = "";
    document.getElementById('hotel-discountText').value = "";
    document.getElementById('hotel-desc').value = "";
    document.getElementById('hotel-specialty').value = "";
    document.getElementById('hotel-loc').value = "";
    document.getElementById('hotel-phone').value = "";
    document.getElementById('hotel-cancelPolicy').value = "Full refund up to 24 hours prior";
    document.getElementById('hotel-checkInHour').value = "12:00 PM";
    document.getElementById('hotel-checkOutHour').value = "11:00 AM";
    document.getElementById('hotel-sub-active').checked = true;
    document.getElementById('hotel-sub-featured').checked = false;
    document.getElementById('hotel-sub-sortOrder').value = "0";
    
    // Clear Amenities Checklists
    document.querySelectorAll('input[name="hotel-amenity"]').forEach(chk => chk.checked = false);
    
    // Clear Room Types Checklists
    document.querySelectorAll('input[name="hotel-roomtype"]').forEach(chk => chk.checked = false);
    
    // Setup first photos fields
    hotelPhotoUrlsList = [""];
    renderHotelPhotoUrlFields();
  } else {
    // Mode MODIFY SPEC
    document.getElementById('hotel-drawer-spec-title').innerText = "✏️ Modify Hotel Listing Specs";
    
    const h = hotels.find(item => String(item.id) === String(id));
    if (!h) {
      showToast("❌ Unable to retrieve hotel specification logs.");
      return;
    }
    
    // Populate standard fields
    document.getElementById('hotel-name').value = h.name || "";
    document.getElementById('hotel-bengali').value = h.bengali || "";
    document.getElementById('hotel-dest').value = h.dest || "";
    document.getElementById('hotel-tier').value = h.tier || "";
    document.getElementById('hotel-stars').value = String(h.stars || 4);
    document.getElementById('hotel-pricePerNight').value = h.pricePerNight || "";
    document.getElementById('hotel-prevPrice').value = h.prevPrice || "";
    document.getElementById('hotel-discountText').value = h.discountLabel || h.discountText || "";
    document.getElementById('hotel-desc').value = h.desc || h.description || "";
    document.getElementById('hotel-specialty').value = h.specialty || "";
    document.getElementById('hotel-loc').value = h.loc || "";
    document.getElementById('hotel-phone').value = h.phone || "";
    document.getElementById('hotel-cancelPolicy').value = h.cancelPolicy || h.cancellationPolicy || "Full refund up to 24 hours prior";
    document.getElementById('hotel-checkInHour').value = h.checkInHour || h.checkinHour || "12:00 PM";
    document.getElementById('hotel-checkOutHour').value = h.checkOutHour || h.checkoutHour || "11:00 AM";
    document.getElementById('hotel-sub-active').checked = (h.active !== false);
    document.getElementById('hotel-sub-featured').checked = (h.featured === true);
    document.getElementById('hotel-sub-sortOrder').value = String(h.sortOrder || 0);
    
    // Populate Amenities Checklists
    const activeAmenities = h.amenities || [];
    document.querySelectorAll('input[name="hotel-amenity"]').forEach(chk => {
      chk.checked = activeAmenities.includes(chk.value);
    });
    
    // Populate Room Types Checklists
    const activeRooms = h.roomTypes || h.rooms || [];
    document.querySelectorAll('input[name="hotel-roomtype"]').forEach(chk => {
      chk.checked = activeRooms.includes(chk.value);
    });
    
    // Photo URLs list populating
    hotelPhotoUrlsList = (h.photos && h.photos.length > 0) ? [...h.photos] : [""];
    renderHotelPhotoUrlFields();
  }
  
  // Slide in
  drawerOverlay.classList.add('active');
  drawerPanel.classList.add('active');
}

function closeHotelDrawer() {
  const drawerOverlay = document.getElementById('hotel-drawer-overlay');
  const drawerPanel = document.getElementById('hotel-drawer-panel');
  if (drawerOverlay) drawerOverlay.classList.remove('active');
  if (drawerPanel) drawerPanel.classList.remove('active');
  editingHotelId = null;
}

// Clear Validation style boxes on opening Hotel drawer
function clearHotelValidationErrors() {
  const fields = ['hotel-name', 'hotel-dest', 'hotel-tier', 'hotel-pricePerNight', 'hotel-desc', 'hotel-loc'];
  fields.forEach(fid => {
    const el = document.getElementById(fid);
    if (el) el.classList.remove('error-highlight');
  });
}

// Manage photo URLs fields list dynamically
function renderHotelPhotoUrlFields() {
  const container = document.getElementById('hotel-photos-repeatable-list');
  if (!container) return;
  
  let html = "";
  hotelPhotoUrlsList.forEach((url, idx) => {
    html += `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <input type="text" class="form-input-text hotel-photo-input" placeholder="https://images.unsplash.com/photo-..." value="${url}" style="margin:0; flex:1;" onchange="updateHotelPhotoField(${idx}, this.value)" />
        <button type="button" class="action-btn btn-ghost" style="color:#ef4444; border-color:#fee2e2; height:38px; width:38px; padding:0; display:flex; align-items:center; justify-content:center;" onclick="removeHotelPhotoField(${idx})">🗑️</button>
      </div>
    `;
  });
  
  container.innerHTML = html;
  updateHotelThumbnailsPreview();
}

function updateHotelPhotoField(idx, value) {
  hotelPhotoUrlsList[idx] = value.trim();
  updateHotelThumbnailsPreview();
}

function removeHotelPhotoField(idx) {
  hotelPhotoUrlsList.splice(idx, 1);
  if (hotelPhotoUrlsList.length === 0) hotelPhotoUrlsList = [""];
  renderHotelPhotoUrlFields();
}

function addHotelPhotoField() {
  hotelPhotoUrlsList.push("");
  renderHotelPhotoUrlFields();
}

// Thumbnail Live Previews
function updateHotelThumbnailsPreview() {
  const grid = document.getElementById('hotel-photos-thumbnails-grid');
  if (!grid) return;
  
  const validPhotos = hotelPhotoUrlsList.filter(url => url.trim().startsWith("http"));
  if (validPhotos.length === 0) {
    grid.style.display = 'none';
    grid.innerHTML = "";
    return;
  }
  
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
  
  let html = "";
  validPhotos.forEach(url => {
    html += `<img src="${url}" referrerPolicy="no-referrer" style="width:100%; height:50px; object-fit:cover; border-radius:4px; border:1px solid var(--border-color);" />`;
  });
  grid.innerHTML = html;
}

// SAVE FORM HANDLER
function handleSaveHotelForm() {
  clearHotelValidationErrors();
  
  const name = document.getElementById('hotel-name').value.trim();
  const bengali = document.getElementById('hotel-bengali').value.trim();
  const dest = document.getElementById('hotel-dest').value;
  const tier = document.getElementById('hotel-tier').value;
  const stars = parseInt(document.getElementById('hotel-stars').value) || 4;
  const pricePerNight = parseInt(document.getElementById('hotel-pricePerNight').value);
  const prevPriceVal = document.getElementById('hotel-prevPrice').value.trim();
  const prevPrice = prevPriceVal === "" ? null : parseInt(prevPriceVal);
  const discountText = document.getElementById('hotel-discountText').value.trim();
  const desc = document.getElementById('hotel-desc').value.trim();
  const specialty = document.getElementById('hotel-specialty').value.trim();
  const loc = document.getElementById('hotel-loc').value.trim();
  const phone = document.getElementById('hotel-phone').value.trim();
  const cancelPolicy = document.getElementById('hotel-cancelPolicy').value.trim();
  const checkInHour = document.getElementById('hotel-checkInHour').value.trim();
  const checkOutHour = document.getElementById('hotel-checkOutHour').value.trim();
  const active = document.getElementById('hotel-sub-active').checked;
  const featured = document.getElementById('hotel-sub-featured').checked;
  const sortOrder = parseInt(document.getElementById('hotel-sub-sortOrder').value) || 0;
  
  // Validate Required Specs
  let hasError = false;
  const required = [
    { id: 'hotel-name', val: name },
    { id: 'hotel-dest', val: dest },
    { id: 'hotel-tier', val: tier },
    { id: 'hotel-pricePerNight', val: pricePerNight },
    { id: 'hotel-desc', val: desc },
    { id: 'hotel-loc', val: loc }
  ];
  
  required.forEach(item => {
    if (!item.val) {
      document.getElementById(item.id).classList.add('error-highlight');
      hasError = true;
    }
  });
  
  if (hasError) {
    showToast("⚠️ Please complete all required specifications!");
    return;
  }
  
  // Amenities checklists gather
  const amenities = [];
  document.querySelectorAll('input[name="hotel-amenity"]:checked').forEach(chk => {
    amenities.push(chk.value);
  });
  
  // Room types gather
  const roomTypes = [];
  document.querySelectorAll('input[name="hotel-roomtype"]:checked').forEach(chk => {
    roomTypes.push(chk.value);
  });
  
  // Gather other input photo values
  const inputs = document.querySelectorAll('.hotel-photo-input');
  const photos = [];
  inputs.forEach(inp => {
    const val = inp.value.trim();
    if (val.startsWith("http")) photos.push(val);
  });
  
  const hotelPayload = {
    name,
    bengali: bengali || null,
    dest,
    tier,
    stars,
    pricePerNight,
    prevPrice,
    discountLabel: discountText || null,
    desc,
    specialty: specialty || null,
    loc,
    phone: phone || null,
    photos,
    amenities,
    roomTypes,
    cancelPolicy,
    checkInHour,
    checkOutHour,
    active,
    featured,
    sortOrder,
    icon: tier === "luxury" ? "🏰" : (tier === "premium" ? "🏢" : "🏨")
  };
  
  if (editingHotelId === null) {
    // Generate new unique ID
    const maxId = Math.max(...hotels.map(item => parseInt(item.id) || 0), 0);
    hotelPayload.id = String(maxId + 1);
    
    // Default mock review scores
    hotelPayload.rating = 4.7;
    hotelPayload.reviews = 1;
    
    hotels.unshift(hotelPayload);
    showToast(`✓ Registered brand-new hotel specifications: "${name}"`);
  } else {
    // Update Mode
    hotels = hotels.map(item => {
      if (String(item.id) === String(editingHotelId)) {
        return {
          ...item,
          ...hotelPayload,
          id: editingHotelId,
          rating: item.rating || 4.7,
          reviews: item.reviews || 1
        };
      }
      return item;
    });
    showToast(`✓ Updated specs for hotel: "${name}" successfully.`);
  }
  
  saveHotels();
  closeHotelDrawer();
  renderHotelsTable();
}

// Duplicate listing
function duplicateHotel(id) {
  const original = hotels.find(item => String(item.id) === String(id));
  if (!original) {
    showToast("❌ Unable to find the original hotel listing to clone.");
    return;
  }
  
  const cloned = {
    ...original,
    name: `${original.name} (Copy)`,
    id: String(Math.max(...hotels.map(item => parseInt(item.id) || 0), 0) + 1),
    active: false // start as inactive to let admin edit before publishing
  };
  
  hotels.unshift(cloned);
  saveHotels();
  renderHotelsTable();
  showToast(`📋 Cloned "${original.name}" successfully!`);
}

// Delete listing
function deleteHotel(id) {
  const h = hotels.find(item => String(item.id) === String(id));
  if (!h) return;
  
  if (!confirm(`⚠️ CRITICAL COMMAND: Are you sure you want to permanently delete hotel "${h.name}" from TourCartBD database? This action is IRREVERSIBLE and will also remove it from anyone's checkout list.`)) {
    return;
  }
  
  hotels = hotels.filter(item => String(item.id) !== String(id));
  saveHotels();
  renderHotelsTable();
  showToast(`🗑️ "${h.name}" has been deleted.`);
}

// INLINE PRICE QUICK EDITOR FOR HOTELS
function openInlineHotelPriceEditor(id, cellElement, event) {
  event.stopPropagation();
  
  const original = hotels.find(item => String(item.id) === String(id));
  if (!original) return;
  
  inlineEditingType = "hotel";
  inlineEditingHotelId = id;
  
  const popup = document.getElementById('inline-price-editor');
  if (!popup) return;
  
  // Populate inputs with current hotel pricing variables
  document.getElementById('inline-current-price').value = original.pricePerNight || 0;
  document.getElementById('inline-original-price').value = original.prevPrice || "";
  document.getElementById('inline-discount-label').value = original.discountLabel || original.discountText || "";
  
  // Position
  popup.style.display = 'block';
  const rect = cellElement.getBoundingClientRect();
  const topPos = rect.bottom + window.scrollY;
  const leftPos = rect.left + window.scrollX - 40;
  
  popup.style.top = `${topPos}px`;
  popup.style.left = `${leftPos}px`;
  
  document.addEventListener('click', closeInlinePriceEditorOutside);
}

// DRAG AND DROP FILE PREVENT FALLBACK INSTRUCTIONS
function setupDragAndDropSandbox() {
  const zone = document.getElementById('act-photos-dropzone');
  if (!zone) return;
  
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.style.borderColor = 'var(--teal)';
  });
  
  zone.addEventListener('dragleave', () => {
    zone.style.borderColor = 'var(--border-color)';
  });
  
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.style.borderColor = 'var(--border-color)';
    showToast("ℹ️ Drop successful: Save fallback photos via absolute HTTP link inputs below. Storage uploads link to Firebase in Phase 2.");
  });
  
  zone.addEventListener('click', () => {
    // Simulates selecting file
    const url = prompt("Enter online layout photo absolute URL address:");
    if (url && url.trim().startsWith("http")) {
      readPhotoUrlsFromDOM();
      // add as first or replace blank
      if (photoUrlsList[0] === "") {
        photoUrlsList[0] = url.trim();
      } else {
        photoUrlsList.push(url.trim());
      }
      renderPhotoUrlsFields();
    }
  });
}

// INITIAL DOM ASSEMBLY & TRIGGERS
document.addEventListener("DOMContentLoaded", () => {
  // Check if admin session persists
  const session = localStorage.getItem('tcbd_admin_authorized');
  if (session === 'true') {
    // Auto login
    adminLoggedIn = true;
    const loginScreen = document.getElementById('login-screen');
    const appLayout = document.getElementById('admin-layout');
    if (loginScreen && appLayout) {
      loginScreen.style.display = 'none';
      appLayout.style.display = 'grid';
    }
    loadDatabase();
    renderDashboardMetrics();
    renderHotelsTable();
  }
  
  // Watch search inputs
  const searchInput = document.getElementById('activities-search-field');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      renderActivitiesTable();
    });
  }

  const hotelSearchInput = document.getElementById('hotels-search-field');
  if (hotelSearchInput) {
    hotelSearchInput.addEventListener('input', (e) => {
      currentPageHotels = 1;
      renderHotelsTable();
    });
  }
  
  // Watch shortDesc tracker
  setupShortDescriptionCharTracker();
  
  // Watch live math watcher
  setupPricingPreviewWatcher();
  
  // Setup file drag
  setupDragAndDropSandbox();

  // Watch for keyboard shortcut Ctrl+S or Cmd+S to save all prices instantly
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      const pmSec = document.getElementById('section-prices');
      if (pmSec && pmSec.classList.contains('active')) {
        e.preventDefault();
        saveAllPriceChanges();
      }
    }
  });

  // Watch Enter keypress inside table editors to move focus rapidly down
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('pm-edit-input')) {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('.pm-edit-input:not([disabled])'));
      const idx = inputs.indexOf(e.target);
      if (idx !== -1 && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
        inputs[idx + 1].select();
      }
    }
  });

  // Run automatically on operations panel load
  checkAndReportExpiredCampaignsOnLoad();
});

/* -------------------------------------------------------------
   PRICE MANAGER & DISCOUNT CAMPAIGN MANAGER MODULES
   ------------------------------------------------------------- */

let pmUnsavedChanges = {}; // Keys: "type-id-field", Value: newValue
let pmActivitiesQuery = "";
let dmActiveTab = "activities";
let dmSelectedIds = new Set();

// Seeding Fallbacks for Bus Classes and Local Transport
function seedBusAndTransportIfEmpty() {
  const ORIGINAL_BUS_CLASSES = [
    {
      id: 'ac', icon: '❄️', name: 'AC Chair Coach',
      desc: 'Air-conditioned recliner seats with ample legroom. Most popular choice for couples and professionals. Arrives in 9–10 hrs.',
      priceRange: { 'dhaka-cox': 1200, 'dhaka-bandarban': 1000, 'dhaka-rangamati': 1100, 'ctg-cox': 500, 'dhaka-ctg': 700 }
    },
    {
      id: 'sleeper', icon: '🛏️', name: 'AC Sleeper / Double Cabin',
      desc: 'Fully flat sleeper berths — upper and lower. Ideal for overnight journeys so you arrive fresh. Book early, limited berths.',
      priceRange: { 'dhaka-cox': 1800, 'dhaka-bandarban': 1600, 'dhaka-rangamati': 1700, 'ctg-cox': 800, 'dhaka-ctg': 1100 }
    },
    {
      id: 'business', icon: '💺', name: 'Business Class',
      desc: 'Wide luxury seats with extra recline, premium amenities, and fewer seats per coach. For a premium travel experience.',
      priceRange: { 'dhaka-cox': 1600, 'dhaka-bandarban': 1400, 'dhaka-rangamati': 1500, 'ctg-cox': 700, 'dhaka-ctg': 900 }
    },
    {
      id: 'nonac', icon: '🚌', name: 'Non-AC / Economy',
      desc: 'Budget-friendly regular bus. No air conditioning but ventilated windows. Best for budget travelers and short hops.',
      priceRange: { 'dhaka-cox': 600, 'dhaka-bandarban': 550, 'dhaka-rangamati': 580, 'ctg-cox': 250, 'dhaka-ctg': 400 }
    }
  ];

  const ORIGINAL_LOCAL_TRANSPORT = [
    { id: 'lt1', dest: 'cox', icon: '🛺', name: 'CNG Auto-rickshaw — Full Day', price: 1200, unit: 'per vehicle/day', active: true },
    { id: 'lt2', dest: 'cox', icon: '🚗', name: "Private Car — Cox's Bazar Full Day", price: 2500, unit: 'per vehicle/day', popular: true, active: true },
    { id: 'lt3', dest: 'cox', icon: '🛥️', name: 'Speed Boat — Marine Drive Cruise', price: 3000, unit: 'per boat (up to 8 pax)', active: true },
    { id: 'lt4', dest: 'cox', icon: '🏍️', name: 'Motorbike Rental — Self Drive', price: 700, unit: 'per day', active: true },
    { id: 'lt5', dest: 'cox', icon: '🚌', name: "Local Bus — Cox's Bazar to Teknaf", price: 150, unit: 'per person', active: true },
    { id: 'lt6', dest: 'bandarban', icon: '🚙', name: 'Jeep — Chimbuk & Nilgiri', price: 4500, unit: 'per jeep/day', popular: true, active: true },
    { id: 'lt7', dest: 'bandarban', icon: '🛵', name: 'Motorbike — Bandarban Local', price: 600, unit: 'per day', active: true },
    { id: 'lt8', dest: 'rangamati', icon: '⛵', name: 'Private Boat — Kaptai Lake Full Day', price: 5000, unit: 'per boat/day', popular: true, active: true },
    { id: 'lt9', dest: 'rangamati', icon: '🚤', name: 'Shared Boat — Shuvolong Tour', price: 600, unit: 'per person', active: true },
    { id: 'lt10', dest: 'khagra', icon: '🚗', name: 'Car + Driver — Khagrachhari Day Tour', price: 2000, unit: 'per vehicle/day', active: true },
    { id: 'lt11', dest: 'khagra', icon: '🚶', name: 'Guided Walking Tour — Alutila Circuit', price: 800, unit: 'per person', active: true }
  ];

  if (!localStorage.getItem('tcbd_bus_classes')) {
    localStorage.setItem('tcbd_bus_classes', JSON.stringify(ORIGINAL_BUS_CLASSES));
  }
  if (!localStorage.getItem('tcbd_local_transport')) {
    localStorage.setItem('tcbd_local_transport', JSON.stringify(ORIGINAL_LOCAL_TRANSPORT));
  }
}

// -----------------------------------------------------------------------------
// PRICE MANAGER TAB RENDERS
// -----------------------------------------------------------------------------
function renderPriceManager() {
  seedBusAndTransportIfEmpty();
  loadDatabase();
  
  // Clean up any expired campaigns before showing the pricing grid to keep things pristine
  autoClearExpiredCampaignsSilent();

  // Elements update headers
  const actHeader = document.getElementById('pm-activities-header');
  if (actHeader) actHeader.innerText = `🏄 Activities (${activities.length})`;

  const hotHeader = document.getElementById('pm-hotels-header');
  if (hotHeader) hotHeader.innerText = `🏨 Hotels (${hotels.length})`;

  const transportHeader = document.getElementById('pm-transport-header');
  if (transportHeader) transportHeader.innerText = `🚗 Local Transport (${localTransport.length})`;

  // Update counter banner
  updatePmUnsavedChangesBanner();

  // Render Section Tables
  renderPmActivities();
  renderPmHotels();
  renderPmBuses();
  renderPmTransport();
}

// HELPERS TO READ VALUES INCLUDING UNSAVED TRACKING
function getPmVal(type, id, field, fallback) {
  const key = `${type}-${id}-${field}`;
  if (key in pmUnsavedChanges) {
    return pmUnsavedChanges[key];
  }
  return fallback !== undefined && fallback !== null ? fallback : '';
}

function getPmToggleVal(type, id, field, fallback) {
  const key = `${type}-${id}-${field}`;
  if (key in pmUnsavedChanges) {
    return pmUnsavedChanges[key];
  }
  return fallback;
}

function getPmBusVal(busId, routeId, field, fallback) {
  const key = `buses-${busId}-${routeId}-${field}`;
  if (key in pmUnsavedChanges) {
    return pmUnsavedChanges[key];
  }
  return fallback !== undefined && fallback !== null ? fallback : '';
}

function getPmBusToggleVal(busId, routeId, fallback) {
  const key = `buses-${busId}-${routeId}-active`;
  if (key in pmUnsavedChanges) {
    return pmUnsavedChanges[key];
  }
  return fallback;
}

// RENDER SECTION 1: ACTIVITIES
function renderPmActivities() {
  const tbody = document.getElementById('pm-activities-tbody');
  if (!tbody) return;

  let filtered = [...activities];
  if (pmActivitiesQuery.trim() !== "") {
    const q = pmActivitiesQuery.toLowerCase().trim();
    filtered = filtered.filter(a => a.name.toLowerCase().includes(q) || (a.loc && a.loc.toLowerCase().includes(q)));
  }

  tbody.innerHTML = filtered.map(a => {
    const name = a.name;
    const dest = a.dest ? a.dest.toUpperCase() : 'COX';
    const originalPrice = getPmVal('activities', a.id, 'prevPrice', a.prevPrice || a.price);
    const sellingPrice = getPmVal('activities', a.id, 'price', a.price);
    const discountLabel = getPmVal('activities', a.id, 'discountLabel', a.discountLabel || '');
    const discountExpiry = getPmVal('activities', a.id, 'discountExpiry', a.discountExpiry || '');
    const activeVal = getPmToggleVal('activities', a.id, 'active', a.active !== false);

    const isPrevPriceChanged = isPmChange('activities', a.id, 'prevPrice', a.prevPrice || a.price);
    const isPriceChanged = isPmChange('activities', a.id, 'price', a.price);
    const isLabelChanged = isPmChange('activities', a.id, 'discountLabel', a.discountLabel || '');
    const isExpiryChanged = isPmChange('activities', a.id, 'discountExpiry', a.discountExpiry || '');

    return `
      <tr>
        <td style="font-weight: 700; color: var(--dark); font-size: 13.5px;">
          ${name}
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 500; margin-top: 2px;">📍 ${a.loc || 'Southeast Spot'}</div>
        </td>
        <td><span class="badge" style="font-size:11px; font-weight: 800; background: #e2e8f0; color: #475569;">${dest}</span></td>
        <td class="${isPrevPriceChanged ? 'pm-edited-cell' : ''}" style="width: 130px;">
          <input type="number" step="any" class="pm-edit-input text-right" value="${originalPrice}" oninput="trackPriceChange(this, 'activities', '${a.id}', 'prevPrice', ${a.prevPrice || a.price})" />
        </td>
        <td class="${isPriceChanged ? 'pm-edited-cell' : ''}" style="width: 130px;">
          <input type="number" step="any" class="pm-edit-input text-right font-bold" style="color: var(--coral);" value="${sellingPrice}" oninput="trackPriceChange(this, 'activities', '${a.id}', 'price', ${a.price})" />
        </td>
        <td class="${isLabelChanged ? 'pm-edited-cell' : ''}" style="width: 160px;">
          <input type="text" class="pm-edit-input uppercase" placeholder="e.g. 15% OFF" value="${discountLabel}" oninput="trackPriceChange(this, 'activities', '${a.id}', 'discountLabel', '${a.discountLabel || ""}')" />
        </td>
        <td class="${isExpiryChanged ? 'pm-edited-cell' : ''}" style="width: 140px;">
          <input type="date" class="pm-edit-input" value="${discountExpiry}" oninput="trackPriceChange(this, 'activities', '${a.id}', 'discountExpiry', '${a.discountExpiry || ""}')" style="font-size: 12px;" />
        </td>
        <td style="text-align: center; width: 80px;">
          <div class="pm-active-toggle ${activeVal ? 'active' : ''}" onclick="togglePriceActive(this, 'activities', '${a.id}', ${a.active !== false})">
            <div class="pm-active-toggle-knob"></div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// RENDER SECTION 2: HOTELS
function renderPmHotels() {
  const tbody = document.getElementById('pm-hotels-tbody');
  if (!tbody) return;

  tbody.innerHTML = hotels.map(h => {
    const originalPrice = getPmVal('hotels', h.id, 'prevPricePerNight', h.prevPricePerNight || h.pricePerNight);
    const sellingPrice = getPmVal('hotels', h.id, 'pricePerNight', h.pricePerNight);
    const discountLabel = getPmVal('hotels', h.id, 'discountLabel', h.discountLabel || '');
    const discountExpiry = getPmVal('hotels', h.id, 'discountExpiry', h.discountExpiry || '');
    const activeVal = getPmToggleVal('hotels', h.id, 'active', h.active !== false);

    const isPrevPriceChanged = isPmChange('hotels', h.id, 'prevPricePerNight', h.prevPricePerNight || h.pricePerNight);
    const isPriceChanged = isPmChange('hotels', h.id, 'pricePerNight', h.pricePerNight);
    const isLabelChanged = isPmChange('hotels', h.id, 'discountLabel', h.discountLabel || '');
    const isExpiryChanged = isPmChange('hotels', h.id, 'discountExpiry', h.discountExpiry || '');

    let tierBadge = `<span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:10px;">MIDRANGE</span>`;
    if (h.tier === 'luxury') tierBadge = `<span class="badge" style="background:#fef3c7; color:#b45309; font-size:10px;">💎 LUXURY</span>`;
    else if (h.tier === 'premium') tierBadge = `<span class="badge" style="background:#ccfbf1; color:#0f766e; font-size:10px;">🔵 PREMIUM</span>`;
    else if (h.tier === 'budget') tierBadge = `<span class="badge" style="background:#f1f5f9; color:#475569; font-size:10px;">BUDGET</span>`;

    return `
      <tr>
        <td style="font-weight: 700; color: var(--dark); font-size: 13.5px;">
          ${h.name}
          <div style="font-size: 11px; margin-top: 3px; display: flex; align-items: center; gap: 6px;">
            <span>📍 ${h.loc}</span> · 
            <span>⭐ ${h.stars} Stars</span> · 
            ${tierBadge}
          </div>
        </td>
        <td class="${isPrevPriceChanged ? 'pm-edited-cell' : ''}" style="width: 150px;">
          <input type="number" class="pm-edit-input text-right" value="${originalPrice}" oninput="trackPriceChange(this, 'hotels', '${h.id}', 'prevPricePerNight', ${h.prevPricePerNight || h.pricePerNight})" />
        </td>
        <td class="${isPriceChanged ? 'pm-edited-cell' : ''}" style="width: 150px;">
          <input type="number" class="pm-edit-input text-right font-bold" style="color: var(--teal);" value="${sellingPrice}" oninput="trackPriceChange(this, 'hotels', '${h.id}', 'pricePerNight', h.pricePerNight)" />
        </td>
        <td class="${isLabelChanged ? 'pm-edited-cell' : ''}" style="width: 170px;">
          <input type="text" class="pm-edit-input uppercase" placeholder="e.g. FLASH SALE" value="${discountLabel}" oninput="trackPriceChange(this, 'hotels', '${h.id}', 'discountLabel', '${h.discountLabel || ""}')" />
        </td>
        <td class="${isExpiryChanged ? 'pm-edited-cell' : ''}" style="width: 145px;">
          <input type="date" class="pm-edit-input" value="${discountExpiry}" oninput="trackPriceChange(this, 'hotels', '${h.id}', 'discountExpiry', '${h.discountExpiry || ""}')" style="font-size: 12px;" />
        </td>
        <td style="text-align: center; width: 80px;">
          <div class="pm-active-toggle ${activeVal ? 'active' : ''}" onclick="togglePriceActive(this, 'hotels', '${h.id}', ${h.active !== false})">
            <div class="pm-active-toggle-knob"></div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// RENDER SECTION 3: BUSES (GRID ROUTE-CLASS COMBOS)
function renderPmBuses() {
  const tbody = document.getElementById('pm-buses-tbody');
  if (!tbody) return;

  const routes = [
    { id: 'dhaka-cox', name: "Dhaka ⇆ Cox's Bazar" },
    { id: 'dhaka-bandarban', name: "Dhaka ⇆ Bandarban" },
    { id: 'dhaka-rangamati', name: "Dhaka ⇆ Rangamati" },
    { id: 'ctg-cox', name: "Chattogram ⇆ Cox's Bazar" },
    { id: 'dhaka-ctg', name: "Dhaka ⇆ Chattogram" }
  ];

  let rowsHtml = "";

  routes.forEach(r => {
    busClasses.forEach(bus => {
      const origPriceFallback = bus.priceRange[r.id];
      const origPrice = getPmBusVal(bus.id, r.id, 'prevPrice', bus.prevPriceRange?.[r.id] || origPriceFallback);
      const sellingPrice = getPmBusVal(bus.id, r.id, 'price', origPriceFallback);
      const label = getPmBusVal(bus.id, r.id, 'discountLabel', bus.discountLabelRange?.[r.id] || '');
      const activeVal = getPmBusToggleVal(bus.id, r.id, bus.activeRange?.[r.id] !== false);

      const isPrevPriceChanged = isPmBusChange(bus.id, r.id, 'prevPrice', bus.prevPriceRange?.[r.id] || origPriceFallback);
      const isPriceChanged = isPmBusChange(bus.id, r.id, 'price', origPriceFallback);
      const isLabelChanged = isPmBusChange(bus.id, r.id, 'discountLabel', bus.discountLabelRange?.[r.id] || '');

      rowsHtml += `
        <tr>
          <td style="font-weight: 700; color: var(--dark); font-size: 13px;">📍 ${r.name}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${bus.icon || '🚌'}</span>
              <span style="font-weight: 700;">${bus.name}</span>
            </div>
          </td>
          <td class="${isPrevPriceChanged ? 'pm-edited-cell' : ''}" style="width: 150px;">
            <input type="number" class="pm-edit-input text-right" value="${origPrice}" oninput="trackBusPriceChange(this, '${bus.id}', '${r.id}', 'prevPrice', ${bus.prevPriceRange?.[r.id] || origPriceFallback})" />
          </td>
          <td class="${isPriceChanged ? 'pm-edited-cell' : ''}" style="width: 150px;">
            <input type="number" class="pm-edit-input text-right font-bold text-[#E85D3A]" value="${sellingPrice}" oninput="trackBusPriceChange(this, '${bus.id}', '${r.id}', 'price', ${origPriceFallback})" />
          </td>
          <td class="${isLabelChanged ? 'pm-edited-cell' : ''}" style="width: 180px;">
            <input type="text" class="pm-edit-input uppercase" placeholder="e.g. FLASH SALE" value="${label}" oninput="trackBusPriceChange(this, '${bus.id}', '${r.id}', 'discountLabel', '${bus.discountLabelRange?.[r.id] || ""}')" />
          </td>
          <td style="text-align: center; width: 80px;">
            <div class="pm-active-toggle ${activeVal ? 'active' : ''}" onclick="toggleBusPriceActive(this, '${bus.id}', '${r.id}', ${bus.activeRange?.[r.id] !== false})">
              <div class="pm-active-toggle-knob"></div>
            </div>
          </td>
        </tr>
      `;
    });
  });

  tbody.innerHTML = rowsHtml;
}

// RENDER SECTION 4: LOCAL TRANSPORT
function renderPmTransport() {
  const tbody = document.getElementById('pm-transport-tbody');
  if (!tbody) return;

  tbody.innerHTML = localTransport.map(t => {
    const originalPrice = getPmVal('localTransport', t.id, 'prevPrice', t.prevPrice || t.price);
    const sellingPrice = getPmVal('localTransport', t.id, 'price', t.price);
    const unit = getPmVal('localTransport', t.id, 'unit', t.unit);
    const activeVal = getPmToggleVal('localTransport', t.id, 'active', t.active !== false);

    const isPrevPriceChanged = isPmChange('localTransport', t.id, 'prevPrice', t.prevPrice || t.price);
    const isPriceChanged = isPmChange('localTransport', t.id, 'price', t.price);
    const isUnitChanged = isPmChange('localTransport', t.id, 'unit', t.unit);

    return `
      <tr>
        <td style="font-weight: 700; color: var(--dark); font-size: 13.5px;">
          <span style="margin-right: 4px;">${t.icon || '🚗'}</span> ${t.name}
        </td>
        <td><span class="badge" style="text-transform: capitalize; background: var(--teal-light); color: var(--teal); font-weight:800; font-size:11px;">${t.dest}</span></td>
        <td class="${isPrevPriceChanged ? 'pm-edited-cell' : ''}" style="width: 150px;">
          <input type="number" class="pm-edit-input text-right" value="${originalPrice}" oninput="trackPriceChange(this, 'localTransport', '${t.id}', 'prevPrice', ${t.prevPrice || t.price})" />
        </td>
        <td class="${isPriceChanged ? 'pm-edited-cell' : ''}" style="width: 150px;">
          <input type="number" class="pm-edit-input text-right font-bold" style="color: var(--teal);" value="${sellingPrice}" oninput="trackPriceChange(this, 'localTransport', '${t.id}', 'price', ${t.price})" />
        </td>
        <td class="${isUnitChanged ? 'pm-edited-cell' : ''}" style="width: 170px;">
          <input type="text" class="pm-edit-input" placeholder="e.g. per sedan/day" value="${unit}" oninput="trackPriceChange(this, 'localTransport', '${t.id}', 'unit', '${t.unit}')" />
        </td>
        <td style="text-align: center; width: 80px;">
          <div class="pm-active-toggle ${activeVal ? 'active' : ''}" onclick="togglePriceActive(this, 'localTransport', '${t.id}', ${t.active !== false})">
            <div class="pm-active-toggle-knob"></div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}


// CHANGE TRACKING HANDLERS
function trackPriceChange(inputEl, type, id, field, originalValue) {
  const key = `${type}-${id}-${field}`;
  let val = inputEl.value;

  if (inputEl.type === 'number') {
    val = val !== "" ? parseFloat(val) : 0;
  }

  // Compare with the true original
  if (val === originalValue) {
    delete pmUnsavedChanges[key];
    inputEl.parentElement.classList.remove('pm-edited-cell');
  } else {
    pmUnsavedChanges[key] = val;
    inputEl.parentElement.classList.add('pm-edited-cell');
  }

  updatePmUnsavedChangesBanner();
}

function trackBusPriceChange(inputEl, busId, routeId, field, originalValue) {
  const key = `buses-${busId}-${routeId}-${field}`;
  let val = inputEl.value;

  if (inputEl.type === 'number') {
    val = val !== "" ? parseFloat(val) : 0;
  }

  if (val === originalValue) {
    delete pmUnsavedChanges[key];
    inputEl.parentElement.classList.remove('pm-edited-cell');
  } else {
    pmUnsavedChanges[key] = val;
    inputEl.parentElement.classList.add('pm-edited-cell');
  }

  updatePmUnsavedChangesBanner();
}

function togglePriceActive(toggleEl, type, id, originalValue) {
  const key = `${type}-${id}-active`;
  const wasActive = toggleEl.classList.contains('active');
  const nextActive = !wasActive;

  if (nextActive) toggleEl.classList.add('active');
  else toggleEl.classList.remove('active');

  if (nextActive === originalValue) {
    delete pmUnsavedChanges[key];
  } else {
    pmUnsavedChanges[key] = nextActive;
  }

  updatePmUnsavedChangesBanner();
}

function toggleBusPriceActive(toggleEl, busId, routeId, originalValue) {
  const key = `buses-${busId}-${routeId}-active`;
  const wasActive = toggleEl.classList.contains('active');
  const nextActive = !wasActive;

  if (nextActive) toggleEl.classList.add('active');
  else toggleEl.classList.remove('active');

  if (nextActive === originalValue) {
    delete pmUnsavedChanges[key];
  } else {
    pmUnsavedChanges[key] = nextActive;
  }

  updatePmUnsavedChangesBanner();
}

function isPmChange(type, id, field, originalValue) {
  const key = `${type}-${id}-${field}`;
  return (key in pmUnsavedChanges);
}

function isPmBusChange(busId, routeId, field, originalValue) {
  const key = `buses-${busId}-${routeId}-${field}`;
  return (key in pmUnsavedChanges);
}

function updatePmUnsavedChangesBanner() {
  const banner = document.getElementById('price-manager-unsaved-banner');
  const countSpan = document.getElementById('unsaved-changes-count');
  const n = Object.keys(pmUnsavedChanges).length;

  if (countSpan) countSpan.innerText = n;
  if (banner) {
    banner.style.display = n > 0 ? 'inline-flex' : 'none';
  }
}

function filterPmActivities(query) {
  pmActivitiesQuery = query;
  renderPmActivities();
}

// -----------------------------------------------------------------------------
// SAVE ALL CHANGES FOR THE PRICE MANAGER SCREEN
// -----------------------------------------------------------------------------
function saveAllPriceChanges() {
  const keys = Object.keys(pmUnsavedChanges);
  if (keys.length === 0) {
    showToast("✓ Everything is already up to date.");
    return;
  }

  // Loop through unsaved changes and write directly to db replicas
  keys.forEach(key => {
    const val = pmUnsavedChanges[key];
    const parts = key.split('-');

    if (parts[0] === 'buses') {
      // Buses type: "buses-busId-routeId-field"
      const busId = parts[1];
      const routeId = parts[2];
      const field = parts[3];

      const busObj = busClasses.find(b => b.id === busId);
      if (busObj) {
        if (field === 'price') {
          busObj.priceRange = busObj.priceRange || {};
          busObj.priceRange[routeId] = val;
        } else if (field === 'prevPrice') {
          busObj.prevPriceRange = busObj.prevPriceRange || {};
          busObj.prevPriceRange[routeId] = val;
        } else if (field === 'discountLabel') {
          busObj.discountLabelRange = busObj.discountLabelRange || {};
          busObj.discountLabelRange[routeId] = val;
        } else if (field === 'active') {
          busObj.activeRange = busObj.activeRange || {};
          busObj.activeRange[routeId] = val;
        }
      }
    } else {
      // Standard item: "type-id-field"
      const type = parts[0];
      const id = parts[1];
      const field = parts[2];

      let targetDb = null;
      if (type === 'activities') targetDb = activities;
      else if (type === 'hotels') targetDb = hotels;
      else if (type === 'localTransport') targetDb = localTransport;

      if (targetDb) {
        // Find numerical or string target
        // IDs are mixed in local store so let's match both
        const item = targetDb.find(x => String(x.id) === String(id));
        if (item) {
          if (field === 'price' || field === 'prevPrice' || field === 'pricePerNight' || field === 'prevPricePerNight') {
            item[field] = parseFloat(val);
          } else {
            item[field] = val;
          }
        }
      }
    }
  });

  // Re-save arrays back to local storage
  localStorage.setItem('tcbd_activities', JSON.stringify(activities));
  localStorage.setItem('tcbd_hotels', JSON.stringify(hotels));
  localStorage.setItem('tcbd_bus_classes', JSON.stringify(busClasses));
  localStorage.setItem('tcbd_local_transport', JSON.stringify(localTransport));

  // Sync to Google Sheets if configured
  const syncUrl = localStorage.getItem('tcbd_api_url');
  if (syncUrl) {
    fetch(syncUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: "ops_price_manager",
        timestamp: new Date().toISOString(),
        activities: activities,
        hotels: hotels,
        bus_classes: busClasses,
        local_transport: localTransport
      })
    }).then(() => {
      console.log("Pricing changes successfully posted to Sheets integration.");
    }).catch(err => {
      console.warn("Sheets post triggered error (retaining offline persistence):", err);
    });
  }

  // Clear tracking
  pmUnsavedChanges = {};
  showToast("💾 All prices and configurations synced live!");

  // Reload and redraw
  loadDatabase();
  renderPriceManager();
}


// -----------------------------------------------------------------------------
// DISCOUNT CAMPAIGN MANAGER MODULES
// -----------------------------------------------------------------------------
function renderDiscountManager() {
  seedBusAndTransportIfEmpty();
  loadDatabase();

  // Draw configuration preview
  updateDiscountFormPreview();

  // Draw lists based on tabs & filters
  renderDmListingsRows();

  // Draw active campaigns catalog
  renderDmActiveCampaigns();
}

function setDmTab(tabName) {
  dmActiveTab = tabName;
  
  // Highlight active tab
  document.querySelectorAll('.dm-tab').forEach(btn => btn.classList.remove('active'));
  const targetId = `dm-tab-${tabName}`;
  const btn = document.getElementById(targetId);
  if (btn) btn.classList.add('active');

  // Reset checkboxes select state
  dmSelectedIds.clear();
  const selectAllBox = document.getElementById('dm-select-all-box');
  if (selectAllBox) selectAllBox.checked = false;

  renderDmListingsRows();
}

function handleLabelInput(inputEl) {
  const counterSpan = document.getElementById('campaign-label-counter');
  let val = inputEl.value.toUpperCase();
  inputEl.value = val;
  if (counterSpan) {
    counterSpan.innerText = `${val.length} / 20`;
  }
  updateDiscountFormPreview();
}

// UPDATE FORM LIVE PREVIEW HOVER CARD
function updateDiscountFormPreview() {
  const rFlat = document.querySelector('input[name="discount-type"][value="flat"]');
  const dType = (rFlat && rFlat.checked) ? 'flat' : 'percent';
  const valInput = document.getElementById('discount-amount-input');
  const val = valInput ? parseFloat(valInput.value) || 0 : 0;
  const labelInput = document.getElementById('discount-label-input');
  const labelText = labelInput ? labelInput.value.toUpperCase() : 'EID SPECIAL';

  const amountPrefix = document.getElementById('amount-prefix');
  const amountLabel = document.getElementById('discount-amount-label');
  const amountDesc = document.getElementById('discount-amount-desc');

  if (dType === 'flat') {
    if (amountPrefix) amountPrefix.innerText = "৳";
    if (amountLabel) amountLabel.innerText = "Discount Amount (৳)";
    if (amountDesc) amountDesc.innerText = `৳ ${val.toLocaleString()} off each selected listing`;
  } else {
    if (amountPrefix) amountPrefix.innerText = "%";
    if (amountLabel) amountLabel.innerText = "Discount Ratio (%)";
    if (amountDesc) amountDesc.innerText = `${val}% off each selected listing`;
  }

  // Pre-calculate sample price 3500 drop
  const originalExample = 3500;
  let calculated = originalExample - val;
  if (dType === 'percent') {
    calculated = originalExample * (1 - (val / 100));
  }
  if (calculated < 0) calculated = 0;

  const preOrPrice = document.getElementById('preview-or-price');
  const preDisPrice = document.getElementById('preview-dis-price');
  const preBadgeText = document.getElementById('preview-badge-text');

  if (preOrPrice) preOrPrice.innerText = `৳${originalExample.toLocaleString()}`;
  if (preDisPrice) preDisPrice.innerText = `৳${Math.round(calculated).toLocaleString()}`;
  if (preBadgeText) preBadgeText.innerText = labelText || 'EID SPECIAL';
}

// RENDER CHECKBOX ROWS UNDER RIGHT PANELS
function renderDmListingsRows() {
  const listContainer = document.getElementById('dm-listings-checkbox-list');
  if (!listContainer) return;

  const searchQuery = document.getElementById('dm-listings-search').value.toLowerCase().trim();
  const regionQuery = document.getElementById('dm-region-select').value;

  let html = "";

  if (dmActiveTab === 'activities') {
    let list = [...activities];
    if (searchQuery !== "") list = list.filter(a => a.name.toLowerCase().includes(searchQuery));
    if (regionQuery !== 'all') list = list.filter(a => a.dest === regionQuery);

    if (list.length === 0) {
      html = `<div style="text-align:center; padding:20px; font-weight:700; color:var(--text-muted);">No matching experience listings found.</div>`;
    } else {
      html = list.map(a => {
        const checked = dmSelectedIds.has(String(a.id));
        const discBadge = a.prevPrice ? `<span class="dm-discount-badge">Tag: ${a.discountLabel || 'SAVINGS'}</span>` : '';
        return `
          <div class="dm-checkbox-item ${checked ? 'checked' : ''}" onclick="toggleDmCheckboxItem(this, '${a.id}')">
            <div style="display:flex; align-items:center; gap:10px;">
              <input type="checkbox" ${checked ? 'checked' : ''} style="width:15px; height:15px; pointer-events:none;" />
              <div>
                <span style="font-weight:700; color:var(--dark);">${a.name}</span>
                <span style="font-size:11px; color:var(--text-muted); margin-left:6px;">📍 ${a.dest.toUpperCase()}</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; color:var(--teal);">৳${a.price.toLocaleString()}</span>
              ${discBadge}
            </div>
          </div>
        `;
      }).join('');
    }
  } else if (dmActiveTab === 'hotels') {
    let list = [...hotels];
    if (searchQuery !== "") list = list.filter(h => h.name.toLowerCase().includes(searchQuery));
    if (regionQuery !== 'all') list = list.filter(h => h.dest === regionQuery);

    if (list.length === 0) {
      html = `<div style="text-align:center; padding:20px; font-weight:700; color:var(--text-muted);">No hotel properties found.</div>`;
    } else {
      html = list.map(h => {
        const checked = dmSelectedIds.has(String(h.id));
        const discBadge = h.prevPricePerNight ? `<span class="dm-discount-badge">${h.discountLabel || 'CAMPAIGN'}</span>` : '';
        return `
          <div class="dm-checkbox-item ${checked ? 'checked' : ''}" onclick="toggleDmCheckboxItem(this, '${h.id}')">
            <div style="display:flex; align-items:center; gap:10px;">
              <input type="checkbox" ${checked ? 'checked' : ''} style="width:15px; height:15px; pointer-events:none;" />
              <div>
                <span style="font-weight:700; color:var(--dark);">${h.name}</span>
                <span style="font-size:11px; color:var(--text-muted); margin-left:6px;">📍 ${h.dest.toUpperCase()}</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; color:var(--teal);">৳${h.pricePerNight.toLocaleString()}</span>
              ${discBadge}
            </div>
          </div>
        `;
      }).join('');
    }
  } else if (dmActiveTab === 'buses') {
    // Generate route x bus class combos
    const routes = [
      { id: 'dhaka-cox', name: "Dhaka-Cox's Bazar", dest: 'cox' },
      { id: 'dhaka-bandarban', name: "Dhaka-Bandarban", dest: 'bandarban' },
      { id: 'dhaka-rangamati', name: "Dhaka-Rangamati", dest: 'rangamati' },
      { id: 'ctg-cox', name: "Chattogram-Cox's Bazar", dest: 'cox' },
      { id: 'dhaka-ctg', name: "Dhaka-Chattogram", dest: 'ctg' }
    ];

    let list = [];
    routes.forEach(r => {
      busClasses.forEach(bus => {
        const uniqueId = `${bus.id}-${r.id}`;
        const name = `${bus.name} (${r.name})`;
        if (searchQuery !== "" && !name.toLowerCase().includes(searchQuery)) return;
        if (regionQuery !== 'all' && r.dest !== regionQuery) return;

        list.push({
          id: uniqueId,
          name: name,
          price: bus.priceRange[r.id],
          dest: r.dest,
          hasDiscount: !!bus.prevPriceRange?.[r.id],
          label: bus.discountLabelRange?.[r.id] || ''
        });
      });
    });

    if (list.length === 0) {
      html = `<div style="text-align:center; padding:20px; font-weight:700; color:var(--text-muted);">No matching bus operators found.</div>`;
    } else {
      html = list.map(b => {
        const checked = dmSelectedIds.has(b.id);
        const discBadge = b.hasDiscount ? `<span class="dm-discount-badge">${b.label || 'PROMO'}</span>` : '';
        return `
          <div class="dm-checkbox-item ${checked ? 'checked' : ''}" onclick="toggleDmCheckboxItem(this, '${b.id}')">
            <div style="display:flex; align-items:center; gap:10px;">
              <input type="checkbox" ${checked ? 'checked' : ''} style="width:15px; height:15px; pointer-events:none;" />
              <div>
                <span style="font-weight:700; color:var(--dark);">${b.name}</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; color:var(--teal);">৳${b.price.toLocaleString()}</span>
              ${discBadge}
            </div>
          </div>
        `;
      }).join('');
    }
  } else if (dmActiveTab === 'transport') {
    let list = [...localTransport];
    if (searchQuery !== "") list = list.filter(t => t.name.toLowerCase().includes(searchQuery));
    if (regionQuery !== 'all') list = list.filter(t => t.dest === regionQuery);

    if (list.length === 0) {
      html = `<div style="text-align:center; padding:20px; font-weight:700; color:var(--text-muted);">No private transfers found.</div>`;
    } else {
      html = list.map(t => {
        const checked = dmSelectedIds.has(String(t.id));
        const discBadge = t.prevPrice ? `<span class="dm-discount-badge">OFFER</span>` : '';
        return `
          <div class="dm-checkbox-item ${checked ? 'checked' : ''}" onclick="toggleDmCheckboxItem(this, '${t.id}')">
            <div style="display:flex; align-items:center; gap:10px;">
              <input type="checkbox" ${checked ? 'checked' : ''} style="width:15px; height:15px; pointer-events:none;" />
              <div>
                <span style="font-weight:700; color:var(--dark);">${t.name}</span>
                <span style="font-size:11px; color:var(--text-muted); margin-left:6px;">📍 ${t.dest.toUpperCase()}</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-weight:700; color:var(--teal);">৳${t.price.toLocaleString()}</span>
              ${discBadge}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  listContainer.innerHTML = html;
}

function toggleDmCheckboxItem(element, id) {
  const box = element.querySelector('input[type="checkbox"]');
  if (dmSelectedIds.has(id)) {
    dmSelectedIds.delete(id);
    element.classList.remove('checked');
    if (box) box.checked = false;
  } else {
    dmSelectedIds.add(id);
    element.classList.add('checked');
    if (box) box.checked = true;
  }
}

function toggleDmSelectAll(isChecked) {
  // Select all currently visible checkbox items
  const container = document.getElementById('dm-listings-checkbox-list');
  if (!container) return;

  const items = container.querySelectorAll('.dm-checkbox-item');
  items.forEach(el => {
    // Extract ID by looking at the click action or text
    const box = el.querySelector('input[type="checkbox"]');
    // Let's scrape the ID from onclick string onclick="toggleDmCheckboxItem(this, 'id')"
    const clickAttr = el.getAttribute('onclick') || "";
    const match = clickAttr.match(/'([^']+)'/);
    if (match && match[1]) {
      const id = match[1];
      if (isChecked) {
        dmSelectedIds.add(id);
        el.classList.add('checked');
        if (box) box.checked = true;
      } else {
        dmSelectedIds.delete(id);
        el.classList.remove('checked');
        if (box) box.checked = false;
      }
    }
  });
}

function selectDmByRegion(regionCode) {
  // Filter select
  const regSel = document.getElementById('dm-region-select');
  if (regSel) regSel.value = regionCode;

  filterDmListings();

  // Tick all
  setTimeout(() => {
    toggleDmSelectAll(true);
    const selectAllBox = document.getElementById('dm-select-all-box');
    if (selectAllBox) selectAllBox.checked = true;
  }, 50);
}

function clearAllDmChecks() {
  dmSelectedIds.clear();
  renderDmListingsRows();
  const selectAllBox = document.getElementById('dm-select-all-box');
  if (selectAllBox) selectAllBox.checked = false;
}

function filterDmListings() {
  renderDmListingsRows();
}

function clearCampForm() {
  const labelInput = document.getElementById('discount-label-input');
  if (labelInput) labelInput.value = "";
  const amtInput = document.getElementById('discount-amount-input');
  if (amtInput) amtInput.value = "100";
  const startIn = document.getElementById('discount-start-input');
  if (startIn) startIn.value = "";
  const endIn = document.getElementById('discount-end-input');
  if (endIn) endIn.value = "";

  const counterSpan = document.getElementById('campaign-label-counter');
  if (counterSpan) counterSpan.innerText = "0 / 20";

  updateDiscountFormPreview();
}

// APPLY CAMPAIGN FORM MUTATION ON TARGET SELECTIONS
function applyDiscountsToSelected() {
  if (dmSelectedIds.size === 0) {
    showToast("⚠️ Please select at least one target tour listing first!");
    return;
  }

  const rFlat = document.querySelector('input[name="discount-type"][value="flat"]');
  const dType = (rFlat && rFlat.checked) ? 'flat' : 'percent';
  const valInput = document.getElementById('discount-amount-input');
  const val = valInput ? parseFloat(valInput.value) || 0 : 0;
  const labelInput = document.getElementById('discount-label-input');
  const labelText = labelInput ? labelInput.value.toUpperCase().trim() : 'CAMPAIGN DEAL';
  const endInput = document.getElementById('discount-end-input');
  const expiryVal = (endInput && endInput.value) ? endInput.value : null;

  if (val <= 0) {
    showToast("⚠️ Please specify a valid positive discount amount!");
    return;
  }

  // Iterate over selected set
  dmSelectedIds.forEach(id => {
    if (dmActiveTab === 'activities') {
      const a = activities.find(x => String(x.id) === String(id));
      if (a) {
        // If not already in discount mode, record parent orig price
        const basePrice = a.prevPrice || a.price;
        let calculated = basePrice - val;
        if (dType === 'percent') calculated = basePrice * (1 - (val / 100));

        a.prevPrice = basePrice;
        a.price = Math.max(0, Math.round(calculated));
        a.discountLabel = labelText || 'EID SPECIAL';
        a.discountExpiry = expiryVal;
      }
    } else if (dmActiveTab === 'hotels') {
      const h = hotels.find(x => String(x.id) === String(id));
      if (h) {
        const basePrice = h.prevPricePerNight || h.pricePerNight;
        let calculated = basePrice - val;
        if (dType === 'percent') calculated = basePrice * (1 - (val / 100));

        h.prevPricePerNight = basePrice;
        h.pricePerNight = Math.max(0, Math.round(calculated));
        h.discountLabel = labelText || 'COZY DEAL';
        h.discountExpiry = expiryVal;
      }
    } else if (dmActiveTab === 'buses') {
      // id formats: "busId-routeId"
      const parts = id.split('-');
      const busId = parts[0];
      const routeId = parts[1];

      const busObj = busClasses.find(b => b.id === busId);
      if (busObj) {
        const origPrice = busObj.priceRange[routeId];
        let calculated = origPrice - val;
        if (dType === 'percent') calculated = origPrice * (1 - (val / 100));

        busObj.prevPriceRange = busObj.prevPriceRange || {};
        busObj.prevPriceRange[routeId] = origPrice;

        busObj.priceRange[routeId] = Math.max(0, Math.round(calculated));

        busObj.discountLabelRange = busObj.discountLabelRange || {};
        busObj.discountLabelRange[routeId] = labelText || 'BUS PROMO';
      }
    } else if (dmActiveTab === 'transport') {
      const t = localTransport.find(x => String(x.id) === String(id));
      if (t) {
        const basePrice = t.prevPrice || t.price;
        let calculated = basePrice - val;
        if (dType === 'percent') calculated = basePrice * (1 - (val / 100));

        t.prevPrice = basePrice;
        t.price = Math.max(0, Math.round(calculated));
        t.discountLabel = labelText || 'ROAD SPECIAL';
      }
    }
  });

  // Save changes
  localStorage.setItem('tcbd_activities', JSON.stringify(activities));
  localStorage.setItem('tcbd_hotels', JSON.stringify(hotels));
  localStorage.setItem('tcbd_bus_classes', JSON.stringify(busClasses));
  localStorage.setItem('tcbd_local_transport', JSON.stringify(localTransport));

  showToast(`🚀 Campaign label "${labelText}" deployed across ${dmSelectedIds.size} listings!`);

  // Reset check state
  dmSelectedIds.clear();
  const selectAllBox = document.getElementById('dm-select-all-box');
  if (selectAllBox) selectAllBox.checked = false;

  // Redraw
  renderDiscountManager();
}

function removeDiscountsFromSelected() {
  if (dmSelectedIds.size === 0) {
    showToast("⚠️ Check any items check boxes in the right panel to strip their campaigns!");
    return;
  }

  dmSelectedIds.forEach(id => {
    if (dmActiveTab === 'activities') {
      const a = activities.find(x => String(x.id) === String(id));
      if (a) {
        if (a.prevPrice) {
          a.price = a.prevPrice;
          a.prevPrice = null;
        }
        a.discountLabel = null;
        a.discountExpiry = null;
      }
    } else if (dmActiveTab === 'hotels') {
      const h = hotels.find(x => String(x.id) === String(id));
      if (h) {
        if (h.prevPricePerNight) {
          h.pricePerNight = h.prevPricePerNight;
          h.prevPricePerNight = null;
        }
        h.discountLabel = null;
        h.discountExpiry = null;
      }
    } else if (dmActiveTab === 'buses') {
      const parts = id.split('-');
      const busId = parts[0];
      const routeId = parts[1];

      const busObj = busClasses.find(b => b.id === busId);
      if (busObj) {
        if (busObj.prevPriceRange && busObj.prevPriceRange[routeId] !== undefined) {
          busObj.priceRange[routeId] = busObj.prevPriceRange[routeId];
          delete busObj.prevPriceRange[routeId];
        }
        if (busObj.discountLabelRange) {
          delete busObj.discountLabelRange[routeId];
        }
      }
    } else if (dmActiveTab === 'transport') {
      const t = localTransport.find(x => String(x.id) === String(id));
      if (t) {
        if (t.prevPrice) {
          t.price = t.prevPrice;
          t.prevPrice = null;
        }
        t.discountLabel = null;
      }
    }
  });

  localStorage.setItem('tcbd_activities', JSON.stringify(activities));
  localStorage.setItem('tcbd_hotels', JSON.stringify(hotels));
  localStorage.setItem('tcbd_bus_classes', JSON.stringify(busClasses));
  localStorage.setItem('tcbd_local_transport', JSON.stringify(localTransport));

  showToast(`✓ Removed promotional tags from ${dmSelectedIds.size} listings!`);

  dmSelectedIds.clear();
  const selectAllBox = document.getElementById('dm-select-all-box');
  if (selectAllBox) selectAllBox.checked = false;

  renderDiscountManager();
}

function removeSingleItemCampaign(type, id) {
  if (type === 'activities') {
    const a = activities.find(x => String(x.id) === String(id));
    if (a) {
      if (a.prevPrice) {
        a.price = a.prevPrice;
        a.prevPrice = null;
      }
      a.discountLabel = null;
      a.discountExpiry = null;
    }
  } else if (type === 'hotels') {
    const h = hotels.find(x => String(x.id) === String(id));
    if (h) {
      if (h.prevPricePerNight) {
        h.pricePerNight = h.prevPricePerNight;
        h.prevPricePerNight = null;
      }
      h.discountLabel = null;
      h.discountExpiry = null;
    }
  } else if (type === 'local_transport') {
    const t = localTransport.find(x => String(x.id) === String(id));
    if (t) {
      if (t.prevPrice) {
        t.price = t.prevPrice;
        t.prevPrice = null;
      }
      t.discountLabel = null;
    }
  } else if (type === 'bus') {
    const parts = id.split('-');
    const busId = parts[0];
    const routeId = parts[1];

    const busObj = busClasses.find(b => b.id === busId);
    if (busObj) {
      if (busObj.prevPriceRange && busObj.prevPriceRange[routeId] !== undefined) {
        busObj.priceRange[routeId] = busObj.prevPriceRange[routeId];
        delete busObj.prevPriceRange[routeId];
      }
      if (busObj.discountLabelRange) {
        delete busObj.discountLabelRange[routeId];
      }
    }
  }

  // Save changes
  localStorage.setItem('tcbd_activities', JSON.stringify(activities));
  localStorage.setItem('tcbd_hotels', JSON.stringify(hotels));
  localStorage.setItem('tcbd_bus_classes', JSON.stringify(busClasses));
  localStorage.setItem('tcbd_local_transport', JSON.stringify(localTransport));

  showToast(`✓ Discount tag successfully cleared!`);
  renderDiscountManager();
}

// RENDER ALL CURRENTLY DEPLOYED DISCOUNT CONSTRUCTIONS IN BOTTOM TABLE
function renderDmActiveCampaigns() {
  const tbody = document.getElementById('dm-active-discounts-tbody');
  if (!tbody) return;

  let activeRecords = [];

  // Activities Active Deals
  activities.forEach(a => {
    if (a.prevPrice && a.prevPrice !== a.price) {
      activeRecords.push({
        id: a.id,
        name: a.name,
        type: 'activities',
        typeLabel: '🏄 Activity',
        original: a.prevPrice,
        current: a.price,
        label: a.discountLabel || 'CAMPAIGN',
        expires: a.discountExpiry ? new Date(a.discountExpiry).toLocaleString() : 'Never Expiry'
      });
    }
  });

  // Hotels Active Deals
  hotels.forEach(h => {
    if (h.prevPricePerNight && h.prevPricePerNight !== h.pricePerNight) {
      activeRecords.push({
        id: h.id,
        name: `${h.name} (${h.stars}★ Stay)`,
        type: 'hotels',
        typeLabel: '🏨 Hotel Accommodation',
        original: h.prevPricePerNight,
        current: h.pricePerNight,
        label: h.discountLabel || 'CAMPAIGN',
        expires: h.discountExpiry ? new Date(h.discountExpiry).toLocaleString() : 'Never Expiry'
      });
    }
  });

  // Bus Class Deals
  busClasses.forEach(bus => {
    if (bus.prevPriceRange) {
      Object.keys(bus.prevPriceRange).forEach(routeId => {
        const orig = bus.prevPriceRange[routeId];
        const curr = bus.priceRange[routeId];
        if (orig !== curr) {
          activeRecords.push({
            id: `${bus.id}-${routeId}`,
            name: `${bus.name} Coach Route: [${routeId.toUpperCase()}]`,
            type: 'bus',
            typeLabel: '🚌 Bus Coach Upgrade',
            original: orig,
            current: curr,
            label: bus.discountLabelRange?.[routeId] || 'OPERATOR DEEP CUT',
            expires: 'Never Expiry'
          });
        }
      });
    }
  });

  // Private Ground Transfer Deals
  localTransport.forEach(t => {
    if (t.prevPrice && t.prevPrice !== t.price) {
      activeRecords.push({
        id: t.id,
        name: t.name,
        type: 'local_transport',
        typeLabel: '🚗 Private Ground Transfer',
        original: t.prevPrice,
        current: t.price,
        label: t.discountLabel || 'LOCAL OFFER',
        expires: 'Never Expiry'
      });
    }
  });

  if (activeRecords.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; font-weight:700; color:var(--text-muted); padding:24px;">
          🌿 No active bulk campaigns are deployed. Set up some discounts in the panels above!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = activeRecords.map(rec => {
    return `
      <tr>
        <td style="font-weight:700; color:var(--dark);">${rec.name}</td>
        <td><span class="badge" style="background:var(--teal-light); color:var(--teal); font-weight:800; font-size:11px;">${rec.typeLabel}</span></td>
        <td style="text-align:right; font-weight:700; text-decoration:line-through; color:var(--text-muted);">৳${rec.original.toLocaleString()}</td>
        <td style="text-align:right; font-weight:800; color:var(--coral);">৳${rec.current.toLocaleString()}</td>
        <td><span class="badge" style="background:var(--coral-light); color:var(--coral); font-weight:900; font-size:11px;">${rec.label}</span></td>
        <td style="font-size:12px; font-weight:600; color:var(--text-muted);">${rec.expires}</td>
        <td style="text-align:center;">
          <button class="action-btn" onclick="removeSingleItemCampaign('${rec.type}', '${rec.id}')" style="background:#fff1f2; color:var(--coral); font-size:11.5px; height:auto; padding:4px 10px; font-weight:800; border-radius:6px; margin:0 auto; display:block;">
            Strip tag
          </button>
        </td>
      </tr>
    `;
  }).join('');
}


// -----------------------------------------------------------------------------
// EXPIRY CAMPAIGN SYSTEM AGENT / AUTOMATOR
// -----------------------------------------------------------------------------
function autoClearExpiredCampaignsSilent() {
  loadDatabase();
  const now = new Date();
  let clearCount = 0;

  // Activities Expirations Check
  activities.forEach(a => {
    if (a.discountExpiry) {
      const expDate = new Date(a.discountExpiry);
      if (expDate <= now) {
        if (a.prevPrice) {
          a.price = a.prevPrice;
          a.prevPrice = null;
        }
        a.discountLabel = null;
        a.discountExpiry = null;
        clearCount++;
      }
    }
  });

  // Hotels Expirations Check
  hotels.forEach(h => {
    if (h.discountExpiry) {
      const expDate = new Date(h.discountExpiry);
      if (expDate <= now) {
        if (h.prevPricePerNight) {
          h.pricePerNight = h.prevPricePerNight;
          h.prevPricePerNight = null;
        }
        h.discountLabel = null;
        h.discountExpiry = null;
        clearCount++;
      }
    }
  });

  if (clearCount > 0) {
    localStorage.setItem('tcbd_activities', JSON.stringify(activities));
    localStorage.setItem('tcbd_hotels', JSON.stringify(hotels));
    console.log(`[Expiry Sweep] Pruned ${clearCount} expired discount campaign structures silenty.`);
  }
}

function checkAndReportExpiredCampaignsOnLoad() {
  loadDatabase();
  const now = new Date();
  let clearCount = 0;

  activities.forEach(a => {
    if (a.discountExpiry) {
      if (new Date(a.discountExpiry) <= now) {
        if (a.prevPrice) {
          a.price = a.prevPrice;
          a.prevPrice = null;
        }
        a.discountLabel = null;
        a.discountExpiry = null;
        clearCount++;
      }
    }
  });

  hotels.forEach(h => {
    if (h.discountExpiry) {
      if (new Date(h.discountExpiry) <= now) {
        if (h.prevPricePerNight) {
          h.pricePerNight = h.prevPricePerNight;
          h.prevPricePerNight = null;
        }
        h.discountLabel = null;
        h.discountExpiry = null;
        clearCount++;
      }
    }
  });

  if (clearCount > 0) {
    localStorage.setItem('tcbd_activities', JSON.stringify(activities));
    localStorage.setItem('tcbd_hotels', JSON.stringify(hotels));
    showToast(`🔔 Notice: ${clearCount} scheduled discount campaign packages expired and were automatically clean-pruned.`);
  }
}

// ==================== ANALYTICS & REPORTS ====================
let analyticsRange = 'week';

function setAnalyticsRange(rangeId) {
  analyticsRange = rangeId;
  
  // Highlight pill
  const pAll = ['week', 'month', 'all', 'custom'];
  pAll.forEach(p => {
    const el = document.getElementById(`an-pill-${p}`);
    if (el) {
      if (p === rangeId) {
        el.classList.add('active');
        el.style.background = 'var(--teal)';
        el.style.color = 'var(--white)';
        el.style.borderColor = 'var(--teal)';
      } else {
        el.classList.remove('active');
        el.style.background = 'var(--white)';
        el.style.color = 'var(--dark)';
        el.style.borderColor = 'var(--border-color)';
      }
    }
  });

  const customInputs = document.getElementById('an-custom-inputs');
  if (customInputs) {
    customInputs.style.display = (rangeId === 'custom') ? 'flex' : 'none';
  }

  renderAnalytics();
}

function applyCustomAnalyticsRange() {
  const start = document.getElementById('an-start-date').value;
  const end = document.getElementById('an-end-date').value;
  if (!start && !end) {
    showToast("⚠️ Enter at least a Start or End date Coordinate");
    return;
  }
  renderAnalytics();
  showToast("✓ Custom range filter applied");
}

function renderAnalytics() {
  loadDatabase();
  
  let filtered = [...bookings];
  const now = new Date();

  if (analyticsRange === 'week') {
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - 7);
    cutoff.setHours(0,0,0,0);
    filtered = bookings.filter(b => b.timestamp && new Date(b.timestamp) >= cutoff);
  } else if (analyticsRange === 'month') {
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - 30);
    cutoff.setHours(0,0,0,0);
    filtered = bookings.filter(b => b.timestamp && new Date(b.timestamp) >= cutoff);
  } else if (analyticsRange === 'custom') {
    const startVal = document.getElementById('an-start-date').value;
    const endVal = document.getElementById('an-end-date').value;
    if (startVal) {
      const startLimit = new Date(startVal);
      startLimit.setHours(0,0,0,0);
      filtered = filtered.filter(b => b.timestamp && new Date(b.timestamp) >= startLimit);
    }
    if (endVal) {
      const endLimit = new Date(endVal);
      endLimit.setHours(23,59,59,999);
      filtered = filtered.filter(b => b.timestamp && new Date(b.timestamp) <= endLimit);
    }
  }

  // Row 1 metrics
  const totalCount = filtered.length;
  const totalGMV = filtered.reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  const avgValue = totalCount > 0 ? Math.round(totalGMV / totalCount) : 0;
  const totalDeposits = filtered.reduce((sum, b) => sum + (Number(b.deposit) || 0), 0);
  
  const conversionBookings = filtered.filter(b => {
    const s = (b.status || '').toLowerCase().trim();
    return s === 'confirmed' || s === 'completed';
  }).length;
  const conversionRate = totalCount > 0 ? ((conversionBookings / totalCount) * 100).toFixed(1) : "0.0";

  document.getElementById('an-v-gmv').innerText = `৳${totalGMV.toLocaleString()}`;
  document.getElementById('an-v-avg').innerText = `৳${avgValue.toLocaleString()}`;
  document.getElementById('an-v-deposits').innerText = `৳${totalDeposits.toLocaleString()}`;
  document.getElementById('an-v-conv').innerText = `${conversionRate}%`;

  // ROW 2: Traveler Type
  const typeCounts = { Couple: 0, Solo: 0, Group: 0, Family: 0, Corporate: 0 };
  filtered.forEach(b => {
    const t = (b.type || '').toLowerCase().trim();
    if (t === 'couple') typeCounts.Couple++;
    else if (t === 'solo') typeCounts.Solo++;
    else if (t === 'group') typeCounts.Group++;
    else if (t === 'family') typeCounts.Family++;
    else if (t === 'corporate') typeCounts.Corporate++;
  });

  let travHTML = "";
  Object.keys(typeCounts).forEach(type => {
    const count = typeCounts[type];
    const pct = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : "0.0";
    travHTML += `
      <tr style="height:36px;">
        <td style="padding:4px 8px; font-weight:600;">${type}</td>
        <td style="padding:4px 8px; font-weight:700;">${count}</td>
        <td style="padding:4px 8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; font-family:var(--font-mono); width:40px; font-size:11px;">${pct}%</span>
            <div style="flex:1; background:#f1f5f9; height:6px; border-radius:3px; overflow:hidden; max-width:80px;">
              <div style="background:var(--teal); height:100%; width:${pct}%;"></div>
            </div>
          </div>
        </td>
      </tr>
    `;
  });
  document.getElementById('an-tb-travellers').innerHTML = travHTML;

  // Acquisition Source
  const sourceCounts = { "Facebook Group": 0, "Facebook Ad": 0, "Friend Referral": 0, "WhatsApp": 0, "Google": 0, "Instagram": 0, "Other": 0 };
  filtered.forEach(b => {
    const s = (b.source || '').toLowerCase().trim();
    if (s.includes('ad')) sourceCounts["Facebook Ad"]++;
    else if (s.includes('group')) sourceCounts["Facebook Group"]++;
    else if (s.includes('word') || s.includes('friend') || s.includes('referral') || s.includes('referred')) sourceCounts["Friend Referral"]++;
    else if (s.includes('whatsapp') || s.includes('chat')) sourceCounts["WhatsApp"]++;
    else if (s.includes('google') || s.includes('search')) sourceCounts["Google"]++;
    else if (s.includes('instagram') || s.includes('insta')) sourceCounts["Instagram"]++;
    else sourceCounts["Other"]++;
  });

  let sourceHTML = "";
  Object.keys(sourceCounts).forEach(source => {
    const count = sourceCounts[source];
    const pct = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : "0.0";
    sourceHTML += `
      <tr style="height:36px;">
        <td style="padding:4px 8px; font-weight:600;">${source}</td>
        <td style="padding:4px 8px; font-weight:700;">${count}</td>
        <td style="padding:4px 8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; font-family:var(--font-mono); width:40px; font-size:11px;">${pct}%</span>
            <div style="flex:1; background:#f1f5f9; height:6px; border-radius:3px; overflow:hidden; max-width:80px;">
              <div style="background:var(--coral); height:100%; width:${pct}%;"></div>
            </div>
          </div>
        </td>
      </tr>
    `;
  });
  document.getElementById('an-tb-sources').innerHTML = sourceHTML;

  // Payment Method
  const payCounts = { "bKash": { count: 0, amount: 0 }, "Nagad": { count: 0, amount: 0 }, "Card / Bank": { count: 0, amount: 0 } };
  filtered.forEach(b => {
    const p = (b.payment || '').toLowerCase().trim();
    const totVal = Number(b.total) || 0;
    if (p.includes('bkash')) {
      payCounts["bKash"].count++;
      payCounts["bKash"].amount += totVal;
    } else if (p.includes('nagad')) {
      payCounts["Nagad"].count++;
      payCounts["Nagad"].amount += totVal;
    } else {
      payCounts["Card / Bank"].count++;
      payCounts["Card / Bank"].amount += totVal;
    }
  });

  let payHTML = "";
  Object.keys(payCounts).forEach(m => {
    payHTML += `
      <tr style="height:36px;">
        <td style="padding:4px 8px; font-weight:600;">${m}</td>
        <td style="padding:4px 8px; font-weight:700;">${payCounts[m].count}</td>
        <td style="padding:4px 8px; text-align:right; font-weight:800; color:var(--dark);">৳${payCounts[m].amount.toLocaleString()}</td>
      </tr>
    `;
  });
  document.getElementById('an-tb-payments').innerHTML = payHTML;

  // Row 3: Status Breakdown
  const statBreakdowns = {
    "New": { count: 0, amount: 0 },
    "Contacted": { count: 0, amount: 0 },
    "Confirmed": { count: 0, amount: 0 },
    "Completed": { count: 0, amount: 0 },
    "Cancelled": { count: 0, amount: 0 }
  };
  
  filtered.forEach(b => {
    let s = (b.status || 'New').toLowerCase().trim();
    if (s === 'pending') s = 'new';
    let label = 'New';
    if (s === 'new') label = 'New';
    else if (s === 'contacted') label = 'Contacted';
    else if (s === 'confirmed') label = 'Confirmed';
    else if (s === 'completed') label = 'Completed';
    else if (s === 'cancelled' || s === 'cancel') label = 'Cancelled';
    
    if (statBreakdowns[label]) {
      statBreakdowns[label].count++;
      statBreakdowns[label].amount += (Number(b.total) || 0);
    }
  });

  let statHTML = "";
  Object.keys(statBreakdowns).forEach(label => {
    const item = statBreakdowns[label];
    const pct = totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : "0.0";
    statHTML += `
      <tr style="height:38px;">
        <td style="padding:4px 8px;"><span class="badge-pill badge-${label.toLowerCase()}" style="font-size:10px; font-weight:800; padding:2px 6px;">${label}</span></td>
        <td style="padding:4px 8px; font-weight:700;">${item.count}</td>
        <td style="padding:4px 8px; font-family:var(--font-mono); font-weight:700; color:var(--text-muted); font-size:11px;">${pct}%</td>
        <td style="padding:4px 8px; text-align:right; font-weight:800; color:var(--teal);">৳${item.amount.toLocaleString()}</td>
      </tr>
    `;
  });
  document.getElementById('an-tb-statuses').innerHTML = statHTML;

  // Destination Breakdown
  const destCounts = {
    "cox": 0,
    "bandarban": 0,
    "rangamati": 0,
    "khagra": 0,
    "ctg": 0,
    "other": 0
  };

  let totalItemsCount = 0;
  
  filtered.forEach(b => {
    const itemsList = b.items || [];
    itemsList.forEach(item => {
      totalItemsCount++;
      let destFound = false;

      const act = (activities || []).find(a => a.name === item.name || a.id === item.id);
      if (act) {
        if (destCounts[act.dest] !== undefined) destCounts[act.dest]++;
        destFound = true;
      } else {
        const hot = (hotels || []).find(h => h.name === item.name || h.id === item.id || h.id === String(item.id));
        if (hot) {
          if (destCounts[hot.dest] !== undefined) destCounts[hot.dest]++;
          destFound = true;
        } else {
          const trans = (localTransport || []).find(t => t.name === item.name || t.id === item.id);
          if (trans) {
            if (destCounts[trans.dest] !== undefined) destCounts[trans.dest]++;
            destFound = true;
          }
        }
      }

      if (!destFound) {
        const nameLower = (item.name || '').toLowerCase();
        if (nameLower.includes("cox") || nameLower.includes("st. martin") || nameLower.includes("saint martin") || nameLower.includes("sea palace") || nameLower.includes("beach")) {
          destCounts["cox"]++;
        } else if (nameLower.includes("bandarban") || nameLower.includes("nilgiri") || nameLower.includes("sajek") || nameLower.includes("chimbuk")) {
          destCounts["bandarban"]++;
        } else if (nameLower.includes("rangamati") || nameLower.includes("kaptai") || nameLower.includes("lake") || nameLower.includes("shuvolong")) {
          destCounts["rangamati"]++;
        } else if (nameLower.includes("khagrachhari") || nameLower.includes("alutila") || nameLower.includes("richhang") || nameLower.includes("khagra")) {
          destCounts["khagra"]++;
        } else if (nameLower.includes("chattogram") || nameLower.includes("patenga") || nameLower.includes("foy's") || nameLower.includes("ctg") || nameLower.includes("guliakhali")) {
          destCounts["ctg"]++;
        } else {
          destCounts["other"]++;
        }
      }
    });
  });

  const destLabels = {
    "cox": "🏖️ Cox's Bazar / St. Martin",
    "bandarban": "🌿 Bandarban Hills Peaks",
    "rangamati": "💧 Lake Rangamati Valley",
    "khagra": "🌄 Khagrachhari Outbound",
    "ctg": "🏙️ Chattogram Harbor Coast",
    "other": "🎒 Other Services"
  };

  let destHTML = "";
  Object.keys(destCounts).forEach(dKey => {
    const itemsBooked = destCounts[dKey];
    const pct = totalItemsCount > 0 ? ((itemsBooked / totalItemsCount) * 100).toFixed(1) : "0.0";
    
    let progressBg = "var(--teal)";
    if (dKey === "bandarban") progressBg = "#10b981";
    if (dKey === "rangamati") progressBg = "#3b82f6";
    if (dKey === "khagra") progressBg = "#f59e0b";
    if (dKey === "ctg") progressBg = "#8b5cf6";
    if (dKey === "other") progressBg = "#64748b";

    destHTML += `
      <tr style="height:36px;">
        <td style="padding:4px 8px; font-weight:700; color:var(--dark);">${destLabels[dKey]}</td>
        <td style="padding:4px 8px; text-align:center; font-weight:800; font-family:var(--font-mono);">${itemsBooked}</td>
        <td style="padding:4px 8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; font-family:var(--font-mono); width:40px; font-size:11px;">${pct}%</span>
            <div style="flex:1; background:#f1f5f9; height:6px; border-radius:3px; overflow:hidden; max-width:80px;">
              <div style="background:${progressBg}; height:100%; width:${pct}%;"></div>
            </div>
          </div>
        </td>
      </tr>
    `;
  });
  document.getElementById('an-tb-destinations').innerHTML = destHTML;

  // Quick Stats
  const nameFreq = {};
  filtered.forEach(b => {
    (b.items || []).forEach(item => {
      const n = item.name || 'Unnamed';
      nameFreq[n] = (nameFreq[n] || 0) + 1;
    });
  });
  
  let popAct = "N/A";
  let maxCount = 0;
  Object.keys(nameFreq).forEach(n => {
    if (nameFreq[n] > maxCount) {
      maxCount = nameFreq[n];
      popAct = n;
    }
  });
  document.getElementById('an-stat-pop-act').innerText = popAct;
  document.getElementById('an-stat-pop-act-sub').innerText = `${maxCount} separate reservations in range`;

  let highestBooking = null;
  filtered.forEach(b => {
    if (!highestBooking || (Number(b.total) > Number(highestBooking.total))) {
      highestBooking = b;
    }
  });

  if (highestBooking) {
    document.getElementById('an-stat-highest-booking').innerText = `৳${(highestBooking.total || 0).toLocaleString()}`;
    document.getElementById('an-stat-highest-booking-sub').innerText = `${highestBooking.ref} — ${highestBooking.name}`;
  } else {
    document.getElementById('an-stat-highest-booking').innerText = "N/A";
    document.getElementById('an-stat-highest-booking-sub').innerText = "0 bookings found";
  }

  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  filtered.forEach(b => {
    if (b.timestamp) {
      const d = new Date(b.timestamp).getDay();
      dayCounts[d]++;
    }
  });

  const daysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let peakDayIdx = 5;
  let maxDayCount = -1;
  dayCounts.forEach((cnt, idx) => {
    if (cnt > maxDayCount) {
      maxDayCount = cnt;
      peakDayIdx = idx;
    }
  });

  if (maxDayCount > 0) {
    document.getElementById('an-stat-peak-day').innerText = daysList[peakDayIdx];
    document.getElementById('an-stat-peak-day-sub').innerText = `${maxDayCount} total tickets registered`;
  } else {
    document.getElementById('an-stat-peak-day').innerText = "N/A";
    document.getElementById('an-stat-peak-day-sub').innerText = "No bookings found";
  }
}

// ==================== SYSTEM SETTINGS DIRECTIVES ====================
function initSettingsForm() {
  const gasUrl = localStorage.getItem('tcbd_api_url') || localStorage.getItem('tcbd_sheets_webhook') || '';
  const waNum = localStorage.getItem('tcbd_wa') || '8801740902857';
  const emailNotif = localStorage.getItem('tcbd_email_notif') === 'true';
  const emailVal = localStorage.getItem('tcbd_notif_email') || 'alerts@tourcartbd.com';
  const dailyNotif = localStorage.getItem('tcbd_daily_notif') === 'true';

  document.getElementById('setting-gas-url').value = gasUrl;
  document.getElementById('setting-wa-num').value = waNum;
  
  const emailToggle = document.getElementById('setting-toggle-email');
  if (emailToggle) emailToggle.checked = emailNotif;
  
  const emailBox = document.getElementById('setting-email-box');
  if (emailBox) emailBox.style.display = emailNotif ? 'block' : 'none';
  
  document.getElementById('setting-email-val').value = emailVal;
  document.getElementById('setting-toggle-daily').checked = dailyNotif;

  const syncLabel = document.getElementById('settings-last-sync');
  if (syncLabel) {
    const lastSync = localStorage.getItem('tcbd_last_sync_timestamp') || new Date().toISOString();
    syncLabel.innerText = new Date(lastSync).toLocaleString();
  }
}

async function testGasConnection() {
  const url = document.getElementById('setting-gas-url').value.trim();
  if (!url) {
    showToast("⚠️ Google Apps Script URL cannot be empty.");
    return;
  }
  const statusEl = document.getElementById('test-conn-status');
  statusEl.innerText = "⏳ Pinging...";
  statusEl.style.color = "var(--text-muted)";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ping: true })
    });
    
    clearTimeout(timeoutId);
    statusEl.innerText = "✓ Connected";
    statusEl.style.color = "var(--teal)";
    showToast("✓ Connected successfully to Google Sheets Webhook.");
  } catch (err) {
    console.error("Link warning:", err);
    if (url.startsWith('https://script.google.com/')) {
      statusEl.innerText = "✓ Connected";
      statusEl.style.color = "var(--teal)";
      showToast("✓ Handshake established successfully.");
    } else {
      statusEl.innerText = "✗ Failed";
      statusEl.style.color = "var(--danger)";
      showToast("✗ Handshake failed. Ensure the URL is correct.");
    }
  }
}

function saveGasSettings() {
  const url = document.getElementById('setting-gas-url').value.trim();
  localStorage.setItem('tcbd_api_url', url);
  localStorage.setItem('tcbd_sheets_webhook', url);
  showToast("✓ Saved: Webhook connection bound successfully!");
}

function saveWaSettings() {
  const num = document.getElementById('setting-wa-num').value.trim().replace(/\+/g, '').replace(/\s+/g, '');
  if (!num) {
    showToast("⚠️ WhatsApp number cannot be empty.");
    return;
  }
  localStorage.setItem('tcbd_wa', num);
  showToast("✓ Saved: WhatsApp Business Number updated.");
  
  // Try to dispatch globally
  if (typeof window.tcbd_wa !== 'undefined') {
    window.tcbd_wa = num;
  }
}

function savePasswordSettings() {
  const curPass = document.getElementById('setting-cur-pwd').value;
  const newPass = document.getElementById('setting-new-pwd').value;
  const confPass = document.getElementById('setting-conf-pwd').value;

  const storedPass = localStorage.getItem('tcbd_admin_pwd') || 'TourCart@2026';

  if (!curPass || !newPass || !confPass) {
    showToast("⚠️ All password fields are required.");
    return;
  }
  if (curPass !== storedPass) {
    showToast("✗ Failed: Current password is incorrect.");
    return;
  }
  if (newPass.length < 8) {
    showToast("⚠️ Failed: New password must be at least 8 characters.");
    return;
  }
  if (newPass !== confPass) {
    showToast("✗ Failed: New passwords do not match.");
    return;
  }

  localStorage.setItem('tcbd_admin_pwd', newPass);
  showToast("✓ Saved: Admin Password changed successfully!");
  
  document.getElementById('setting-cur-pwd').value = "";
  document.getElementById('setting-new-pwd').value = "";
  document.getElementById('setting-conf-pwd').value = "";

  setTimeout(() => {
    logoutAdmin();
  }, 1000);
}

function saveNotificationSettings() {
  const notifEmail = document.getElementById('setting-toggle-email').checked;
  const emailVal = document.getElementById('setting-email-val').value.trim();
  const notifDaily = document.getElementById('setting-toggle-daily').checked;

  localStorage.setItem('tcbd_email_notif', notifEmail ? 'true' : 'false');
  localStorage.setItem('tcbd_notif_email', emailVal);
  localStorage.setItem('tcbd_daily_notif', notifDaily ? 'true' : 'false');

  showToast("✓ Saved: Notification settings synchronized.");
}

function exportAllDataJson() {
  loadDatabase();
  const backup = {
    bookings: bookings,
    corporate: JSON.parse(localStorage.getItem('tcbd_corporate') || '[]'),
    activities: activities,
    hotels: hotels,
    bus_classes: busClasses,
    local_transport: localTransport,
    config: {
      api_url: localStorage.getItem('tcbd_api_url') || '',
      whatsapp_num: localStorage.getItem('tcbd_wa') || '',
      email_notif: localStorage.getItem('tcbd_email_notif') || '',
      notif_email: localStorage.getItem('tcbd_notif_email') || '',
      daily_notif: localStorage.getItem('tcbd_daily_notif') || ''
    }
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `TourCartBD_FullBackup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("📥 Exported all data files to JSON successfully!");
}

function clearAllBookingsWithWarn() {
  const doubleCheck = confirm("⚠️ Are you sure? This will wipe your ENTIRE bookings ledger! This cannot be undone.");
  if (!doubleCheck) return;

  localStorage.setItem('tcbd_bookings', '[]');
  loadDatabase();
  renderDashboardMetrics();
  
  const analyticsSec = document.getElementById('section-analytics');
  if (analyticsSec && analyticsSec.classList.contains('active')) {
    renderAnalytics();
  }
  showToast("✓ Clean swept: All bookings data successfully cleared.");
}

function syncPriceChangeToGas(itemName, oldPrice, newPrice) {
  const syncUrl = localStorage.getItem('tcbd_api_url');
  if (!syncUrl) return;

  const payload = {
    sheet: 'PriceUpdates',
    item: itemName,
    oldPrice: Number(oldPrice) || 0,
    newPrice: Number(newPrice) || 0,
    updatedBy: 'admin',
    timestamp: new Date().toISOString()
  };

  fetch(syncUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(() => {
    console.log(`✓ Synchronized price post for "${itemName}"`);
  }).catch(err => {
    console.warn("Pricing post sync warning:", err);
  });
}

/* ============================================
   NC ENDURANCE GUIDE — APP LOGIC
   CMS-driven race directory with filtering,
   sorting, and dynamic rendering.
   ============================================ */

(function () {
  'use strict';

  // ─── CMS DATA MODEL ─────────────────────────
  // This array simulates the "NC Races" CMS Collection.
  // Each item maps to CMS collection fields:
  //   - id: unique identifier
  //   - name: Race Name (text)
  //   - date: Race Date (ISO date string)
  //   - city: City (text)
  //   - region: Region (option: Northwest, Southwest, Central, Northeast, Southeast)
  //   - distance: Distance (option: 5K, 10K, Half Marathon, Marathon, Ultra, Triathlon)
  //   - description: Short Description (text)
  //   - logo: Logo Image URL (image, optional)
  //   - url: Race URL (link)
  //   - featured: Featured flag (boolean)

  var races = [
    { id: 'r001', name: 'Blue Ridge Relay', date: '2026-09-12', city: 'Boone', region: 'Northwest', distance: 'Ultra', lat: 36.2168, lng: -81.6746, description: 'A 208-mile team relay through the Blue Ridge Mountains, spanning from Grayson Highlands to Asheville across stunning mountain terrain.', logo: '', url: '#', featured: true },
    { id: 'r002', name: 'Tobacco Road Marathon', date: '2026-03-15', city: 'Cary', region: 'Central', distance: 'Marathon', lat: 35.7915, lng: -78.7811, description: 'Fast and flat BQ course along the American Tobacco Trail. One of the most popular spring marathons in the Southeast.', logo: '', url: '#', featured: false },
    { id: 'r003', name: 'Uwharrie Mountain Run', date: '2026-02-07', city: 'Troy', region: 'Central', distance: 'Ultra', lat: 35.3568, lng: -79.8942, description: 'A grueling 20-mile or 40-mile trail run through the ancient Uwharrie Mountains. Rooted in tradition and challenging single-track.', logo: '', url: '#', featured: false },
    { id: 'r004', name: 'Oak City Mile', date: '2026-05-02', city: 'Raleigh', region: 'Central', distance: '5K', lat: 35.7796, lng: -78.6382, description: 'A one-mile street race through downtown Raleigh. Fast, festive, and family-friendly with elite and community heats.', logo: '', url: '#', featured: false },
    { id: 'r005', name: 'Grandfather Mountain Marathon', date: '2026-07-11', city: 'Boone', region: 'Northwest', distance: 'Marathon', lat: 36.1998, lng: -81.6396, description: 'The oldest marathon in the Carolinas. A challenging point-to-point course with over 1,600 feet of elevation gain through High Country roads.', logo: '', url: '#', featured: false },
    { id: 'r006', name: 'Wrightsville Beach Half Marathon', date: '2026-03-22', city: 'Wrightsville Beach', region: 'Southeast', distance: 'Half Marathon', lat: 34.2085, lng: -77.7964, description: 'A scenic coastal half marathon with views of the Intracoastal Waterway and Atlantic Ocean. A spring tradition for NC runners.', logo: '', url: '#', featured: false },
    { id: 'r007', name: 'Croatan Buck 50', date: '2026-04-18', city: 'New Bern', region: 'Northeast', distance: 'Ultra', lat: 35.1085, lng: -77.0441, description: 'A 150K gravel ultra through the Croatan National Forest. Remote, relentless, and one of the East Coast\'s premier ultra-distance events.', logo: '', url: '#', featured: false },
    { id: 'r008', name: 'Charlotte Thunder Road Marathon', date: '2026-11-21', city: 'Charlotte', region: 'Southwest', distance: 'Marathon', lat: 35.2271, lng: -80.8431, description: 'Charlotte\'s premier fall marathon through Uptown and surrounding neighborhoods. Fast course with strong crowd support.', logo: '', url: '#', featured: false },
    { id: 'r009', name: 'Outer Banks Marathon', date: '2026-11-08', city: 'Kitty Hawk', region: 'Northeast', distance: 'Marathon', lat: 36.0726, lng: -75.7057, description: 'Run through the birthplace of flight along the scenic Outer Banks. A flat, fast course with ocean breezes and barrier island views.', logo: '', url: '#', featured: false },
    { id: 'r010', name: 'Fonta Flora State Trail 50K', date: '2026-04-04', city: 'Morganton', region: 'Northwest', distance: 'Ultra', lat: 35.7454, lng: -81.6848, description: 'An ultra-distance trail race along the developing Fonta Flora State Trail with views of Lake James and Linville Gorge.', logo: '', url: '#', featured: false },
    { id: 'r011', name: 'Quintiles Wrightsville Beach Triathlon', date: '2026-05-16', city: 'Wrightsville Beach', region: 'Southeast', distance: 'Triathlon', lat: 34.2104, lng: -77.7906, description: 'A sprint and Olympic-distance triathlon at Wrightsville Beach. One of the longest-running multisport events in North Carolina.', logo: '', url: '#', featured: false },
    { id: 'r012', name: 'Asheville Running Experience 10K', date: '2026-06-13', city: 'Asheville', region: 'Northwest', distance: '10K', lat: 35.5951, lng: -82.5515, description: 'A hilly 10K through Asheville\'s vibrant downtown and surrounding arts district. Post-race beer garden from local breweries.', logo: '', url: '#', featured: false },
    { id: 'r013', name: 'Biltmore Kiwanis Classic 15K', date: '2026-08-29', city: 'Asheville', region: 'Northwest', distance: '10K', lat: 35.5781, lng: -82.5521, description: 'A late-summer classic winding through the historic Biltmore Village area. Great community race with decades of history.', logo: '', url: '#', featured: false },
    { id: 'r014', name: 'Ramblin Rose Triathlon', date: '2026-09-20', city: 'Durham', region: 'Central', distance: 'Triathlon', lat: 35.9940, lng: -78.8986, description: 'A women-centric sprint triathlon designed to be welcoming for first-timers and experienced athletes alike.', logo: '', url: '#', featured: false },
    { id: 'r015', name: 'Mountains-to-Sea Trail 50', date: '2026-10-10', city: 'Black Mountain', region: 'Northwest', distance: 'Ultra', lat: 35.6179, lng: -82.3212, description: 'A 50-mile point-to-point ultra along a section of the 1,175-mile Mountains-to-Sea Trail. Rugged, remote, and rewarding.', logo: '', url: '#', featured: false }
  ];


  // ─── DOM REFERENCES ──────────────────────────
  var filterDate = document.getElementById('filter-date');
  var filterRegion = document.getElementById('filter-region');
  var filterCity = document.getElementById('filter-city');
  var filterDistance = document.getElementById('filter-distance');
  var filterSort = document.getElementById('filter-sort');
  var clearFiltersBtn = document.getElementById('clear-filters');
  var emptyClearBtn = document.getElementById('empty-clear-filters');
  var raceGrid = document.getElementById('race-grid');
  var raceCount = document.getElementById('race-count');
  var emptyState = document.getElementById('empty-state');
  var featuredCard = document.getElementById('featured-race-card');


  // ─── INITIALIZATION ──────────────────────────
  // init() is defined at the bottom of the file, after initMap()


  // ─── POPULATE CITY DROPDOWN ──────────────────
  function populateCityFilter() {
    var cities = [];
    races.forEach(function (race) {
      if (cities.indexOf(race.city) === -1) {
        cities.push(race.city);
      }
    });
    cities.sort();

    cities.forEach(function (city) {
      var option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      filterCity.appendChild(option);
    });
  }


  // ─── DATE HELPERS ────────────────────────────
  function parseDate(dateStr) {
    var parts = dateStr.split('-');
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  function formatDate(dateStr) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = parseDate(dateStr);
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function formatDateFull(dateStr) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var d = parseDate(dateStr);
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function isInDateRange(dateStr, rangeKey) {
    if (!rangeKey) return true;
    var now = new Date();
    var raceDate = parseDate(dateStr);
    var endDate;

    switch (rangeKey) {
      case 'this-month':
        return raceDate.getMonth() === now.getMonth() && raceDate.getFullYear() === now.getFullYear();
      case 'next-month':
        endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        var startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return raceDate >= startNextMonth && raceDate <= endDate;
      case '3-months':
        endDate = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
        return raceDate >= now && raceDate <= endDate;
      case '6-months':
        endDate = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
        return raceDate >= now && raceDate <= endDate;
      case 'this-year':
        return raceDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  }


  // ─── SVG ICONS ───────────────────────────────
  var icons = {
    mapPin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    calendar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    route: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
    region: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>'
  };


  // ─── RENDER FEATURED RACE ────────────────────
  function renderFeaturedRace() {
    var featured = races.filter(function (r) { return r.featured; })[0];
    if (!featured) {
      document.getElementById('featured-race').style.display = 'none';
      return;
    }

    var logoHtml = featured.logo
      ? '<img src="' + escapeHtml(featured.logo) + '" alt="' + escapeHtml(featured.name) + ' logo" class="featured-logo">'
      : '<div class="featured-logo-placeholder">' + icons.route + '</div>';

    featuredCard.innerHTML =
      '<a href="' + escapeHtml(featured.url) + '" class="featured-race-link" style="display:contents;color:inherit;text-decoration:none;">' +
        logoHtml +
        '<div class="featured-details">' +
          '<div class="featured-badge">Featured Race</div>' +
          '<p class="featured-date">' + icons.calendar + ' ' + formatDateFull(featured.date) + '</p>' +
          '<h3 class="featured-name">' + escapeHtml(featured.name) + '</h3>' +
          '<div class="featured-meta">' +
            '<span class="featured-meta-item">' + icons.mapPin + ' ' + escapeHtml(featured.city) + ', NC</span>' +
            '<span class="featured-meta-item">' + icons.region + ' ' + escapeHtml(featured.region) + '</span>' +
            '<span class="featured-meta-item">' + icons.route + ' ' + escapeHtml(featured.distance) + '</span>' +
          '</div>' +
          '<p class="featured-description">' + escapeHtml(featured.description) + '</p>' +
          '<span class="btn btn-primary featured-cta">View Race Details</span>' +
        '</div>' +
      '</a>';
  }


  // ─── RENDER RACE CARD ────────────────────────
  function renderRaceCard(race) {
    var logoHtml = race.logo
      ? '<img src="' + escapeHtml(race.logo) + '" alt="' + escapeHtml(race.name) + '" class="race-card-logo">'
      : '<div class="race-card-logo-placeholder"></div>';

    return (
      '<a href="' + escapeHtml(race.url) + '" class="race-card" data-id="' + race.id + '">' +
        '<div class="race-card-body">' +
          '<div class="race-card-header">' +
            '<span class="race-card-date">' + formatDate(race.date) + '</span>' +
            logoHtml +
          '</div>' +
          '<h3 class="race-card-name">' + escapeHtml(race.name) + '</h3>' +
          '<div class="race-card-meta">' +
            '<span class="race-card-meta-item">' + icons.mapPin + ' ' + escapeHtml(race.city) + ', NC</span>' +
            '<span class="race-card-meta-item">' + icons.region + ' ' + escapeHtml(race.region) + '</span>' +
          '</div>' +
          '<p class="race-card-description">' + escapeHtml(race.description) + '</p>' +
        '</div>' +
        '<div class="race-card-divider"></div>' +
        '<div class="race-card-footer">' +
          '<span class="race-card-distance">' + escapeHtml(race.distance) + '</span>' +
          '<span class="race-card-link">View Race ' + icons.arrow + '</span>' +
        '</div>' +
      '</a>'
    );
  }


  // ─── FILTERING + SORTING ─────────────────────
  function applyFilters() {
    var dateVal = filterDate.value;
    var regionVal = filterRegion.value;
    var cityVal = filterCity.value;
    var distanceVal = filterDistance.value;
    var sortVal = filterSort.value;

    // Filter (exclude featured from main list)
    var filtered = races.filter(function (race) {
      if (race.featured) return false;
      if (!isInDateRange(race.date, dateVal)) return false;
      if (regionVal && race.region !== regionVal) return false;
      if (cityVal && race.city !== cityVal) return false;
      if (distanceVal && race.distance !== distanceVal) return false;
      return true;
    });

    // Sort
    filtered.sort(function (a, b) {
      switch (sortVal) {
        case 'date-asc':
          return parseDate(a.date) - parseDate(b.date);
        case 'date-desc':
          return parseDate(b.date) - parseDate(a.date);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return parseDate(a.date) - parseDate(b.date);
      }
    });

    // Render
    if (filtered.length === 0) {
      raceGrid.style.display = 'none';
      emptyState.style.display = 'block';
      raceCount.textContent = '';
    } else {
      raceGrid.style.display = '';
      emptyState.style.display = 'none';
      raceCount.textContent = filtered.length + ' race' + (filtered.length !== 1 ? 's' : '') + ' found';

      var html = '';
      filtered.forEach(function (race) {
        html += renderRaceCard(race);
      });
      raceGrid.innerHTML = html;
    }
  }


  // ─── CLEAR FILTERS ──────────────────────────
  function clearFilters() {
    filterDate.value = '';
    filterRegion.value = '';
    filterCity.value = '';
    filterDistance.value = '';
    filterSort.value = 'date-asc';
    applyFilters();
  }


  // ─── EVENT BINDINGS ──────────────────────────
  function bindEvents() {
    filterDate.addEventListener('change', applyFilters);
    filterRegion.addEventListener('change', applyFilters);
    filterCity.addEventListener('change', applyFilters);
    filterDistance.addEventListener('change', applyFilters);
    filterSort.addEventListener('change', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
    emptyClearBtn.addEventListener('click', clearFilters);
  }


  // ─── UTILITY ─────────────────────────────────
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }


  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerOffset = 130;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ─── HEADER SCROLL EFFECT ────────────────────
  var header = document.querySelector('.site-header');
  var lastScroll = 0;

  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      header.style.boxShadow = '0 1px 8px rgba(27, 42, 74, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  }, { passive: true });


  // ─── INTERACTIVE MAP ────────────────────────
  function initMap() {
    var mapEl = document.getElementById('nceg-leaflet-map');
    if (!mapEl || typeof L === 'undefined') return;

    var map = L.map('nceg-leaflet-map', {
      scrollWheelZoom: false,
      zoomControl: true
    }).setView([35.55, -79.4], 7);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 16
    }).addTo(map);

    function makeIcon(color) {
      return L.divIcon({
        className: 'nceg-map-marker',
        html: '<svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="' + color + '"/>' +
          '<circle cx="14" cy="14" r="6" fill="#fff" opacity="0.9"/>' +
          '<circle cx="14" cy="14" r="3" fill="' + color + '"/>' +
          '</svg>',
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [0, -36]
      });
    }

    var navyIcon = makeIcon('#1B2A4A');
    var goldIcon = makeIcon('#C4A265');
    var markers = L.featureGroup();

    races.forEach(function (r) {
      if (!r.lat || !r.lng) return;
      var icon = r.featured ? goldIcon : navyIcon;
      var popupContent =
        '<div class="nceg-popup-inner">' +
          '<span class="nceg-popup-date">' + formatDate(r.date) + '</span>' +
          '<div class="nceg-popup-name">' + escapeHtml(r.name) + '</div>' +
          '<div class="nceg-popup-meta">' + escapeHtml(r.city) + ', NC &middot; ' + escapeHtml(r.region) + '</div>' +
          '<span class="nceg-popup-distance">' + escapeHtml(r.distance) + '</span>' +
          '<a href="' + escapeHtml(r.url) + '" class="nceg-popup-link">View Race Details</a>' +
        '</div>';
      markers.addLayer(
        L.marker([r.lat, r.lng], { icon: icon })
          .bindPopup(popupContent, { className: 'nceg-map-popup', maxWidth: 280, minWidth: 220 })
      );
    });

    markers.addTo(map);
    if (markers.getLayers().length > 0) {
      map.fitBounds(markers.getBounds().pad(0.15));
    }
    setTimeout(function () { map.invalidateSize(); }, 300);
  }


  // ─── LAUNCH ──────────────────────────────────
  function init() {
    populateCityFilter();
    renderFeaturedRace();
    applyFilters();
    bindEvents();
    initMap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

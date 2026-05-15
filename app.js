const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const ALTITUDE_VIEW = {
  topAltitude: 90,
  bottomAltitude: 0,
  topY: 8,
  bottomY: 86,
};
const SCOPE_VIEW = {
  topOffset: 1,
  bottomOffset: -1,
  topY: 8,
  bottomY: 86,
};
const LIMB_OFFSETS = {
  sun: 16 / 60,
  moon: 15 / 60,
};

const state = {
  targetAzimuth: 126,
  targetAltitude: 38,
  targetCenterAltitude: 38,
  targetName: "Sonne",
  targetKind: "sun",
  targetComputedAt: "",
  viewAzimuth: 92,
  viewAltitude: 18,
  indexAngle: 12,
  micrometerMinutes: 0,
  indexErrorMinutes: 0,
  measurements: [],
  bodies: [],
};

const NAV_STARS = [
  { name: "Sirius", ra: 6.7525, dec: -16.7161 },
  { name: "Canopus", ra: 6.3992, dec: -52.6957 },
  { name: "Arcturus", ra: 14.261, dec: 19.1825 },
  { name: "Vega", ra: 18.6156, dec: 38.7837 },
  { name: "Capella", ra: 5.2782, dec: 45.998 },
  { name: "Rigel", ra: 5.2423, dec: -8.2016 },
  { name: "Procyon", ra: 7.655, dec: 5.225 },
  { name: "Achernar", ra: 1.6286, dec: -57.2367 },
  { name: "Betelgeuse", ra: 5.9195, dec: 7.4071 },
  { name: "Altair", ra: 19.8464, dec: 8.8683 },
  { name: "Aldebaran", ra: 4.5987, dec: 16.5093 },
  { name: "Antares", ra: 16.4901, dec: -26.432 },
  { name: "Spica", ra: 13.4199, dec: -11.1614 },
  { name: "Pollux", ra: 7.7553, dec: 28.0262 },
  { name: "Fomalhaut", ra: 22.9608, dec: -29.6222 },
  { name: "Deneb", ra: 20.6905, dec: 45.2803 },
  { name: "Regulus", ra: 10.1395, dec: 11.9672 },
  { name: "Hamal", ra: 2.1196, dec: 23.4624 },
];

const PLANET_ELEMENTS = {
  Mercury: {
    N: [48.3313, 3.24587e-5],
    i: [7.0047, 5e-8],
    w: [29.1241, 1.01444e-5],
    a: [0.387098, 0],
    e: [0.205635, 5.59e-10],
    M: [168.6562, 4.0923344368],
  },
  Venus: {
    N: [76.6799, 2.4659e-5],
    i: [3.3946, 2.75e-8],
    w: [54.891, 1.38374e-5],
    a: [0.72333, 0],
    e: [0.006773, -1.302e-9],
    M: [48.0052, 1.6021302244],
  },
  Mars: {
    N: [49.5574, 2.11081e-5],
    i: [1.8497, -1.78e-8],
    w: [286.5016, 2.92961e-5],
    a: [1.523688, 0],
    e: [0.093405, 2.516e-9],
    M: [18.6021, 0.5240207766],
  },
  Jupiter: {
    N: [100.4542, 2.76854e-5],
    i: [1.303, -1.557e-7],
    w: [273.8777, 1.64505e-5],
    a: [5.20256, 0],
    e: [0.048498, 4.469e-9],
    M: [19.895, 0.0830853001],
  },
  Saturn: {
    N: [113.6634, 2.3898e-5],
    i: [2.4886, -1.081e-7],
    w: [339.3939, 2.97661e-5],
    a: [9.55475, 0],
    e: [0.055546, -9.499e-9],
    M: [316.967, 0.0334442282],
  },
};

const elements = {
  skyFrame: document.querySelector("#skyFrame"),
  scope: document.querySelector(".scope"),
  worldHorizon: document.querySelector("#worldHorizon"),
  worldObjects: document.querySelector("#worldObjects"),
  directBelowHorizon: document.querySelector("#directBelowHorizon"),
  mirrorBelowHorizon: document.querySelector("#mirrorBelowHorizon"),
  directHorizon: document.querySelector("#directHorizon"),
  mirrorHorizon: document.querySelector("#mirrorHorizon"),
  directSun: document.querySelector("#directSun"),
  mirrorSun: document.querySelector("#mirrorSun"),
  azimuth: document.querySelector("#azimuth"),
  altitude: document.querySelector("#altitude"),
  indexAngle: document.querySelector("#indexAngle"),
  micrometerMinutes: document.querySelector("#micrometerMinutes"),
  micrometerReadout: document.querySelector("#micrometerReadout"),
  indexError: document.querySelector("#indexError"),
  objectName: document.querySelector("#objectName"),
  latitudeDeg: document.querySelector("#latitudeDeg"),
  latitudeMin: document.querySelector("#latitudeMin"),
  latitudeHemisphere: document.querySelector("#latitudeHemisphere"),
  longitudeDeg: document.querySelector("#longitudeDeg"),
  longitudeMin: document.querySelector("#longitudeMin"),
  longitudeHemisphere: document.querySelector("#longitudeHemisphere"),
  utcTime: document.querySelector("#utcTime"),
  bodySelect: document.querySelector("#bodySelect"),
  useCurrentTime: document.querySelector("#useCurrentTime"),
  aimSelectedBody: document.querySelector("#aimSelectedBody"),
  selectedBodyReadout: document.querySelector("#selectedBodyReadout"),
  almanacNote: document.querySelector("#almanacNote"),
  targetLabel: document.querySelector("#targetLabel"),
  sextantReading: document.querySelector("#sextantReading"),
  correctedReading: document.querySelector("#correctedReading"),
  viewReadout: document.querySelector("#viewReadout"),
  targetReadout: document.querySelector("#targetReadout"),
  saveMeasurement: document.querySelector("#saveMeasurement"),
  clearLog: document.querySelector("#clearLog"),
  measurementList: document.querySelector("#measurementList"),
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function shortestAngleDelta(from, to) {
  return ((to - from + 540) % 360) - 180;
}

function sinDeg(value) {
  return Math.sin(value * RAD);
}

function cosDeg(value) {
  return Math.cos(value * RAD);
}

function atan2Deg(y, x) {
  return normalizeDegrees(Math.atan2(y, x) * DEG);
}

function asinDeg(value) {
  return Math.asin(clamp(value, -1, 1)) * DEG;
}

function formatAngle(angle) {
  const sign = angle < 0 ? "-" : "";
  const absolute = Math.abs(angle);
  const degrees = Math.floor(absolute);
  const minutes = (absolute - degrees) * 60;
  return `${sign}${String(degrees).padStart(2, "0")} deg ${minutes.toFixed(1).padStart(4, "0")}'`;
}

function getSextantAngle() {
  return state.indexAngle + state.micrometerMinutes / 60;
}

function formatSignedMinutes(minutes) {
  return `${minutes >= 0 ? "+" : ""}${minutes.toFixed(1)}'`;
}

function formatShortAngle(angle) {
  return `${Math.round(normalizeDegrees(angle))} deg`;
}

function projectAltitudeToY(altitude, topAltitude, bottomAltitude, topY, bottomY) {
  const ratio = (topAltitude - altitude) / (topAltitude - bottomAltitude);
  return topY + ratio * (bottomY - topY);
}

function toDateTimeLocalValue(date) {
  const parts = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ];
  const time = [
    String(date.getUTCHours()).padStart(2, "0"),
    String(date.getUTCMinutes()).padStart(2, "0"),
  ];
  return `${parts.join("-")}T${time.join(":")}`;
}

function getAlmanacDate() {
  return new Date(`${elements.utcTime.value}:00Z`);
}

function getSignedCoordinate(degreesElement, minutesElement, hemisphereElement, negativeHemisphere, maxDegrees) {
  const degrees = clamp(Math.abs(Number(degreesElement.value || 0)), 0, maxDegrees);
  const minutes = clamp(Math.abs(Number(minutesElement.value || 0)), 0, 59.999);
  const sign = hemisphereElement.value === negativeHemisphere ? -1 : 1;

  return sign * (degrees + minutes / 60);
}

function getObserverPosition() {
  return {
    latitude: getSignedCoordinate(elements.latitudeDeg, elements.latitudeMin, elements.latitudeHemisphere, "S", 90),
    longitude: getSignedCoordinate(elements.longitudeDeg, elements.longitudeMin, elements.longitudeHemisphere, "W", 180),
  };
}

function formatCoordinate(degrees, minutes, hemisphere) {
  return `${Math.round(degrees)} deg ${Number(minutes).toFixed(3)}' ${hemisphere}`;
}

function getJulianDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function getGreenwichSiderealTime(jd) {
  const d = jd - 2451545.0;
  const t = d / 36525;
  return normalizeDegrees(280.46061837 + 360.98564736629 * d + 0.000387933 * t * t - (t * t * t) / 38710000);
}

function equatorialToHorizontal(raHours, decDegrees, latitude, longitude, jd) {
  const lst = normalizeDegrees(getGreenwichSiderealTime(jd) + longitude);
  const hourAngle = normalizeDegrees(lst - raHours * 15);
  const h = hourAngle > 180 ? hourAngle - 360 : hourAngle;
  const alt = asinDeg(sinDeg(latitude) * sinDeg(decDegrees) + cosDeg(latitude) * cosDeg(decDegrees) * cosDeg(h));
  const az = atan2Deg(
    -sinDeg(h),
    Math.tan(decDegrees * RAD) * cosDeg(latitude) - sinDeg(latitude) * cosDeg(h),
  );

  return { azimuth: az, altitude: alt };
}

function eclipticToEquatorial(lambda, beta, jd) {
  const d = jd - 2451545.0;
  const epsilon = 23.4393 - 3.563e-7 * d;
  const x = cosDeg(lambda) * cosDeg(beta);
  const y = sinDeg(lambda) * cosDeg(beta);
  const z = sinDeg(beta);
  const xe = x;
  const ye = y * cosDeg(epsilon) - z * sinDeg(epsilon);
  const ze = y * sinDeg(epsilon) + z * cosDeg(epsilon);
  const ra = atan2Deg(ye, xe) / 15;
  const dec = asinDeg(ze);

  return { ra, dec };
}

function solveKepler(meanAnomaly, eccentricity) {
  let eccentricAnomaly = meanAnomaly + eccentricity * DEG * sinDeg(meanAnomaly) * (1 + eccentricity * cosDeg(meanAnomaly));

  for (let index = 0; index < 5; index += 1) {
    const delta = (eccentricAnomaly - eccentricity * DEG * sinDeg(eccentricAnomaly) - meanAnomaly) / (1 - eccentricity * cosDeg(eccentricAnomaly));
    eccentricAnomaly -= delta;
  }

  return eccentricAnomaly;
}

function getSunEquatorial(jd) {
  const d = jd - 2451545.0;
  const meanLongitude = normalizeDegrees(280.46 + 0.9856474 * d);
  const meanAnomaly = normalizeDegrees(357.528 + 0.9856003 * d);
  const lambda = normalizeDegrees(meanLongitude + 1.915 * sinDeg(meanAnomaly) + 0.02 * sinDeg(2 * meanAnomaly));

  return eclipticToEquatorial(lambda, 0, jd);
}

function getMoonEquatorial(jd) {
  const d = jd - 2451543.5;
  const N = normalizeDegrees(125.1228 - 0.0529538083 * d);
  const i = 5.1454;
  const w = normalizeDegrees(318.0634 + 0.1643573223 * d);
  const a = 60.2666;
  const e = 0.0549;
  const M = normalizeDegrees(115.3654 + 13.0649929509 * d);
  const E = solveKepler(M, e);
  const xv = a * (cosDeg(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * sinDeg(E);
  const v = atan2Deg(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);
  const xh = r * (cosDeg(N) * cosDeg(v + w) - sinDeg(N) * sinDeg(v + w) * cosDeg(i));
  const yh = r * (sinDeg(N) * cosDeg(v + w) + cosDeg(N) * sinDeg(v + w) * cosDeg(i));
  const zh = r * sinDeg(v + w) * sinDeg(i);
  const lambda = atan2Deg(yh, xh);
  const beta = atan2Deg(zh, Math.sqrt(xh * xh + yh * yh));

  return eclipticToEquatorial(lambda, beta > 180 ? beta - 360 : beta, jd);
}

function getOrbitalValue(pair, d) {
  return pair[0] + pair[1] * d;
}

function getPlanetHeliocentric(name, d) {
  const elementsForPlanet = PLANET_ELEMENTS[name];
  const N = normalizeDegrees(getOrbitalValue(elementsForPlanet.N, d));
  const i = getOrbitalValue(elementsForPlanet.i, d);
  const w = normalizeDegrees(getOrbitalValue(elementsForPlanet.w, d));
  const a = getOrbitalValue(elementsForPlanet.a, d);
  const e = getOrbitalValue(elementsForPlanet.e, d);
  const M = normalizeDegrees(getOrbitalValue(elementsForPlanet.M, d));
  const E = solveKepler(M, e);
  const xv = a * (cosDeg(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * sinDeg(E);
  const v = atan2Deg(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);

  return {
    x: r * (cosDeg(N) * cosDeg(v + w) - sinDeg(N) * sinDeg(v + w) * cosDeg(i)),
    y: r * (sinDeg(N) * cosDeg(v + w) + cosDeg(N) * sinDeg(v + w) * cosDeg(i)),
    z: r * sinDeg(v + w) * sinDeg(i),
  };
}

function getEarthHeliocentric(d) {
  const w = normalizeDegrees(282.9404 + 4.70935e-5 * d);
  const e = 0.016709 - 1.151e-9 * d;
  const M = normalizeDegrees(356.047 + 0.9856002585 * d);
  const E = solveKepler(M, e);
  const xv = cosDeg(E) - e;
  const yv = Math.sqrt(1 - e * e) * sinDeg(E);
  const v = atan2Deg(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);

  return {
    x: r * cosDeg(v + w),
    y: r * sinDeg(v + w),
    z: 0,
  };
}

function getPlanetEquatorial(name, jd) {
  const d = jd - 2451543.5;
  const earth = getEarthHeliocentric(d);
  const planet = getPlanetHeliocentric(name, d);
  const x = planet.x - earth.x;
  const y = planet.y - earth.y;
  const z = planet.z - earth.z;
  const lambda = atan2Deg(y, x);
  const beta = atan2Deg(z, Math.sqrt(x * x + y * y));

  return eclipticToEquatorial(lambda, beta > 180 ? beta - 360 : beta, jd);
}

function makeBody(id, name, kind, equatorial, latitude, longitude, jd, limbOffset = 0) {
  const horizontal = equatorialToHorizontal(equatorial.ra, equatorial.dec, latitude, longitude, jd);

  return {
    id,
    name,
    kind,
    ra: equatorial.ra,
    dec: equatorial.dec,
    azimuth: horizontal.azimuth,
    altitude: horizontal.altitude + limbOffset,
    centerAltitude: horizontal.altitude,
    limbOffset,
  };
}

function calculateBodies() {
  const { latitude, longitude } = getObserverPosition();
  const date = getAlmanacDate();
  const jd = getJulianDate(date);
  const sunEquatorial = getSunEquatorial(jd);
  const moonEquatorial = getMoonEquatorial(jd);
  const bodies = [
    makeBody("sun-lower", "Sonne Unterrand", "sun", sunEquatorial, latitude, longitude, jd, -LIMB_OFFSETS.sun),
    makeBody("sun-upper", "Sonne Oberrand", "sun", sunEquatorial, latitude, longitude, jd, LIMB_OFFSETS.sun),
    makeBody("moon-lower", "Mond Unterrand", "moon", moonEquatorial, latitude, longitude, jd, -LIMB_OFFSETS.moon),
    makeBody("moon-upper", "Mond Oberrand", "moon", moonEquatorial, latitude, longitude, jd, LIMB_OFFSETS.moon),
  ];

  Object.keys(PLANET_ELEMENTS).forEach((name) => {
    bodies.push(makeBody(name.toLowerCase(), name, "planet", getPlanetEquatorial(name, jd), latitude, longitude, jd));
  });

  NAV_STARS.forEach((star) => {
    bodies.push(makeBody(`star-${star.name.toLowerCase()}`, star.name, "star", star, latitude, longitude, jd));
  });

  state.bodies = bodies.sort((a, b) => {
    if (b.altitude !== a.altitude) {
      return b.altitude - a.altitude;
    }

    return a.name.localeCompare(b.name);
  });
  state.targetComputedAt = date.toISOString();
}

function getSelectedBody() {
  return state.bodies.find((body) => body.id === elements.bodySelect.value) || state.bodies[0];
}

function syncTargetFromSelectedBody() {
  const body = getSelectedBody();

  if (!body) {
    return;
  }

  state.targetAzimuth = body.azimuth;
  state.targetAltitude = body.altitude;
  state.targetCenterAltitude = body.centerAltitude;
  state.targetName = body.name;
  state.targetKind = body.kind;
  elements.objectName.value = body.name;
}

function renderBodyOptions(previousValue) {
  elements.bodySelect.innerHTML = "";

  state.bodies.forEach((body) => {
    const option = document.createElement("option");
    option.value = body.id;
    option.textContent = `${body.name} / Az ${Math.round(body.azimuth)} deg / Alt ${Math.round(body.altitude)} deg`;
    elements.bodySelect.append(option);
  });

  if (previousValue && state.bodies.some((body) => body.id === previousValue)) {
    elements.bodySelect.value = previousValue;
  } else {
    elements.bodySelect.value = state.bodies.find((body) => body.id === "sun-lower")?.id || state.bodies[0]?.id || "";
  }
}

function refreshAlmanac() {
  const previousValue = elements.bodySelect.value;
  calculateBodies();
  renderBodyOptions(previousValue);
  syncTargetFromSelectedBody();
  render();
}

function getPosition(azimuth, altitude, centerAltitude, horizontalFov, verticalFov) {
  const azDelta = shortestAngleDelta(state.viewAzimuth, azimuth);
  const altDelta = altitude - centerAltitude;
  const x = 50 + (azDelta / horizontalFov) * 100;
  const y = 50 - (altDelta / verticalFov) * 100;

  return {
    x: clamp(x, -12, 112),
    y: clamp(y, -12, 112),
    visible: Math.abs(azDelta) <= horizontalFov * 0.62 && Math.abs(altDelta) <= verticalFov * 0.62,
  };
}

function getWorldPosition(azimuth, altitude) {
  const azDelta = shortestAngleDelta(state.viewAzimuth, azimuth);
  const x = 50 + (azDelta / 150) * 100;
  const y = projectAltitudeToY(altitude, ALTITUDE_VIEW.topAltitude, ALTITUDE_VIEW.bottomAltitude, ALTITUDE_VIEW.topY, ALTITUDE_VIEW.bottomY);

  return {
    x: clamp(x, -12, 112),
    y: clamp(y, -12, 112),
    visible: Math.abs(azDelta) <= 93 && altitude >= -8 && altitude <= 96,
  };
}

function getScopePosition(azimuth, altitude) {
  const azDelta = shortestAngleDelta(state.viewAzimuth, azimuth);
  const topAltitude = state.viewAltitude + SCOPE_VIEW.topOffset;
  const bottomAltitude = state.viewAltitude + SCOPE_VIEW.bottomOffset;
  const x = 50 + (azDelta / 32) * 100;
  const y = projectAltitudeToY(altitude, topAltitude, bottomAltitude, SCOPE_VIEW.topY, SCOPE_VIEW.bottomY);

  return {
    x: clamp(x, -12, 112),
    y: clamp(y, -12, 112),
    visible: Math.abs(azDelta) <= 20 && altitude >= bottomAltitude - 4 && altitude <= topAltitude + 4,
  };
}

function renderObject(element, position) {
  element.style.left = `${position.x}%`;
  element.style.top = `${position.y}%`;
  element.style.opacity = position.visible ? "" : "0.16";
}

function renderSplitObject(element, position, side) {
  const localX = side === "left" ? position.x * 2 : (position.x - 50) * 2;
  const insidePane = localX >= -22 && localX <= 122;

  element.style.left = `${localX}%`;
  element.style.top = `${position.y}%`;
  element.style.opacity = position.visible && insidePane ? "" : "0";
}

function renderHorizon(element, position) {
  element.style.top = `${position.y}%`;
  element.style.display = position.visible ? "" : "none";
}

function renderWorldBackground(position) {
  elements.skyFrame.style.setProperty("--world-horizon-y", `${position.y}%`);
}

function renderBelowHorizon(element, position) {
  element.style.top = `${position.y}%`;
  element.style.display = position.visible ? "" : "none";
}

function renderScopeBackground(position) {
  elements.scope.style.setProperty("--scope-horizon-y", `${position.y}%`);
}

function renderWorldObjects() {
  elements.worldObjects.innerHTML = "";

  state.bodies.forEach((body) => {
    const position = getWorldPosition(body.azimuth, body.altitude);
    const marker = document.createElement("div");
    marker.className = `sky-object is-${body.kind}${body.name === state.targetName ? " is-selected" : ""}`;
    marker.style.left = `${position.x}%`;
    marker.style.top = `${position.y}%`;
    marker.style.opacity = position.visible ? "" : "0";
    marker.title = body.name;
    elements.worldObjects.append(marker);
  });
}

function render() {
  const selectedBody = getSelectedBody();
  const sextantAngle = getSextantAngle();
  const directPosition = getScopePosition(state.targetAzimuth, state.targetCenterAltitude);
  const reflectedAltitude = state.targetCenterAltitude - sextantAngle;
  const mirrorPosition = getScopePosition(state.targetAzimuth, reflectedAltitude);
  const scopeHorizonPosition = getScopePosition(state.viewAzimuth, 0);
  const worldHorizonPosition = getWorldPosition(state.viewAzimuth, 0);
  const correctedAngle = sextantAngle + state.indexErrorMinutes / 60;

  elements.directSun.className = `sun scope-sun direct-sun is-${state.targetKind}`;
  elements.mirrorSun.className = `sun scope-sun mirror-sun is-${state.targetKind}`;

  renderWorldObjects();
  renderWorldBackground(worldHorizonPosition);
  renderHorizon(elements.worldHorizon, worldHorizonPosition);
  renderSplitObject(elements.directSun, directPosition, "left");
  renderSplitObject(elements.mirrorSun, mirrorPosition, "right");
  renderScopeBackground(scopeHorizonPosition);
  renderHorizon(elements.directHorizon, scopeHorizonPosition);
  renderHorizon(elements.mirrorHorizon, scopeHorizonPosition);
  renderBelowHorizon(elements.directBelowHorizon, scopeHorizonPosition);
  renderBelowHorizon(elements.mirrorBelowHorizon, scopeHorizonPosition);

  elements.sextantReading.textContent = formatAngle(sextantAngle);
  elements.correctedReading.textContent = formatAngle(correctedAngle);
  elements.micrometerReadout.textContent = formatSignedMinutes(state.micrometerMinutes);
  elements.viewReadout.textContent = `Az ${String(Math.round(state.viewAzimuth)).padStart(3, "0")} deg / Alt ${Math.round(state.viewAltitude)} deg`;
  elements.targetLabel.textContent = state.targetName;
  elements.targetReadout.textContent = `Az ${Math.round(state.targetAzimuth)} deg / Alt ${Math.round(state.targetAltitude)} deg`;

  if (selectedBody) {
    elements.selectedBodyReadout.textContent = `Az ${formatShortAngle(selectedBody.azimuth)} / Alt ${formatAngle(selectedBody.altitude)}`;
  }
}

function renderMeasurements() {
  elements.measurementList.innerHTML = "";

  state.measurements.forEach((measurement) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${measurement.object} / ${measurement.corrected}</strong>
      <span>${measurement.time} UTC / Hs ${measurement.raw} / IE ${measurement.indexError}</span>
      <span>Almanach ${measurement.target} / Ort ${measurement.location}</span>
    `;
    elements.measurementList.append(item);
  });
}

function saveMeasurement() {
  const sextantAngle = getSextantAngle();
  const corrected = sextantAngle + state.indexErrorMinutes / 60;
  const indexError = `${state.indexErrorMinutes >= 0 ? "+" : ""}${state.indexErrorMinutes.toFixed(1)}'`;
  const date = getAlmanacDate();

  state.measurements.unshift({
    object: elements.objectName.value.trim() || "Objekt",
    time: date.toISOString().replace("T", " ").slice(0, 19),
    raw: formatAngle(sextantAngle),
    corrected: formatAngle(corrected),
    indexError,
    location: `${formatCoordinate(elements.latitudeDeg.value, elements.latitudeMin.value, elements.latitudeHemisphere.value)} / ${formatCoordinate(elements.longitudeDeg.value, elements.longitudeMin.value, elements.longitudeHemisphere.value)}`,
    target: `Az ${Math.round(state.targetAzimuth)} deg / Alt ${formatAngle(state.targetAltitude)}`,
  });

  renderMeasurements();
}

function updateFromInputs() {
  state.viewAzimuth = Number(elements.azimuth.value);
  state.viewAltitude = Number(elements.altitude.value);
  state.indexAngle = Number(elements.indexAngle.value);
  state.micrometerMinutes = Number(elements.micrometerMinutes.value);
  state.indexErrorMinutes = Number(elements.indexError.value || 0);
  render();
}

function setViewFromPointer(event) {
  const rect = elements.skyFrame.getBoundingClientRect();
  const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
  const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
  const azimuth = (state.viewAzimuth + (x - 0.5) * 110 + 360) % 360;
  const altitude = clamp(state.viewAltitude + (0.5 - y) * 42, -10, 80);

  elements.azimuth.value = Math.round(azimuth);
  elements.altitude.value = Math.round(altitude);
  updateFromInputs();
}

function aimAtSelectedBody() {
  syncTargetFromSelectedBody();
  elements.azimuth.value = Math.round(state.targetAzimuth);
  elements.altitude.value = Math.round(clamp(state.targetCenterAltitude, -10, 80) * 2) / 2;
  updateFromInputs();
}

["input", "change"].forEach((eventName) => {
  elements.azimuth.addEventListener(eventName, updateFromInputs);
  elements.altitude.addEventListener(eventName, updateFromInputs);
  elements.indexAngle.addEventListener(eventName, updateFromInputs);
  elements.micrometerMinutes.addEventListener(eventName, updateFromInputs);
  elements.indexError.addEventListener(eventName, updateFromInputs);
});

["change", "input"].forEach((eventName) => {
  elements.latitudeDeg.addEventListener(eventName, refreshAlmanac);
  elements.latitudeMin.addEventListener(eventName, refreshAlmanac);
  elements.latitudeHemisphere.addEventListener(eventName, refreshAlmanac);
  elements.longitudeDeg.addEventListener(eventName, refreshAlmanac);
  elements.longitudeMin.addEventListener(eventName, refreshAlmanac);
  elements.longitudeHemisphere.addEventListener(eventName, refreshAlmanac);
  elements.utcTime.addEventListener(eventName, refreshAlmanac);
});

elements.bodySelect.addEventListener("change", () => {
  syncTargetFromSelectedBody();
  render();
});

elements.useCurrentTime.addEventListener("click", () => {
  elements.utcTime.value = toDateTimeLocalValue(new Date());
  refreshAlmanac();
});

elements.aimSelectedBody.addEventListener("click", aimAtSelectedBody);
elements.saveMeasurement.addEventListener("click", saveMeasurement);
elements.clearLog.addEventListener("click", () => {
  state.measurements = [];
  renderMeasurements();
});

elements.skyFrame.addEventListener("pointerdown", (event) => {
  elements.skyFrame.setPointerCapture(event.pointerId);
  setViewFromPointer(event);
});

elements.skyFrame.addEventListener("pointermove", (event) => {
  if (event.buttons === 1) {
    setViewFromPointer(event);
  }
});

elements.utcTime.value = toDateTimeLocalValue(new Date());
refreshAlmanac();
renderMeasurements();

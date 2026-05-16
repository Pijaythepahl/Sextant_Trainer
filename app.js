const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const ALTITUDE_VIEW = {
  topAltitude: 90,
  bottomAltitude: -10,
  topY: 8,
  bottomY: 94,
};
const WORLD_HORIZON_VIEW = {
  topAltitude: 90,
  bottomAltitude: 0,
  topY: 8,
  bottomY: 86,
};
const SCOPE_OVERLAY_LIMITS = {
  topY: 18,
  bottomY: 86,
};
const SCOPE_VIEW = {
  topOffset: 1,
  bottomOffset: -1,
  topY: 10,
  bottomY: 90,
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
  indexAngle: 0,
  micrometerMinutes: 0,
  indexErrorMinutes: 0,
  observerHeightMeters: 2,
  showSkyLabels: false,
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
  directScopeObjects: document.querySelector("#directScopeObjects"),
  mirrorScopeObjects: document.querySelector("#mirrorScopeObjects"),
  directBelowHorizon: document.querySelector("#directBelowHorizon"),
  mirrorBelowHorizon: document.querySelector("#mirrorBelowHorizon"),
  directHorizon: document.querySelector("#directHorizon"),
  mirrorHorizon: document.querySelector("#mirrorHorizon"),
  azimuth: document.querySelector("#azimuth"),
  altitude: document.querySelector("#altitude"),
  indexAngle: document.querySelector("#indexAngle"),
  micrometerMinutes: document.querySelector("#micrometerMinutes"),
  micrometerReadout: document.querySelector("#micrometerReadout"),
  indexError: document.querySelector("#indexError"),
  observerHeight: document.querySelector("#observerHeight"),
  latitudeDeg: document.querySelector("#latitudeDeg"),
  latitudeMin: document.querySelector("#latitudeMin"),
  latitudeHemisphere: document.querySelector("#latitudeHemisphere"),
  longitudeDeg: document.querySelector("#longitudeDeg"),
  longitudeMin: document.querySelector("#longitudeMin"),
  longitudeHemisphere: document.querySelector("#longitudeHemisphere"),
  utcTime: document.querySelector("#utcTime"),
  bodySelect: document.querySelector("#bodySelect"),
  useCurrentTime: document.querySelector("#useCurrentTime"),
  toggleAlmanac: document.querySelector("#toggleAlmanac"),
  almanac: document.querySelector(".almanac"),
  toggleSkyLabels: document.querySelector("#toggleSkyLabels"),
  targetLabel: document.querySelector("#targetLabel"),
  sextantReading: document.querySelector("#targetReadout"),
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

function atan2SignedDeg(y, x) {
  return Math.atan2(y, x) * DEG;
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

function getDipCorrectionDegrees() {
  return (1.76 * Math.sqrt(Math.max(state.observerHeightMeters, 0))) / 60;
}

function formatSignedMinutes(minutes) {
  return `${minutes >= 0 ? "+" : ""}${minutes.toFixed(1)}'`;
}

function formatShortAngle(angle) {
  return `${Math.round(normalizeDegrees(angle))} deg`;
}

function formatViewAltitude(angle) {
  return `${Number(angle).toFixed(1)} deg`;
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

function getLocalHourAngle(raHours, longitude, jd) {
  const lst = normalizeDegrees(getGreenwichSiderealTime(jd) + longitude);
  const hourAngle = normalizeDegrees(lst - raHours * 15);
  return hourAngle > 180 ? hourAngle - 360 : hourAngle;
}

function equatorialToHorizontal(raHours, decDegrees, latitude, longitude, jd) {
  const h = getLocalHourAngle(raHours, longitude, jd);
  const alt = asinDeg(sinDeg(latitude) * sinDeg(decDegrees) + cosDeg(latitude) * cosDeg(decDegrees) * cosDeg(h));
  const az = atan2Deg(
    -sinDeg(h),
    Math.tan(decDegrees * RAD) * cosDeg(latitude) - sinDeg(latitude) * cosDeg(h),
  );

  return { azimuth: az, altitude: alt };
}

function getMeanObliquity(jd) {
  const t = (jd - 2451545.0) / 36525;
  const seconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813));
  return 23 + 26 / 60 + seconds / 3600;
}

function getApparentObliquity(jd) {
  const t = (jd - 2451545.0) / 36525;
  const omega = normalizeDegrees(125.04 - 1934.136 * t);
  return getMeanObliquity(jd) + 0.00256 * cosDeg(omega);
}

function eclipticToEquatorial(lambda, beta, jd, obliquity = getMeanObliquity(jd)) {
  const x = cosDeg(lambda) * cosDeg(beta);
  const y = sinDeg(lambda) * cosDeg(beta);
  const z = sinDeg(beta);
  const xe = x;
  const ye = y * cosDeg(obliquity) - z * sinDeg(obliquity);
  const ze = y * sinDeg(obliquity) + z * cosDeg(obliquity);
  const ra = atan2Deg(ye, xe) / 15;
  const dec = asinDeg(ze);

  return { ra, dec };
}

function applyTopocentricParallax(equatorial, latitude, longitude, jd) {
  if (!equatorial.distanceEarthRadii) {
    return equatorial;
  }

  const horizontalParallax = asinDeg(1 / equatorial.distanceEarthRadii);
  const hourAngle = getLocalHourAngle(equatorial.ra, longitude, jd);
  const rhoSinPhi = 0.99833 * sinDeg(latitude);
  const rhoCosPhi = cosDeg(latitude);
  const deltaRa = atan2SignedDeg(
    -rhoCosPhi * sinDeg(horizontalParallax) * sinDeg(hourAngle),
    cosDeg(equatorial.dec) - rhoCosPhi * sinDeg(horizontalParallax) * cosDeg(hourAngle),
  );
  const ra = normalizeDegrees(equatorial.ra * 15 + deltaRa) / 15;
  const dec = atan2SignedDeg(
    (sinDeg(equatorial.dec) - rhoSinPhi * sinDeg(horizontalParallax)) * cosDeg(deltaRa),
    cosDeg(equatorial.dec) - rhoCosPhi * sinDeg(horizontalParallax) * cosDeg(hourAngle),
  );

  return { ...equatorial, ra, dec };
}

function getAtmosphericRefraction(altitude) {
  if (altitude < -1 || altitude > 89.9) {
    return 0;
  }

  return 1.02 / Math.tan((altitude + 10.3 / (altitude + 5.11)) * RAD) / 60;
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
  const t = (jd - 2451545.0) / 36525;
  const meanLongitude = normalizeDegrees(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  const meanAnomaly = normalizeDegrees(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const center =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * sinDeg(meanAnomaly) +
    (0.019993 - 0.000101 * t) * sinDeg(2 * meanAnomaly) +
    0.000289 * sinDeg(3 * meanAnomaly);
  const trueLongitude = meanLongitude + center;
  const omega = normalizeDegrees(125.04 - 1934.136 * t);
  const lambda = normalizeDegrees(trueLongitude - 0.00569 - 0.00478 * sinDeg(omega));

  return eclipticToEquatorial(lambda, 0, jd, getApparentObliquity(jd));
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
  const rawLambda = atan2Deg(yh, xh);
  const rawBeta = atan2Deg(zh, Math.sqrt(xh * xh + yh * yh));
  const Lm = normalizeDegrees(N + w + M);
  const Ms = normalizeDegrees(356.047 + 0.9856002585 * d);
  const Ls = normalizeDegrees(282.9404 + 4.70935e-5 * d + Ms);
  const D = normalizeDegrees(Lm - Ls);
  const F = normalizeDegrees(Lm - N);
  const lambda = normalizeDegrees(
    rawLambda -
      1.274 * sinDeg(M - 2 * D) +
      0.658 * sinDeg(2 * D) -
      0.186 * sinDeg(Ms) -
      0.059 * sinDeg(2 * M - 2 * D) -
      0.057 * sinDeg(M - 2 * D + Ms) +
      0.053 * sinDeg(M + 2 * D) +
      0.046 * sinDeg(2 * D - Ms) +
      0.041 * sinDeg(M - Ms) -
      0.035 * sinDeg(D) -
      0.031 * sinDeg(M + Ms) -
      0.015 * sinDeg(2 * F - 2 * D) +
      0.011 * sinDeg(M - 4 * D),
  );
  const beta =
    (rawBeta > 180 ? rawBeta - 360 : rawBeta) -
    0.173 * sinDeg(F - 2 * D) -
    0.055 * sinDeg(M - F - 2 * D) -
    0.046 * sinDeg(M + F - 2 * D) +
    0.033 * sinDeg(F + 2 * D) +
    0.017 * sinDeg(2 * M + F);
  const equatorial = eclipticToEquatorial(lambda, beta, jd);

  return { ...equatorial, distanceEarthRadii: r };
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
  const topocentric = applyTopocentricParallax(equatorial, latitude, longitude, jd);
  const horizontal = equatorialToHorizontal(topocentric.ra, topocentric.dec, latitude, longitude, jd);
  const refraction = getAtmosphericRefraction(horizontal.altitude);
  const apparentCenterAltitude = horizontal.altitude + refraction;

  return {
    id,
    name,
    kind,
    ra: topocentric.ra,
    dec: topocentric.dec,
    azimuth: horizontal.azimuth,
    altitude: apparentCenterAltitude + limbOffset,
    centerAltitude: apparentCenterAltitude,
    geometricAltitude: horizontal.altitude,
    refraction,
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

function getWorldHorizonPosition(azimuth, altitude) {
  const azDelta = shortestAngleDelta(state.viewAzimuth, azimuth);
  const x = 50 + (azDelta / 150) * 100;
  const y = projectAltitudeToY(
    altitude,
    WORLD_HORIZON_VIEW.topAltitude,
    WORLD_HORIZON_VIEW.bottomAltitude,
    WORLD_HORIZON_VIEW.topY,
    WORLD_HORIZON_VIEW.bottomY,
  );

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

function renderScopeOverlay() {
  const y = projectAltitudeToY(
    state.viewAltitude,
    ALTITUDE_VIEW.topAltitude,
    ALTITUDE_VIEW.bottomAltitude,
    ALTITUDE_VIEW.topY,
    ALTITUDE_VIEW.bottomY,
  );

  elements.scope.style.setProperty("--scope-y", `${clamp(y, SCOPE_OVERLAY_LIMITS.topY, SCOPE_OVERLAY_LIMITS.bottomY)}%`);
}

function renderWorldObjects() {
  elements.worldObjects.innerHTML = "";

  const renderedCenterBodies = new Set();

  state.bodies.forEach((body) => {
    const display = getDisplayBody(body);

    if (renderedCenterBodies.has(display.key)) {
      return;
    }

    renderedCenterBodies.add(display.key);

    const position = getWorldPosition(body.azimuth, body.centerAltitude);
    const marker = document.createElement("div");
    marker.className = `sky-object is-${body.kind}`;
    marker.style.left = `${position.x}%`;
    marker.style.top = `${position.y}%`;
    marker.style.opacity = position.visible ? "" : "0";
    marker.title = display.name;
    elements.worldObjects.append(marker);

    if (state.showSkyLabels && position.visible) {
      const label = document.createElement("div");
      label.className = `sky-label is-${body.kind}`;
      label.style.left = `${position.x}%`;
      label.style.top = `${position.y}%`;
      const labelText = document.createElement("span");
      labelText.className = "sky-label-text";
      labelText.textContent = display.name;
      label.append(labelText);
      elements.worldObjects.append(label);
    }
  });
}

function getDisplayBody(body) {
  const isDiscBody = body.kind === "sun" || body.kind === "moon";

  return {
    key: isDiscBody ? body.kind : body.id,
    name: isDiscBody ? (body.kind === "sun" ? "Sonne" : "Mond") : body.name,
  };
}

function appendScopeObject(container, body, altitude, side) {
  const display = getDisplayBody(body);
  const position = getScopePosition(body.azimuth, altitude);
  const localX = side === "left" ? position.x * 2 : (position.x - 50) * 2;
  const insidePane = localX >= -22 && localX <= 122;

  if (!position.visible || !insidePane) {
    return;
  }

  const marker = document.createElement("div");
  marker.className = `scope-object is-${body.kind}`;
  marker.style.left = `${localX}%`;
  marker.style.top = `${position.y}%`;
  marker.title = display.name;
  container.append(marker);

  if (state.showSkyLabels) {
    const label = document.createElement("div");
    label.className = `sky-label scope-label is-${body.kind}`;
    label.style.left = `${localX}%`;
    label.style.top = `${position.y}%`;
    const labelText = document.createElement("span");
    labelText.className = "sky-label-text";
    labelText.textContent = display.name;
    label.append(labelText);
    container.append(label);
  }
}

function renderScopeObjects(sextantAngle) {
  elements.directScopeObjects.innerHTML = "";
  elements.mirrorScopeObjects.innerHTML = "";

  const renderedCenterBodies = new Set();

  state.bodies.forEach((body) => {
    const display = getDisplayBody(body);

    if (renderedCenterBodies.has(display.key)) {
      return;
    }

    renderedCenterBodies.add(display.key);

    appendScopeObject(elements.directScopeObjects, body, body.centerAltitude, "left");
    appendScopeObject(elements.mirrorScopeObjects, body, body.centerAltitude - sextantAngle, "right");
  });
}

function render() {
  const sextantAngle = getSextantAngle();
  const visibleHorizonAltitude = -getDipCorrectionDegrees();
  const scopeHorizonPosition = getScopePosition(state.viewAzimuth, visibleHorizonAltitude);
  const worldHorizonPosition = getWorldHorizonPosition(state.viewAzimuth, visibleHorizonAltitude);

  renderWorldObjects();
  renderScopeObjects(sextantAngle);
  renderWorldBackground(worldHorizonPosition);
  renderHorizon(elements.worldHorizon, worldHorizonPosition);
  renderScopeOverlay();
  renderScopeBackground(scopeHorizonPosition);
  renderHorizon(elements.directHorizon, scopeHorizonPosition);
  renderHorizon(elements.mirrorHorizon, scopeHorizonPosition);
  renderBelowHorizon(elements.directBelowHorizon, scopeHorizonPosition);
  renderBelowHorizon(elements.mirrorBelowHorizon, scopeHorizonPosition);

  elements.micrometerReadout.textContent = formatSignedMinutes(state.micrometerMinutes);
  elements.viewReadout.textContent = `Az ${String(Math.round(state.viewAzimuth)).padStart(3, "0")} deg / Alt ${formatViewAltitude(state.viewAltitude)}`;
  elements.targetLabel.textContent = "Hs";
  elements.sextantReading.textContent = formatAngle(sextantAngle);

}

function renderMeasurements() {
  elements.measurementList.innerHTML = "";

  state.measurements.forEach((measurement) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${measurement.object} / Hs ${measurement.raw}</strong>
      <span>${measurement.time} UTC / IE ${measurement.indexError}</span>
      <span>Almanach ${measurement.target} / Ort ${measurement.location}</span>
    `;
    elements.measurementList.append(item);
  });
}

function saveMeasurement() {
  const sextantAngle = getSextantAngle();
  const dipCorrection = getDipCorrectionDegrees();
  const indexError = `${state.indexErrorMinutes >= 0 ? "+" : ""}${state.indexErrorMinutes.toFixed(1)}'`;
  const date = getAlmanacDate();

  state.measurements.unshift({
    object: state.targetName,
    time: date.toISOString().replace("T", " ").slice(0, 19),
    raw: formatAngle(sextantAngle),
    indexError,
    location: `${formatCoordinate(elements.latitudeDeg.value, elements.latitudeMin.value, elements.latitudeHemisphere.value)} / ${formatCoordinate(elements.longitudeDeg.value, elements.longitudeMin.value, elements.longitudeHemisphere.value)} / Auge ${state.observerHeightMeters.toFixed(1)} m / Dip -${formatAngle(dipCorrection)}`,
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
  state.observerHeightMeters = Number(elements.observerHeight.value || 0);
  render();
}

function toggleAlmanac() {
  const isCollapsed = elements.almanac.classList.toggle("is-collapsed");
  elements.toggleAlmanac.textContent = isCollapsed ? "Ausklappen" : "Einklappen";
  elements.toggleAlmanac.setAttribute("aria-expanded", String(!isCollapsed));
}

function toggleSkyLabels() {
  state.showSkyLabels = !state.showSkyLabels;
  elements.toggleSkyLabels.textContent = state.showSkyLabels ? "Namen ausblenden" : "Namen anzeigen";
  elements.toggleSkyLabels.setAttribute("aria-pressed", String(state.showSkyLabels));
  render();
}

["input", "change"].forEach((eventName) => {
  elements.azimuth.addEventListener(eventName, updateFromInputs);
  elements.altitude.addEventListener(eventName, updateFromInputs);
  elements.indexAngle.addEventListener(eventName, updateFromInputs);
  elements.micrometerMinutes.addEventListener(eventName, updateFromInputs);
  elements.indexError.addEventListener(eventName, updateFromInputs);
  elements.observerHeight.addEventListener(eventName, updateFromInputs);
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

elements.toggleSkyLabels.addEventListener("click", toggleSkyLabels);
elements.toggleAlmanac.addEventListener("click", toggleAlmanac);
elements.saveMeasurement.addEventListener("click", saveMeasurement);
elements.clearLog.addEventListener("click", () => {
  state.measurements = [];
  renderMeasurements();
});

elements.utcTime.value = toDateTimeLocalValue(new Date());
refreshAlmanac();
renderMeasurements();

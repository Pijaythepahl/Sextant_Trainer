const state = {
  targetAzimuth: 126,
  targetAltitude: 38,
  viewAzimuth: 92,
  viewAltitude: 18,
  indexAngle: 12,
  indexErrorMinutes: 0,
  measurements: [],
};

const elements = {
  skyFrame: document.querySelector("#skyFrame"),
  scope: document.querySelector(".scope"),
  worldHorizon: document.querySelector("#worldHorizon"),
  worldSun: document.querySelector("#worldSun"),
  directBelowHorizon: document.querySelector("#directBelowHorizon"),
  mirrorBelowHorizon: document.querySelector("#mirrorBelowHorizon"),
  directHorizon: document.querySelector("#directHorizon"),
  mirrorHorizon: document.querySelector("#mirrorHorizon"),
  directSun: document.querySelector("#directSun"),
  mirrorSun: document.querySelector("#mirrorSun"),
  azimuth: document.querySelector("#azimuth"),
  altitude: document.querySelector("#altitude"),
  indexAngle: document.querySelector("#indexAngle"),
  indexError: document.querySelector("#indexError"),
  objectName: document.querySelector("#objectName"),
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

function shortestAngleDelta(from, to) {
  return ((to - from + 540) % 360) - 180;
}

function formatAngle(angle) {
  const sign = angle < 0 ? "-" : "";
  const absolute = Math.abs(angle);
  const degrees = Math.floor(absolute);
  const minutes = (absolute - degrees) * 60;
  return `${sign}${String(degrees).padStart(2, "0")} deg ${minutes.toFixed(1).padStart(4, "0")}'`;
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

function renderBelowHorizon(element, position) {
  element.style.top = `${position.y}%`;
  element.style.display = position.visible ? "" : "none";
}

function renderScopeBackground(position) {
  elements.scope.style.setProperty("--scope-horizon-y", `${position.y}%`);
}

function render() {
  const worldSunPosition = getPosition(state.targetAzimuth, state.targetAltitude, 0, 150, 90);
  const worldHorizonPosition = getPosition(state.viewAzimuth, 0, 0, 150, 90);
  const directPosition = getPosition(state.targetAzimuth, state.targetAltitude, state.viewAltitude, 32, 24);
  const reflectedAltitude = state.targetAltitude - state.indexAngle;
  const mirrorPosition = getPosition(state.targetAzimuth, reflectedAltitude, state.viewAltitude, 32, 24);
  const scopeHorizonPosition = getPosition(state.viewAzimuth, 0, state.viewAltitude, 32, 24);
  const correctedAngle = state.indexAngle + state.indexErrorMinutes / 60;

  renderObject(elements.worldSun, worldSunPosition);
  renderHorizon(elements.worldHorizon, worldHorizonPosition);
  renderSplitObject(elements.directSun, directPosition, "left");
  renderSplitObject(elements.mirrorSun, mirrorPosition, "right");
  renderScopeBackground(scopeHorizonPosition);
  renderHorizon(elements.directHorizon, scopeHorizonPosition);
  renderHorizon(elements.mirrorHorizon, scopeHorizonPosition);
  renderBelowHorizon(elements.directBelowHorizon, scopeHorizonPosition);
  renderBelowHorizon(elements.mirrorBelowHorizon, scopeHorizonPosition);

  elements.sextantReading.textContent = formatAngle(state.indexAngle);
  elements.correctedReading.textContent = formatAngle(correctedAngle);
  elements.viewReadout.textContent = `Az ${String(Math.round(state.viewAzimuth)).padStart(3, "0")} deg / Alt ${Math.round(state.viewAltitude)} deg`;
  elements.targetReadout.textContent = `Az ${state.targetAzimuth} deg / Alt ${state.targetAltitude} deg`;
}

function renderMeasurements() {
  elements.measurementList.innerHTML = "";

  state.measurements.forEach((measurement) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${measurement.object} / ${measurement.corrected}</strong>
      <span>${measurement.time} / Hs ${measurement.raw} / IE ${measurement.indexError}</span>
      <span>Blick ${measurement.view} / Ziel ${measurement.target}</span>
    `;
    elements.measurementList.append(item);
  });
}

function saveMeasurement() {
  const now = new Date();
  const corrected = state.indexAngle + state.indexErrorMinutes / 60;
  const indexError = `${state.indexErrorMinutes >= 0 ? "+" : ""}${state.indexErrorMinutes.toFixed(1)}'`;

  state.measurements.unshift({
    object: elements.objectName.value.trim() || "Objekt",
    time: now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    raw: formatAngle(state.indexAngle),
    corrected: formatAngle(corrected),
    indexError,
    view: `Az ${Math.round(state.viewAzimuth)} deg / Alt ${Math.round(state.viewAltitude)} deg`,
    target: `Az ${state.targetAzimuth} deg / Alt ${state.targetAltitude} deg`,
  });

  renderMeasurements();
}

function updateFromInputs() {
  state.viewAzimuth = Number(elements.azimuth.value);
  state.viewAltitude = Number(elements.altitude.value);
  state.indexAngle = Number(elements.indexAngle.value);
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

["input", "change"].forEach((eventName) => {
  elements.azimuth.addEventListener(eventName, updateFromInputs);
  elements.altitude.addEventListener(eventName, updateFromInputs);
  elements.indexAngle.addEventListener(eventName, updateFromInputs);
  elements.indexError.addEventListener(eventName, updateFromInputs);
});

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

updateFromInputs();
renderMeasurements();

function createStars() {
  const container = document.querySelector('body');

  for (let i = 0; i < 1000; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = '.1px';
    star.style.height = '.1px';

    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';

    container.appendChild(star);
  }
}

createStars();

const moonOrbit = document.querySelector('.moon');
const moonLabel = moonOrbit?.querySelector('.planet-hover-name');
const speedToggleButton = document.querySelector('.speed-toggle');

const ORBIT_DEFAULT_DURATIONS = {
  mercury: 68.7,
  venus: 48.7,
  earth: 36.5,
  moon: 2.7,
  mars: 26.5,
  jupiter: 31,
  saturn: 52,
  uranus: 90,
  neptune: 177,
  pluton: 266,
};

const ORBITAL_PERIOD_DAYS = {
  mercury: 88,
  venus: 224.7,
  earth: 365.25,
  moon: 27.3,
  mars: 687,
  jupiter: 4332.6,
  saturn: 10759.2,
  uranus: 30688.5,
  neptune: 60182,
  pluton: 90560,
};

let isRealSpeedEnabled = false;

function formatDuration(seconds) {
  return `${seconds.toFixed(2)}s`;
}

function setOrbitDuration(planetName, durationSeconds) {
  const orbitElement = document.querySelector(`.${planetName}`);
  if (!orbitElement) {
    return;
  }
  orbitElement.style.animationDuration = formatDuration(durationSeconds);
  if (planetName !== 'moon') {
    orbitElement.style.setProperty('--planet-label-dur', formatDuration(durationSeconds));
  }
}

function applyDefaultSpeeds() {
  Object.entries(ORBIT_DEFAULT_DURATIONS).forEach(([planetName, durationSeconds]) => {
    setOrbitDuration(planetName, durationSeconds);
  });
}

function applyRealSpeeds() {
  const jupiterPeriodDays = ORBITAL_PERIOD_DAYS.jupiter;
  const jupiterReferenceSeconds = ORBIT_DEFAULT_DURATIONS.jupiter;
  const realSpeedScale = jupiterPeriodDays / jupiterReferenceSeconds;

  Object.entries(ORBITAL_PERIOD_DAYS).forEach(([planetName, periodDays]) => {
    const scaledSeconds = periodDays / realSpeedScale;
    setOrbitDuration(planetName, scaledSeconds);
  });
}

function updateSpeedToggleUI() {
  if (!speedToggleButton) {
    return;
  }
  speedToggleButton.classList.toggle('is-real-speed', isRealSpeedEnabled);
  speedToggleButton.setAttribute('aria-pressed', String(isRealSpeedEnabled));
  speedToggleButton.textContent = isRealSpeedEnabled
    ? 'Revenir à la vitesse actuelle'
    : 'Activer la vitesse réelle';
}

function toggleOrbitSpeedMode() {
  isRealSpeedEnabled = !isRealSpeedEnabled;
  if (isRealSpeedEnabled) {
    applyRealSpeeds();
  } else {
    applyDefaultSpeeds();
  }
  updateSpeedToggleUI();
}

if (speedToggleButton) {
  speedToggleButton.addEventListener('click', toggleOrbitSpeedMode);
}

function accumulatedRotationDeg(el) {
  let combined = new DOMMatrix();
  let cur = el;
  while (cur && cur !== document.documentElement) {
    const tf = getComputedStyle(cur).transform;
    if (tf && tf !== 'none') {
      combined = new DOMMatrix(tf).multiply(combined);
    }
    cur = cur.parentElement;
  }
  return (Math.atan2(combined.b, combined.a) * 180) / Math.PI;
}

function syncMoonLabelUpright() {
  if (moonOrbit && moonLabel) {
    const angle = accumulatedRotationDeg(moonOrbit);
    moonLabel.style.transform = `translate(-50%, calc(-100% - 0.4em)) rotate(${-angle}deg)`;
  }
  requestAnimationFrame(syncMoonLabelUpright);
}

syncMoonLabelUpright();

const info = document.querySelector('.info');
const INFO_PLACEHOLDER = '<p class="info__hint">Cliquez sur une planète</p>';

const planetInfos = {
  sun: '<h2>Soleil</h2><ul><li>Type: Étoile</li><li>Surnom: Le Roi Soleil</li><li>Masse: 1,989 &times; 10<sup>30</sup> kg</li><li>Diamètre: 1 392 700 km</li></ul>',
  mercury:
    "<h2>Mercure</h2><ul><li>Type: Planète rocheuse</li><li>Surnom: La Planète de Fer</li><li>Masse: 3,30 &times; 10<sup>23</sup> kg</li><li>Diamètre: 4 879 km</li><li>Distance par rapport au soleil: 58 millions km</li><li>Durée d'une année: 88 jours terrestres</li></ul>",
  venus:
    "<h2>Vénus</h2><ul><li>Type: Planète rocheuse</li><li>Surnom: L’Étoile du Berger</li><li>Masse: 4,87 &times; 10<sup>24</sup> kg</li><li>Diamètre: 12 104 km</li><li>Distance par rapport au soleil: 108 millions km</li><li>Durée d'une année: 225 jours terrestres</li></ul>",
  earth:
    "<h2>Terre</h2><ul><li>Type: Planète rocheuse</li><li>Surnom: La Planète Bleue</li><li>Masse: 5,97 &times; 10<sup>24</sup> kg</li><li>Diamètre: 12 756 km</li><li>Distance par rapport au soleil: 150 millions km</li><li>Durée d'une année: 365,25 jours</li></ul>",
  moon: "<h2>Lune</h2><ul><li>Type: Satellite naturel</li><li>Surnom: L’Astre de Nuit</li><li>Masse: 7,34 &times; 10<sup>22</sup> kg</li><li>Diamètre: 3 474 km</li><li>Distance par rapport au soleil: Env. 150 millions km</li><li>Durée d'une année: 27,3 jours (révolution autour de la Terre)</li></ul>",
  mars: "<h2>Mars</h2><ul><li>Type: Planète rocheuse</li><li>Surnom: La Planète Rouge</li><li>Masse: 6,42 &times; 10<sup>23</sup> kg</li><li>Diamètre: 6 792 km</li><li>Distance par rapport au soleil: 228 millions km</li><li>Durée d'une année: 687 jours terrestres (environ 1,9 an)</li></ul>",
  jupiter:
    "<h2>Jupiter</h2><ul><li>Type: Planète géante gazeuse</li><li>Surnom: La Reine des Planètes</li><li>Masse: 1,90 &times; 10<sup>27</sup> kg</li><li>Diamètre: 142 984 km</li><li>Distance par rapport au soleil: 778 millions km</li><li>Durée d'une année: 12 ans terrestres</li></ul>",
  saturn:
    "<h2>Saturne</h2><ul><li>Type: Planète géante gazeuse</li><li>Surnom: La Belle aux Anneaux</li><li>Masse: 5,68 &times; 10<sup>26</sup> kg</li><li>Diamètre: 120 536 km</li><li>Distance par rapport au soleil: 1,4 milliard km</li><li>Durée d'une année: 29,5 ans terrestres</li></ul>",
  uranus:
    "<h2>Uranus</h2><ul><li>Type: Planète géante de glace</li><li>Surnom: La Planète Inclinée</li><li>Masse: 8,68 &times; 10<sup>25</sup> kg</li><li>Diamètre: 51 118 km</li><li>Distance par rapport au soleil: 2,9 milliards km</li><li>Durée d'une année: 84 ans terrestres</li></ul>",
  neptune:
    "<h2>Neptune</h2><ul><li>Type: Planète géante de glace</li><li>Surnom: La Planète des Vents</li><li>Masse: 1,02 &times; 10<sup>26</sup> kg</li><li>Diamètre: 49 528 km</li><li>Distance par rapport au soleil: 4,5 milliards km</li><li>Durée d'une année: 165 ans terrestres</li></ul>",
  pluton:
    "<h2>Pluton</h2><ul><li>Type: Planète naine</li><li>Surnom: L’Exilée</li><li>Masse: 1,31 &times; 10<sup>22</sup> kg</li><li>Diamètre: 2 376 km</li><li>Distance par rapport au soleil: 5,9 milliards km</li><li>Durée d'une année: 248 ans terrestres</li></ul>",
};

const planets = document.querySelectorAll('.planets');
let activePlanet = null;

planets.forEach((planet) => {
  planet.addEventListener('click', (e) => {
    e.stopPropagation();

    const clickedPlanet = e.currentTarget.dataset.planet;
    const planetInfo = planetInfos[clickedPlanet];

    if (!planetInfo) {
      return;
    }

    const previouslyRinged = document.querySelector('.planets.is-selected');

    if (activePlanet === clickedPlanet) {
      activePlanet = null;
      info.innerHTML = INFO_PLACEHOLDER;
    } else {
      info.innerHTML = planetInfo;
      activePlanet = clickedPlanet;
    }

    if (previouslyRinged !== e.currentTarget) {
      document.querySelectorAll('.planets.is-selected').forEach((el) => {
        el.classList.remove('is-selected');
      });
      e.currentTarget.classList.add('is-selected');
    }
  });
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.info')) return;
  activePlanet = null;
  info.innerHTML = INFO_PLACEHOLDER;
  document.querySelectorAll('.planets.is-selected').forEach((el) => {
    el.classList.remove('is-selected');
  });
});

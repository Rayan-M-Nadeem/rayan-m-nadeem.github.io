(function () {
  'use strict';

  var search = document.getElementById('search');
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var browser = document.getElementById('explore');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-open]'));
  var domains = Array.prototype.slice.call(document.querySelectorAll('.domain'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.concept'));
  var active = 'mechanics';

  var explanations = {
    'Motion is always relative': 'Motion is never described without first choosing what counts as still. A passenger may be stationary relative to a train while moving rapidly relative to the ground, and neither description is more “real” until the reference frame is named. Velocity changes between steadily moving observers, while acceleration remains detectable because it changes the motion itself. Thinking in reference frames prevents contradictions and prepares the way for both orbital mechanics and relativity.',
    'A force changes motion, not motion itself': 'A force is an interaction that changes velocity; it is not something an object needs in order to keep moving. If all forces balance, an object stays at rest or continues in a straight line at constant speed. Acceleration appears only when the vector sum of the forces is not zero, and greater mass makes the same imbalance less effective. This distinction is why diagrams must show every interaction before an equation is chosen.',
    'Energy tracks the capacity for change': 'Energy is an accounting property of a system rather than a material stored inside an object. It can appear as motion, position, deformation, microscopic thermal motion, chemical structure, or energy in fields. Work, heating, and radiation move energy across a chosen system boundary, while internal processes transform it from one form to another. Conservation lets us compare the beginning and end of a process without reconstructing every moment in between.',
    'Momentum follows the motion of a system': 'Momentum combines how much matter is moving with its velocity and direction. During a collision, the objects may exert huge forces on one another, yet those internal forces change the parts in opposite ways, leaving total momentum fixed when outside impulses are negligible. Energy may change form through sound, heat, or deformation while momentum is still conserved. That makes momentum especially powerful for analyzing brief interactions that are difficult to observe frame by frame.',
    'Rotation has its own inertia and momentum': 'Rotational motion depends not only on total mass but also on how that mass is distributed around an axis. Material farther from the axis contributes more rotational inertia, so it takes more torque to produce the same angular acceleration. When outside torque is small, angular momentum remains constant and an object spins faster as its mass moves inward. Rolling objects combine translation and rotation, so their energy is divided between two kinds of motion.',
    'An orbit is a continuous fall': 'An orbiting object is falling under gravity at every moment, but it also moves sideways fast enough for the curved surface beneath it to fall away at the same rate. Gravity supplies the inward acceleration that continually turns the velocity without necessarily changing its magnitude. Different starting speeds create circular, elliptical, escaping, or crashing paths. The same basic idea connects a thrown ball, the Moon, satellites, planets, and binary stars.',
    'Pressure is force spread across area': 'Pressure describes how strongly force is distributed over a surface, which is why the same force can have very different effects when applied over different areas. In a fluid at rest, molecular collisions transmit pressure in every direction, and pressure increases with depth because lower layers support more fluid above them. A confined fluid can therefore transmit a pressure change throughout the system. The model works across liquids and gases, with density and compressibility setting important limits.',
    'Buoyancy comes from a pressure difference': 'A submerged object experiences greater fluid pressure on its lower surfaces than on its upper surfaces. Adding those pressure forces produces a net upward buoyant force equal to the weight of the displaced fluid. Floating occurs when the object settles at a depth where that upward force balances its weight; sinking occurs when it cannot displace enough fluid. Shape matters because it changes displaced volume, allowing a steel ship to float even though solid steel is denser than water.',
    'Flow trades pressure, speed, and height': 'Steady fluid flow must satisfy continuity: for an incompressible fluid, the amount entering a region each second must also leave it. A narrower passage therefore produces faster flow. Along an ideal streamline, pressure, kinetic energy per volume, and gravitational energy per volume trade with one another, which is the basis of Bernoulli’s principle. Real fluids also lose mechanical energy through viscosity and may become turbulent, so the ideal relationship is a starting model rather than a universal shortcut.',
    'Temperature is not heat': 'Temperature measures how energy is distributed among microscopic degrees of freedom, while heat is energy transferred because two systems differ in temperature. An object can contain substantial internal energy without currently gaining or losing heat. The amount of energy required for a temperature change depends on mass, material, and phase, and transfer can occur through conduction, convection, or radiation. Thermal equilibrium is reached when there is no net heat flow, not when microscopic motion stops.',
    'Entropy measures how many hidden arrangements fit': 'Entropy is best understood as a count of how many microscopic arrangements are compatible with the large-scale state we observe. High-entropy macrostates are overwhelmingly common because vastly more particle arrangements produce them. An isolated system therefore tends toward those states even though the microscopic laws do not simply forbid reverse motion. This statistical imbalance explains irreversible-looking processes, the limits of engines, and the thermodynamic arrow that distinguishes past from future.',
    'Phases are collective behaviors': 'A phase is a shared pattern of behavior produced by many interacting particles, not a label attached permanently to a substance. In a solid, particles remain organized around stable positions; in a liquid they rearrange while staying close; in a gas they move broadly and independently; in a plasma many charges move freely. During a phase transition, added or removed energy changes organization and bonding before it changes temperature. Pressure can shift the transition points by favoring one structure over another.',
    'A restoring influence creates oscillation': 'Oscillation begins when displacement from equilibrium creates an influence pointing back toward equilibrium. Inertia carries the system past the center, the restoring influence reverses the motion, and the exchange repeats between kinetic and potential energy. Simple harmonic motion is the important ideal case in which restoring force is proportional to displacement, producing a regular sinusoidal pattern. Real oscillators lose energy through damping or gain it from a repeating external drive.',
    'Speed belongs to the medium; frequency to the source': 'A wave is a traveling pattern of disturbance whose speed is usually set by the properties of the medium. The source establishes how many cycles are produced each second, so when the wave enters a region with a different speed, its frequency stays fixed while its wavelength changes. The medium’s particles generally oscillate near their original positions instead of traveling with the wave. This separation between pattern motion and material motion is essential to understanding sound, water waves, strings, and light.',
    'Waves add without permanently changing one another': 'When waves overlap, their displacements add point by point through superposition. Peaks that arrive together reinforce one another, while a peak and trough can partially or completely cancel. The interference pattern may look like a new object, yet ideal waves pass through and continue with their original forms afterward. Phase therefore matters as much as amplitude, and repeated sources can create stable regions of strong and weak response.',
    'Boundaries select standing patterns': 'A wave reflected from a boundary can overlap its incoming version and form a standing wave. Positions that always cancel become nodes, while positions with the largest oscillation become antinodes. Only wavelengths that fit the boundary conditions reinforce themselves consistently, so a finite system allows a discrete family of resonant frequencies. Those allowed patterns explain musical harmonics and also foreshadow why confined quantum systems possess discrete energy states.',
    'Relative motion changes the arrival rate': 'The Doppler effect occurs because motion changes the rate at which successive wavefronts reach an observer. Approach crowds arrival times together and raises the observed frequency; separation spreads them apart and lowers it. The effect depends on motion relative to the medium for sound, while light requires the relativistic version because it has no material medium. If a source outruns its own waves, the fronts accumulate into a shock wave rather than merely shifting pitch.',
    'Timing can matter more than force size': 'Every oscillating system has natural frequencies determined by its inertia and restoring influences. A small repeated drive can add substantial energy when each push arrives in step with the motion, producing resonance. Damping removes energy and limits the response, while poor timing can make even a larger drive ineffective. Engineers therefore care about the spectrum of driving frequencies, not just the maximum size of an applied force.',
    'Charge creates interaction and rearranges matter': 'Electric charge is a conserved property that determines how matter participates in electromagnetic interactions. Like charges repel, opposite charges attract, and the force weakens with distance. In conductors, mobile charges can redistribute across an object; in insulators, bound positive and negative charge can shift slightly and create polarization. Charging an object generally separates or transfers existing charge rather than producing charge from nothing.',
    'A field describes local possibilities': 'An electric field assigns a magnitude and direction to every point in space, describing the force a small positive test charge would experience there. The field exists because of the source arrangement even when no test object is present. Fields from multiple sources add vectorially, creating complex regions of reinforcement and cancellation. This viewpoint replaces mysterious action at a distance with a local structure that can store energy and evolve through time.',
    'Voltage is an energy difference per charge': 'Electric potential turns the vector electric field into an energy landscape. A voltage difference states how much electric potential energy changes for each unit of charge moved between two locations. Positive and negative charges move in opposite directions relative to potential because their potential energy depends on the sign of charge. Batteries maintain voltage by using chemical processes to separate charge, while circuit elements transform the transferred energy into light, motion, heat, or stored field energy.',
    'A circuit is a system, not a queue of electrons': 'When a circuit closes, the source establishes an electric field throughout the conducting path and charges already present begin to drift. The useful response is therefore not one electron racing from the battery to the device. Current measures charge flow rate, voltage measures energy transferred per charge, and resistance describes how material and geometry oppose the flow. Series and parallel connections change the constraints on current and voltage across the entire system.',
    'A capacitor stores separated charge and field energy': 'A capacitor consists of conductors arranged so opposite charge can be separated while remaining close together. The separation produces an electric field, and the energy is stored in that field rather than simply “inside” either plate. Capacitance measures how much charge separation is produced per volt and depends on geometry and the material between the conductors. Because charge cannot appear instantly, capacitors give circuits characteristic charging and discharging time scales.',
    'Magnetism redirects moving charge': 'Magnetic fields act on moving charges in a direction perpendicular to both the motion and the field. The force can curve a path without doing ordinary mechanical work, so it often changes direction rather than speed. Electric currents generate magnetic fields because a current is organized charge motion, and magnetic materials arise from microscopic charge motion and quantum spin. The directional nature of the interaction is why right-hand rules are useful rather than arbitrary classroom rituals.',
    'A changing magnetic environment creates an electric push': 'Electromagnetic induction occurs when magnetic flux through a conducting loop changes. The induced electric field can drive current even without a battery, and a faster flux change produces a larger electromotive force. Lenz’s law says the induced response opposes the change that created it, which is a direct consequence of energy conservation. Relative motion, changing field strength, or changing loop area can all produce the needed flux change.',
    'Reflection preserves angles': 'Reflection occurs when a wave encounters a boundary and returns into its original region. For light rays, the incoming and outgoing angles are equal when both are measured from the normal line perpendicular to the surface. Smooth surfaces preserve the organized relationship between neighboring rays and form images, while rough surfaces scatter rays in many directions even though each microscopic reflection follows the same law. Curved mirrors use changing surface normals to make rays converge or diverge.',
    'Light bends when its speed changes': 'Refraction is the change in direction that occurs when light crosses a boundary at an angle and its propagation speed changes. Frequency remains fixed because the oscillation must stay continuous across the boundary, so wavelength adjusts to the new speed. A wave entering a slower medium bends toward the normal; entering a faster one bends away. At sufficiently steep angles, a wave attempting to leave a higher-index material can reflect completely inside it.',
    'Lenses and curved mirrors organize rays': 'Lenses and curved mirrors redirect many rays so they converge toward a focus or spread as if they came from one. Image position, orientation, and magnification depend on both focal length and object distance. Real images form where rays physically meet and can be projected, while virtual images come from extensions of diverging rays and can only be viewed through the optical system. Real devices combine several elements to control distortions, color separation, focus, and field of view.',
    'Light spreads and interferes': 'The ray model fails when openings or obstacles become comparable to the wavelength of light. Wavefronts then spread through diffraction, and different routes overlap to create bright and dark interference regions. These effects demonstrate that light carries phase information and place a fundamental limit on the detail any optical instrument can resolve. Larger apertures collect more light and narrow the diffraction pattern, improving resolution without eliminating the wave limit.',
    'All light is electromagnetic': 'Radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays are the same kind of electromagnetic disturbance at different frequencies. In vacuum they travel at the same speed, while their wavelengths and photon energies differ. Matter responds selectively because molecular rotations, vibrations, electron transitions, and nuclear processes couple to different frequency ranges. Intensity tells us how much energy arrives, while frequency determines the energy exchanged by each photon.',
    'Space and time adjust to preserve light speed': 'Special relativity begins with two requirements: the laws of physics are the same for uniformly moving observers, and every such observer measures the same vacuum speed of light. Space and time must then mix so observers can disagree about duration, distance, and simultaneity while agreeing on the spacetime interval. Time dilation and length contraction are not optical illusions; they are consistent differences in how observers divide the same events. At ordinary speeds, the corrections are so small that Newtonian mechanics remains an excellent approximation.',
    'Gravity can be geometry': 'General relativity replaces gravitational force with the curvature of spacetime produced by mass, energy, pressure, and momentum. Freely falling objects follow the straightest available paths through that curved geometry, while standing on the ground feels force because the surface prevents free fall. Gravity also changes clock rates and bends light, effects confirmed far beyond the original planetary tests. Strong curvature produces black holes, while changing mass distributions can send gravitational waves across the universe.',
    'Quantum theory predicts possibilities precisely': 'A quantum state describes probability amplitudes for possible measurement outcomes rather than a hidden classical trajectory waiting to be revealed. Amplitudes can reinforce or cancel before probabilities are calculated, producing interference even when particles arrive one at a time. Measurement returns a definite allowed outcome, but repeated experiments recover the predicted distribution with extraordinary accuracy. The theory is probabilistic in its outcomes yet extremely precise in the rules governing those probabilities.',
    'Uncertainty is built into the state': 'Quantum uncertainty is not simply the disturbance caused by clumsy measurement. A state tightly localized in position requires a broad combination of wavelengths and therefore a broad range of momenta; a sharply defined momentum requires a spatially extended wave. The same mathematical structure creates tradeoffs for other pairs of incompatible observables. Individual outcomes remain unpredictable within those limits, but the spread and correlations of many measurements are rigorously determined.',
    'Binding changes the mass of a system': 'When particles bind into a stable nucleus, the completed system has less mass than the separated ingredients because energy was released during formation. That missing mass is the binding energy expressed through mass–energy equivalence. Fission releases energy by splitting very heavy nuclei into more tightly bound fragments, while fusion combines light nuclei toward more tightly bound configurations. Conservation applies to the total mass-energy, not to mass and energy as unrelated ledgers.',
    'Particles are excitations of fields': 'Quantum field theory treats fundamental fields as present throughout space and particles as quantized excitations of those fields. An electron is therefore not best pictured as a tiny classical bead; it is a stable excitation of the electron field with specific mass, charge, and spin. Interactions create, destroy, and exchange excitations while conserving the quantities required by symmetries. The Standard Model successfully describes electromagnetic, weak, and strong interactions, but it does not yet provide a quantum theory of gravity or identify dark matter.',
    'A star is a long balance between collapse and pressure': 'A star persists because inward gravitational compression is balanced layer by layer by outward pressure. Fusion in the core changes composition and supplies energy that eventually escapes as radiation and moving particles. As fuel and structure change, the balance readjusts, driving the star through new stages. Final outcomes depend strongly on mass: white dwarfs, neutron stars, black holes, and supernova explosions all emerge from different failures or reorganizations of that support.',
    'Cosmic expansion stretches distances between unbound systems': 'The expanding-universe model says that large-scale distances between gravitationally unbound regions grow with time. It is not an explosion from one location into preexisting emptiness; every sufficiently distant observer sees the same general expansion pattern. Light traveling through expanding space is redshifted, and that record allows astronomers to reconstruct the history of the expansion. Galaxies, solar systems, and atoms remain bound because local forces overwhelm this extremely weak large-scale stretching.',
    'Deterministic does not always mean predictable': 'A deterministic system can still become practically unpredictable when tiny differences in initial conditions grow exponentially. Nonlinear feedback makes nearby trajectories separate until measurement uncertainty overwhelms the detailed forecast. This is chaos: not rulelessness or true randomness, but extreme sensitivity inside a rule-governed system. Short-term prediction and long-term statistical patterns can both remain useful even when an exact distant future cannot be calculated.',
    'Collective quantum behavior can become visible': 'Quantum effects usually lose visible coherence as systems interact with their surroundings, but some materials organize enormous numbers of particles into a shared quantum state. In a superconductor, paired electrons move coherently without ordinary electrical resistance below a critical condition. The material also expels magnetic field through the Meissner effect, showing that superconductivity is more than perfect conductivity. Temperature, magnetic field, and current can disrupt the collective state and return the material to ordinary behavior.'
  };

  var applications = {
    'Motion is always relative': 'navigation systems, radar speed, sports tracking, aircraft guidance, and spacecraft rendezvous.',
    'A force changes motion, not motion itself': 'vehicle safety, structural design, robotics, biomechanics, and launch calculations.',
    'Energy tracks the capacity for change': 'power grids, engines, batteries, building efficiency, metabolism, and renewable energy.',
    'Momentum follows the motion of a system': 'airbags, recoil control, collision reconstruction, rockets, and particle detectors.',
    'Rotation has its own inertia and momentum': 'flywheels, turbines, bicycles, satellites, gyroscopes, and figure skating.',
    'An orbit is a continuous fall': 'GPS satellites, weather observation, communications, planetary missions, and asteroid tracking.',
    'Pressure is force spread across area': 'hydraulic brakes, syringes, diving, weather instruments, and medical blood-pressure measurement.',
    'Buoyancy comes from a pressure difference': 'ships, submarines, hot-air balloons, life jackets, and density measurement.',
    'Flow trades pressure, speed, and height': 'aircraft wings, plumbing, blood flow, ventilation, turbines, and fuel injection.',
    'Temperature is not heat': 'climate control, cooking, electronics cooling, medicine, insulation, and industrial processing.',
    'Entropy measures how many hidden arrangements fit': 'engines, refrigeration, information theory, chemistry, materials, and cosmology.',
    'Phases are collective behaviors': 'refrigeration, metallurgy, semiconductor fabrication, weather prediction, and plasma technology.',
    'A restoring influence creates oscillation': 'clocks, suspension systems, seismology, sensors, musical instruments, and molecular spectroscopy.',
    'Speed belongs to the medium; frequency to the source': 'ultrasound, telecommunications, acoustics, sonar, and earthquake analysis.',
    'Waves add without permanently changing one another': 'noise-canceling headphones, antennas, imaging, interferometers, and concert-hall acoustics.',
    'Boundaries select standing patterns': 'instrument design, microwave ovens, lasers, antennas, bridges, and quantum wells.',
    'Relative motion changes the arrival rate': 'medical ultrasound, weather radar, police radar, astronomy, and flow measurement.',
    'Timing can matter more than force size': 'radio tuning, MRI, vibration control, clocks, filters, and structural safety.',
    'Charge creates interaction and rearranges matter': 'photocopiers, electrostatic painting, air filtration, touchscreens, and lightning protection.',
    'A field describes local possibilities': 'sensor design, particle accelerators, high-voltage equipment, and electronic components.',
    'Voltage is an energy difference per charge': 'batteries, power supplies, neural signals, electrical safety, and circuit design.',
    'A circuit is a system, not a queue of electrons': 'consumer electronics, vehicles, computers, home wiring, and medical devices.',
    'A capacitor stores separated charge and field energy': 'camera flashes, power smoothing, touchscreens, defibrillators, and signal timing.',
    'Magnetism redirects moving charge': 'motors, speakers, MRI scanners, mass spectrometers, and particle accelerators.',
    'A changing magnetic environment creates an electric push': 'generators, transformers, wireless charging, induction cooktops, and guitar pickups.',
    'Reflection preserves angles': 'mirrors, telescopes, periscopes, lidar, solar concentrators, and optical instruments.',
    'Light bends when its speed changes': 'fiber-optic communication, eyeglasses, prisms, cameras, and medical endoscopes.',
    'Lenses and curved mirrors organize rays': 'cameras, microscopes, telescopes, corrective lenses, projectors, and the human eye.',
    'Light spreads and interferes': 'spectrometers, precision measurement, microscopy, astronomy, holography, and chip fabrication.',
    'All light is electromagnetic': 'radio, Wi-Fi, thermal imaging, remote controls, sterilization, X-ray imaging, and radiotherapy.',
    'Space and time adjust to preserve light speed': 'GPS timing, particle accelerators, precision clocks, and high-energy astrophysics.',
    'Gravity can be geometry': 'GPS corrections, gravitational-wave astronomy, black-hole imaging, and cosmological modeling.',
    'Quantum theory predicts possibilities precisely': 'lasers, transistors, chemistry, quantum computers, sensors, and medical imaging.',
    'Uncertainty is built into the state': 'electron microscopy, nanotechnology, spectroscopy, quantum cryptography, and atomic clocks.',
    'Binding changes the mass of a system': 'nuclear power, fusion research, radiometric dating, medicine, and stellar modeling.',
    'Particles are excitations of fields': 'collider experiments, particle detectors, semiconductor theory, and searches for new physics.',
    'A star is a long balance between collapse and pressure': 'stellar dating, element formation, exoplanet studies, supernova prediction, and navigation by stars.',
    'Cosmic expansion stretches distances between unbound systems': 'distance measurement, galaxy surveys, cosmic-history reconstruction, and dark-energy research.',
    'Deterministic does not always mean predictable': 'weather forecasting, orbital stability, ecology, economics, and secure communications.',
    'Collective quantum behavior can become visible': 'MRI magnets, fusion reactors, maglev systems, quantum sensors, and next-generation power technology.'
  };

  function normalize(value) {
    return value.toLowerCase().trim();
  }

  cards.forEach(function (card) {
    var title = card.querySelector('h4').textContent.trim();
    if (explanations[title]) card.querySelector(':scope > p').textContent = explanations[title];
    if (applications[title]) {
      var use = document.createElement('p');
      use.className = 'applications';
      use.innerHTML = '<strong>Used in</strong>' + applications[title];
      card.querySelector('details').before(use);
    }
  });

  function filter() {
    var query = normalize(search.value);
    var shown = 0;
    browser.classList.toggle('searching', Boolean(query));

    domains.forEach(function (domain) {
      var name = domain.getAttribute('data-domain');
      var inDomain = query ? true : active === name;
      var visible = 0;

      domain.querySelectorAll('.concept').forEach(function (card) {
        var text = normalize(card.textContent + ' ' + (card.getAttribute('data-search') || ''));
        var match = inDomain && (!query || text.indexOf(query) !== -1);
        card.hidden = !match;
        if (match) { shown += 1; visible += 1; }
      });
      domain.hidden = visible === 0;
    });

    count.textContent = shown;
    empty.hidden = shown !== 0;
  }

  function select(name, scroll) {
    active = name;
    search.value = '';
    tabs.forEach(function (tab) {
      var selected = tab.getAttribute('data-filter') === name;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
    filter();
    if (scroll) browser.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { select(tab.getAttribute('data-filter'), true); });
  });

  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      select(link.getAttribute('data-open'), true);
    });
  });

  search.addEventListener('input', filter);
  filter();

  var topButton = document.getElementById('top');
  window.addEventListener('scroll', function () {
    topButton.classList.toggle('show', window.scrollY > 700);
  }, { passive: true });
  topButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());

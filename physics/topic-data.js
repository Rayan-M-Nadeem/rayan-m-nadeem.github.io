(function () {
  'use strict';

  function topic(slug, domain, tag, formula, formulaNote, why, model, limits, practice, misconceptions) {
    return {
      slug: slug,
      domain: domain,
      tag: tag,
      formula: formula,
      formulaNote: formulaNote,
      why: why,
      model: model,
      limits: limits,
      practice: practice,
      misconceptions: misconceptions
    };
  }

  window.PHYSICS_CHAPTERS = {
    mechanics: { number: '01', label: 'Mechanics', title: 'Motion, forces, and conservation', color: '#7ea9ff' },
    matter: { number: '02', label: 'Matter & heat', title: 'Fluids, temperature, and disorder', color: '#72d6c8' },
    waves: { number: '03', label: 'Waves', title: 'Oscillations, sound, and patterns', color: '#ad8dff' },
    fields: { number: '04', label: 'Fields', title: 'Electricity and magnetism', color: '#f7c96f' },
    light: { number: '05', label: 'Light', title: 'Optics and electromagnetic radiation', color: '#ff86cf' },
    modern: { number: '06', label: 'Modern', title: 'Relativity, quantum physics, and the cosmos', color: '#79dfff' }
  };

  window.PHYSICS_TOPICS = {
    'Motion is always relative': topic(
      'motion-is-relative', 'mechanics', 'Change', 'a = Δv / Δt',
      'Acceleration is the change in velocity per interval of time. Because velocity includes direction, turning counts as acceleration even when speed stays fixed.',
      'A statement such as “the ball moves at five meters per second” is incomplete until a reference frame and direction are named. A passenger can be still relative to a train and moving relative to the ground at the same moment. Physics handles this by describing position with coordinates, displacement as a change between positions, and velocity as the rate and direction of that change. No ordinary frame moving at constant velocity is uniquely privileged.',
      'The most useful picture is a motion graph. The slope of a position–time graph is velocity, while the slope of a velocity–time graph is acceleration. The area under a velocity–time graph gives displacement. These connections let the same motion be read as a story, a diagram, or a relationship without treating the equation as the idea itself.',
      'Classical velocity addition works when speeds are small compared with light. At extreme speeds, space and time cannot be treated as universal, and special relativity replaces simple addition. Even classically, a rotating or accelerating reference frame can create apparent forces, so the frame must be identified before interpreting the motion.',
      'Navigation software continuously compares motion with Earth, roads, satellites, and the vehicle itself. Radar measures relative approach speed, sports tracking reconstructs trajectories from changing positions, and spacecraft rendezvous depends on matching both position and velocity in an orbital frame.',
      ['Negative velocity means motion in the chosen negative direction; it does not automatically mean slowing down.', 'Zero velocity at one instant does not require zero acceleration—a thrown object has zero vertical velocity at its highest point while gravity still accelerates it.']
    ),
    'A force changes motion, not motion itself': topic(
      'force-changes-motion', 'mechanics', 'Interaction', 'ΣF = ma',
      'The vector sum of all external forces determines acceleration. Mass measures how strongly an object resists that change in velocity.',
      'Newton’s first law removes a deeply persistent intuition: motion does not naturally run out. An object needs no net force to continue at constant velocity; a net force is required only to change that velocity. Everyday objects slow because friction and drag are forces, not because rest is the natural destination of matter. Forces always describe interactions between objects, which is why every force on a diagram should have an identifiable source.',
      'Start by choosing the object or system, then draw only the forces acting on it. Add those forces as vectors. If they cancel, acceleration is zero even when the object is moving quickly. Newton’s third law pairs act on different objects, so they do not cancel on a one-object diagram. This system-first method prevents most force problems from becoming an exercise in guessing formulas.',
      'The simple form assumes an inertial reference frame and treats mass as constant. At speeds near light, momentum is no longer simply mass times velocity. Real contact forces can also depend on deformation, speed, temperature, or surface structure, so ideal friction and spring models are approximations rather than universal laws.',
      'Vehicle crumple zones manage forces during rapid changes of motion, structural engineers track loads through buildings, and robots use force sensors to control grip. The same reasoning appears in biomechanics, prosthetics, aircraft control, and launch calculations.',
      ['A moving object does not have a force “in the direction of motion” merely because it is moving.', 'The equal-and-opposite forces in Newton’s third law act on different objects; they do not erase each other on a single object.']
    ),
    'Energy tracks the capacity for change': topic(
      'energy-tracks-change', 'mechanics', 'Conservation', 'Wnet = ΔK',
      'Net work changes kinetic energy. More broadly, energy moves across a system boundary through work, heating, or radiation and changes form inside the system.',
      'Energy is an accounting property, not a substance sloshing invisibly inside objects. A chosen system can store energy in motion, height, elastic deformation, chemical structure, microscopic motion, mass, or fields. Conservation means every decrease must appear as an increase somewhere else once the system boundary is drawn broadly enough. The power of the idea is that it compares states without requiring a frame-by-frame reconstruction of the path between them.',
      'Choose the system before naming energy forms. Gravitational potential energy belongs to the interacting Earth–object system, while spring energy belongs to the deformed spring system. Work is energy transferred by a force acting through displacement; power tells how rapidly transfer occurs. A bar chart or energy-flow diagram is often clearer than beginning with an equation.',
      'Mechanical energy alone is not always conserved. Friction can transform organized motion into internal thermal energy, and an external motor can add energy to the system. Potential energy is available only for conservative interactions, and its zero level is a convenient reference rather than an observable absolute amount.',
      'Energy accounting guides engines, batteries, electrical grids, insulation, renewable power, and metabolism. Engineers compare useful output with input to measure efficiency, then locate where energy becomes less available through heating, sound, deformation, or other transfers.',
      ['“Lost” mechanical energy has normally changed form or crossed the chosen boundary; total energy has not disappeared.', 'A force can act without doing work if there is no displacement in its direction, as with an ideal centripetal force in circular motion.']
    ),
    'Momentum follows the motion of a system': topic(
      'momentum-of-a-system', 'mechanics', 'Conservation', 'J = Δp',
      'Impulse is force accumulated over time and equals the resulting change in momentum. Momentum includes direction, so it must be added as a vector.',
      'Momentum combines an object’s inertia with its velocity. During a collision, forces between the parts of a system can be enormous, yet they occur in equal-and-opposite pairs over the same time. Their impulses cancel in the total, so an isolated system keeps the same momentum even while individual objects change speed, direction, shape, and temperature. This makes momentum ideal for brief events whose internal details are difficult to follow.',
      'Define the collection of objects first and ask whether the net external impulse during the event is negligible. If it is, total momentum before equals total momentum after. The center of mass then moves as if all system mass were concentrated there and only external forces acted. Collision type determines what else is conserved: elastic collisions preserve kinetic energy, while inelastic ones transform some of it.',
      'Momentum conservation is exact only for a genuinely closed system, although short collision times often make external impulses small enough to ignore. At relativistic speeds the definition of momentum changes, and rockets require an open-system treatment because expelled mass carries momentum away.',
      'Airbags lengthen stopping time to reduce force for the same momentum change. Momentum also explains recoil, rocket propulsion, collision reconstruction, sports follow-through, and how particle detectors infer invisible products from the tracks that remain.',
      ['Kinetic energy is not conserved in every collision even when momentum is.', 'Momentum is not just “mass times speed”; direction is essential, so opposite momenta can cancel.']
    ),
    'Rotation has its own inertia and momentum': topic(
      'rotation-inertia-momentum', 'mechanics', 'Rotation', 'τ = Iα',
      'Torque produces angular acceleration. Rotational inertia depends on both total mass and how far that mass lies from the axis.',
      'Rotation mirrors linear motion but adds a crucial geometric feature: distance from the axis matters. The same force creates more turning effect when applied farther from the pivot and more nearly perpendicular to the lever arm. A ring is harder to spin up than a compact disk of the same mass and radius because more of its mass sits far from the axis. This distribution is summarized by rotational inertia.',
      'Torque plays the role of force, angular acceleration parallels linear acceleration, and angular momentum parallels momentum. When external torque is negligible, angular momentum stays fixed; moving mass inward therefore increases rotation rate. Rolling joins both worlds because the center of mass translates while the object rotates around it, dividing kinetic energy between the two motions.',
      'The rigid-body model assumes distances inside the object stay fixed. Real objects flex, dissipate energy, slip, and can rotate around changing axes. Angular momentum conservation still applies to an isolated system, but calculating the distribution may require more than one simple rotational inertia.',
      'Flywheels store energy, gyroscopes stabilize spacecraft and phones, turbines extract power, and wheel design changes vehicle response. Athletes alter rotational inertia during dives and spins, while engineers manage torque in tools, joints, motors, and bridges.',
      ['A larger torque does not always mean a larger force; changing the lever arm or angle can change torque.', 'Centripetal acceleration points inward during rotation, but it does not imply an additional inward “centripetal force” beyond the real forces already present.']
    ),
    'An orbit is a continuous fall': topic(
      'orbit-is-continuous-fall', 'mechanics', 'Gravity', 'F ∝ 1 / r²',
      'Gravitational strength falls with the square of center-to-center distance. Doubling the distance makes the interaction one-fourth as strong.',
      'A satellite is never beyond gravity. It falls inward continuously while its sideways velocity carries it far enough that the curved surface below drops away. Gravity changes the direction of velocity and creates the curved path. Increase the starting sideways speed and the path can change from a crash to an ellipse, a circle, a larger ellipse, or escape. A thrown ball and a moon therefore belong to the same family of motion.',
      'For a circular orbit, gravity supplies the required inward acceleration. Elliptical orbits exchange kinetic and gravitational potential energy: an object moves faster near the body it orbits and slower farther away. Kepler’s laws summarize these patterns, while Newtonian gravity explains why they emerge and extends them to satellites, binary stars, and multi-body systems.',
      'The two-body idealization ignores drag, nonspherical gravity, radiation pressure, and pulls from other bodies. Close to very dense objects or when extreme precision is needed, general relativity replaces Newtonian gravity. Stable orbit also does not mean a circular path; ellipses are the ordinary case.',
      'Orbital reasoning sets GPS paths, weather-satellite coverage, communication networks, planetary missions, and asteroid forecasts. Mission planners deliberately use gravity assists and carefully timed burns to reshape an orbit rather than simply pointing a spacecraft at its destination.',
      ['Astronauts feel weightless because they are freely falling with their spacecraft, not because gravity is absent.', 'A force toward the center can turn velocity without increasing speed, so an orbit does not require continuous engine thrust.']
    ),

    'Pressure is force spread across area': topic(
      'pressure-force-over-area', 'matter', 'Fluids', 'P = F / A',
      'Pressure is force per area. In a fluid at rest it acts in every direction, and at greater depth it rises because more fluid must be supported above.',
      'Fluids exert forces through countless microscopic collisions. Averaged over an area, those impacts become pressure. A narrow point creates high pressure from an ordinary force, while a broad surface spreads the same force. In a stationary fluid, pressure at a point has no preferred direction; otherwise the fluid would begin to move. The change with depth follows from balancing the weight of each layer.',
      'Distinguish absolute pressure from gauge pressure, which measures above the surrounding atmosphere. In a confined nearly incompressible fluid, an added pressure is transmitted through the fluid. A hydraulic machine uses the same pressure on different piston areas, trading distance moved for force rather than multiplying energy for free.',
      'Hydrostatic relationships assume the fluid is at rest and has roughly constant density. Gases can compress substantially, rapidly moving fluids need a flow model, and pressure in biological systems may vary with elasticity and pumping rather than depth alone.',
      'Hydraulic brakes, lifts, syringes, diving equipment, weather instruments, and blood-pressure cuffs all rely on controlled pressure. Snowshoes and wide tires reduce pressure by increasing contact area, while needles and cutting edges concentrate it.',
      ['Pressure is not the same as total force; a small high-pressure region can exert less total force than a large low-pressure region.', 'Atmospheric pressure acts in all directions, not only downward.']
    ),
    'Buoyancy comes from a pressure difference': topic(
      'buoyancy-pressure-difference', 'matter', 'Fluids', 'Fb = ρVg',
      'The buoyant force equals the weight of displaced fluid. It grows with displaced volume, fluid density, and gravitational field strength.',
      'Pressure increases with depth, so the lower surface of a submerged object is generally pushed more strongly than the upper surface. Adding all surface forces leaves a net upward force. Archimedes’ principle packages that result: the upward buoyant force equals the weight of the fluid the object displaces, regardless of the object’s own material.',
      'Floating begins when an object sinks far enough to displace its own weight of fluid. Average density matters more than the density of each ingredient, which is why a hollow steel ship can float. Stability is separate: the relative positions of the center of mass and center of buoyancy determine whether a small tilt is corrected or amplified.',
      'The simplest rule assumes a fluid with known density and a static or slowly moving object. Hydrofoils, airplane wings, and fast swimmers also experience dynamic lift that is not ordinary buoyancy. In compressible gases, displaced density can change significantly with height and temperature.',
      'Ship design, submarines, life jackets, hydrometers, hot-air balloons, and weather balloons all control displaced fluid or average density. Medical and industrial density measurements can also infer composition from how strongly a sample floats or sinks.',
      ['An object floats because it displaces enough fluid, not simply because it contains air.', 'A fully submerged object does not gain more buoyant force merely by going deeper if the fluid density and object volume stay constant.']
    ),
    'Flow trades pressure, speed, and height': topic(
      'flow-pressure-speed-height', 'matter', 'Flow', 'A₁v₁ = A₂v₂',
      'For steady incompressible flow, the same volume must pass every cross-section each second. A narrower section therefore requires greater speed.',
      'Continuity is conservation of mass applied to a moving fluid. If density is nearly fixed and flow does not accumulate inside a pipe, volume flow rate remains constant. Bernoulli’s relationship adds energy conservation along a streamline: pressure energy, kinetic energy, and gravitational energy can trade as the fluid changes speed or height.',
      'Use continuity first to track how speed changes, then apply the energy picture only when the assumptions fit. Viscosity converts organized flow energy into internal energy, and turbulence mixes many irregular motions. The Reynolds number compares inertial and viscous effects and helps predict when smooth laminar flow becomes unstable.',
      'A narrow pipe does not universally mean lower pressure. Pumps, viscosity, height changes, branching, and transient flow can overturn that shortcut. Bernoulli’s equation is most reliable for steady, incompressible, nonviscous flow along a streamline; it is not a one-line explanation for every form of lift.',
      'The ideas guide plumbing, ventilation, blood-flow estimates, fuel injection, turbines, spray devices, and aircraft instruments. Engineers add pressure losses and turbulence models when designing real pipes, vessels, valves, and aerodynamic surfaces.',
      ['Faster flow and lower pressure are linked only under the relevant energy assumptions, not as a universal cause-and-effect rule.', 'Continuity conserves mass; the area–speed shortcut assumes density does not change.']
    ),
    'Temperature is not heat': topic(
      'temperature-is-not-heat', 'matter', 'Thermal', 'Q = mcΔT',
      'The energy transferred for a temperature change depends on mass, specific heat capacity, and temperature difference. Phase changes require a different relationship.',
      'Temperature describes the distribution of microscopic energy among a system’s available motions and interactions. Heat is not an amount sitting inside an object; it is energy crossing a boundary because of a temperature difference. Internal energy is what remains stored microscopically. A bathtub of warm water can contain more internal energy than a cup of hot water even though the cup has the higher temperature.',
      'Thermal contact drives net energy transfer until equilibrium, when both systems share a common temperature and no net heat flows. Conduction transfers energy through microscopic interactions, convection moves energy with a flowing fluid, and radiation carries it through electromagnetic waves. Specific heat describes how strongly a material’s temperature responds to added energy.',
      'Temperature is not always a simple average kinetic energy, especially in solids, molecules with many modes, or quantum systems. The constant-specific-heat equation is an approximation over a temperature range and excludes phase changes, chemical reactions, and substantial work done by expansion.',
      'Climate control, cooking, sterilization, electronics cooling, insulation, medicine, and industrial processing all depend on separating temperature from energy-transfer rate. Material choice often matters as much as the temperature difference because conductivity and heat capacity control the response.',
      ['Cold does not flow into a warm object; net energy flows from the warmer system to the cooler one.', 'Equal temperatures do not imply equal internal energies, because mass, material, and phase also matter.']
    ),
    'Entropy measures how many hidden arrangements fit': topic(
      'entropy-hidden-arrangements', 'matter', 'Thermodynamics', 'ΔStotal ≥ 0',
      'The total entropy of an isolated system does not decrease. Local entropy can fall only while an equal or larger increase occurs elsewhere.',
      'A visible macrostate—such as a gas spread through a room—can correspond to an enormous number of microscopic arrangements. Entropy measures that multiplicity and, more generally, how broadly energy is distributed among accessible states. Systems move toward high-entropy macrostates because those states occupy overwhelmingly more of the possible microscopic landscape, not because individual particles know which direction time should run.',
      'The second law is statistical but extraordinarily reliable for large systems. It explains why heat spontaneously spreads, why mixing is easy to observe but unmixing is not, and why no engine can turn all absorbed heat into useful work in a cycle. Entropy also connects thermodynamics with information because missing microscopic detail changes how many states remain possible.',
      'Calling entropy “disorder” can be suggestive but often misleads. A crystal can have complex structure while entropy depends on accessible microstates and energy distribution. Small systems can fluctuate, and open systems can become more ordered by exporting entropy; life does this without violating the second law.',
      'Entropy sets limits on engines, power plants, refrigerators, batteries, chemical reactions, data erasure, and even cosmic evolution. Engineers use it to identify irreversibility and determine how much energy remains available to perform useful work.',
      ['Entropy can decrease in a refrigerator or organism locally; the surrounding increase must be included.', 'The second law does not say everything becomes visually messy, nor does it forbid temporary fluctuations.']
    ),
    'Phases are collective behaviors': topic(
      'phases-collective-behaviors', 'matter', 'Matter', 'Q = mL',
      'Latent heat is the energy per unit mass required to reorganize a material during a phase transition without changing its temperature.',
      'A phase is a collective pattern created by many interacting particles. Solids maintain long-range positional structure, liquids stay close while continually rearranging, gases explore a much larger volume, and plasmas contain mobile charged particles. The substance has not changed identity merely because temperature or pressure changes how its particles organize and move.',
      'During melting or boiling, added energy breaks or rearranges intermolecular structure instead of immediately increasing temperature. A phase diagram maps which pattern is stable for different temperature and pressure combinations and reveals special points where phases coexist or lose a sharp boundary. Magnetism, superconductivity, and superfluidity are also phases, extending the idea beyond solid–liquid–gas labels.',
      'Heating curves assume near-equilibrium changes and fairly uniform samples. Real transitions can supercool, superheat, nucleate at impurities, or spread unevenly. Plasma is not simply “very hot gas”; its free charges create collective electromagnetic behavior that a neutral gas lacks.',
      'Refrigeration deliberately cycles a working fluid through phase changes. Metallurgy controls crystal phases, semiconductor fabrication manages material structure, weather depends on water transitions, and plasma technology supports lighting, chip production, and fusion research.',
      ['Temperature can remain constant while energy enters during a phase change because that energy reorganizes the material.', 'A phase is not limited to the familiar four states; many collective electrical, magnetic, and quantum phases exist.']
    ),

    'A restoring influence creates oscillation': topic(
      'restoring-influence-oscillation', 'waves', 'Oscillation', 'F = −kx',
      'For an ideal spring, force is proportional to displacement and points back toward equilibrium. The minus sign represents that opposite direction.',
      'An equilibrium is a state with no net tendency to change. If displacement creates a force back toward that state, inertia can carry the system past equilibrium and begin a repeating exchange. In simple harmonic motion, the restoring force grows linearly with displacement, producing a sinusoidal pattern and a constant period for a given system.',
      'Energy alternates between kinetic and stored potential forms. At maximum displacement speed is zero and potential energy is largest; at equilibrium speed is greatest. Mass slows the response while stiffness speeds it up. A pendulum behaves approximately this way only for small angles, where its curved restoring effect is nearly linear.',
      'Real oscillators lose energy through damping, so amplitude decays unless a driver replaces it. Large displacements, nonlinear springs, friction, and changing geometry break the ideal sinusoidal model. The motion may still oscillate, but period and waveform can depend on amplitude.',
      'Oscillations set the timing of clocks, electronic signals, musical instruments, suspension systems, seismic sensors, and molecular spectra. Designers choose natural frequency and damping to either preserve a clean oscillation or suppress unwanted vibration.',
      ['The restoring force is largest at the endpoints, even though speed is zero there.', 'A larger amplitude does not change the ideal spring’s period, but it can change the period of a nonideal oscillator.']
    ),
    'Speed belongs to the medium; frequency to the source': topic(
      'wave-speed-frequency-source', 'waves', 'Waves', 'v = fλ',
      'Wave speed equals frequency times wavelength. When frequency stays fixed at a boundary, wavelength changes to match the new propagation speed.',
      'A wave is a coordinated disturbance that carries energy and information while the medium’s material usually oscillates around equilibrium. The source controls how often cycles are launched. The medium’s inertia and restoring properties control how rapidly the pattern propagates, so the wavelength adjusts to connect source frequency with medium speed.',
      'At a boundary, the oscillation must remain continuous, so transmitted and reflected waves keep the source frequency. A string with greater tension carries waves faster; a denser string usually carries them more slowly. Sound speed depends on compressibility and density, while electromagnetic waves require no material medium and move at a universal speed in vacuum.',
      'Some media are dispersive: different frequencies travel at different speeds, so a pulse changes shape. Large-amplitude waves can also become nonlinear. The simple relationship still holds for each frequency component, but “the wave speed” may mean phase speed, group speed, or signal speed depending on context.',
      'Telecommunications chooses frequencies and predicts wavelengths in cables, air, and fibers. Ultrasound, sonar, instrument design, and earthquake analysis infer material properties or distances from how quickly disturbances travel.',
      ['Particles of the medium do not normally travel with the wave from source to receiver.', 'Changing frequency does not necessarily change speed; in a fixed nondispersive medium it changes wavelength instead.']
    ),
    'Waves add without permanently changing one another': topic(
      'waves-add-superposition', 'waves', 'Superposition', 'ytotal = y₁ + y₂',
      'In a linear medium, overlapping disturbances add point by point. Interference is the pattern produced by that addition.',
      'Superposition says that each wave contributes independently to the total displacement while waves overlap. Peaks aligned with peaks reinforce; peaks aligned with troughs reduce or cancel. Afterward, ideal waves continue with their original shapes because the medium responded to the sum without permanently merging the waves.',
      'Interference depends on phase—the position within a cycle. A stable pattern requires sources with a consistent phase relationship, called coherence. Path differences shift phase, producing bands of constructive and destructive interference. The same addition builds beats when frequencies are close and complex waveforms when many harmonics combine.',
      'Superposition is exact only for linear responses. Very large water waves, nonlinear optical materials, shock waves, and strongly driven structures can make waves interact and create new frequencies or lasting changes. Cancellation also removes displacement at a point, not necessarily all energy throughout the region.',
      'Noise-canceling headphones generate an opposing pressure wave, antennas shape radiation through phased elements, and interferometers measure tiny distance changes. The same idea supports medical imaging, spectroscopy, acoustics, and gravitational-wave detection.',
      ['Destructive interference does not destroy energy; energy is redistributed through the full pattern.', 'Two waves can pass through one another without bouncing or losing identity in a linear medium.']
    ),
    'Boundaries select standing patterns': topic(
      'boundaries-standing-patterns', 'waves', 'Resonance', 'L = nλ / 2',
      'For a string fixed at both ends, an integer number of half-wavelengths must fit the length. Different boundary types select different allowed patterns.',
      'A reflected wave can overlap the incoming wave so that particular points remain still while others oscillate strongly. These are nodes and antinodes. A boundary restricts which patterns reproduce themselves after reflection, so only certain wavelengths fit cleanly. The lowest is the fundamental, and higher allowed patterns are harmonics.',
      'Standing waves do not represent energy marching one way through the system; they are a persistent interference pattern formed by oppositely traveling waves. Boundary conditions determine whether an endpoint must be a node, an antinode, or something between. Discrete modes in strings and pipes provide a concrete bridge to the quantized states of atoms and fields.',
      'Real boundaries are not perfectly fixed or open, and damping broadens each resonance. Instruments also have complex shapes and coupled parts, so their frequencies may not be exact integer multiples. The simple formula is a model for an ideal string, not every resonating system.',
      'Instrument makers shape strings and air columns, microwave ovens form field patterns, lasers select optical cavity modes, and antennas tune standing electrical waves. Engineers also identify structural modes so bridges, buildings, and machinery avoid dangerous excitation.',
      ['A standing wave is produced by traveling waves; the material itself does not stay frozen between antinodes.', 'Higher harmonics have higher frequency, not necessarily greater amplitude.']
    ),
    'Relative motion changes the arrival rate': topic(
      'relative-motion-doppler', 'waves', 'Sound', 'Approach raises observed frequency',
      'Approach makes wavefronts arrive more often; separation makes them arrive less often. Source motion and observer motion alter the pattern in different ways for sound.',
      'A moving source emits each new crest from a shifted location, crowding wavefronts ahead and spreading them behind. A moving observer instead crosses already-formed wavefronts at a changed rate. Both effects alter observed frequency, but the equations differ for waves tied to a medium because source and observer motion are measured relative to that medium.',
      'For sound, frequency shift becomes a pitch change. If a source exceeds the wave speed, it outruns its own disturbances and wavefronts pile into a shock cone. Light has no material medium, so its Doppler shift follows relativity and depends only on relative motion between source and observer.',
      'Ordinary formulas assume steady speeds and a known wave speed. Wind, temperature gradients, acceleration, reflections, and broad emission spectra complicate sound measurements. A frequency change can also come from the source itself, so motion must be inferred with context.',
      'Medical ultrasound measures blood flow, radar tracks storms and vehicles, astronomy uses spectral shifts to measure stars and galaxies, and flow meters infer fluid speed without inserting a mechanical probe.',
      ['The source’s emitted frequency does not change merely because it moves; the spacing and arrival rate of wavefronts change.', 'A Doppler shift measures motion along the line of sight most directly, not the full sideways velocity.']
    ),
    'Timing can matter more than force size': topic(
      'timing-and-resonance', 'waves', 'Resonance', 'fdrive ≈ fnatural',
      'A periodic driver transfers energy most effectively when its frequency lies near a natural frequency of the system.',
      'Every oscillating system has natural modes set by its inertia, restoring influences, shape, and boundaries. A small push delivered in phase with the motion adds energy on every cycle. Near resonance, those additions accumulate and can produce a response far larger than the individual pushes suggest.',
      'The phase relationship changes across resonance. Damping removes energy and limits the peak amplitude, while the quality factor describes how narrow and persistent the response is. Coupled oscillators can split one resonance into several collective modes, allowing energy to move between parts of a system.',
      'Resonance does not guarantee unlimited growth. Real systems dissipate energy, change their properties at large amplitude, or fail structurally. A driver can also excite several modes, and the strongest response depends on where and how the force is applied, not frequency alone.',
      'Radio receivers isolate stations by resonance, MRI excites selected nuclear spins, clocks maintain stable oscillations, and vibration absorbers protect structures. Musical instruments cultivate useful resonances while cars, turbines, and bridges are designed to suppress destructive ones.',
      ['Resonance is not simply “matching speed”; it is frequency and phase matching with a natural mode.', 'A tiny force can build a large response only when it keeps supplying energy coherently over many cycles.']
    ),

    'Charge creates interaction and rearranges matter': topic(
      'charge-interaction-matter', 'fields', 'Charge', 'F ∝ q₁q₂ / r²',
      'Electric force grows with both charges and weakens with the square of their separation. The charge signs determine attraction or repulsion.',
      'Electric charge is a conserved property that comes in positive and negative forms. Like signs repel and opposite signs attract. Ordinary charging usually moves electrons between objects or separates existing charge; it does not manufacture net charge. At microscopic scales charge is quantized in fixed units, even though large objects contain so many charges that changes appear continuous.',
      'In conductors, mobile charge rearranges until the internal electric field reaches electrostatic equilibrium. In insulators, charges remain bound but can shift slightly, creating polarization and attraction to a charged object without net transfer. Grounding connects an object to a vast charge reservoir, allowing redistribution until its potential matches Earth.',
      'The inverse-square model treats charges as points and ignores time delay. Extended shapes require adding contributions across the charge distribution, and moving charges introduce magnetic effects. At atomic scales, quantum mechanics replaces classical particle paths, although charge conservation remains fundamental.',
      'Electrostatic painting attracts droplets to a surface, photocopiers position toner, precipitators remove particles from exhaust, capacitive touchscreens sense rearrangement, and lightning protection guides charge safely into Earth.',
      ['A neutral object can be attracted to a charged one through polarization.', '“Static” electricity still involves charge interaction and redistribution; static describes the large-scale situation, not motionless electrons.']
    ),
    'A field describes local possibilities': topic(
      'field-local-possibilities', 'fields', 'Fields', 'E = F / q',
      'Electric field is force per unit positive test charge. The field belongs to the sources; the force also depends on the charge placed within it.',
      'A field assigns a physical quantity to every point in space. The electric field specifies the direction and strength of the force a small positive charge would experience. This local description replaces the idea that distant objects somehow reach across empty space instantaneously. Changes in electromagnetic fields propagate at finite speed and can carry energy and momentum even where no matter is present.',
      'Field contributions add as vectors. Symmetry can make complicated source distributions simple: spherical, cylindrical, or planar arrangements constrain the direction and variation. Field lines are a drawing tool whose tangent shows direction and whose density suggests strength; they are not material threads or actual particle paths.',
      'A test charge must be small enough not to rearrange the sources. Near sharp conductors or complex materials, ideal symmetry breaks. Static electric-field models also omit magnetic induction and radiation when sources change rapidly.',
      'Engineers map fields around high-voltage equipment, sensors, capacitors, semiconductor devices, and particle accelerators. Field control also shapes electron beams, protects circuits, and helps determine safe spacing around power systems.',
      ['Field lines do not begin because a test charge is placed in the region; the source arrangement already creates the field.', 'A charged particle does not have to move along a field line if it begins with sideways velocity or experiences other forces.']
    ),
    'Voltage is an energy difference per charge': topic(
      'voltage-energy-per-charge', 'fields', 'Potential', 'ΔV = ΔU / q',
      'One volt is one joule of potential-energy difference per coulomb. The sign of the charge determines how voltage translates into potential energy.',
      'Electric potential converts a vector field into an energy landscape. Voltage is the difference between two points on that landscape, not a substance located at one wire. A positive charge loses potential energy moving toward lower potential, while a negative charge does the opposite because potential energy equals charge times potential.',
      'Only differences are physically important, so a zero level can be chosen for convenience. Equipotential surfaces contain points with the same voltage, and electric fields point toward the steepest decrease in potential. A battery uses chemical reactions to maintain separation of charge and therefore a potential difference between its terminals.',
      'Voltage alone does not determine danger, power, or current. The available charge, source resistance, path through the body, and duration all matter. In rapidly changing electromagnetic systems, a single scalar potential may not capture the full electric field without an accompanying magnetic contribution.',
      'Voltage drives energy transfer in power supplies, batteries, neural signals, sensors, and electronic circuits. Engineers use potential maps to design insulation, prevent electrical breakdown, and guide charge through semiconductor components.',
      ['Electrons often drift toward higher electric potential while their potential energy decreases because their charge is negative.', 'A battery does not store voltage; it stores chemical energy and maintains a voltage difference.']
    ),
    'A circuit is a system, not a queue of electrons': topic(
      'circuit-is-a-system', 'fields', 'Circuits', 'V = IR   ·   P = IV',
      'For an ohmic component, voltage, current, and resistance are related. Electrical power is the rate of energy transfer within the circuit.',
      'When a switch closes, an electric field becomes established throughout the conducting path and charges already present begin to drift. The lamp does not wait for one particular electron to travel from the battery. Energy is transferred through the electromagnetic system surrounding the conductors while local charges respond everywhere along the loop.',
      'Current measures charge flow rate, voltage measures energy difference per charge, and resistance summarizes how a component responds. Junction and loop rules express conservation of charge and energy. In series, components share current; in parallel, branches share voltage. Equivalent resistance compresses the behavior of a network into one overall relationship.',
      'Ohm’s law is not a universal definition of matter. Bulbs, diodes, batteries, and biological tissue can have nonlinear or changing resistance. Ideal wire and battery models also ignore internal resistance, capacitance, inductance, heating, and the short transient before a steady state forms.',
      'Circuit reasoning underlies computers, vehicles, household wiring, medical instruments, communication hardware, and power grids. Designers track both signal behavior and energy transfer so components receive the correct voltage without overheating.',
      ['Current is not used up by a component; charge flow remains continuous through a steady series loop.', 'A battery does not send newly supplied electrons all the way around before a device responds.']
    ),
    'A capacitor stores separated charge and field energy': topic(
      'capacitor-charge-field-energy', 'fields', 'Storage', 'Q = CV',
      'Capacitance is separated charge per volt. Geometry and the material between conductors determine how much separation a given voltage produces.',
      'A capacitor places two conductors close enough that opposite charges can collect while remaining separated. The resulting electric field stores energy in the space between and around the conductors. Larger plate area, smaller separation, and a suitable dielectric usually increase capacitance by allowing more charge separation for the same voltage.',
      'Charging is a time-dependent process. As charge accumulates, the capacitor’s voltage rises and opposes further transfer until it matches the source. In a resistor–capacitor circuit, the product of resistance and capacitance sets the characteristic time. Discharge reverses the flow and releases field energy into the rest of the circuit.',
      'Real capacitors leak, heat, have maximum voltage ratings, and behave imperfectly at high frequency. A dielectric can break down if its field becomes too strong. Capacitance also appears unintentionally between nearby conductors, which matters in fast electronics.',
      'Capacitors smooth power supplies, time signals, tune radios, sense touch, release bursts in camera flashes, and store energy for defibrillators. They also filter noise and separate alternating from steady components in communication circuits.',
      ['A charged capacitor can remain dangerous after power is removed because its field still stores energy.', 'Charge is separated between plates; an ideal capacitor does not create net charge from nothing.']
    ),
    'Magnetism redirects moving charge': topic(
      'magnetism-moving-charge', 'fields', 'Magnetism', 'F = qvB sin θ',
      'Magnetic force is largest when motion crosses the field and zero when motion runs parallel to it. The force is perpendicular to the motion.',
      'A magnetic field acts on moving charge sideways, perpendicular to both velocity and field. Because that force is perpendicular to displacement, it normally changes direction rather than kinetic energy. A uniform field can bend a charged particle into a circular or helical path, with charge sign determining the direction of curvature.',
      'Currents create magnetic fields because current is organized charge motion. Loops behave like magnetic dipoles, and permanent magnets arise from electron orbital motion and quantum spin aligning within regions of a material. Magnetism and electricity are not separate forces; relativity reveals them as different aspects of one electromagnetic field.',
      'The simple force expression assumes a point charge in specified fields. Real magnetic materials have domains, hysteresis, saturation, and temperature dependence. Magnetic fields can transfer energy through induced electric fields or forces on current-carrying conductors even though the direct force on one free charge is sideways.',
      'Motors turn magnetic force into torque, speakers turn current into vibration, MRI uses strong fields to organize nuclear spins, and mass spectrometers separate particles by their curved paths. Accelerators and fusion devices use fields to guide charged beams and plasmas.',
      ['A magnetic field does not directly speed up a lone charged particle when it is the only field present.', 'Magnetic north and south are labels for a dipole; isolated magnetic monopoles have not been observed.']
    ),
    'A changing magnetic environment creates an electric push': topic(
      'changing-magnetism-induction', 'fields', 'Induction', 'ℰ = −ΔΦB / Δt',
      'A faster change in magnetic flux produces a larger induced voltage. The minus sign states that the response opposes the change.',
      'Magnetic flux combines field strength, loop area, and orientation. When that flux changes, an electric field appears around the region and can drive current through a conductor. The effect does not require physical contact: motion, a changing field, a changing loop area, or rotation can all change flux.',
      'Lenz’s law determines direction. The induced current produces its own magnetic effect that resists the original change, enforcing energy conservation. A generator therefore requires mechanical work, and a transformer’s changing primary current creates changing flux that transfers energy to a secondary coil.',
      'No current flows if the path is open, although an induced voltage can still exist. Flux through one arbitrarily chosen surface is not a substance passing through the loop, and a strong constant field produces no induction unless geometry or orientation changes.',
      'Generators produce most grid electricity, transformers change voltage efficiently, induction cooktops heat cookware, guitar pickups turn string motion into signals, and wireless chargers transfer energy through changing fields.',
      ['A stationary loop in a constant magnetic field has no induced voltage merely because the field is strong.', 'The induced response opposes the change in flux, not necessarily the original external field itself.']
    ),

    'Reflection preserves angles': topic(
      'reflection-preserves-angles', 'light', 'Reflection', 'θin = θout',
      'The incoming and reflected angles are equal when both are measured from the normal line perpendicular to the surface.',
      'Reflection occurs because an electromagnetic wave drives charges at a boundary, and those charges radiate a new wave back into the original region. In the ray picture, the incoming ray, reflected ray, and surface normal share a plane. Equal angles follow from the wavefront geometry and the requirement that phase remain coordinated along the surface.',
      'A smooth surface preserves the orderly relationship between neighboring rays and forms a recognizable image. A rough surface has many differently oriented microscopic normals, scattering light broadly even though every tiny region still follows the same law. Curved mirrors vary the normal across the surface so rays converge or diverge.',
      'The ray model works when surface features and optical elements are large compared with wavelength. Thin coatings, metals, polarization, and microscopic structures require the full wave description, where reflected amplitude and phase depend on material properties and angle.',
      'Mirrors, telescopes, periscopes, lidar, barcode scanners, solar concentrators, and optical instruments all control reflected paths. Anti-reflection coatings use interference between reflections rather than simply eliminating reflection at one boundary.',
      ['Angles are measured from the normal, not from the surface.', 'Diffuse reflection still obeys the reflection law locally; roughness changes the direction of the local normal.']
    ),
    'Light bends when its speed changes': topic(
      'light-bends-refraction', 'light', 'Refraction', 'n = c / v',
      'Refractive index compares light’s vacuum speed with its propagation speed in a material. Higher index generally means slower propagation.',
      'When a tilted wavefront reaches a boundary, one side enters the new material first and changes speed before the other. The front rotates, changing the direction of travel. Frequency stays fixed across the boundary because the electromagnetic oscillation must remain continuous, while wavelength changes with speed.',
      'Snell’s law connects incident angle, refractive indices, and transmitted angle. Entering a slower, higher-index medium bends light toward the normal; leaving bends it away. Beyond a critical angle inside a higher-index material, no transmitted traveling ray can form and total internal reflection keeps the light inside.',
      'Index usually depends on frequency, which produces dispersion and separates colors. Absorbing, anisotropic, or rapidly varying materials need more detailed models. Saying light “slows because it collides with atoms” is misleading; propagation changes through the coherent electromagnetic response of the material.',
      'Refraction makes eyeglasses and camera lenses work, confines signals in optical fibers, separates spectra in prisms, and guides light through endoscopes, microscopes, telescopes, and atmospheric observations.',
      ['Light’s frequency does not change at an ordinary stationary boundary; wavelength does.', 'A refracted ray bends because the wave’s propagation changes across the interface, not because photons follow a stop-and-go collision path.']
    ),
    'Lenses and curved mirrors organize rays': topic(
      'lenses-mirrors-organize-rays', 'light', 'Imaging', '1 / f = 1 / do + 1 / di',
      'Focal length, object distance, and image distance determine where an ideal thin optical system forms an image.',
      'A converging lens or concave mirror redirects parallel rays toward a focus, while a diverging system spreads them as if they came from a virtual focus. An image forms when rays from each object point are brought to corresponding image points. Real images occur where light physically converges and can be projected; virtual images are located by extending diverging rays backward.',
      'A few principal rays reveal location, orientation, and relative size without tracing every ray. Magnification compares image and object size and carries a sign for orientation. Multiple elements can be combined so one image becomes the object for the next, as in microscopes, telescopes, and camera systems.',
      'The thin-lens and small-angle approximations ignore thickness and rays far from the axis. Real devices contend with spherical aberration, chromatic aberration, coma, distortion, diffraction, and limited aperture. Designers combine shapes and materials to correct these effects.',
      'The same geometry powers cameras, projectors, corrective lenses, microscopes, telescopes, medical scopes, and the human eye. Autofocus changes lens position or curvature to place the image precisely on a sensor or retina.',
      ['A virtual image is not imaginary; light reaches the observer but does not physically converge at the apparent image location.', 'A larger lens does not automatically create greater magnification; focal lengths and object placement determine it.']
    ),
    'Light spreads and interferes': topic(
      'light-diffraction-interference', 'light', 'Wave optics', 'd sin θ = mλ',
      'For evenly spaced slits, bright directions occur when path differences equal whole wavelengths and the waves arrive in phase.',
      'Light cannot always be treated as perfectly straight rays. When an opening or obstacle is comparable to a wavelength, different parts of the wavefront spread and overlap. Their amplitudes add, producing bright and dark regions whose spacing records wavelength, geometry, and phase.',
      'A single aperture creates diffraction, two coherent paths produce fringes, and many regularly spaced openings form sharp diffraction-grating peaks. The same wave behavior sets a resolution limit: two nearby details blur together when their diffraction patterns overlap too strongly. Larger apertures narrow the pattern and reveal finer detail.',
      'Stable fringes require sufficient coherence and mechanical stability. Extended sources, mixed wavelengths, vibration, and environmental changes wash patterns out. Individual photons still arrive as localized detections, yet their accumulated probability pattern follows interference.',
      'Spectrometers separate wavelengths, interferometers measure tiny displacements, microscopes and telescopes are designed around resolution limits, and chip fabrication uses controlled diffraction and interference at extremely small scales.',
      ['Diffraction is not only a property of openings smaller than a wavelength; it is always present and becomes conspicuous at comparable scales.', 'Observing individual photon impacts does not remove the interference pattern built over many events.']
    ),
    'All light is electromagnetic': topic(
      'all-light-electromagnetic', 'light', 'Spectrum', 'E = hf',
      'Photon energy grows with frequency. Intensity measures total energy arriving per area and time, which also depends on how many photons arrive.',
      'Electromagnetic waves are self-propagating changes in electric and magnetic fields. Radio, microwave, infrared, visible, ultraviolet, X-ray, and gamma radiation differ mainly in frequency and wavelength, not in their basic identity. In vacuum every part of the spectrum travels at the same speed.',
      'Matter responds selectively. Molecular rotations absorb some microwaves, vibrations interact with infrared, electron transitions produce visible and ultraviolet spectra, and energetic photons can ionize atoms. Spectrum names mark useful regions rather than sharp changes in the underlying physics.',
      'Frequency alone does not determine exposure risk; intensity, duration, absorption, and tissue matter too. Ionizing radiation begins when individual photons carry enough energy to remove bound electrons, while sufficiently intense nonionizing radiation can still heat or damage material.',
      'Radio and Wi-Fi transmit information, infrared cameras map temperature, ultraviolet can sterilize surfaces, X-rays image dense tissue, and gamma radiation treats some cancers. Spectroscopy identifies composition from the frequencies matter emits or absorbs.',
      ['Microwaves do not heat only water; they interact with several polar materials.', 'Brighter visible light has greater intensity, not necessarily higher-frequency photons.']
    ),

    'Space and time adjust to preserve light speed': topic(
      'space-time-preserve-light-speed', 'modern', 'Relativity', 'γ = 1 / √(1 − v²/c²)',
      'The Lorentz factor measures how strongly time, length, energy, and momentum comparisons differ from ordinary low-speed expectations.',
      'Special relativity begins with two principles: the laws of physics are the same in every inertial frame, and every inertial observer measures the same vacuum speed of light. If speed is distance divided by time, preserving light speed requires different observers to divide spacetime into space and time differently. Simultaneity therefore becomes frame-dependent.',
      'Time dilation and length contraction are coordinated parts of one geometry, not mechanical damage or an optical trick. Proper time is the duration measured by a clock traveling between events, while the spacetime interval is the invariant all observers agree on. Relativistic momentum and energy keep conservation laws consistent across frames.',
      'The familiar formulas compare inertial observers and do not by themselves describe gravity. Acceleration can be handled within special relativity, but curved spacetime requires general relativity. At everyday speeds the Lorentz factor is so close to one that Newtonian mechanics remains an excellent approximation.',
      'GPS corrects relativistic clock rates, accelerators design around relativistic momentum, and particle lifetimes measured in laboratories reveal time dilation. Precision clocks can now detect relativistic differences from ordinary changes in speed and height.',
      ['Each inertial observer measures the other’s moving clock as slow; there is no contradiction because simultaneity also differs.', 'Massive objects cannot be accelerated through light speed, but distant cosmic recession can exceed light speed because it is not local motion through space.']
    ),
    'Gravity can be geometry': topic(
      'gravity-can-be-geometry', 'modern', 'Gravity', 'Mass-energy ↔ spacetime curvature',
      'Einstein’s field equation connects matter, energy, pressure, and momentum with the curvature of spacetime.',
      'General relativity begins with the equivalence between free fall and weightlessness. A freely falling object feels no gravitational force locally; it follows the straightest available path through curved spacetime. Standing on Earth feels force because the ground prevents that natural free-fall path.',
      'Mass-energy shapes geometry, and geometry guides motion. Curvature changes clock rates, bends light, shifts orbits, and allows disturbances called gravitational waves. Black holes appear when curvature creates a boundary from which future-directed paths cannot return, while cosmology applies the same theory to the geometry of the universe as a whole.',
      'Newtonian gravity is an extremely accurate weak-field, low-speed limit and is far easier to use for ordinary systems. The slogan about a stretched rubber sheet is only an analogy and misleadingly relies on gravity to explain gravity. Quantum theory and general relativity are not yet unified into a completed fundamental framework.',
      'Relativistic corrections keep GPS accurate, gravitational-wave detectors observe colliding compact objects, and black-hole imaging tests extreme gravity. The theory also underlies models of stars, gravitational lensing, and cosmic expansion.',
      ['Orbiting objects are not being pulled through a preexisting curved space alone; spacetime geometry includes time as well.', 'A black hole does not pull more strongly than another object of equal mass at the same outside distance.']
    ),
    'Quantum theory predicts possibilities precisely': topic(
      'quantum-possibilities', 'modern', 'Quantum', 'Probability = |amplitude|²',
      'Quantum alternatives carry amplitudes that add and interfere before their magnitude is squared to obtain outcome probabilities.',
      'A quantum state is a complete predictive description of possible measurement outcomes, not simply a fuzzy classical path. Each alternative carries an amplitude with magnitude and phase. Amplitudes can reinforce or cancel, which allows particles sent one at a time to build an interference pattern after many detections.',
      'Observables have allowed outcomes and probability distributions set by the state. Between measurements, the state evolves by a precise deterministic rule; measurement returns one outcome probabilistically. Entanglement describes joint states that cannot be reduced to independent properties of each part and produces correlations stronger than any local hidden-variable account allows.',
      'Quantum theory does not mean “anything can happen.” Symmetries, conservation laws, state preparation, and amplitudes place strict constraints on outcomes. Classical behavior emerges when actions are large compared with Planck’s scale and environmental interaction suppresses observable coherence, although interpretation of measurement remains debated.',
      'Quantum rules explain chemical bonds, transistors, lasers, atomic clocks, magnetic resonance, superconductors, and emerging quantum computers and sensors. Much of modern technology works because engineers control allowed states and transitions.',
      ['Quantum probability is not merely ignorance about a definite hidden classical trajectory.', 'Observation means a physical interaction that records information; a conscious human is not required.']
    ),
    'Uncertainty is built into the state': topic(
      'uncertainty-built-in', 'modern', 'Quantum', 'ΔxΔp ≥ ħ / 2',
      'A quantum state cannot make both position and momentum arbitrarily sharp. Their spreads have a lower-bound product.',
      'A localized wave packet must combine many wavelengths. Because wavelength corresponds to momentum, narrowing position necessarily broadens the momentum distribution. A nearly single-wavelength state has sharply defined momentum but spreads across space. Uncertainty is therefore a structural property of the state, not merely a flaw in equipment.',
      'The deeper mathematical reason is that position and momentum operations do not commute: changing their measurement order can change the outcome statistics. Similar tradeoffs apply to other incompatible observables. The bound concerns the spread across repeated preparations of the same state, while each individual measurement still produces a definite result.',
      'The relationship does not claim that every pair of quantities is uncertain in the same way, nor does it set a simple limit on simultaneous knowledge of energy and time in exactly the position–momentum sense. Measurement disturbance can add uncertainty, but it is not the source of the fundamental bound.',
      'Uncertainty shapes electron microscopes, atomic structure, spectroscopy, nanotechnology, quantum cryptography, and precision sensing. It also produces zero-point motion, preventing bound quantum systems from becoming perfectly motionless.',
      ['Better instruments cannot remove the intrinsic spread of a quantum state.', 'The uncertainty principle does not allow macroscopic violations of conservation laws; quantum fluctuations obey the full theory’s constraints.']
    ),
    'Binding changes the mass of a system': topic(
      'binding-changes-mass', 'modern', 'Nuclear', 'ΔE = Δmc²',
      'A change in a system’s rest energy corresponds to a change in its mass. Nuclear binding releases enough energy for the mass difference to be measurable.',
      'Separated nucleons have more total mass than the stable nucleus they can form. When the nucleus binds, energy leaves through radiation or particle motion, so the completed system’s mass is lower. This mass defect is not missing matter; it is the difference in total internal energy expressed through mass–energy equivalence.',
      'Binding energy per nucleon rises toward medium-sized nuclei. Light nuclei can release energy by fusing toward tighter binding, while very heavy nuclei can release energy by splitting. Radioactive decay occurs when a different configuration is energetically accessible and allowed by the relevant interaction and quantum rules.',
      'Not every nuclear reaction releases energy, and overcoming electric repulsion can require substantial input before fusion begins. A chain reaction depends on reaction products triggering further events; it is separate from the energy released by one nucleus. Radiation type and biological effect must also be evaluated individually.',
      'Nuclear binding powers stars and reactors, supports radiometric dating, produces medical tracers and treatments, and explains the origin of many elements. Fusion research attempts to create and control the conditions that let light nuclei bind productively.',
      ['Mass is conserved only as part of total mass-energy accounting, not as a separate unchanging quantity in nuclear reactions.', 'Fusion releases energy for light nuclei; combining nuclei beyond the most tightly bound region generally requires energy.']
    ),
    'Particles are excitations of fields': topic(
      'particles-field-excitations', 'modern', 'Particles', 'Fields + symmetries → particles and interactions',
      'Quantum field theory treats each fundamental particle type as a quantized excitation of an underlying field.',
      'The electron field, photon field, quark fields, and other fundamental fields extend throughout space. What we call one particle is a discrete excitation with the field’s characteristic mass, charge, and spin. Identical particles are identical because they are excitations of the same field, not separately manufactured miniature objects.',
      'Interactions rearrange excitations while preserving quantities required by symmetries. The Standard Model organizes matter fields and the electromagnetic, weak, and strong interactions. Feynman diagrams are terms in a calculation of amplitudes, not literal snapshots of tiny balls exchanging messages along fixed paths.',
      'The Standard Model is extraordinarily successful but incomplete: it omits a quantum description of gravity, does not identify dark matter, and leaves several parameters unexplained. “Virtual particles popping in and out of nothing” is a popular cartoon that often obscures rather than clarifies the mathematics.',
      'Quantum field theory predicts collider events, particle decays, semiconductor behavior, antimatter processes, and precision magnetic effects. Detectors reconstruct short-lived excitations from energy, momentum, charge, and tracks left in matter.',
      ['Fields are not just calculation devices placed around classical particles; in the modern theory the fields are fundamental.', 'A Feynman diagram is a contribution to a probability amplitude, not a literal movie of an interaction.']
    ),
    'A star is a long balance between collapse and pressure': topic(
      'star-balance-collapse-pressure', 'modern', 'Astrophysics', 'Inward gravity ↔ outward pressure',
      'Hydrostatic equilibrium balances gravity against a pressure gradient in every layer. Evolution begins when the sources of pressure or energy change.',
      'Gravity tries to compress a star, while gas pressure, radiation pressure, and sometimes quantum degeneracy resist collapse. The balance is maintained layer by layer rather than by one outward surface force. Core fusion supplies energy that moves outward and helps support the temperature and pressure structure.',
      'Fusion changes composition, so a star cannot remain unchanged forever. Mass determines how hot and dense the core becomes, which fuels can ignite, and how the final support fails or reorganizes. Low- and medium-mass stars leave white dwarfs; sufficiently massive cores can form neutron stars or black holes, often after supernova explosions.',
      'A star does not burn like a chemical fire, and fusion pressure is not a simple outward explosion. Stellar models combine gravity, energy transport, nuclear reaction networks, opacity, magnetic activity, and mass loss. Binary interactions can redirect an otherwise ordinary life cycle.',
      'Stellar models date star clusters, trace element formation, predict supernovae, interpret exoplanet observations, and calibrate cosmic distances. The elements in planets and living systems record generations of stellar fusion and explosive recycling.',
      ['Stars do not remain stable because fusion directly pushes the surface outward; fusion maintains the thermal structure that supports pressure.', 'Not every massive star immediately becomes a black hole, and the outcome depends on core mass and mass loss.']
    ),
    'Cosmic expansion stretches distances between unbound systems': topic(
      'cosmic-expansion', 'modern', 'Cosmology', 'v ≈ H₀d',
      'On large scales, recession rate is approximately proportional to distance. This relation describes changing cosmic geometry, not motion from a central explosion.',
      'Cosmic expansion means the scale relating large, unbound regions grows with time. There is no special center within the observable universe: every sufficiently distant observer sees the same broad pattern. The early universe was hot and dense everywhere, then expanded and cooled rather than exploding from one point into preexisting emptiness.',
      'Traveling light is stretched with the expanding geometry, producing cosmological redshift. Galaxy distances, supernova brightness, the cosmic microwave background, and element abundances together reconstruct expansion history. The expansion rate has changed as radiation, matter, and dark energy dominated the cosmic energy budget at different eras.',
      'Bound systems do not simply expand. Electromagnetic forces hold atoms together and gravity holds galaxies and solar systems against the extremely weak large-scale stretching. At enormous distances recession can exceed light speed without an object locally moving through space faster than light.',
      'Galaxy surveys map structure and expansion, standard candles measure cosmic history, and microwave-background observations constrain the universe’s age, geometry, and contents. Current research uses these records to investigate dark matter, dark energy, and tensions between expansion measurements.',
      ['The Big Bang was not an explosion at one location with galaxies flying into empty space.', 'Cosmological redshift is related to expansion and should not always be treated as an ordinary Doppler shift through static space.']
    ),
    'Deterministic does not always mean predictable': topic(
      'deterministic-not-predictable', 'modern', 'Complexity', 'Small difference → exponential separation',
      'A positive Lyapunov exponent describes rapid separation of nearby trajectories, creating a finite horizon for detailed prediction.',
      'A deterministic rule assigns one future to each exact starting state, but prediction requires knowing that state with finite precision. In a chaotic system, nearby possibilities separate exponentially until their details become macroscopically different. The failure lies in long-term forecasting, not in the existence of governing rules.',
      'Chaos appears in nonlinear systems with feedback and several interacting degrees of freedom. Phase-space diagrams reveal stretching and folding of trajectories, while strange attractors show structured long-term behavior without simple repetition. Statistical properties can remain stable even after exact trajectories become unpredictable.',
      'Chaos is not the same as randomness, and complicated behavior is not automatically chaotic. Some nonlinear systems settle into simple patterns, while some stochastic systems remain statistically predictable. Claims of a “butterfly effect” require demonstrated sensitivity, not merely a long causal chain.',
      'Weather models run ensembles of slightly different initial conditions, orbital studies test long-term stability, and engineers analyze chaotic vibration and fluid flow. Similar tools appear in ecology, heart rhythms, lasers, secure communication, and population dynamics.',
      ['Deterministic does not mean practically predictable when initial conditions cannot be known with infinite precision.', 'Climate statistics can be predictable even when exact weather on a distant day is not.']
    ),
    'Collective quantum behavior can become visible': topic(
      'collective-quantum-behavior', 'modern', 'Condensed matter', 'Microscopic pairing → macroscopic coherence',
      'Below critical conditions, many particles can share a coherent quantum state and produce new behavior at the scale of an entire material.',
      'In an ordinary conductor, scattering converts organized electron motion into thermal energy and creates resistance. In many superconductors, electrons form correlated Cooper pairs and enter a shared phase-coherent state. An energy gap suppresses ordinary scattering channels, allowing persistent current without conventional resistance.',
      'Superconductors also expel magnetic field through the Meissner effect, distinguishing the phase from a merely perfect conductor. Magnetic flux can enter some materials in quantized vortices, and Josephson junctions let the quantum phase control current across a thin barrier. Temperature, current, and magnetic field each have critical limits.',
      'Not every cold material becomes superconducting, and practical wires still face cooling, mechanical, and field constraints. High-temperature superconductors are “high” relative to older superconductors, not room-temperature devices. Their microscopic mechanism can also differ from the simplest pairing model.',
      'Superconducting magnets power MRI scanners and research accelerators, while sensitive junctions detect tiny magnetic fields. Fusion devices, maglev systems, quantum computers, energy storage, and low-loss power technologies may benefit as materials and cooling improve.',
      ['Zero electrical resistance and magnetic-field expulsion are distinct defining features.', 'Cooling any metal enough does not guarantee superconductivity; the material must support the appropriate collective state.']
    )
  };
}());

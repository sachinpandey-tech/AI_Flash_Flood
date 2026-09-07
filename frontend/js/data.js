/**
 * HimaGuard: Hyperlocal Flash Flood Early Warning System
 * SIH 2026 Problem Statement SIH26192
 * Data Store: 12 Himalayan Villages, 20 IoT Sensors, Shelters, Historical Events
 */

const HIMAGUARD_DATA = {
  // 12 Monitored Himalayan Villages in Mandakini-Alaknanda River Catchment, Uttarakhand
  villages: [
    {
      id: 'VIL-001',
      name: 'Bhairavpur',
      district: 'Rudraprayag',
      population: 1840,
      households: 360,
      coordinates: [30.4185, 79.0669],
      nearbyRiver: 'Mandakini River (Lower Gorge Reach)',
      distanceToRiver: '95 meters',
      elevation: '1,480m MSL',
      slope: '32° (Steep Catchment Gradient)',
      landslideRisk: 'High',
      historicalFloodCount: 4,
      historicalLandslideCount: 6,
      status: 'Critical', // Will be dynamic in demo
      floodProbability: 87, // %
      estimatedLeadTime: 42, // minutes
      confidence: 0.91,
      sensorsOnline: '3/3',
      lastUpdate: '10 sec ago',
      sensors: {
        rainGauge: 74.0, // mm/hr
        soilMoisture: 86.0, // %
        waterLevel: 2.80, // meters
        waterLevelChange: '+18 cm / 10 min',
        temperature: 21.5, // °C
        humidity: 94 // %
      },
      riskFactors: {
        rainfallRisk: 92,
        soilSaturation: 86,
        waterLevelRisk: 79,
        slopeRisk: 71,
        historicalRisk: 64
      },
      aiReasons: [
        'Heavy sustained rainfall detected in upstream catchment (74 mm/hr)',
        'Soil moisture approaching critical saturation capacity (86%)',
        'Rapid water-level surge in Mandakini River (+18 cm in 10 minutes)',
        'Steep slope gradient (32°) accelerating overland runoff into gorge',
        '4 historical flash flood events recorded in this basin section'
      ],
      evacuation: {
        affectedZones: 'Ward 1, Ward 2 (Riverside settlement), Lower Market Bazaar',
        affectedPopulation: 680,
        recommendedDirection: 'North-East upward ridge toward ZP Inter College',
        shelters: [
          { name: 'Govt Inter College Elevated Campus', capacity: 750, distance: '850m', elevation: '+35m', status: 'Ready' },
          { name: 'Panchayat Community Center High Ground', capacity: 400, distance: '1.2km', elevation: '+42m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-002',
      name: 'Joshimath Valley',
      district: 'Chamoli',
      population: 2950,
      households: 580,
      coordinates: [30.5574, 79.5668],
      nearbyRiver: 'Dhauliganga / Alaknanda Confluence',
      distanceToRiver: '320 meters',
      elevation: '1,890m MSL',
      slope: '28° (Subsidence Prone Slope)',
      landslideRisk: 'Very High',
      historicalFloodCount: 5,
      historicalLandslideCount: 8,
      status: 'High',
      floodProbability: 72,
      estimatedLeadTime: 58,
      confidence: 0.88,
      sensorsOnline: '2/2',
      lastUpdate: '15 sec ago',
      sensors: {
        rainGauge: 52.0,
        soilMoisture: 78.0,
        waterLevel: 3.10,
        waterLevelChange: '+11 cm / 10 min',
        temperature: 18.2,
        humidity: 89
      },
      riskFactors: {
        rainfallRisk: 74,
        soilSaturation: 78,
        waterLevelRisk: 70,
        slopeRisk: 85,
        historicalRisk: 80
      },
      aiReasons: [
        'Persistent rainfall on geo-sensitive slope terrain',
        'Dhauliganga water level rising steadily above seasonal threshold',
        'Sub-surface soil saturation high due to prior week infiltration'
      ],
      evacuation: {
        affectedZones: 'Sector 3 Ravine Corridor, Lower Helang Outpost',
        affectedPopulation: 820,
        recommendedDirection: 'Upper Auli Road Safe Terraces',
        shelters: [
          { name: 'Army Transit Shelter Camp', capacity: 1200, distance: '1.5km', elevation: '+60m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-003',
      name: 'Karnaprayag Reach',
      district: 'Chamoli',
      population: 3400,
      households: 690,
      coordinates: [30.2600, 79.2185],
      nearbyRiver: 'Alaknanda & Pindar River Sangam',
      distanceToRiver: '60 meters',
      elevation: '860m MSL',
      slope: '22°',
      landslideRisk: 'Moderate',
      historicalFloodCount: 6,
      historicalLandslideCount: 3,
      status: 'Critical',
      floodProbability: 84,
      estimatedLeadTime: 48,
      confidence: 0.90,
      sensorsOnline: '2/2',
      lastUpdate: '8 sec ago',
      sensors: {
        rainGauge: 68.5,
        soilMoisture: 84.0,
        waterLevel: 4.20,
        waterLevelChange: '+15 cm / 10 min',
        temperature: 23.0,
        humidity: 92
      },
      riskFactors: {
        rainfallRisk: 85,
        soilSaturation: 84,
        waterLevelRisk: 88,
        slopeRisk: 55,
        historicalRisk: 78
      },
      aiReasons: [
        'Dual river confluence receiving combined discharge from Pindar glacier valley',
        'Alaknanda water level within 30cm of municipal warning mark',
        'Inundation predicted for low-lying riverbank market within 50 minutes'
      ],
      evacuation: {
        affectedZones: 'Sangam Ghat Bazaar, Old Bus Stand Colony',
        affectedPopulation: 1100,
        recommendedDirection: 'Pauri Highway Upper Bypass',
        shelters: [
          { name: 'Municipal Town Hall Elevated Shelter', capacity: 900, distance: '700m', elevation: '+30m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-004',
      name: 'Rudraprayag Confluence',
      district: 'Rudraprayag',
      population: 4100,
      households: 820,
      coordinates: [30.2844, 78.9811],
      nearbyRiver: 'Alaknanda & Mandakini Confluence',
      distanceToRiver: '80 meters',
      elevation: '895m MSL',
      slope: '25°',
      landslideRisk: 'Moderate',
      historicalFloodCount: 7,
      historicalLandslideCount: 4,
      status: 'High',
      floodProbability: 76,
      estimatedLeadTime: 55,
      confidence: 0.89,
      sensorsOnline: '2/2',
      lastUpdate: '12 sec ago',
      sensors: {
        rainGauge: 58.0,
        soilMoisture: 79.0,
        waterLevel: 4.80,
        waterLevelChange: '+12 cm / 10 min',
        temperature: 22.8,
        humidity: 90
      },
      riskFactors: {
        rainfallRisk: 78,
        soilSaturation: 79,
        waterLevelRisk: 82,
        slopeRisk: 60,
        historicalRisk: 82
      },
      aiReasons: [
        'Mandakini surge discharging into Alaknanda creates backwater pooling',
        'High soil moisture prevents further rainwater absorption'
      ],
      evacuation: {
        affectedZones: 'Belni Bridge Approaches, Ghat Commercial Hub',
        affectedPopulation: 950,
        recommendedDirection: 'Gulabrai Elevated Highway Shelter',
        shelters: [
          { name: 'District Sports Complex Elevated Hall', capacity: 1500, distance: '1.1km', elevation: '+45m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-005',
      name: 'Devprayag Sangam',
      district: 'Tehri Garhwal',
      population: 2150,
      households: 420,
      coordinates: [30.1459, 78.5986],
      nearbyRiver: 'Bhagirathi & Alaknanda Confluence (Origin of Ganga)',
      distanceToRiver: '110 meters',
      elevation: '475m MSL',
      slope: '30°',
      landslideRisk: 'Moderate',
      historicalFloodCount: 4,
      historicalLandslideCount: 3,
      status: 'Moderate',
      floodProbability: 58,
      estimatedLeadTime: 85,
      confidence: 0.87,
      sensorsOnline: '2/2',
      lastUpdate: '20 sec ago',
      sensors: {
        rainGauge: 38.0,
        soilMoisture: 65.0,
        waterLevel: 5.10,
        waterLevelChange: '+7 cm / 10 min',
        temperature: 24.5,
        humidity: 82
      },
      riskFactors: {
        rainfallRisk: 55,
        soilSaturation: 65,
        waterLevelRisk: 62,
        slopeRisk: 68,
        historicalRisk: 60
      },
      aiReasons: [
        'Elevated river discharge from upstream Bhagirathi and Alaknanda',
        'Rainfall intensity moderate; gorge depth contains initial surge'
      ],
      evacuation: {
        affectedZones: 'Lower Pilgrimage Steps, Shanti Bazaar',
        affectedPopulation: 420,
        recommendedDirection: 'Badrinath Highway Upper Terraces',
        shelters: [
          { name: 'Ramkund High Ground Pilgrim Center', capacity: 600, distance: '600m', elevation: '+35m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-006',
      name: 'Guptkashi Slope',
      district: 'Rudraprayag',
      population: 1980,
      households: 390,
      coordinates: [30.5228, 79.0764],
      nearbyRiver: 'Upper Mandakini Catchment',
      distanceToRiver: '450 meters',
      elevation: '1,319m MSL',
      slope: '34°',
      landslideRisk: 'High',
      historicalFloodCount: 3,
      historicalLandslideCount: 7,
      status: 'High',
      floodProbability: 71,
      estimatedLeadTime: 62,
      confidence: 0.89,
      sensorsOnline: '1/1',
      lastUpdate: '18 sec ago',
      sensors: {
        rainGauge: 62.0,
        soilMoisture: 81.0,
        waterLevel: 2.10,
        waterLevelChange: '+9 cm / 10 min',
        temperature: 19.5,
        humidity: 91
      },
      riskFactors: {
        rainfallRisk: 80,
        soilSaturation: 81,
        waterLevelRisk: 58,
        slopeRisk: 88,
        historicalRisk: 65
      },
      aiReasons: [
        'Steep mountain slope with active debris-flow channels',
        'Cloudburst activity in Kedarnath sanctuary upstream feeding culverts'
      ],
      evacuation: {
        affectedZones: 'Nala Village Ravine, Lower Helipad road',
        affectedPopulation: 510,
        recommendedDirection: 'Vishwanath Temple Ridge',
        shelters: [
          { name: 'Guptkashi Sanskrit Mahavidyalaya', capacity: 500, distance: '950m', elevation: '+50m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-007',
      name: 'Tilwara Basin',
      district: 'Rudraprayag',
      population: 1650,
      households: 310,
      coordinates: [30.3540, 78.9890],
      nearbyRiver: 'Mandakini River (Valley Basin)',
      distanceToRiver: '85 meters',
      elevation: '940m MSL',
      slope: '18°',
      landslideRisk: 'Moderate',
      historicalFloodCount: 5,
      historicalLandslideCount: 2,
      status: 'Critical',
      floodProbability: 86,
      estimatedLeadTime: 36,
      confidence: 0.92,
      sensorsOnline: '1/1',
      lastUpdate: '6 sec ago',
      sensors: {
        rainGauge: 71.0,
        soilMoisture: 88.0,
        waterLevel: 3.60,
        waterLevelChange: '+19 cm / 10 min',
        temperature: 22.0,
        humidity: 95
      },
      riskFactors: {
        rainfallRisk: 90,
        soilSaturation: 88,
        waterLevelRisk: 85,
        slopeRisk: 50,
        historicalRisk: 75
      },
      aiReasons: [
        'Wide flat valley basin prone to rapid backwater inundation',
        'Water level rising at 19 cm per 10 minutes from Bhairavpur discharge',
        'Predicted embankment overflow within 36 minutes'
      ],
      evacuation: {
        affectedZones: 'Tilwara Agricultural Plain, GMVN Tourist Rest Area',
        affectedPopulation: 780,
        recommendedDirection: 'Saurakhal Upper Link Road',
        shelters: [
          { name: 'Govt Higher Secondary School Compound', capacity: 700, distance: '800m', elevation: '+28m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-008',
      name: 'Nandaprayag Ghat',
      district: 'Chamoli',
      population: 1420,
      households: 270,
      coordinates: [30.3325, 79.3242],
      nearbyRiver: 'Alaknanda & Nandakini Confluence',
      distanceToRiver: '70 meters',
      elevation: '914m MSL',
      slope: '26°',
      landslideRisk: 'Moderate',
      historicalFloodCount: 4,
      historicalLandslideCount: 4,
      status: 'Moderate',
      floodProbability: 54,
      estimatedLeadTime: 95,
      confidence: 0.86,
      sensorsOnline: '1/1',
      lastUpdate: '25 sec ago',
      sensors: {
        rainGauge: 34.0,
        soilMoisture: 62.0,
        waterLevel: 3.40,
        waterLevelChange: '+6 cm / 10 min',
        temperature: 21.0,
        humidity: 80
      },
      riskFactors: {
        rainfallRisk: 50,
        soilSaturation: 62,
        waterLevelRisk: 58,
        slopeRisk: 62,
        historicalRisk: 58
      },
      aiReasons: [
        'Nandakini discharge within manageable gauge thresholds',
        'Watch condition active; rainfall remains steady'
      ],
      evacuation: {
        affectedZones: 'Lower Ghat Road, Temple Steps',
        affectedPopulation: 310,
        recommendedDirection: 'NH-07 Elevated Parking Plateau',
        shelters: [
          { name: 'Nandaprayag Nagar Panchayat Bhawan', capacity: 450, distance: '550m', elevation: '+25m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-009',
      name: 'Ukhimath Hillside',
      district: 'Rudraprayag',
      population: 2280,
      households: 460,
      coordinates: [30.5147, 79.0967],
      nearbyRiver: 'Madhyamaheshwar Stream (High Elevation)',
      distanceToRiver: '520 meters',
      elevation: '1,311m MSL',
      slope: '31°',
      landslideRisk: 'Moderate',
      historicalFloodCount: 2,
      historicalLandslideCount: 5,
      status: 'Low',
      floodProbability: 31,
      estimatedLeadTime: 180,
      confidence: 0.94,
      sensorsOnline: '1/1',
      lastUpdate: '30 sec ago',
      sensors: {
        rainGauge: 18.0,
        soilMoisture: 48.0,
        waterLevel: 1.40,
        waterLevelChange: '+2 cm / 10 min',
        temperature: 19.0,
        humidity: 74
      },
      riskFactors: {
        rainfallRisk: 30,
        soilSaturation: 48,
        waterLevelRisk: 25,
        slopeRisk: 72,
        historicalRisk: 35
      },
      aiReasons: [
        'High elevation ridge with natural steep drainage channels',
        'Soil moisture well below saturation threshold (48%)'
      ],
      evacuation: {
        affectedZones: 'None currently at risk',
        affectedPopulation: 0,
        recommendedDirection: 'Omkareshwar Temple High Complex',
        shelters: [
          { name: 'Omkareshwar Yatri Niwas', capacity: 800, distance: '400m', elevation: '+20m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-010',
      name: 'Gopeshwar Terrace',
      district: 'Chamoli',
      population: 3900,
      households: 780,
      coordinates: [30.4089, 79.3308],
      nearbyRiver: 'Balkhila River Sub-basin',
      distanceToRiver: '680 meters',
      elevation: '1,550m MSL',
      slope: '20°',
      landslideRisk: 'Low',
      historicalFloodCount: 1,
      historicalLandslideCount: 2,
      status: 'Low',
      floodProbability: 24,
      estimatedLeadTime: 240,
      confidence: 0.95,
      sensorsOnline: '2/2',
      lastUpdate: '40 sec ago',
      sensors: {
        rainGauge: 14.5,
        soilMoisture: 42.0,
        waterLevel: 1.10,
        waterLevelChange: '+1 cm / 10 min',
        temperature: 20.0,
        humidity: 70
      },
      riskFactors: {
        rainfallRisk: 22,
        soilSaturation: 42,
        waterLevelRisk: 20,
        slopeRisk: 45,
        historicalRisk: 20
      },
      aiReasons: [
        'District administrative plateau positioned safely above river floodplain',
        'Normal monsoon precipitation levels recorded'
      ],
      evacuation: {
        affectedZones: 'None currently at risk',
        affectedPopulation: 0,
        recommendedDirection: 'District Collectorate Compound',
        shelters: [
          { name: 'Police Line Multipurpose Hall', capacity: 1000, distance: '900m', elevation: '+15m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-011',
      name: 'Chamoli Sector',
      district: 'Chamoli',
      population: 3100,
      households: 620,
      coordinates: [30.4045, 79.3490],
      nearbyRiver: 'Alaknanda Main Gorge',
      distanceToRiver: '130 meters',
      elevation: '960m MSL',
      slope: '29°',
      landslideRisk: 'High',
      historicalFloodCount: 6,
      historicalLandslideCount: 7,
      status: 'High',
      floodProbability: 78,
      estimatedLeadTime: 52,
      confidence: 0.90,
      sensorsOnline: '2/2',
      lastUpdate: '14 sec ago',
      sensors: {
        rainGauge: 61.0,
        soilMoisture: 80.0,
        waterLevel: 4.10,
        waterLevelChange: '+14 cm / 10 min',
        temperature: 21.8,
        humidity: 91
      },
      riskFactors: {
        rainfallRisk: 82,
        soilSaturation: 80,
        waterLevelRisk: 81,
        slopeRisk: 75,
        historicalRisk: 84
      },
      aiReasons: [
        'Steep gorge section vulnerable to debris blockages and flash surges',
        'Upstream cloudburst activity discharging rapidly through bedrock constriction'
      ],
      evacuation: {
        affectedZones: 'Old Chamoli Riverside Settlement, District Jail Low Ground',
        affectedPopulation: 890,
        recommendedDirection: 'Gopeshwar Bypass Elevated Road',
        shelters: [
          { name: 'Chamoli ZP Higher Secondary School', capacity: 850, distance: '1.2km', elevation: '+45m', status: 'Ready' }
        ]
      }
    },
    {
      id: 'VIL-012',
      name: 'Srinagar Garhwal Plain',
      district: 'Pauri Garhwal',
      population: 6200,
      households: 1250,
      coordinates: [30.2227, 78.7844],
      nearbyRiver: 'Alaknanda River (Reservoir Reach)',
      distanceToRiver: '150 meters',
      elevation: '560m MSL',
      slope: '12°',
      landslideRisk: 'Low',
      historicalFloodCount: 5,
      historicalLandslideCount: 1,
      status: 'Moderate',
      floodProbability: 49,
      estimatedLeadTime: 110,
      confidence: 0.88,
      sensorsOnline: '1/2',
      lastUpdate: '16 sec ago',
      sensors: {
        rainGauge: 32.0,
        soilMoisture: 59.0,
        waterLevel: 5.80,
        waterLevelChange: '+8 cm / 10 min',
        temperature: 25.2,
        humidity: 84
      },
      riskFactors: {
        rainfallRisk: 46,
        soilSaturation: 59,
        waterLevelRisk: 60,
        slopeRisk: 25,
        historicalRisk: 65
      },
      aiReasons: [
        'Dam dam spillway gates regulated upstream at Srinagar Hydro Project',
        'Moderate influx expected within 2 hours as upstream surges travel downstream'
      ],
      evacuation: {
        affectedZones: 'ITI Riverside Colony, Resham Majri Ghat',
        affectedPopulation: 540,
        recommendedDirection: 'HNB Garhwal University Campus Ridge',
        shelters: [
          { name: 'University Chauras Campus Auditorium', capacity: 2000, distance: '1.8km', elevation: '+40m', status: 'Ready' }
        ]
      }
    }
  ],

  // 20 IoT Real-Time Sensors across the catchment
  sensors: [
    { id: 'UTK001', type: 'Rain Gauge', village: 'Bhairavpur', villageId: 'VIL-001', value: '74 mm/hr', numericValue: 74, battery: 82, signal: 'Strong', lastUpdated: '10 sec ago', status: 'ONLINE', coordinates: [30.4210, 79.0680] },
    { id: 'UTK002', type: 'Soil Moisture', village: 'Bhairavpur', villageId: 'VIL-001', value: '86%', numericValue: 86, battery: 76, signal: 'Strong', lastUpdated: '8 sec ago', status: 'ONLINE', coordinates: [30.4190, 79.0650] },
    { id: 'UTK003', type: 'Water Level', village: 'Bhairavpur', villageId: 'VIL-001', value: '2.8 m', numericValue: 2.8, battery: 91, signal: 'Strong', lastUpdated: '5 sec ago', status: 'ONLINE', coordinates: [30.4180, 79.0660] },
    { id: 'UTK004', type: 'Rain Gauge', village: 'Joshimath Valley', villageId: 'VIL-002', value: '52 mm/hr', numericValue: 52, battery: 68, signal: 'Fair', lastUpdated: '15 sec ago', status: 'ONLINE', coordinates: [30.5580, 79.5670] },
    { id: 'UTK005', type: 'Water Level', village: 'Joshimath Valley', villageId: 'VIL-002', value: '3.1 m', numericValue: 3.1, battery: 85, signal: 'Strong', lastUpdated: '12 sec ago', status: 'ONLINE', coordinates: [30.5560, 79.5650] },
    { id: 'UTK006', type: 'Rain Gauge', village: 'Karnaprayag Reach', villageId: 'VIL-003', value: '68.5 mm/hr', numericValue: 68.5, battery: 89, signal: 'Strong', lastUpdated: '8 sec ago', status: 'ONLINE', coordinates: [30.2610, 79.2190] },
    { id: 'UTK007', type: 'Water Level', village: 'Karnaprayag Reach', villageId: 'VIL-003', value: '4.2 m', numericValue: 4.2, battery: 74, signal: 'Strong', lastUpdated: '7 sec ago', status: 'ONLINE', coordinates: [30.2590, 79.2180] },
    { id: 'UTK008', type: 'Rain Gauge', village: 'Rudraprayag Confluence', villageId: 'VIL-004', value: '58 mm/hr', numericValue: 58, battery: 95, signal: 'Strong', lastUpdated: '11 sec ago', status: 'ONLINE', coordinates: [30.2850, 78.9820] },
    { id: 'UTK009', type: 'Water Level', village: 'Rudraprayag Confluence', villageId: 'VIL-004', value: '4.8 m', numericValue: 4.8, battery: 88, signal: 'Strong', lastUpdated: '9 sec ago', status: 'ONLINE', coordinates: [30.2830, 78.9800] },
    { id: 'UTK010', type: 'Soil Moisture', village: 'Devprayag Sangam', villageId: 'VIL-005', value: '65%', numericValue: 65, battery: 70, signal: 'Fair', lastUpdated: '20 sec ago', status: 'ONLINE', coordinates: [30.1460, 78.5990] },
    { id: 'UTK011', type: 'Water Level', village: 'Devprayag Sangam', villageId: 'VIL-005', value: '5.1 m', numericValue: 5.1, battery: 84, signal: 'Strong', lastUpdated: '18 sec ago', status: 'ONLINE', coordinates: [30.1450, 78.5980] },
    { id: 'UTK012', type: 'Soil Moisture', village: 'Guptkashi Slope', villageId: 'VIL-006', value: '81%', numericValue: 81, battery: 42, signal: 'Weak', lastUpdated: '18 sec ago', status: 'WARNING', coordinates: [30.5230, 79.0770] },
    { id: 'UTK013', type: 'Water Level', village: 'Tilwara Basin', villageId: 'VIL-007', value: '3.6 m', numericValue: 3.6, battery: 93, signal: 'Strong', lastUpdated: '6 sec ago', status: 'ONLINE', coordinates: [30.3550, 78.9900] },
    { id: 'UTK014', type: 'Rain Gauge', village: 'Nandaprayag Ghat', villageId: 'VIL-008', value: '34 mm/hr', numericValue: 34, battery: 78, signal: 'Strong', lastUpdated: '25 sec ago', status: 'ONLINE', coordinates: [30.3330, 79.3250] },
    { id: 'UTK015', type: 'Soil Moisture', village: 'Ukhimath Hillside', villageId: 'VIL-009', value: '48%', numericValue: 48, battery: 86, signal: 'Strong', lastUpdated: '30 sec ago', status: 'ONLINE', coordinates: [30.5150, 79.0970] },
    { id: 'UTK016', type: 'Rain Gauge', village: 'Gopeshwar Terrace', villageId: 'VIL-010', value: '14.5 mm/hr', numericValue: 14.5, battery: 92, signal: 'Strong', lastUpdated: '40 sec ago', status: 'ONLINE', coordinates: [30.4090, 79.3310] },
    { id: 'UTK017', type: 'Temperature/Humidity', village: 'Gopeshwar Terrace', villageId: 'VIL-010', value: '20°C / 70%', numericValue: 20, battery: 89, signal: 'Strong', lastUpdated: '40 sec ago', status: 'ONLINE', coordinates: [30.4100, 79.3320] },
    { id: 'UTK018', type: 'Rain Gauge', village: 'Chamoli Sector', villageId: 'VIL-011', value: '61 mm/hr', numericValue: 61, battery: 81, signal: 'Strong', lastUpdated: '14 sec ago', status: 'ONLINE', coordinates: [30.4050, 79.3500] },
    { id: 'UTK019', type: 'Water Level', village: 'Chamoli Sector', villageId: 'VIL-011', value: '4.1 m', numericValue: 4.1, battery: 15, signal: 'Weak', lastUpdated: '10 min ago', status: 'OFFLINE', coordinates: [30.4030, 79.3480] },
    { id: 'UTK020', type: 'Water Level', village: 'Srinagar Garhwal Plain', villageId: 'VIL-012', value: '5.8 m', numericValue: 5.8, battery: 12, signal: 'Weak', lastUpdated: '45 min ago', status: 'OFFLINE', coordinates: [30.2230, 78.7850] }
  ],

  // Active and historical emergency alerts
  alerts: [
    {
      id: 'ALT-2026-104',
      severity: 'Critical',
      badgeClass: 'badge-critical',
      village: 'Bhairavpur',
      villageId: 'VIL-001',
      title: 'FLASH FLOOD WARNING: IMMINENT INUNDATION',
      probability: 87,
      leadTime: '42 min',
      trigger: 'Heavy Rain 74 mm/h + Soil 86% + River Surge +18cm/10m',
      time: '10 mins ago (22:12 IST)',
      status: 'ACTIVE',
      recommendedAction: 'Evacuate low-lying riverside settlement (Wards 1 & 2) immediately to ZP Inter College.',
      zone: 'Mandakini Lower Reach - Zone A'
    },
    {
      id: 'ALT-2026-103',
      severity: 'Critical',
      badgeClass: 'badge-critical',
      village: 'Tilwara Basin',
      villageId: 'VIL-007',
      title: 'RAPID INUNDATION ADVISORY',
      probability: 86,
      leadTime: '36 min',
      trigger: 'River Level 3.6m approaching 3.8m embankment crest',
      time: '18 mins ago (22:04 IST)',
      status: 'ACTIVE',
      recommendedAction: 'Move agricultural machinery and residents from floodplains to higher terrace school.',
      zone: 'Tilwara Floodplain Basin'
    },
    {
      id: 'ALT-2026-102',
      severity: 'Critical',
      badgeClass: 'badge-critical',
      village: 'Karnaprayag Reach',
      villageId: 'VIL-003',
      title: 'SANGAM CONFLUENCE SURGE ALERT',
      probability: 84,
      leadTime: '48 min',
      trigger: 'Combined Pindar & Alaknanda discharge surge',
      time: '32 mins ago (21:50 IST)',
      status: 'ACTIVE',
      recommendedAction: 'Close Sangam Ghat commercial shops and clear pilgrims from riverbanks.',
      zone: 'Sangam Confluence Zone'
    },
    {
      id: 'ALT-2026-101',
      severity: 'High',
      badgeClass: 'badge-high',
      village: 'Chamoli Sector',
      villageId: 'VIL-011',
      title: 'SEVERE WEATHER & DEBRIS FLOW WATCH',
      probability: 78,
      leadTime: '52 min',
      trigger: 'Rainfall 61 mm/h on steep 29° slope',
      time: '45 mins ago (21:37 IST)',
      status: 'ACTIVE',
      recommendedAction: 'Monitor ravine culverts; prepare elderly and vulnerable persons for relocation.',
      zone: 'Chamoli Gorge Rim'
    },
    {
      id: 'ALT-2026-098',
      severity: 'Moderate',
      badgeClass: 'badge-moderate',
      village: 'Devprayag Sangam',
      villageId: 'VIL-005',
      title: 'RIVER SURGE WATCH',
      probability: 58,
      leadTime: '85 min',
      trigger: 'Bhagirathi outflow increasing',
      time: '2 hours ago',
      status: 'RESOLVED',
      recommendedAction: 'Pilgrimage bathing ghats cordoned off.',
      zone: 'Devprayag Lower Terraces'
    }
  ],

  // Historical Disaster Records for Himalayan Basins & Event Replay
  historicalEvents: [
    {
      id: 'EVT-2023-04',
      date: '14 Jul 2023',
      location: 'Bhairavpur & Mandakini Valley',
      village: 'Bhairavpur',
      eventType: 'Flash Flood & Embankment Breach',
      rainfall: '118 mm / 2 hr',
      waterLevel: '3.65 m (Peak Surge)',
      severity: 'Critical',
      impact: '12 structures partially submerged, 450 residents evacuated in 40 mins, 0 casualties',
      leadTimeObserved: '38 minutes early warning'
    },
    {
      id: 'EVT-2021-02',
      date: '07 Feb 2021',
      location: 'Chamoli / Rishiganga Gorge',
      village: 'Chamoli Sector',
      eventType: 'Glacial Rock Avalanche & Debris Surge',
      rainfall: '12 mm (Glacial detachment trigger)',
      waterLevel: '6.20 m (Flash Wave)',
      severity: 'Critical',
      impact: 'Rishiganga Hydropower project damage, downstream bridge severed',
      leadTimeObserved: '18 minutes radar/acoustic warning'
    },
    {
      id: 'EVT-2023-08',
      date: '12 Aug 2023',
      location: 'Karnaprayag & Pindar River',
      village: 'Karnaprayag Reach',
      eventType: 'Flash Confluence Surge',
      rainfall: '94 mm / 3 hr',
      waterLevel: '4.85 m (Above Danger Mark)',
      severity: 'High',
      impact: 'Lower market flooded, 6 vehicles washed away, pre-evacuation saved 820 persons',
      leadTimeObserved: '52 minutes lead time'
    },
    {
      id: 'EVT-2022-06',
      date: '18 Jul 2022',
      location: 'Tilwara Basin',
      village: 'Tilwara Basin',
      eventType: 'Backwater Floodplain Inundation',
      rainfall: '88 mm / 2 hr',
      waterLevel: '3.40 m',
      severity: 'High',
      impact: 'Agricultural fields submerged, livestock safely moved to elevated terrace',
      leadTimeObserved: '45 minutes lead time'
    },
    {
      id: 'EVT-2020-07',
      date: '25 Jul 2020',
      location: 'Guptkashi Ravines',
      village: 'Guptkashi Slope',
      eventType: 'Debris Flow & Cloudburst Inflow',
      rainfall: '102 mm / 90 min',
      waterLevel: '2.45 m',
      severity: 'High',
      impact: 'Road blocked for 18 hours, 3 culverts damaged, early alert mobilized rescue teams',
      leadTimeObserved: '35 minutes lead time'
    }
  ],

  // Model Evaluation Performance Metrics for Analytics Page
  mlModelMetrics: {
    modelName: 'HimaGuard Hybrid XGBoost-RandomForest v2.4',
    trainedOn: '15,800 historical Himalayan catchment observations (2010–2025)',
    accuracy: 93.4, // %
    precision: 91.8, // %
    recall: 94.2, // %
    f1Score: 93.0, // %
    rocAuc: 0.962,
    meanLeadTimeAccuracy: '± 7.4 minutes',
    falsePositiveRate: '5.8%',
    featuresCount: 11
  },

  // Event Replay 5-Stage Step Definition for SIH Presentation
  replaySteps: [
    {
      stage: 1,
      name: 'Normal Monsoon Inflow',
      timeLabel: 'T - 60 min (10:00 AM)',
      rain: 20,
      soil: 55,
      water: 1.20,
      prob: 18,
      risk: 'Low',
      riskColor: '#10b981',
      action: 'Routine automated telemetry monitoring.'
    },
    {
      stage: 2,
      name: 'Precipitation Acceleration',
      timeLabel: 'T - 45 min (10:15 AM)',
      rain: 45,
      soil: 68,
      water: 1.65,
      prob: 46,
      risk: 'Moderate',
      riskColor: '#eab308',
      action: 'Automated Watch Advisory dispatched to Panchayat volunteers.'
    },
    {
      stage: 3,
      name: 'Heavy Catchment Downpour',
      timeLabel: 'T - 30 min (10:30 AM)',
      rain: 72,
      soil: 82,
      water: 2.40,
      prob: 74,
      risk: 'High',
      riskColor: '#f97316',
      action: 'High Risk Warning issued. Designated shelters opened for reception.'
    },
    {
      stage: 4,
      name: 'Severe Cloudburst Surge',
      timeLabel: 'T - 15 min (10:45 AM)',
      rain: 105,
      soil: 91,
      water: 2.95,
      prob: 88,
      risk: 'Very High',
      riskColor: '#ef4444',
      action: 'Flash Siren activated. Evacuation of low-lying riverside settlement.'
    },
    {
      stage: 5,
      name: 'Peak Inundation Breach',
      timeLabel: 'T = 0 min (11:00 AM)',
      rain: 120,
      soil: 95,
      water: 3.40,
      prob: 96,
      risk: 'Critical',
      riskColor: '#ef4444',
      action: 'Emergency protocols active. All residents sheltered in elevated zone.'
    }
  ]
};

window.HIMAGUARD_DATA = HIMAGUARD_DATA;

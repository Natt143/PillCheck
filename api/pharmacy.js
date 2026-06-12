// api/pharmacy.js

export const fetchPharmaciesByCoords = async (latitude, longitude) => {
  // Search radius in meters (3000 meters = 3 kilometers around you)
  const radius = 3000; 
  
  // OpenStreetMap Overpass query to find pharmacies near your exact coordinates
  const query = `[out:json];node(around:${radius},${latitude},${longitude})[amenity=pharmacy];out;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Map server responded with status: ${response.status}`);
    }

    const json = await response.json();

    // Map the global OpenStreetMap data format to your UI structure
    return json.elements.map((element) => {
      // Build a clean Canadian address format out of available map tags
      const street = element.tags["addr:street"] || "";
      const houseNumber = element.tags["addr:housenumber"] || "";
      const city = element.tags["addr:city"] || "";
      const postalCode = element.tags["addr:postcode"] || "";
      
      const fullAddress = street 
        ? `${houseNumber} ${street}${city ? `, ${city}` : ''}${postalCode ? ` ${postalCode}` : ''}`
        : "Address available via map directions";

      return {
        name: element.tags.name || "Local Pharmacy",
        address: fullAddress,
        phone: element.tags.phone || element.tags["contact:phone"] || "",
        loc: `${element.lat},${element.lon}`, // Raw coordinates for mapping
      };
    });
  } catch (error) {
    console.error("Failed to fetch local Canadian pharmacies:", error);
    throw error;
  }
};
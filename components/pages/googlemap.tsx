import { MapPin } from "lucide-react"

interface GoogleMapProps {
  location?: string
  className?: string
}

export default function GoogleMap({
  location = "23805 El Toro Rd, Lake Forest, CA 92630",
  className = "",
}: GoogleMapProps) {
  // Using a different map URL format that has fewer UI elements
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
    location
  )}&zoom=14`

  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}
    >
      <div className="absolute left-4 top-4 z-10 rounded-full bg-white p-2 shadow-md">
        <MapPin className="h-6 w-6 text-orange-600" />
      </div>
      <div className="relative h-[400px] w-full">
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={mapUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}

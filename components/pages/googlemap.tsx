import { MapPin } from "lucide-react"

interface GoogleMapProps {
  location?: string
}

export default function GoogleMap({
  location = "23805 El Toro Rd, Lake Forest, CA 92630",
}: GoogleMapProps) {
  const mapUrl = `https://maps.google.com/maps?width=600&height=400&hl=en&q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=B&output=embed`

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <div className="absolute left-4 top-4 z-10 rounded-full bg-white p-2 shadow-md">
        <MapPin className="h-6 w-6 text-orange-600" />
      </div>
      <div className="relative h-[400px] w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={mapUrl}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  )
}

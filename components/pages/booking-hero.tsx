export default function BookingHero() {
  return (
    <section className="relative h-[40vh] w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/booking.png")',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="mb-4 text-5xl font-bold">
          Book Your Relaxation Journey
        </h1>
        <p className="max-w-2xl text-xl">
          Choose your preferred massage service and schedule a time that works
          best for you. Your path to tranquility begins here.
        </p>
      </div>
    </section>
  )
}

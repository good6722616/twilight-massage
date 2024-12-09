export default function LocationHero() {
  return (
    <section className="relative h-[40vh] w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/location-hero.jpg")',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="mb-4 text-5xl font-bold">Visit Our Location</h1>
        <p className="max-w-2xl text-xl">
          Conveniently located in Lake Forest, our spa offers a peaceful retreat
          from the everyday hustle
        </p>
      </div>
    </section>
  )
}

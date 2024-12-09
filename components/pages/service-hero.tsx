export default function ServiceHero() {
  return (
    <section className="relative h-[40vh] w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/service-hero.png")',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="mb-4 text-5xl font-bold">Our Services</h1>
        <p className="max-w-2xl text-xl">
          Experience the perfect blend of traditional techniques and modern
          therapy for ultimate relaxation and wellness
        </p>
      </div>
    </section>
  )
}

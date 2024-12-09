export default function ContactHero() {
  return (
    <section className="relative h-[40vh] w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/contact-hero.png")',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="mb-4 text-5xl font-bold">Contact Us</h1>
        <p className="max-w-2xl text-xl">
          Get in touch with us for appointments, inquiries, or any questions you
          may have
        </p>
      </div>
    </section>
  )
}

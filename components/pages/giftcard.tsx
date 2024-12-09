import Image from "next/image"
import HeadingText from "@/components/heading-text"
import { giftCards } from "@/config/contents"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
export default function Features() {
  return (
    <section
      className="to-whitepy-16 space-y-8 bg-gradient-to-br from-orange-100 via-orange-50 lg:py-24"
      id="features"
    >
      <div className="container mx-auto px-4">
        {giftCards.header || giftCards.subheader ? (
          <HeadingText subtext={giftCards.subheader} className="text-center">
            {giftCards.header}
          </HeadingText>
        ) : null}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="grid grid-cols-1 gap-8">
            {giftCards.content.map((cards) => {
              const Icon = Icons[cards.icon || "giftCard"]

              return (
                <div
                  key={cards.text}
                  className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-8 md:text-left"
                >
                  <div className="flex">
                    <Icon className="h-[6rem] w-[6rem]" />
                  </div>
                  <div className="flex-1">
                    <p className="md:text4xl text-2xl font-semibold">
                      {cards.text}
                    </p>
                    <p className="font-light text-muted-foreground md:text-lg">
                      {cards.subtext}
                    </p>
                    <Button className="mt-4" size="xl">
                      Buy a Gift Card
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          <div
            className=""
            style={{
              backgroundImage: `url("/giftcard_sample.jpg")`,
              backgroundRepeat: `no-repeat`,
              backgroundSize: `contain`,
              height: "500px",
            }}
          ></div>
        </div>
      </div>
    </section>
  )
}

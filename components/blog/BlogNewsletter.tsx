"use client"
import React from "react"
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

const socialLinks = [
  { href: "#", icon: "fa-facebook-f", label: "Facebook" },
  { href: "#", icon: "fa-instagram", label: "Instagram" },
  { href: "#", icon: "fa-linkedin-in", label: "LinkedIn" },
  { href: "#", icon: "fa-youtube", label: "YouTube" },
]

export default function BlogNewsletter() {
  const form = useForm({
    defaultValues: { email: "" },
  })

  function onSubmit(values: { email: string }) {
    // You can handle the email submission here
    alert(`Subscribed: ${values.email}`)
    form.reset()
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-md bg-[#f3e5d8] p-8 shadow-sm md:mx-0">
      <h2 className="mb-4 font-serif text-3xl text-[#3d3327]">
        Subscribe to our newsletter today!
      </h2>
      <p className="mb-6 text-[#7c6f5f]">
        Sed vel enim porttitor posuere sed pretium lectus aliquet odio faucibus
        nunc varius congue aliquam risus condimentum sit.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel htmlFor="newsletter-email" className="sr-only">
              Email address
            </FormLabel>
            <FormControl>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email address"
                {...form.register("email", { required: "Email is required" })}
                className="mb-2 md:mb-0"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button
            type="submit"
            className="mt-2 w-full  bg-[#a67c52] px-5 py-2 font-semibold text-white transition-colors hover:bg-[#8c6846] md:mt-0 md:w-auto md:rounded-l-none md:rounded-r-full"
          >
            Subscribe
          </Button>
        </form>
      </Form>
      <div className="mt-2 flex gap-4 text-[#3d3327]">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            className="text-xl transition-colors hover:text-[#a67c52]"
          >
            <i className={`fab ${link.icon}`}></i>
          </a>
        ))}
      </div>
    </section>
  )
}

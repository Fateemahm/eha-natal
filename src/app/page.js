import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFCF8] text-[#30243A]">
      <Header />

      {/* MAIN CONTENT */}
      <main>
        {/* HERO SECTION */}
        <section
          id="home"
          className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2 lg:px-10"
        >
          {/* Hero text */}
          <div>
            <span className="mb-6 inline-block rounded-full bg-[#F5EDF7] px-4 py-2 text-sm font-semibold text-[#805B91]">
              Support for every step of your journey
            </span>

            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#30243A] sm:text-5xl lg:text-6xl">
              Your pregnancy journey,
              <span className="text-[#B47D9D]"> supported.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-[#746A78] sm:text-lg">
              Pregnancy comes with many questions, changes and special
              moments. eha-natal is here to help you stay informed, keep track
              of your journey and feel supported along the way.
            </p>

            {/* Call-to-action buttons */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-full bg-[#805B91] px-8 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-[#805B91]/20 transition hover:-translate-y-0.5 hover:bg-[#684477]"
              >
                Get started
              </Link>

              <Link
                href="#about"
                className="rounded-full border border-[#DCCBDD] px-8 py-4 text-center text-sm font-semibold text-[#684477] transition hover:bg-[#F5EDF7]"
              >
                Learn more
              </Link>
            </div>

            <p className="mt-6 text-sm text-[#918795]">
              A little more support for the journey ahead.
            </p>
          </div>

          {/* Hero image */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full bg-[#F8E5DD]" />
            <div className="absolute -bottom-5 -right-5 h-40 w-40 rounded-full bg-[#EDE2F0]" />

            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#F5E9E5] shadow-xl">
              <Image
                src="/images/pregnancy-hero.jpg.avif"
                alt="Expectant mother enjoying a peaceful moment"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-4 rounded-2xl bg-white p-4 shadow-lg sm:left-8">
              <p className="text-sm font-semibold text-[#684477]">
                Every journey matters
              </p>
              <p className="mt-1 text-xs text-[#918795]">
                Care, information and support
              </p>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="bg-[#F8F2F8] px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#A477A9]">
              About eha-natal
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#30243A] sm:text-4xl">
              A more informed and supported pregnancy journey
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#746A78]">
              eha-natal is designed to make pregnancy information and
              pregnancy-related support easier to access. It aims to help
              expectant mothers keep track of important details and feel more
              prepared throughout their journey.
            </p>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-[#A477A9]">
                What you can do
              </span>

              <h2 className="mt-4 text-3xl font-bold text-[#30243A] sm:text-4xl">
                Support that moves with you
              </h2>

              <p className="mt-4 leading-7 text-[#746A78]">
                Helpful tools and information to support you as your pregnancy
                journey progresses.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {/* Feature 1 */}
              <article className="rounded-3xl border border-[#F0E8EF] bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5EDF7] text-2xl">
                  ♡
                </div>

                <h3 className="text-xl font-bold text-[#684477]">
                  Your pregnancy profile
                </h3>

                <p className="mt-3 leading-7 text-[#746A78]">
                  Keep important pregnancy details organised in one place.
                </p>
              </article>

              {/* Feature 2 */}
              <article className="rounded-3xl border border-[#F0E8EF] bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCEEE8] text-2xl">
                  ✿
                </div>

                <h3 className="text-xl font-bold text-[#684477]">
                  Helpful information
                </h3>

                <p className="mt-3 leading-7 text-[#746A78]">
                  Access useful pregnancy-related information to help you stay
                  informed.
                </p>
              </article>

              {/* Feature 3 */}
              <article className="rounded-3xl border border-[#F0E8EF] bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F1E8] text-2xl">
                  ✧
                </div>

                <h3 className="text-xl font-bold text-[#684477]">
                  A personal journey
                </h3>

                <p className="mt-3 leading-7 text-[#746A78]">
                  Keep track of relevant details as you move through your
                  pregnancy.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="px-6 pb-20 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#684477] px-6 py-16 text-center sm:px-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Your journey deserves support.
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-[#F0E7F3]">
              Take the next step towards a more organised and informed
              pregnancy journey with eha-natal.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-sm font-bold text-[#684477] transition hover:bg-[#F5EDF7]"
            >
              Create your account
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#30243A] px-6 py-12 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand information */}
          <div>
            <Link href="/" className="text-2xl font-bold">
              eha<span className="text-[#E69A86]">-</span>natal
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-[#D5CAD9]">
              Supporting a more informed and organised pregnancy journey.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold">Explore</h3>

            <ul className="mt-4 space-y-3 text-sm text-[#D5CAD9]">
              <li>
                <Link href="#home" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-white">
                  About us
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-semibold">Legal</h3>

            <ul className="mt-4 space-y-3 text-sm text-[#D5CAD9]">
              <li>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="font-semibold">Contact</h3>

            <p className="mt-4 text-sm leading-7 text-[#D5CAD9]">
              Have a question or need assistance?
            </p>

            <a
              href="mailto:support@eha-natal.com"
              className="mt-2 inline-block text-sm text-[#F1C6B8] hover:text-white"
            >
              Contact support
            </a>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/15 pt-6 text-center text-xs text-[#BFB2C5]">
          © {new Date().getFullYear()} eha-natal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}


"use client";

import Link from "next/link";
import Header from "@/components/Header";
import {
  MapPin,
  Building2,
  Stethoscope,
  CalendarDays,
  Clock,
  ClipboardCheck,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";

const bookingSteps = [
  {
    number: "01",
    title: "Select your State",
    description: "Choose the Nigerian state where you want to receive care.",
    icon: MapPin,
  },
  {
    number: "02",
    title: "Select your LGA",
    description: "Filter healthcare facilities by your Local Government Area.",
    icon: MapPin,
  },
  {
    number: "03",
    title: "Choose a healthcare facility",
    description: "Explore registered healthcare facilities in your selected area.",
    icon: Building2,
  },
  {
    number: "04",
    title: "Select a service",
    description:
      "Choose from available services such as antenatal consultation, ultrasound or laboratory tests.",
    icon: Stethoscope,
  },
  {
    number: "05",
    title: "Choose a date and time",
    description:
      "View available appointment slots published by your selected facility.",
    icon: CalendarDays,
  },
  {
    number: "06",
    title: "Confirm your appointment",
    description:
      "Review your booking details and confirm your appointment.",
    icon: ClipboardCheck,
  },
];

export default function BookAppointmentPage() {
  return (
    <main className="min-h-screen bg-[#FFFCF8]">
      <Header />

      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <Link
          href="/appointments"
          className="inline-flex items-center gap-2 text-sm text-[#805B91] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Antenatal Calendar
        </Link>

        <div className="mt-8">
          <span className="rounded-full bg-[#F5EDF7] px-4 py-2 text-sm font-medium text-[#805B91]">
            Appointment Booking
          </span>

          <h1 className="mt-5 text-3xl font-bold text-[#684477] md:text-4xl">
            Book Your Healthcare Appointment
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#655B6B]">
            Find a healthcare facility, explore available services and
            schedule a visit that works for you. Follow the steps below
            to understand how appointment booking works.
          </p>
        </div>

        <div className="mt-8 flex gap-3 rounded-2xl border border-[#F0E8EF] bg-white p-5">
          <Info className="mt-1 shrink-0 text-[#805B91]" size={21} />

          <div>
            <h2 className="font-semibold text-[#684477]">
              How appointment booking works
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#655B6B]">
              Select your location, find a healthcare facility, choose
              the service you need and reserve an available appointment
              slot.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-[#684477]">
            Booking process
          </h2>
          <p className="mt-2 text-sm text-[#655B6B]">
            Your appointment will follow these six stages.
          </p>

          <div className="mt-6 space-y-4">
            {bookingSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="flex items-start gap-4 rounded-2xl border border-[#F0E8EF] bg-white p-5 transition hover:border-[#B8A7FF]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5EDF7]">
                    <Icon size={22} className="text-[#805B91]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-[#E69A86]">
                        STEP {step.number}
                      </span>
                    </div>

                    <h3 className="mt-1 font-semibold text-[#684477]">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#655B6B]">
                      {step.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="mt-3 shrink-0 text-[#B8A7FF]"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-[#F5EDF7] p-6">
          <h2 className="text-lg font-semibold text-[#684477]">
            Your healthcare journey starts here
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#655B6B]">
            This booking workflow is currently a demonstration.
            Facility directories, service listings and live appointment
            availability will be connected when the organisation's
            records are available.
          </p>

          <Link
            href="/appointments"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#805B91] px-6 py-3 font-medium text-white transition hover:bg-[#684477]"
          >
            Return to Antenatal Calendar
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}

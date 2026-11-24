
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const antenatalWeeks = [12, 20, 26, 30, 34, 36, 38, 40];

function getContactDate(dueDate, contactWeek) {
  const date = new Date(`${dueDate}T12:00:00`);
  date.setDate(date.getDate() - (40 - contactWeek) * 7);
  return date;
}

function formatDate(date) {
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getContactStatus(date, completed) {
  if (completed) return "completed";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const contactDate = new Date(date);
  contactDate.setHours(0, 0, 0, 0);

  if (contactDate < today) return "overdue";
  return "upcoming";
}

export default function AppointmentsPage() {
  const { data: session, status } = useSession();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") {
        setLoading(false);
      }
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/user-profile", {
        //   params: { userId: session.user.id },
        });

        setProfile(response.data.profile);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Unable to load your pregnancy information.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#FFFCF8]">
        <Header />
        <div className="flex justify-center py-20 text-[#684477]">
          Loading your antenatal calendar...
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#FFFCF8]">
        <Header />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-[#684477]">
            Sign in to continue
          </h1>
          <p className="mt-3 text-[#655B6B]">
            Please sign in to view your antenatal calendar.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-block rounded-xl bg-[#805B91] px-6 py-3 text-white"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  if (error || !profile?.estimatedDueDate) {
    return (
      <main className="min-h-screen bg-[#FFFCF8]">
        <Header />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-[#E69A86]" />
          <h1 className="mt-4 text-2xl font-semibold text-[#684477]">
            {error || "Estimated due date required"}
          </h1>
          <p className="mt-3 text-[#655B6B]">
            {error
              ? "Please try again later."
              : "Add your estimated due date to generate your antenatal calendar."}
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-[#805B91] px-6 py-3 text-white"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const contacts = antenatalWeeks.map((week, index) => {
    const date = getContactDate(profile.estimatedDueDate, week);

    // Completion must eventually come from recorded appointment history.
    const completed = false;
    const contactStatus = getContactStatus(date, completed);

    return {
      id: index + 1,
      week,
      date,
      status: contactStatus,
    };
  });

  const nextContact = contacts.find(
    (contact) => contact.status === "upcoming"
  );

  return (
    <main className="min-h-screen bg-[#FFFCF8]">
      <Header />

      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-[#805B91] hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-5 text-3xl font-bold text-[#684477]">
            Your Antenatal Care Calendar
          </h1>

          <p className="mt-3 max-w-2xl text-[#655B6B]">
            Follow your recommended antenatal contacts throughout your
            pregnancy and plan your healthcare visits.
          </p>
        </div>

        {nextContact && (
          <div className="mb-8 rounded-2xl bg-[#F5EDF7] p-6">
            <p className="text-sm font-medium text-[#805B91]">
              NEXT RECOMMENDED CONTACT
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#684477]">
              Week {nextContact.week}
            </h2>

            <p className="mt-2 text-[#655B6B]">
              {formatDate(nextContact.date)}
            </p>

            <Link
              href="/appointments/book"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#805B91] px-5 py-3 text-white hover:bg-[#684477]"
            >
              Find a Healthcare Facility
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#684477]">
            Your pregnancy timeline
          </h2>
          <p className="mt-1 text-sm text-[#655B6B]">
            Eight recommended contacts based on your estimated due date.
          </p>
        </div>

        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-4 rounded-2xl border border-[#F0E8EF] bg-white p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5EDF7]">
                {contact.status === "completed" ? (
                  <CheckCircle2 className="text-green-600" />
                ) : contact.status === "overdue" ? (
                  <AlertCircle className="text-[#E69A86]" />
                ) : (
                  <Circle className="text-[#805B91]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[#684477]">
                  Antenatal Contact {contact.id}
                </h3>

                <p className="mt-1 text-sm text-[#655B6B]">
                  Recommended at {contact.week} weeks
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#827889]">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    {formatDate(contact.date)}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {contact.status === "overdue"
                      ? "Past recommended date"
                      : contact.status === "completed"
                        ? "Completed"
                        : "Upcoming"}
                  </span>
                </div>
              </div>

              <span
                className={`hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-block ${
                  contact.status === "overdue"
                    ? "bg-orange-50 text-orange-700"
                    : contact.status === "completed"
                      ? "bg-green-50 text-green-700"
                      : "bg-purple-50 text-[#805B91]"
                }`}
              >
                {contact.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#F0E8EF] bg-white p-6">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 text-[#805B91]" />
            <div>
              <h3 className="font-semibold text-[#684477]">
                Ready to book a visit?
              </h3>
              <p className="mt-2 text-sm text-[#655B6B]">
                Choose a healthcare facility and explore its available
                antenatal services and appointment times.
              </p>

              <Link
                href="/appointments/book"
                className="mt-4 inline-flex items-center gap-2 font-semibold text-[#805B91] hover:underline"
              >
                Browse facilities <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs leading-5 text-[#827889]">
          This calendar is an illustrative schedule based on the WHO
          eight-contact antenatal care model. Dates are estimates, not
          confirmed appointments. Follow your healthcare professional's
          advice, as individual care schedules may differ.
        </p>
      </div>
    </main>
  );
}

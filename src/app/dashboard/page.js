
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import CompleteProfileModal from '@/app/dashboard/component/complete-profile-modal';

// Reusable component for displaying individual information
function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-[#F0E8EF] last:border-b-0">
      <span className="text-sm text-[#8B609C]">{label}</span>
      <span className="text-sm font-medium text-[#684477] break-words">
        {value || 'Not added yet'}
      </span>
    </div>
  );
}

// Reusable card for dashboard sections
function ProfileCard({ title, description, children }) {
  return (
    <section className="bg-white border border-[#F0E8EF] rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#684477]">
          {title}
        </h2>
        <p className="text-sm text-[#8B8090] mt-1">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [profileData, setProfileData] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the user's profile
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);

        // const response = await axios.get('/api/user-profile', {
        //   params: { userId: session.user.id },
        // });
        const response = await axios.get("/api/user-profile");

        if (response.data.message === 'Profile not found.') {
          setModalMode('create');
          setModalOpen(true);
        } else {
          setProfileData(response.data.profile);
          setProfileError('');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);

        setProfileError(
          error.response?.data?.message ||
          'Unable to load your profile.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id]);

  const firstName =
    profileData?.user?.firstName ||
    session?.user?.name?.split(' ')[0] ||
    'there';

  const lastName = profileData?.user?.lastName || '';

  const formatDate = (date) => {
    if (!date) return 'Not added yet';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Open the modal to edit an existing profile
  const handleEditProfile = () => {
    setModalMode('edit');
    setModalOpen(true);
  };

  // Handle successful profile creation or update
  const handleProfileSubmit = (response) => {
    setProfileData(response.profile);
    setProfileError('');
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFCF8]">
      <Header />

      {/* Profile Modal */}
      <CompleteProfileModal
        isOpen={modalOpen}
        mode={modalMode}
        profile={modalMode === 'edit' ? profileData || {} : {}}
        onClose={() => setModalOpen(false)}
        onSubmit={handleProfileSubmit}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section */}
        <section className="bg-[#F5EDF7] border border-[#F0E8EF] rounded-2xl p-6 sm:p-8 mb-8">
          <p className="text-sm font-medium text-[#8B609C] mb-2">
            YOUR PERSONAL DASHBOARD
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#684477]">
            Welcome back, {firstName}!
          </h1>

          <p className="text-[#655B6B] mt-2 text-sm sm:text-base">
            Your pregnancy journey, all in one place.
          </p>
        </section>

        {loading ? (
          <div className="text-center py-16 text-[#805B91]">
            Loading your profile...
          </div>
        ) : profileError ? (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4"
          >
            {profileError}
          </div>
        ) : profileData ? (
          <>
            {/* Profile Actions */}
            <div className="flex justify-end mb-5">
              <button
                type="button"
                onClick={handleEditProfile}
                className="inline-flex items-center gap-2 rounded-lg border border-[#805B91] px-5 py-2.5 text-sm font-semibold text-[#805B91] transition hover:bg-[#F5EDF7]"
              >
                <span aria-hidden="true">✎</span>
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Personal Information */}
              <ProfileCard
                title="Personal Information"
                description="Your basic account information"
              >
                <DetailItem label="First Name" value={firstName} />
                <DetailItem label="Last Name" value={lastName} />
                <DetailItem
                  label="Email Address"
                  value={profileData.user?.email || session?.user?.email}
                />
                <DetailItem
                  label="Phone Number"
                  value={profileData.phone}
                />
                <DetailItem
                  label="Address"
                  value={profileData.address}
                />
              </ProfileCard>

              {/* Pregnancy Overview */}
              <ProfileCard
                title="Pregnancy Overview"
                description="An overview of your pregnancy details"
              >
                <DetailItem
                  label="Estimated Due Date"
                  value={formatDate(profileData.estimatedDueDate)}
                />
                <DetailItem
                  label="Current Trimester"
                  value={
                    profileData.currentTrimester
                      ? `Trimester ${profileData.currentTrimester}`
                      : null
                  }
                />
                <DetailItem
                  label="Gravida"
                  value={profileData.gravida}
                />
              </ProfileCard>

              {/* Health Information */}
              <ProfileCard
                title="Health Information"
                description="Your health-related profile details"
              >
                <DetailItem
                  label="Weight"
                  value={profileData.weight}
                />
                <DetailItem
                  label="Height"
                  value={profileData.height}
                />
                <DetailItem
                  label="Blood Group"
                  value={profileData.bloodGroup}
                />
                <DetailItem
                  label="Genotype"
                  value={profileData.genoType}
                />
                <DetailItem
                  label="Allergies"
                  value={profileData.allergies}
                />
              </ProfileCard>

              {/* Additional Personal Details */}
              <ProfileCard
                title="Additional Details"
                description="Other information about you"
              >
                <DetailItem
                  label="Date of Birth"
                  value={formatDate(profileData.dateOfBirth)}
                />
                <DetailItem
                  label="Partner"
                  value={profileData.partner}
                />
                <DetailItem
                  label="State of Origin"
                  value={profileData.stateOfOrigin}
                />
              </ProfileCard>

            </div>

            {/* Book Appointment CTA */}
            <section className="mt-8 overflow-hidden rounded-2xl border border-[#F0E8EF] bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6 p-6 sm:p-8">
                <div>
                  <p className="text-sm font-semibold text-[#8B609C] mb-2">
                    YOUR MATERNAL HEALTH MATTERS
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#684477]">
                    Stay on top of your antenatal care.
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm text-[#655B6B] leading-relaxed">
                    View your recommended antenatal visits, find healthcare
                    facilities near your preferred location, and book an
                    appointment that works for you.
                  </p>
                </div>

                <Link
                  href="/appointments"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#805B91] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#684477] focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-offset-2"
                >
                  Book an Appointment
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </section>
          </>
        ) : null}

      </main>
    </div>
  );
}

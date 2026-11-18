
'use client';

import React, { useEffect, useState } from 'react';
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
  const [profileData, setProfileData] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);

        const response = await axios.get('/api/user-profile', {
          params: { userId: session.user.id },
        });

        if (response.data.message === 'Profile not found.') {
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

  const lastName =
    profileData?.user?.lastName || '';

  const fullName = [firstName, lastName]
    .filter(Boolean)
    .join(' ');

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

  return (
    <div className="min-h-screen bg-[#FFFCF8]">
      <Header />

      {modalOpen && (
        <CompleteProfileModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={(response) => {
            setProfileData(response.profile);
            setModalOpen(false);
          }}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome section */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Personal information */}
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
            </ProfileCard>

            {/* Pregnancy overview */}
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

            {/* Health information */}
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

            {/* Additional personal details */}
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

        ) : null}

      </main>
    </div>
  );
}

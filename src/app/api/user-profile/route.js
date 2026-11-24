
import { prisma } from "@/lib/prisma";
import { calculateCurrentTrimester } from "@/lib/pregnancy";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Get the logged-in user's ID from their server-side session
async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

// Fields that can be saved in a user profile
const allowedFields = [
  "weight",
  "height",
  "partner",
  "stateOfOrigin",
  "allergies",
  "bloodGroup",
  "gravida",
  "estimatedDueDate",
  "dateOfBirth",
  "genoType",
  "address",
  "bio",
  "conceptionDate",
  "phone",
];

// Validate the profile data
function validateProfileFields(body) {
  const data = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      if (body[field] !== null && typeof body[field] !== "string") {
        return {
          error: `${field} must be a string or null.`,
        };
      }

      data[field] = body[field];
    }
  }

  return { data };
}

// GET: Fetch the logged-in user's profile
export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return Response.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!profile) {
      return Response.json(
        { message: "Profile not found." },
        { status: 200 }
      );
    }

    return Response.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("GET profile error:", error);

    return Response.json(
      { message: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

// POST: Create a profile for the logged-in user
export async function POST(request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return Response.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const validation = validateProfileFields(body);

    if (validation.error) {
      return Response.json(
        { message: validation.error },
        { status: 400 }
      );
    }

    const {
      estimatedDueDate,
      conceptionDate,
      ...profileData
    } = validation.data;

    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return Response.json(
        { message: "A profile already exists for this user." },
        { status: 409 }
      );
    }

    const currentTrimester = calculateCurrentTrimester(
      estimatedDueDate,
      conceptionDate
    );

    const profile = await prisma.userProfile.create({
      data: {
        ...profileData,
        estimatedDueDate,
        conceptionDate,
        currentTrimester,
        userId,
      },
    });

    return Response.json(
      {
        message: "Profile created successfully.",
        profile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST profile error:", error);

    if (error.code === "P2002") {
      return Response.json(
        { message: "A profile already exists for this user." },
        { status: 409 }
      );
    }

    return Response.json(
      { message: "Failed to create profile." },
      { status: 500 }
    );
  }
}

// PUT: Update the logged-in user's profile
export async function PUT(request) {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return Response.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const validation = validateProfileFields(body);

    if (validation.error) {
      return Response.json(
        { message: validation.error },
        { status: 400 }
      );
    }

    const {
      estimatedDueDate,
      conceptionDate,
      ...profileData
    } = validation.data;

    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return Response.json(
        { message: "Profile not found." },
        { status: 404 }
      );
    }

    const finalDueDate =
      estimatedDueDate !== undefined
        ? estimatedDueDate
        : existingProfile.estimatedDueDate;

    const finalConceptionDate =
      conceptionDate !== undefined
        ? conceptionDate
        : existingProfile.conceptionDate;

    const currentTrimester = calculateCurrentTrimester(
      finalDueDate,
      finalConceptionDate
    );

    const profile = await prisma.userProfile.update({
      where: { userId },
      data: {
        ...profileData,
        ...(estimatedDueDate !== undefined && { estimatedDueDate }),
        ...(conceptionDate !== undefined && { conceptionDate }),
        currentTrimester,
      },
    });

    return Response.json(
      {
        message: "Profile updated successfully.",
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT profile error:", error);

    return Response.json(
      { message: "Failed to update profile." },
      { status: 500 }
    );
  }
}

// DELETE: Delete the logged-in user's profile
export async function DELETE() {
  try {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return Response.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return Response.json(
        { message: "Profile not found." },
        { status: 404 }
      );
    }

    await prisma.userProfile.delete({
      where: { userId },
    });

    return Response.json(
      { message: "Profile deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE profile error:", error);

    return Response.json(
      { message: "Failed to delete profile." },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";

function requireDevelopmentMode() {
  return process.env.NODE_ENV === "development";
}

// GET /api/user-profile?userId=USER_ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { message: "userId is required." },
        { status: 400 }
      );
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true }
        }
      }
    });

    if (!profile) {
      return Response.json(
        { message: "Profile not found." },
      );
    }

    return Response.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);

    return Response.json(
      { message: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

// POST /api/user-profile
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    // Validate userId
    if (typeof userId !== "string" || !userId.trim()) {
      return Response.json(
        { message: "A valid userId is required." },
        { status: 400 }
      );
    }

    // Only accept fields defined for the profile.
    const stringFields = [
      "weight",
      "height",
      "EDD",
      "partner",
      "stateOfOrigin",
      "allergies",
      "bloodGroup",
      "bloodType",
      "gravida",
    ];

    const data = {};

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        if (
          body[field] !== null &&
          typeof body[field] !== "string"
        ) {
          return Response.json(
            { message: `${field} must be text or null.` },
            { status: 400 }
          );
        }

        data[field] = body[field];
      }
    }

    // Validate DOB
    if (body.DOB !== undefined) {
      if (body.DOB === null) {
        data.DOB = null;
      } else if (typeof body.DOB === "string") {
        const date = new Date(body.DOB);

        if (Number.isNaN(date.getTime())) {
          return Response.json(
            { message: "DOB must be a valid date." },
            { status: 400 }
          );
        }

        data.DOB = date;
      } else {
        return Response.json(
          { message: "DOB must be a date string or null." },
          { status: 400 }
        );
      }
    }

    // Confirm that the user exists.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return Response.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Check whether this user already has a profile.
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (existingProfile) {
      return Response.json(
        {
          message: "This user already has a profile.",
        },
        { status: 409 }
      );
    }

    // Create a new profile only.
    const profile = await prisma.userProfile.create({
      data: {
        userId,
        ...data,
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
    console.error("Error creating profile:", error);

    // Handle duplicate-profile constraint violations.
    if (
      error.code === "P2002"
    ) {
      return Response.json(
        {
          message: "This user already has a profile.",
        },
        { status: 409 }
      );
    }

    return Response.json(
      { message: "Failed to create profile." },
      { status: 500 }
    );
  }
}

// PUT /api/user-profile
export async function PUT(request) {
  try {
    // 1. Get the request body
    const body = await request.json();
    const { userId } = body;

    // 2. Validate userId
    if (typeof userId !== "string" || !userId.trim()) {
      return Response.json(
        { message: "A valid userId is required." },
        { status: 400 }
      );
    }

    // 3. Prepare the fields we allow users to update
    const stringFields = [
      "weight",
      "height",
      "partner",
      "stateOfOrigin",
      "allergies",
      "bloodGroup",
      "bloodType",
      "gravida",
      "estimatedDueDate",
      "curremtTrimester",
      "dateofBirth"
    ];

    const data = {};

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        if (
          body[field] !== null &&
          typeof body[field] !== "string"
        ) {
          return Response.json(
            { message: `${field} must be text or null.` },
            { status: 400 }
          );
        }

        data[field] = body[field];
      }
    }

    // 4. Validate DOB
    if (body.DOB !== undefined) {
      if (body.DOB === null) {
        data.DOB = null;
      } else if (typeof body.DOB === "string") {
        const date = new Date(body.DOB);

        if (Number.isNaN(date.getTime())) {
          return Response.json(
            { message: "DOB must be a valid date." },
            { status: 400 }
          );
        }

        data.DOB = date;
      } else {
        return Response.json(
          { message: "DOB must be a date string or null." },
          { status: 400 }
        );
      }
    }

    // 5. Make sure there is at least one field to update
    if (Object.keys(data).length === 0) {
      return Response.json(
        { message: "Provide at least one field to update." },
        { status: 400 }
      );
    }

    // 6. Check whether the profile exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!existingProfile) {
      return Response.json(
        { message: "Profile not found. Create a profile first." },
        { status: 404 }
      );
    }

    // 7. Update the existing profile
    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data,
    });

    // 8. Return the updated profile
    return Response.json(
      {
        message: "Profile updated successfully.",
        profile: updatedProfile,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating profile:", error);

    return Response.json(
      { message: "Failed to update profile." },
      { status: 500 }
    );
  }
}

 // DELETE /api/user-profile?userId=USER_ID
export async function DELETE(request) {
  try {
    // 1. Get userId from the URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // 2. Validate userId
    if (!userId || !userId.trim()) {
      return Response.json(
        { message: "A valid userId is required." },
        { status: 400 }
      );
    }

    // 3. Check whether the profile exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    // 4. If profile doesn't exist, return 404
    if (!existingProfile) {
      return Response.json(
        { message: "Profile not found." },
        { status: 404 }
      );
    }

    // 5. Delete the profile
    await prisma.userProfile.delete({
      where: { userId },
    });

    // 6. Return success response
    return Response.json(
      { message: "Profile deleted successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting profile:", error);

    return Response.json(
      { message: "Failed to delete profile." },
      { status: 500 }
    );
  }
}

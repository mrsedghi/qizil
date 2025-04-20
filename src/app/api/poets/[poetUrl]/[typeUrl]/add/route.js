// app/api/poets/[poetUrl]/[typeUrl]/add/route.js
import { NextResponse } from "next/server";
import prisma from "../../../../../../../lib/prisma";

export async function GET(request, { params }) {
  try {
    const { poetUrl, typeUrl } = params;

    // Fetch poet
    const poet = await prisma.poet.findUnique({
      where: { poetUrl },
      select: { id: true, name: true },
    });

    if (!poet) {
      return NextResponse.json({ error: "Poet not found" }, { status: 404 });
    }

    // Fetch poem type
    const poemType = await prisma.poemType.findFirst({
      where: {
        typeUrl,
        poetId: poet.id,
      },
      select: { id: true, name: true },
    });

    if (!poemType) {
      return NextResponse.json(
        { error: "Poem type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ poet, poemType });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { poetUrl, typeUrl } = params;
    const { title, content, order, audioFiles } = await request.json();

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Get poet and poem type IDs first
    const poet = await prisma.poet.findUnique({
      where: { poetUrl },
      select: { id: true },
    });

    if (!poet) {
      return NextResponse.json({ error: "Poet not found" }, { status: 404 });
    }

    const poemType = await prisma.poemType.findFirst({
      where: {
        typeUrl,
        poetId: poet.id,
      },
      select: { id: true },
    });

    if (!poemType) {
      return NextResponse.json(
        { error: "Poem type not found" },
        { status: 404 }
      );
    }

    // Check if order already exists for this poet and poem type
    if (order) {
      const existingPoem = await prisma.poem.findFirst({
        where: {
          poetId: poet.id,
          poemTypeId: poemType.id,
          order: parseInt(order),
        },
      });

      if (existingPoem) {
        return NextResponse.json(
          { error: "A poem with this order number already exists" },
          { status: 400 }
        );
      }
    }

    // Prepare data for poem creation
    const poemData = {
      title,
      content,
      order: order || 0,
      poemTypeId: poemType.id,
      poetId: poet.id,
    };

    // Handle audio files only if they exist and are valid
    if (audioFiles && Array.isArray(audioFiles)) {
      // Filter out invalid audio files (must have a non-empty url)
      const validAudioFiles = audioFiles.filter(
        (audio) =>
          audio &&
          typeof audio === "object" &&
          audio.url &&
          audio.url.trim() !== ""
      );

      // Only add audioFiles relation if there are valid entries
      if (validAudioFiles.length > 0) {
        poemData.audioFiles = {
          create: validAudioFiles.map((audio) => ({
            url: audio.url,
            reciter: audio.reciter || null,
            format: audio.format || "mp3",
            duration: audio.duration || null,
          })),
        };
      }
    }

    // Create poem with or without audio files
    const newPoem = await prisma.poem.create({
      data: poemData,
      include: {
        audioFiles: true,
      },
    });

    return NextResponse.json(newPoem);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

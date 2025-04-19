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

    // Get poet and poem type IDs first
    const poet = await prisma.poet.findUnique({
      where: { poetUrl },
      select: { id: true },
    });

    const poemType = await prisma.poemType.findFirst({
      where: {
        typeUrl,
        poetId: poet.id,
      },
      select: { id: true },
    });

    // Create poem with audio files
    const newPoem = await prisma.poem.create({
      data: {
        title,
        content,
        order: order || 0,
        poemTypeId: poemType.id,
        poetId: poet.id,
        audioFiles: {
          create: audioFiles.map((audio) => ({
            url: audio.url,
            reciter: audio.reciter,
            format: audio.format || "mp3",
            duration: audio.duration || 0,
          })),
        },
      },
      include: {
        audioFiles: true,
      },
    });

    return NextResponse.json(newPoem);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

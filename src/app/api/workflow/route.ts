import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_ID = "demo-user"; 

export async function GET() {
  let workflow = await prisma.workflow.findUnique({
    where: { userId: USER_ID },
  });

  if (!workflow) {
    workflow = await prisma.workflow.create({
      data: {
        userId: USER_ID,
        name: "untitled",
        nodes: [],
        edges: [],
      },
    });
  }

  return NextResponse.json(workflow);
}

export async function PUT(req: Request) {
  const { nodes, edges, name } = await req.json();

  await prisma.workflow.upsert({
    where: { userId: USER_ID },
    update: {
      ...(name ? { name } : {}), 
      nodes,
      edges,
    },
    create: {
      userId: USER_ID,
      name: name || "Auto Saved Workflow",
      nodes,
      edges,
    },
  });

  return NextResponse.json({ success: true });
}

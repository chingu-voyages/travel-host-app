import { connectMongoDB } from '@/lib/mongodb';
import Event from '@/schemas/event';
import User from '@/schemas/user';

import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// This route will return all the events for a user
// TODO: this route needs to be secured (only the requsting user should be able to see their events)
export async function GET(req: Request, { params }: any) {
  await connectMongoDB();
  const { id } = params;
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidObjectId) {
    return NextResponse.json({ message: 'Invalid ObjectId format' }, { status: 400 });
  }

  // Find the user, then get the events associated with the user
  const user = await User.findById(id);
  if (user) {
    const { eventIds } = user;
    const userEvents = await Event.find({ _id: { $in: eventIds } });
    return NextResponse.json(userEvents, { status: 200 });
  }
  return NextResponse.json({ message: 'User not found' }, { status: 404 });
}

import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const user = await currentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      <div className="space-y-4">
        <div>
          <h2 className="mb-2 text-xl font-semibold">User Information</h2>
          <div>
            <span className="font-medium">Email:</span> {user?.primaryEmailAddress?.emailAddress}
          </div>
          <div>
            <span className="font-medium">Role:</span> user
          </div>
        </div>
      </div>
    </div>
  );
}

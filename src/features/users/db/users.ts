import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { revalidateUserCache } from "./cache"

// export async function test() {
//   "use cache"
//   cacheTag("test")
// }
export async function insertUser(data: typeof UserTable.$inferInsert) {
  const [newUser] = await db
    .insert(UserTable)
    .values(data)
    .returning()
    // .onConflictDoUpdate({
    //   target: [UserTable.clerkUserId],
    //   set: data,
    // })

  if (newUser == null) throw new Error("Failed to create user")
  revalidateUserCache(newUser.id)

  return newUser
}

export async function updateUser(
  // { clerkUserId }: { clerkUserId: string },
  { userId }: { userId: string },
  data: Partial<typeof UserTable.$inferInsert>
) {
  const [updatedUser] = await db
    .update(UserTable)
    .set(data)
    // .where(eq(UserTable.clerkUserId, clerkUserId))
    .where(eq(UserTable.id, userId))
    .returning()

  if (updatedUser == null) throw new Error("Failed to update user")
  revalidateUserCache(updatedUser.id)

  return updatedUser
}

// export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
export async function deleteUser({ userId }: { userId: string }) {
  const [deletedUser] = await db
    .update(UserTable)
    .set({
      deletedAt: new Date(),
      email: "redacted@deleted.com",
      name: "Deleted User",
      // clerkUserId: "deleted",
      imageUrl: null,
    })
    // .where(eq(UserTable.clerkUserId, clerkUserId))
    .where(eq(UserTable.id, userId))
    .returning()

  if (deletedUser == null) throw new Error("Failed to delete user")
  revalidateUserCache(deletedUser.id)

  return deletedUser
}
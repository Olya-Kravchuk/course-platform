ALTER TABLE "users" DROP CONSTRAINT "users_clerkUserId_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "passwordHash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "clerkUserId";
ALTER TABLE "branches" ADD COLUMN "manager_name" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "branches" ADD CONSTRAINT "branches_manager_name_users_name_fk" FOREIGN KEY ("manager_name") REFERENCES "public"."users"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

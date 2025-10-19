CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" varchar PRIMARY KEY NOT NULL,
	"game_type" text DEFAULT 'pubg' NOT NULL,
	"team_name" text NOT NULL,
	"leader_name" text NOT NULL,
	"leader_whatsapp" text NOT NULL,
	"leader_player_id" text NOT NULL,
	"player2_name" text NOT NULL,
	"player2_player_id" text NOT NULL,
	"player3_name" text NOT NULL,
	"player3_player_id" text NOT NULL,
	"player4_name" text NOT NULL,
	"player4_player_id" text NOT NULL,
	"youtube_vote" text DEFAULT 'no' NOT NULL,
	"transaction_id" text NOT NULL,
	"payment_screenshot" text NOT NULL,
	"agreed_to_terms" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

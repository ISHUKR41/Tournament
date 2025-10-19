import Pusher from "pusher";

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER || "ap2",
  useTLS: true,
});

// Trigger event when team registers
export async function notifyTeamRegistration(gameType: string) {
  await pusher.trigger("tournament", "team-registered", {
    gameType,
    timestamp: new Date().toISOString(),
  });
}

// Trigger event when payment is updated
export async function notifyPaymentUpdate(teamId: string) {
  await pusher.trigger("tournament", "payment-updated", {
    teamId,
    timestamp: new Date().toISOString(),
  });
}

import Pusher from "pusher";

const isPusherEnabled = !!(
  process.env.PUSHER_APP_ID &&
  process.env.PUSHER_KEY &&
  process.env.PUSHER_SECRET
);

export const pusher = isPusherEnabled
  ? new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER || "ap2",
      useTLS: true,
    })
  : null;

// Trigger event when team registers
export async function notifyTeamRegistration(gameType: string) {
  if (!pusher) {
    console.warn("Pusher not configured, skipping real-time notification");
    return;
  }
  await pusher.trigger("tournament", "team-registered", {
    gameType,
    timestamp: new Date().toISOString(),
  });
}

// Trigger event when payment is updated
export async function notifyPaymentUpdate(teamId: string) {
  if (!pusher) {
    console.warn("Pusher not configured, skipping real-time notification");
    return;
  }
  await pusher.trigger("tournament", "payment-updated", {
    teamId,
    timestamp: new Date().toISOString(),
  });
}

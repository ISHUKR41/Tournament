import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertTeamSchema, type InsertTeam } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import paymentQr from "@assets/pubg qr_1760564389416.jpg";

interface GameRegistrationFormProps {
  onClose: () => void;
  gameType: "pubg" | "freefire";
  gameName: string;
  entryFee: number;
}

export function GameRegistrationForm({ onClose, gameType, gameName, entryFee }: GameRegistrationFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<InsertTeam>({
    resolver: zodResolver(insertTeamSchema),
    defaultValues: {
      gameType,
      teamName: "",
      leaderName: "",
      leaderWhatsapp: "",
      leaderPlayerId: "",
      player2Name: "",
      player2PlayerId: "",
      player3Name: "",
      player3PlayerId: "",
      player4Name: "",
      player4PlayerId: "",
      youtubeVote: "no",
      transactionId: "",
      paymentScreenshot: "",
      agreedToTerms: 0 as any,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertTeam) => {
      return await apiRequest("POST", "/api/teams", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/teams/count'] });
      queryClient.invalidateQueries({ queryKey: [`/api/teams/count/${gameType}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Registration Successful!",
        description: "Your team has been registered. Check WhatsApp for updates.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        form.setValue("paymentScreenshot", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: InsertTeam) => {
    registerMutation.mutate(data);
  };

  const playerIdLabel = gameType === "pubg" ? "PUBG ID" : "Free Fire UID";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 z-10 bg-card border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold" data-testid="text-form-title">
              {gameName} Team Registration
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in all details carefully. Entry fee: ₹{entryFee} per team
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-form"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Team Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-semibold">Team Information</h3>
              
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your team name" {...field} data-testid="input-team-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="leaderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Leader Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} data-testid="input-leader-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leaderWhatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="10-digit number" {...field} data-testid="input-leader-whatsapp" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="leaderPlayerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Leader {playerIdLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${playerIdLabel}`} {...field} data-testid="input-leader-player-id" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Player 2 */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-semibold">Player 2</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="player2Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player 2 Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} data-testid="input-player2-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="player2PlayerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player 2 {playerIdLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter ${playerIdLabel}`} {...field} data-testid="input-player2-player-id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Player 3 */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-semibold">Player 3</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="player3Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player 3 Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} data-testid="input-player3-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="player3PlayerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player 3 {playerIdLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter ${playerIdLabel}`} {...field} data-testid="input-player3-player-id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Player 4 */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-semibold">Player 4</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="player4Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player 4 Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} data-testid="input-player4-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="player4PlayerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player 4 {playerIdLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter ${playerIdLabel}`} {...field} data-testid="input-player4-player-id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* YouTube Live Stream Vote */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="youtubeVote"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold">
                      Do you want to watch the match live on YouTube?
                    </FormLabel>
                    <FormDescription>
                      Vote for live streaming. The option with more votes will be implemented.
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="vote-yes" data-testid="radio-youtube-yes" />
                          <label htmlFor="vote-yes" className="cursor-pointer">Yes</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="vote-no" data-testid="radio-youtube-no" />
                          <label htmlFor="vote-no" className="cursor-pointer">No</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-semibold">Payment Information</h3>
              
              <div className="bg-secondary/20 p-6 rounded-lg space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Scan the QR code below to make payment
                  </p>
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <img
                      src={paymentQr}
                      alt="Payment QR Code"
                      className="w-64 h-64 object-contain mx-auto"
                      data-testid="img-payment-qr"
                    />
                  </div>
                  <p className="text-sm font-medium mt-3">
                    Entry Fee: ₹{entryFee}
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID / UTR Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter transaction ID from payment app"
                        {...field}
                        data-testid="input-transaction-id"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentScreenshot"
                render={() => (
                  <FormItem>
                    <FormLabel>Payment Screenshot</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          data-testid="input-payment-screenshot"
                        />
                        {imagePreview && (
                          <div className="relative w-full max-w-md">
                            <img
                              src={imagePreview}
                              alt="Payment Screenshot Preview"
                              className="rounded-lg border w-full"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Terms and Conditions */}
            <FormField
              control={form.control}
              name="agreedToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value === 1}
                      onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                      data-testid="checkbox-agree-terms"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the terms and conditions
                    </FormLabel>
                    <FormDescription>
                      Registration is final. No refunds under any circumstances.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                data-testid="button-submit-registration"
              >
                {registerMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {registerMutation.isPending ? "Registering..." : "Complete Registration"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={registerMutation.isPending}
                data-testid="button-cancel-registration"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

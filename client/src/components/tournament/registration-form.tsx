import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { X, Upload, Loader2, QrCode, Smartphone, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertTeamSchema, type InsertTeam } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import paymentQr from "@assets/pubg qr_1760564389416.jpg";

interface RegistrationFormProps {
  onClose: () => void;
}

export function RegistrationForm({ onClose }: RegistrationFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [copied, setCopied] = useState(false);
  
  const upiId = "your-upi-id@paytm";

  const form = useForm<InsertTeam>({
    resolver: zodResolver(insertTeamSchema),
    defaultValues: {
      teamName: "",
      leaderName: "",
      leaderWhatsapp: "",
      leaderPubgId: "",
      player2Name: "",
      player2PubgId: "",
      player3Name: "",
      player3PubgId: "",
      player4Name: "",
      player4PubgId: "",
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
  
  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      toast({
        title: "UPI ID Copied!",
        description: "You can now paste it in your payment app",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the UPI ID manually",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: InsertTeam) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 z-10 bg-card border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold" data-testid="text-form-title">
              Team Registration
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in all details carefully. Entry fee: ₹80 per team
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
                name="leaderPubgId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Leader PUBG ID</FormLabel>
                    <FormControl>
                      <Input placeholder="PUBG Mobile ID" {...field} data-testid="input-leader-pubg-id" />
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
                  name="player2PubgId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player 2 PUBG ID</FormLabel>
                      <FormControl>
                        <Input placeholder="PUBG Mobile ID" {...field} data-testid="input-player2-pubg-id" />
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
                  name="player3PubgId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player 3 PUBG ID</FormLabel>
                      <FormControl>
                        <Input placeholder="PUBG Mobile ID" {...field} data-testid="input-player3-pubg-id" />
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
                  name="player4PubgId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player 4 PUBG ID</FormLabel>
                      <FormControl>
                        <Input placeholder="PUBG Mobile ID" {...field} data-testid="input-player4-pubg-id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Payment QR Code */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-semibold flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                Payment Details - ₹80
              </h3>
              
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-chart-1/5 border-primary/20">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                      <img 
                        src={paymentQr} 
                        alt="Payment QR Code" 
                        className="w-48 h-48 object-contain"
                        data-testid="img-payment-qr"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      Scan this QR code with any UPI app
                    </p>
                  </div>
                  
                  <div className="flex flex-col justify-center space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Payment Methods:</p>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 bg-background/60 px-3 py-1.5 rounded-lg">
                          <Smartphone className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Google Pay</span>
                        </div>
                        <div className="flex items-center gap-2 bg-background/60 px-3 py-1.5 rounded-lg">
                          <Smartphone className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">PhonePe</span>
                        </div>
                        <div className="flex items-center gap-2 bg-background/60 px-3 py-1.5 rounded-lg">
                          <Smartphone className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Paytm</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">UPI ID:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-background/60 px-3 py-2 rounded-lg text-sm font-mono">
                          {upiId}
                        </code>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={copyUpiId}
                          data-testid="button-copy-upi"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <p className="text-xs text-destructive font-semibold">Important:</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pay exactly ₹80. After payment, enter transaction ID and upload screenshot below.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-semibold">Payment Confirmation</h3>
              
              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID / Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter transaction ID from payment" {...field} data-testid="input-transaction-id" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentScreenshot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Screenshot</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="flex-1"
                            data-testid="input-payment-screenshot"
                          />
                          <Button type="button" variant="outline" size="icon">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                        {imagePreview && (
                          <div className="relative w-full max-w-sm">
                            <img
                              src={imagePreview}
                              alt="Payment screenshot"
                              className="w-full rounded-lg border"
                              data-testid="img-payment-preview"
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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="agreedToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value === 1}
                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                        data-testid="checkbox-terms"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to all terms and conditions
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        I confirm that my team will follow fair gameplay and all tournament rules. 
                        I understand that fees are non-refundable.
                      </p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={registerMutation.isPending}
                data-testid="button-submit-registration"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
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

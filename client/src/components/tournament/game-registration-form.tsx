import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { X, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
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
import { compressImage } from "@/lib/imageCompression";
import paymentQr from "@assets/pubg qr_1760564389416.jpg";

interface GameRegistrationFormProps {
  onClose: () => void;
  gameType: "pubg" | "freefire";
  gameName: string;
  entryFee: number;
}

// Loading Skeleton Component
function FormSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-3 sm:space-y-4">
        <Skeleton className="h-5 w-32 sm:w-40" />
        <Skeleton className="h-11 sm:h-12 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-3">
          <Skeleton className="h-5 w-28 sm:w-36" />
          <Skeleton className="h-11 sm:h-12 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-28 sm:w-36" />
          <Skeleton className="h-11 sm:h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

type FormValues = Omit<InsertTeam, 'agreedToTerms'> & { agreedToTerms: 0 | 1 };

export function GameRegistrationForm({ onClose, gameType, gameName, entryFee }: GameRegistrationFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(insertTeamSchema) as any,
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
      agreedToTerms: 0,
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      try {
        const compressed = await compressImage(file, 0.3);
        setImagePreview(compressed);
        form.setValue("paymentScreenshot", compressed);
      } catch (error) {
        toast({
          title: "Image Processing Failed",
          description: "Could not process the image. Please try another file.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onSubmit = (data: FormValues) => {
    const sanitizedData: InsertTeam = {
      ...data,
      agreedToTerms: data.agreedToTerms === 1 ? 1 : 0,
    } as InsertTeam;
    registerMutation.mutate(sanitizedData);
  };

  const playerIdLabel = gameType === "pubg" ? "PUBG ID" : "Free Fire UID";

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card 
        className="w-full h-full sm:h-auto sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl max-h-screen sm:max-h-[95vh] md:max-h-[90vh] overflow-y-auto relative rounded-none sm:rounded-lg border-0 sm:border shadow-none sm:shadow-lg"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b p-4 sm:p-5 md:p-6 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h2 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-bold leading-tight" 
              data-testid="text-form-title"
            >
              {gameName} Registration
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
              Entry fee: <span className="font-semibold text-primary">₹{entryFee}</span> per team
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-110"
            data-testid="button-close-form"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-5 md:p-6 lg:p-8 space-y-6 sm:space-y-7 md:space-y-8">
            {/* Team Information */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-base sm:text-lg md:text-xl font-display font-semibold flex items-center gap-2">
                <span className="w-1 h-5 sm:h-6 bg-primary rounded-full"></span>
                Team Information
              </h3>
              
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Team Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your team name" 
                        {...field} 
                        className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md" 
                        data-testid="input-team-name" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                <FormField
                  control={form.control}
                  name="leaderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Team Leader Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Full name" 
                          {...field} 
                          className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md" 
                          data-testid="input-leader-name" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leaderWhatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">WhatsApp Number *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="10-digit number" 
                          {...field} 
                          className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md" 
                          data-testid="input-leader-whatsapp" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="leaderPlayerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Team Leader {playerIdLabel} *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={`Enter ${playerIdLabel}`} 
                        {...field} 
                        className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md" 
                        data-testid="input-leader-player-id" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Player 2 */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-base sm:text-lg md:text-xl font-display font-semibold flex items-center gap-2">
                <span className="w-1 h-5 sm:h-6 bg-primary rounded-full"></span>
                Player 2
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                <FormField
                  control={form.control}
                  name="player2Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Player 2 Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Full name" 
                          {...field} 
                          className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md" 
                          data-testid="input-player2-name" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="player2PlayerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Player 2 {playerIdLabel} *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={`Enter ${playerIdLabel}`} 
                          {...field} 
                          className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md" 
                          data-testid="input-player2-player-id" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Player 3 */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-base sm:text-lg md:text-xl font-display font-semibold flex items-center gap-2">
                <span className="w-1 h-5 sm:h-6 bg-primary rounded-full"></span>
                Player 3
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                <FormField
                  control={form.control}
                  name="player3Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Player 3 Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Full name" 
                          {...field} 
                          className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md" 
                          data-testid="input-player3-name" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="player3PlayerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Player 3 {playerIdLabel} *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={`Enter ${playerIdLabel}`} 
                          {...field} 
                          className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md" 
                          data-testid="input-player3-player-id" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Player 4 */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-base sm:text-lg md:text-xl font-display font-semibold flex items-center gap-2">
                <span className="w-1 h-5 sm:h-6 bg-primary rounded-full"></span>
                Player 4
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                <FormField
                  control={form.control}
                  name="player4Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Player 4 Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Full name" 
                          {...field} 
                          className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md" 
                          data-testid="input-player4-name" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="player4PlayerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Player 4 {playerIdLabel} *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={`Enter ${playerIdLabel}`} 
                          {...field} 
                          className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md" 
                          data-testid="input-player4-player-id" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* YouTube Live Stream Vote */}
            <div className="space-y-4 sm:space-y-5">
              <FormField
                control={form.control}
                name="youtubeVote"
                render={({ field }) => (
                  <FormItem className="space-y-3 p-4 sm:p-5 md:p-6 bg-secondary/20 rounded-lg border transition-all duration-200 hover:shadow-md">
                    <FormLabel className="text-sm sm:text-base md:text-lg font-semibold">
                      Do you want to watch the match live on YouTube?
                    </FormLabel>
                    <FormDescription className="text-xs sm:text-sm">
                      Vote for live streaming. The option with more votes will be implemented.
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-secondary/30 transition-all duration-200 cursor-pointer flex-1">
                          <RadioGroupItem value="yes" id="vote-yes" className="h-5 w-5 sm:h-6 sm:w-6" data-testid="radio-youtube-yes" />
                          <label htmlFor="vote-yes" className="cursor-pointer text-sm sm:text-base font-medium flex-1">Yes, I'd love to watch!</label>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-secondary/30 transition-all duration-200 cursor-pointer flex-1">
                          <RadioGroupItem value="no" id="vote-no" className="h-5 w-5 sm:h-6 sm:w-6" data-testid="radio-youtube-no" />
                          <label htmlFor="vote-no" className="cursor-pointer text-sm sm:text-base font-medium flex-1">No, thanks</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Section */}
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-base sm:text-lg md:text-xl font-display font-semibold flex items-center gap-2">
                <span className="w-1 h-5 sm:h-6 bg-primary rounded-full"></span>
                Payment Information
              </h3>
              
              <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg border-2 border-dashed border-primary/20 space-y-4 sm:space-y-5">
                <div className="text-center">
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4">
                    Scan the QR code below to make payment
                  </p>
                  <div className="inline-block p-3 sm:p-4 md:p-5 bg-white dark:bg-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
                    <img
                      src={paymentQr}
                      alt="Payment QR Code"
                      className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain mx-auto"
                      data-testid="img-payment-qr"
                    />
                  </div>
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-primary/10 rounded-lg inline-block">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-primary">
                      Entry Fee: ₹{entryFee}
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Transaction ID / UTR Number *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter transaction ID from payment app"
                        {...field}
                        className="h-11 sm:h-12 md:h-13 text-sm sm:text-base transition-all duration-200 focus:scale-[1.01] focus:shadow-md"
                        data-testid="input-transaction-id"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentScreenshot"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Payment Screenshot *</FormLabel>
                    <FormControl>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="h-11 sm:h-12 md:h-13 text-sm sm:text-base cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all duration-200"
                            data-testid="input-payment-screenshot"
                          />
                          {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-primary" />
                            </div>
                          )}
                        </div>
                        {imagePreview && !isLoading && (
                          <div className="relative w-full max-w-md mx-auto">
                            <div className="absolute -top-2 -right-2 z-10 bg-green-500 rounded-full p-1 sm:p-1.5 shadow-lg">
                              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <img
                              src={imagePreview}
                              alt="Payment Screenshot Preview"
                              className="rounded-lg border-2 border-primary/20 w-full shadow-md transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                        )}
                        {isLoading && (
                          <Skeleton className="h-48 sm:h-56 md:h-64 w-full max-w-md mx-auto rounded-lg" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Terms and Conditions */}
            <div>
              <FormField
                control={form.control}
                name="agreedToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border-2 border-primary/20 p-4 sm:p-5 md:p-6 bg-secondary/10 transition-all duration-200 hover:shadow-md hover:border-primary/40">
                    <FormControl>
                      <Checkbox
                        checked={field.value === 1}
                        onCheckedChange={(checked) => {
                          const value = checked === true ? 1 : 0;
                          field.onChange(value);
                        }}
                        className="mt-1 h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 hover:scale-110"
                        data-testid="checkbox-agree-terms"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none flex-1">
                      <FormLabel className="text-sm sm:text-base font-semibold cursor-pointer">
                        I agree to the terms and conditions *
                      </FormLabel>
                      <FormDescription className="text-xs sm:text-sm pt-1 sm:pt-2">
                        Registration is final. No refunds under any circumstances. By checking this box, you confirm all information provided is accurate.
                      </FormDescription>
                      <FormMessage className="text-xs sm:text-sm pt-1" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full sm:w-auto sm:flex-1 md:flex-initial h-11 sm:h-12 md:h-13 text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
                data-testid="button-submit-registration"
              >
                {registerMutation.isPending && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />}
                {registerMutation.isPending ? "Registering..." : "Complete Registration"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={registerMutation.isPending}
                className="w-full sm:w-auto h-11 sm:h-12 md:h-13 text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
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

import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Download, 
  LogOut, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Loader2 
} from "lucide-react";
import type { Team } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const { data: admin, isLoading: adminLoading } = useQuery({
    queryKey: ['/api/admin/me'],
    retry: false,
  });

  useEffect(() => {
    if (!adminLoading && !admin) {
      setLocation("/admin/login");
    }
  }, [admin, adminLoading, setLocation]);

  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/logout", {});
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "Successfully logged out",
      });
      setLocation("/admin/login");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/teams/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({
        title: "Status Updated",
        description: "Team status has been updated successfully",
      });
      setSelectedTeam(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/teams/export', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teams-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: "Teams data has been exported to Excel",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const pendingCount = teams.filter(t => t.status === "pending").length;
  const approvedCount = teams.filter(t => t.status === "approved").length;
  const rejectedCount = teams.filter(t => t.status === "rejected").length;

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {admin.username}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" data-testid="button-export-excel">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="outline"
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-teams">{teams.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-pending-teams">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-approved-teams">{approvedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-rejected-teams">{rejectedCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registered Teams</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : teams.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No teams registered yet</p>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => (
                  <Card key={team.id} className="hover-elevate">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg" data-testid={`text-team-name-${team.id}`}>
                              {team.teamName}
                            </h3>
                            <Badge className={getStatusColor(team.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(team.status)}
                                {team.status}
                              </span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Leader: {team.leaderName} • {team.leaderWhatsapp}</p>
                            <p>Transaction ID: {team.transactionId}</p>
                            <p>Registered: {new Date(team.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTeam(team)}
                            data-testid={`button-view-${team.id}`}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Team Details</DialogTitle>
            </DialogHeader>
            {selectedTeam && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Team Name</p>
                    <p className="font-semibold">{selectedTeam.teamName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(selectedTeam.status)}>
                      {selectedTeam.status}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Team Members</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Leader</p>
                      <p>{selectedTeam.leaderName} • {selectedTeam.leaderWhatsapp}</p>
                      <p className="text-sm text-muted-foreground">PUBG ID: {selectedTeam.leaderPubgId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Player 2</p>
                      <p>{selectedTeam.player2Name}</p>
                      <p className="text-sm text-muted-foreground">PUBG ID: {selectedTeam.player2PubgId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Player 3</p>
                      <p>{selectedTeam.player3Name}</p>
                      <p className="text-sm text-muted-foreground">PUBG ID: {selectedTeam.player3PubgId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Player 4</p>
                      <p>{selectedTeam.player4Name}</p>
                      <p className="text-sm text-muted-foreground">PUBG ID: {selectedTeam.player4PubgId}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <p className="text-sm mb-2">Transaction ID: {selectedTeam.transactionId}</p>
                  {selectedTeam.paymentScreenshot && (
                    <img
                      src={selectedTeam.paymentScreenshot}
                      alt="Payment Screenshot"
                      className="max-w-full h-auto rounded-lg border"
                    />
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => updateStatusMutation.mutate({ id: selectedTeam.id, status: "approved" })}
                    disabled={updateStatusMutation.isPending || selectedTeam.status === "approved"}
                    className="flex-1"
                    data-testid="button-approve"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => updateStatusMutation.mutate({ id: selectedTeam.id, status: "rejected" })}
                    disabled={updateStatusMutation.isPending || selectedTeam.status === "rejected"}
                    variant="destructive"
                    className="flex-1"
                    data-testid="button-reject"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Loader2,
  Search,
  Filter,
  Gamepad2
} from "lucide-react";
import type { Team } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminStats {
  total: number;
  pubgTeams: number;
  freeFireTeams: number;
  pending: number;
  approved: number;
  rejected: number;
  pubgAvailable: number;
  freeFireAvailable: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [gameTypeFilter, setGameTypeFilter] = useState<string>("all");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: admin, isLoading: adminLoading } = useQuery<{ username: string }>({
    queryKey: ['/api/admin/me'],
    retry: false,
  });

  useEffect(() => {
    if (!adminLoading && !admin) {
      setLocation("/admin/login");
    }
  }, [admin, adminLoading, setLocation]);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 5000,
    enabled: !!admin,
  });

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
    return `/api/teams/search?${params.toString()}`;
  };

  const { data: allTeams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ['/api/teams/search', searchQuery, statusFilter],
    queryFn: async () => {
      const url = buildSearchUrl();
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch teams');
      return response.json();
    },
    enabled: !!admin,
  });

  const teams = gameTypeFilter === 'all' 
    ? allTeams 
    : allTeams.filter(team => team.gameType === gameTypeFilter);

  useEffect(() => {
    if (selectedTeam) {
      setAdminNotes(selectedTeam.adminNotes || "");
    }
  }, [selectedTeam]);

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
      queryClient.invalidateQueries({ queryKey: ['/api/teams/search'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
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

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      return await apiRequest("PATCH", `/api/admin/teams/${id}/notes`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams/search'] });
      toast({
        title: "Notes Saved",
        description: "Admin notes have been saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save notes",
        variant: "destructive",
      });
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      return await apiRequest("POST", "/api/admin/teams/bulk-status", { ids, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams/search'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setSelectedTeamIds([]);
      toast({
        title: "Bulk Update Successful",
        description: "Selected teams have been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Bulk Update Failed",
        description: error.message || "Failed to update teams",
        variant: "destructive",
      });
    },
  });

  const handleExport = async (gameType?: 'pubg' | 'freefire') => {
    try {
      const url = gameType 
        ? `/api/admin/teams/export?gameType=${gameType}`
        : '/api/admin/teams/export';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const gameName = gameType === 'pubg' ? 'PUBG' : gameType === 'freefire' ? 'FreeFire' : 'All';
      a.download = `${gameName}-teams-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: `${gameName} teams data exported to Excel and saved to exports/${gameType || 'all'} folder`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTeamIds(teams.map(t => t.id));
    } else {
      setSelectedTeamIds([]);
    }
  };

  const handleSelectTeam = (teamId: string, checked: boolean) => {
    if (checked) {
      setSelectedTeamIds([...selectedTeamIds, teamId]);
    } else {
      setSelectedTeamIds(selectedTeamIds.filter(id => id !== teamId));
    }
  };

  const handleBulkApprove = () => {
    if (selectedTeamIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select teams to approve",
        variant: "destructive",
      });
      return;
    }
    bulkStatusMutation.mutate({ ids: selectedTeamIds, status: "approved" });
  };

  const handleBulkReject = () => {
    if (selectedTeamIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select teams to reject",
        variant: "destructive",
      });
      return;
    }
    bulkStatusMutation.mutate({ ids: selectedTeamIds, status: "rejected" });
  };

  const handleSaveNotes = () => {
    if (selectedTeam) {
      updateNotesMutation.mutate({ id: selectedTeam.id, notes: adminNotes });
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
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleExport('pubg')} variant="outline" size="sm" data-testid="button-export-pubg">
              <Download className="w-4 h-4 mr-2" />
              Export PUBG
            </Button>
            <Button onClick={() => handleExport('freefire')} variant="outline" size="sm" data-testid="button-export-freefire">
              <Download className="w-4 h-4 mr-2" />
              Export Free Fire
            </Button>
            <Button onClick={() => handleExport()} variant="outline" size="sm" data-testid="button-export-all">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="outline"
              size="sm"
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 bg-secondary/50 rounded animate-pulse"></div>
              ) : (
                <div className="text-2xl font-bold" data-testid="text-total-teams">{stats?.total || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PUBG Teams</CardTitle>
              <Gamepad2 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 bg-secondary/50 rounded animate-pulse"></div>
              ) : (
                <div className="text-2xl font-bold" data-testid="text-pubg-teams">{stats?.pubgTeams || 0} / 25</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Fire Teams</CardTitle>
              <Gamepad2 className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 bg-secondary/50 rounded animate-pulse"></div>
              ) : (
                <div className="text-2xl font-bold" data-testid="text-freefire-teams">{stats?.freeFireTeams || 0} / 25</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 bg-secondary/50 rounded animate-pulse"></div>
              ) : (
                <div className="text-2xl font-bold" data-testid="text-pending-teams">{stats?.pending || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 bg-secondary/50 rounded animate-pulse"></div>
              ) : (
                <div className="text-2xl font-bold" data-testid="text-approved-teams">{stats?.approved || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 bg-secondary/50 rounded animate-pulse"></div>
              ) : (
                <div className="text-2xl font-bold" data-testid="text-rejected-teams">{stats?.rejected || 0}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Registered Teams</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search"
                  />
                </div>
                <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40" data-testid="select-game-filter">
                    <Gamepad2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Game" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="filter-game-all">All Games</SelectItem>
                    <SelectItem value="pubg" data-testid="filter-game-pubg">PUBG</SelectItem>
                    <SelectItem value="freefire" data-testid="filter-game-freefire">Free Fire</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40" data-testid="select-status-filter">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="filter-all">All Status</SelectItem>
                    <SelectItem value="pending" data-testid="filter-pending">Pending</SelectItem>
                    <SelectItem value="approved" data-testid="filter-approved">Approved</SelectItem>
                    <SelectItem value="rejected" data-testid="filter-rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTeamIds.length > 0 && (
              <div className="mb-4 p-4 bg-secondary/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-sm font-medium">
                  {selectedTeamIds.length} team{selectedTeamIds.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleBulkApprove}
                    disabled={bulkStatusMutation.isPending}
                    data-testid="button-bulk-approve"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Selected
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkReject}
                    disabled={bulkStatusMutation.isPending}
                    data-testid="button-bulk-reject"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Selected
                  </Button>
                </div>
              </div>
            )}

            {teamsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : teams.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery || statusFilter !== 'all' ? 'No teams found matching your filters' : 'No teams registered yet'}
              </p>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <Checkbox
                    checked={selectedTeamIds.length === teams.length && teams.length > 0}
                    onCheckedChange={handleSelectAll}
                    data-testid="checkbox-select-all"
                  />
                  <span className="text-sm font-medium">Select All</span>
                </div>
                <div className="space-y-4">
                  {teams.map((team) => (
                    <Card key={team.id} className="hover-elevate">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <Checkbox
                              checked={selectedTeamIds.includes(team.id)}
                              onCheckedChange={(checked) => handleSelectTeam(team.id, checked as boolean)}
                              className="mt-1"
                              data-testid={`checkbox-team-${team.id}`}
                            />
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
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {team.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateStatusMutation.mutate({ id: team.id, status: "approved" })}
                                  disabled={updateStatusMutation.isPending}
                                  data-testid={`button-approve-${team.id}`}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateStatusMutation.mutate({ id: team.id, status: "rejected" })}
                                  disabled={updateStatusMutation.isPending}
                                  data-testid={`button-reject-${team.id}`}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {team.status === "approved" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateStatusMutation.mutate({ id: team.id, status: "rejected" })}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-reject-${team.id}`}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            )}
                            {team.status === "rejected" && (
                              <Button
                                size="sm"
                                onClick={() => updateStatusMutation.mutate({ id: team.id, status: "approved" })}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-approve-${team.id}`}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTeam(team)}
                              data-testid={`button-view-${team.id}`}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
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
                    <p className="text-sm font-medium text-muted-foreground">Game Type</p>
                    <Badge variant="outline">{selectedTeam.gameType.toUpperCase()}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(selectedTeam.status)}>
                      {selectedTeam.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">YouTube Live Stream</p>
                    <Badge variant={selectedTeam.youtubeVote === 'yes' ? 'default' : 'secondary'}>
                      {selectedTeam.youtubeVote === 'yes' ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Team Members</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Leader</p>
                      <p>{selectedTeam.leaderName} • {selectedTeam.leaderWhatsapp}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTeam.gameType === 'pubg' ? 'PUBG ID' : 'Free Fire UID'}: {selectedTeam.leaderPlayerId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Player 2</p>
                      <p>{selectedTeam.player2Name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTeam.gameType === 'pubg' ? 'PUBG ID' : 'Free Fire UID'}: {selectedTeam.player2PlayerId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Player 3</p>
                      <p>{selectedTeam.player3Name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTeam.gameType === 'pubg' ? 'PUBG ID' : 'Free Fire UID'}: {selectedTeam.player3PlayerId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Player 4</p>
                      <p>{selectedTeam.player4Name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTeam.gameType === 'pubg' ? 'PUBG ID' : 'Free Fire UID'}: {selectedTeam.player4PlayerId}
                      </p>
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

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Admin Notes</h4>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this team..."
                    className="min-h-24"
                    data-testid="textarea-admin-notes"
                  />
                  <Button
                    onClick={handleSaveNotes}
                    disabled={updateNotesMutation.isPending}
                    className="mt-2"
                    size="sm"
                    data-testid="button-save-notes"
                  >
                    {updateNotesMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Notes'
                    )}
                  </Button>
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

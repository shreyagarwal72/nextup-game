import GameLayout from "@/components/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  Volume2, 
  Monitor, 
  Gamepad2, 
  User, 
  Shield, 
  Bell,
  Palette,
  Save,
  Moon,
  Sun
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { gameAudio } from "@/utils/gameAudio";

export default function Settings() {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    // Audio Settings
    masterVolume: [70],
    musicVolume: [50],
    soundEffects: [80],
    muteAll: false,

    // Display Settings
    theme: "dark",
    animations: true,
    screenShake: true,
    particleEffects: true,
    
    // Gameplay Settings
    difficulty: "medium",
    autoSave: true,
    confirmExit: true,
    showHints: true,
    
    // Controls
    keyboardControls: "wasd",
    mouseSensitivity: [50],
    
    // Notifications
    gameNotifications: true,
    achievementPopups: true,
    leaderboardUpdates: false,
    
    // Privacy
    profileVisible: true,
    showOnlineStatus: true,
    allowDataCollection: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      gameAudio.updateSettings(newSettings);
      return newSettings;
    });
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      gameAudio.updateSettings(parsed);
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    gameAudio.updateSettings(settings);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const resetSettings = () => {
    setSettings({
      masterVolume: [70],
      musicVolume: [50],
      soundEffects: [80],
      muteAll: false,
      theme: "dark",
      animations: true,
      screenShake: true,
      particleEffects: true,
      difficulty: "medium",
      autoSave: true,
      confirmExit: true,
      showHints: true,
      keyboardControls: "wasd",
      mouseSensitivity: [50],
      gameNotifications: true,
      achievementPopups: true,
      leaderboardUpdates: false,
      profileVisible: true,
      showOnlineStatus: true,
      allowDataCollection: false
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults.",
    });
  };

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Settings</h1>
          <p className="text-muted-foreground">Customize your gaming experience</p>
        </div>

        {/* Audio Settings */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent flex items-center gap-2">
              <Volume2 className="h-6 w-6" />
              Audio Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="mute-all" className="text-foreground">Mute All Audio</Label>
              <Switch
                id="mute-all"
                checked={settings.muteAll}
                onCheckedChange={(checked) => updateSetting('muteAll', checked)}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-foreground mb-3 block">Master Volume: {settings.masterVolume[0]}%</Label>
                <Slider
                  value={settings.masterVolume}
                  onValueChange={(value) => updateSetting('masterVolume', value)}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={settings.muteAll}
                />
              </div>
              
              <div>
                <Label className="text-foreground mb-3 block">Music Volume: {settings.musicVolume[0]}%</Label>
                <Slider
                  value={settings.musicVolume}
                  onValueChange={(value) => updateSetting('musicVolume', value)}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={settings.muteAll}
                />
              </div>
              
              <div>
                <Label className="text-foreground mb-3 block">Sound Effects: {settings.soundEffects[0]}%</Label>
                <Slider
                  value={settings.soundEffects}
                  onValueChange={(value) => updateSetting('soundEffects', value)}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={settings.muteAll}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent flex items-center gap-2">
              <Monitor className="h-6 w-6" />
              Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground mb-3 block">Theme</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => theme === "light" && toggleTheme()}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => theme === "dark" && toggleTheme()}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Animations</Label>
                  <Switch
                    checked={settings.animations}
                    onCheckedChange={(checked) => updateSetting('animations', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Screen Shake</Label>
                  <Switch
                    checked={settings.screenShake}
                    onCheckedChange={(checked) => updateSetting('screenShake', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Particle Effects</Label>
                  <Switch
                    checked={settings.particleEffects}
                    onCheckedChange={(checked) => updateSetting('particleEffects', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gameplay Settings */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent flex items-center gap-2">
              <Gamepad2 className="h-6 w-6" />
              Gameplay Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-foreground mb-3 block">Default Difficulty</Label>
                <Select value={settings.difficulty} onValueChange={(value) => updateSetting('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-foreground mb-3 block">Keyboard Controls</Label>
                <Select value={settings.keyboardControls} onValueChange={(value) => updateSetting('keyboardControls', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select controls" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wasd">WASD</SelectItem>
                    <SelectItem value="arrows">Arrow Keys</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-foreground mb-3 block">Mouse Sensitivity: {settings.mouseSensitivity[0]}%</Label>
              <Slider
                value={settings.mouseSensitivity}
                onValueChange={(value) => updateSetting('mouseSensitivity', value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Auto Save</Label>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Confirm Exit</Label>
                <Switch
                  checked={settings.confirmExit}
                  onCheckedChange={(checked) => updateSetting('confirmExit', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Show Hints</Label>
                <Switch
                  checked={settings.showHints}
                  onCheckedChange={(checked) => updateSetting('showHints', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Game Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications about game updates</p>
              </div>
              <Switch
                checked={settings.gameNotifications}
                onCheckedChange={(checked) => updateSetting('gameNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Achievement Popups</Label>
                <p className="text-sm text-muted-foreground">Show popups when you earn achievements</p>
              </div>
              <Switch
                checked={settings.achievementPopups}
                onCheckedChange={(checked) => updateSetting('achievementPopups', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Leaderboard Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about ranking changes</p>
              </div>
              <Switch
                checked={settings.leaderboardUpdates}
                onCheckedChange={(checked) => updateSetting('leaderboardUpdates', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Make your profile visible to other players</p>
              </div>
              <Switch
                checked={settings.profileVisible}
                onCheckedChange={(checked) => updateSetting('profileVisible', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Show Online Status</Label>
                <p className="text-sm text-muted-foreground">Display when you're online</p>
              </div>
              <Switch
                checked={settings.showOnlineStatus}
                onCheckedChange={(checked) => updateSetting('showOnlineStatus', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Data Collection</Label>
                <p className="text-sm text-muted-foreground">Allow anonymous usage analytics</p>
              </div>
              <Switch
                checked={settings.allowDataCollection}
                onCheckedChange={(checked) => updateSetting('allowDataCollection', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save/Reset Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={saveSettings}
            className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card px-8"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Settings
          </Button>
          <Button
            onClick={resetSettings}
            variant="outline"
            className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card px-8"
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </GameLayout>
  );
}
import { useState } from "react";
import {
  Box,
  Typography,
  Slider,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useLogMood } from "../hooks/useMood";
import NavigationBar from "../components/NavigationBar";

const getColor = (value: number) => {
  if (value <= 3) return "#d32f2f"; // red (Critical)
  if (value <= 7) return "#ed6c02"; // yellow (Okay)
  return "#2e7d32"; // green (Good)
};

const getMoodLabel = (value: number) => {
  if (value <= 3) return "Critical, really bad";
  if (value <= 7) return "Okay, sad, could be better";
  return "Good, the happiest I've been";
};

export default function MoodLogger() {
  const [mood, setMood] = useState(5); // initial slider value
  const [note, setNote] = useState("");
  const mutation = useLogMood();

  const handleSave = () => {
    mutation.mutate({ moodValue: mood, description: note || ""});
  };

  return (
  <Box>
    <NavigationBar />
    <Box sx={{ maxWidth: 500, mt: 4, justifyContent: "center", mx: "auto", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        How is your mood?
      </Typography>

      {/* Mood slider */}
      <Slider
        min={1}
        max={10}
        value={mood}
        onChange={(_, v) => setMood(v as number)}
        valueLabelDisplay="on"
        sx={{
          color: getColor(mood),
        }}
      />

      <Typography
        sx={{ color: getColor(mood), fontWeight: 600, mb: 2 }}
      >
        Mood level: {mood} - {getMoodLabel(mood)}
      </Typography>

      {/* Notes input */}
      <TextField
        label="How do you feel today?"
        multiline
        rows={4}
        fullWidth
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Describe your thoughts or feelings..."
      />

      {/* Save button */}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSave}
        disabled={mutation.isPending}
        fullWidth
      >
        Save
      </Button>

      {/* Feedback */}
      {mutation.isSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Mood logged successfully
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to log mood
        </Alert>
      )}
    </Box>
    </Box>
  );
}

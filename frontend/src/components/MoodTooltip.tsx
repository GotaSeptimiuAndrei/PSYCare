// components/MoodTooltip.tsx
import { Box, Typography } from "@mui/material";
import { processNotes } from "../utils/tooltipText";

interface MoodTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { score: number; note: string } }>;
  label?: string;
}

export default function MoodTooltip({
  active,
  payload,
  label,
}: MoodTooltipProps) {
  if (!active || !payload?.length || !label) return null;

  const { score, note } = payload[0].payload;
  const notes = processNotes(note);

  return (
    <Box
      sx={{
        p: 1.5,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 260,
      }}
    >
      <Typography variant="subtitle2">
        {new Date(label).toLocaleDateString()}
      </Typography>

      <Typography fontWeight={600}>
        Mood: {score} / 10
      </Typography>

      {notes.map((n, i) => (
        <Typography key={i} variant="body2" sx={{ mt: 0.5 }}>
          • {n}
        </Typography>
      ))}
    </Box>
  );
}

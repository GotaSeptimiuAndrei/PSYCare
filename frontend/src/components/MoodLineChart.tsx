import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Button, ButtonGroup } from "@mui/material";
import MoodTooltip from "./MoodTooltip";
import type { PatientMoodHistory } from "../types/patient";

const periods = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
];

interface MoodLineChartProps {
  data: PatientMoodHistory[];
  period: string; // current period
  setPeriod: (period: string) => void; // setter to update period
}

export default function MoodLineChart({ data, period, setPeriod }: MoodLineChartProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "50%", mt: 2 }}>
        <ButtonGroup size="small" sx={{ mb: 2 }}>
          {periods.map((p) => (
            <Button
              key={p.label}
              variant={period === p.label ? "contained" : "outlined"}
              onClick={() => setPeriod(p.label)} // <-- triggers parent state update
            >
              {p.label}
            </Button>
          ))}
        </ButtonGroup>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" hide />
            <YAxis domain={[1, 10]} hide />
            <Tooltip content={<MoodTooltip />} />
            <Line type="monotone" dataKey="score" stroke="#1976d2" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

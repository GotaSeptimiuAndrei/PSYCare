// components/MoodLineChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Button, ButtonGroup } from "@mui/material";
import { useState, useMemo } from "react";
import MoodTooltip from "./MoodTooltip";
import { filterByPeriod } from "../utils/timeFilter";
import type { PatientMoodHistory } from "../types/patient";

const periods = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
];

export default function MoodLineChart({
  data,
}: {
  data: PatientMoodHistory[];
}) {
  const [days, setDays] = useState(30);

  const filteredData = useMemo(
    () => filterByPeriod(data, days),
    [data, days]
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
    <Box sx={{ width: "50%", mt: 2, justifyContent: "center" }}>
      {/* Filters */}
      <ButtonGroup size="small" sx={{ mb: 2 }}>
        {periods.map((p) => (
          <Button
            key={p.label}
            variant={days === p.days ? "contained" : "outlined"}
            onClick={() => setDays(p.days)}
          >
            {p.label}
          </Button>
        ))}
      </ButtonGroup>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <XAxis dataKey="date" hide />
          <YAxis domain={[1, 10]} hide />
          <Tooltip content={<MoodTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#1976d2"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
    </Box>
  );
}

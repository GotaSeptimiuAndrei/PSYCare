//import MoodLineChart from "../components/MoodLineChart";
import NavigationBar from "../components/NavigationBar";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import { usePatientMoodHistory } from "../hooks/usePatient";
import { getId } from "../hooks/useAuth";
import MoodLineChart from "../components/MoodLineChart";
import { useState } from "react";

export default function PatientDashboard() {
  const id = getId();
  const [period, setPeriod] = useState("1M");
  const { data, isLoading, isError } = usePatientMoodHistory(id!, period);

  if (isLoading) return <CircularProgress sx={{ mt: 4 }} />;
  if (isError || !data)
    return <Typography color="error">Failed to load mood history.</Typography>;

  return (
    <div>
      <NavigationBar />
      <Box sx={{ p: 4 }}>
        <MoodLineChart data={data} period={period} setPeriod={setPeriod}/> {/* guaranteed array now */} 
      </Box>
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Button variant="contained" color="primary" href="/mood-tracker" sx={{ ml: 4, mb: 4 }}>
          Log New Mood Entry
        </Button>
        <Button variant="contained" color="primary" href={`/patient/${id}`} sx={{ ml: 4, mb: 4 }}>
          See Full Mood History
        </Button>
      </Box>
    </div>
  );
}

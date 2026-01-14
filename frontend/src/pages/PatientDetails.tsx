import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import { usePatientMoodHistory } from "../hooks/usePatient";
import MoodLineChart from "../components/MoodLineChart";
<<<<<<< HEAD
import { getId, getRole } from "../hooks/useAuth";
import { useState } from "react";
=======
>>>>>>> 313c9ef (the doctor sees the chart for the patient)

export default function PatientProfile() {
  const jwtId = getId();
  const { patientId } = useParams();
  const id = Number(patientId);
  const role = getRole();
  const [period, setPeriod] = useState("1M");
  const { data, isLoading, isError } = usePatientMoodHistory(id, period);

  if (role !== "doctor" && jwtId !== id) {
    return (
      <>
        <NavigationBar />
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            You are not allowed to view this patient's profile.
          </Typography>
        </Box>
      </>
    );
  }

  if (isLoading) return <CircularProgress sx={{ mt: 4 }} />;
  if (isError || !data) {
    return <Typography color="error">Failed to load history.</Typography>;
  }

  return (
    <>
      <NavigationBar />
      {/* Pass period state and setter to the chart */}
      <MoodLineChart data={data} period={period} setPeriod={setPeriod} />

      <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Patient Mood History
        </Typography>

        {data.length > 0 ? (
          data.map((entry, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Mood score: {entry.score} / 10</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(entry.date).toLocaleDateString()}
                </Typography>
                {entry.note && <Typography sx={{ mt: 1 }}>{entry.note}</Typography>}
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No mood history available.</Typography>
        )}
      </Box>
    </>
  );
}

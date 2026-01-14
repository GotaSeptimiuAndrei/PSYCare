import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import { usePatientMoodHistory } from "../hooks/usePatient";
import MoodLineChart from "../components/MoodLineChart";

export default function PatientProfile() {
  const { patientId } = useParams();
  const id = Number(patientId);

  const { data, isLoading, isError } = usePatientMoodHistory(id);

  if (isLoading) return <CircularProgress sx={{ mt: 4 }} />;
  if (isError || !data) {
    return <Typography color="error">Failed to load history.</Typography>;
  }

  return (
    <>
      <NavigationBar />
      <MoodLineChart data={data} />

      <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Patient Mood History
        </Typography>

        {Array.isArray(data) ? data.map((entry, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                Mood score: {entry.score} / 10
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {new Date(entry.date).toLocaleDateString()}
              </Typography>

              {entry.note && (
                <Typography sx={{ mt: 1 }}>
                  {entry.note}
                </Typography>
              )}
            </CardContent>
          </Card>
        )) : (
          <Typography>No mood history available.</Typography>
        )}
      </Box>
    </>
  );
}

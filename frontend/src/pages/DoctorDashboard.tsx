import NavigationBar from "../components/NavigationBar";
import { useGetPatients } from "../hooks/usePatient";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Patient } from "../types/patient";

export default function DoctorDashboard() {
  const [page, setPage] = useState(0); // backend pages are 0-indexed
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetPatients(page, 10);

  if (isLoading) return <CircularProgress sx={{ mt: 4, ml: 2 }} />;
  if (isError || !data) {
    return <Typography color="error">Failed to load patients.</Typography>;
  }

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  return (
    <>
      <NavigationBar />

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Patients
        </Typography>

        <Grid container spacing={3}>
          {data.content.map((patient: Patient) => (
            <Grid key={patient.id}>
              <Card>
                <CardActionArea
                  onClick={() => navigate(`/patient/${patient.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6">
                      {patient.fullName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {patient.email}
                    </Typography>

                    {patient.lastMoodValue !== null && (
                      <Typography sx={{ mt: 1 }}>
                        Last mood: {patient.lastMoodValue} / 10
                      </Typography>
                    )}

                    {patient.lastSeen && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Last seen:{" "}
                        {new Date(patient.lastSeen).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {data.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={data.totalPages}
              page={page + 1}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </>
  );
}

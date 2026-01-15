import { useParams } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import { usePatientMoodHistory } from "../hooks/usePatient";
import { useGetAllExercises } from "../hooks/useExercise";
import { useAssignHomework } from "../hooks/useTask";
import MoodLineChart from "../components/MoodLineChart";
import { getId, getRole } from "../hooks/useAuth";
import { useState } from "react";

export default function PatientProfile() {
  const jwtId = getId();
  const { patientId } = useParams();
  const id = Number(patientId);
  const role = getRole();
  const [period, setPeriod] = useState("1M");

  const { data, isLoading, isError } = usePatientMoodHistory(id, period);

  const { data: exercises } = useGetAllExercises();
  const assignMutation = useAssignHomework();

  const [open, setOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<number | string>("");
  const [dueDate, setDueDate] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedExercise("");
    setDueDate("");
  };

  const handleConfirmAssignment = () => {
    assignMutation.mutate({
      patientId: id,
      exerciseId: Number(selectedExercise),
      assignedDate: dueDate
    }, {
      onSuccess: () => {
        handleClose();
      }
    });
  };

  if ((role !== "doctor" && jwtId !== id) || isError) {
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
      <MoodLineChart data={data} period={period} setPeriod={setPeriod} />

      <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Patient Mood History
          </Typography>
          {role === "doctor" && (
            <Button variant="contained" onClick={handleOpen}>
              Assign Task
            </Button>
          )}
        </Box>

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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Assign Exercise</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Select Exercise</InputLabel>
            <Select
              value={selectedExercise}
              label="Select Exercise"
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              {exercises?.map((ex) => (
                <MenuItem key={ex.id} value={ex.id}>
                  {ex.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleConfirmAssignment}
            variant="contained"
            disabled={!selectedExercise || !dueDate || assignMutation.isPending}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

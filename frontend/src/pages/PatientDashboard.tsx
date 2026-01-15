//import MoodLineChart from "../components/MoodLineChart";
import NavigationBar from "../components/NavigationBar";
import { CircularProgress, Box, Typography, Button, Card, CardContent, Divider, List, ListItem, ListItemText, Collapse, IconButton } from "@mui/material";
import { usePatientMoodHistory } from "../hooks/usePatient";
import { getId } from "../hooks/useAuth";
import MoodLineChart from "../components/MoodLineChart";
import { useState } from "react";
import { useGetMyTasks, useCompleteTask } from "../hooks/useTask";
import type { Task } from "../types/task";

export default function PatientDashboard() {
  const id = getId();
  const [period, setPeriod] = useState("1M");
  const { data, isLoading, isError } = usePatientMoodHistory(id!, period);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data: tasks, isLoading: tasksLoading } = useGetMyTasks();
  const completeMutation = useCompleteTask();

  const handleExpand = (taskId: number) => {
    setExpandedId(expandedId === taskId ? null : taskId);
  };

  if (isLoading || tasksLoading) return <CircularProgress sx={{ mt: 4 }} />;
  if (isError || !data)
    return <Typography color="error">Failed to load mood history.</Typography>;

  const pendingTasks = tasks?.filter((t: Task) => t.status === 'PENDING') || [];
  const completedTasks = tasks?.filter((t: Task) => t.status === 'COMPLETED') || [];

  console.log("Tasks from DB:", tasks);

  return (
    <div>
      <NavigationBar />
      <Box sx={{ p: 4 }}>
        <MoodLineChart data={data} period={period} setPeriod={setPeriod} /> {/* guaranteed array now */}
      </Box>

      <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Pending Assignments</Typography>

        {pendingTasks.map((task: Task) => (
          <Card key={task.id} sx={{ mb: 2, borderLeft: '5px solid #1976d2' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ cursor: 'pointer', flexGrow: 1 }} onClick={() => task.id && handleExpand(task.id)}>
                  <Typography variant="h6">{task.exerciseTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due to: {task.assignedDate ? new Date(task.assignedDate).toLocaleDateString() : "No date"}
                  </Typography>
                </Box>
                <IconButton onClick={() => task.id && handleExpand(task.id)}>
                  <span style={{
                    transform: expandedId === task.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: '0.3s',
                    display: 'inline-block'
                  }}>▼</span>
                </IconButton>
              </Box>

              <Collapse in={expandedId === task.id}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>{task.exerciseDescription}</Typography>

                  {task.contentUrl && (
                    <Button
                      variant="outlined"
                      size="small"
                      href={task.contentUrl}
                      target="_blank"
                      sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}
                    >
                      Open Resource
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => task.id && completeMutation.mutate(task.id)}
                    disabled={completeMutation.isPending}
                  >
                    {completeMutation.isPending ? "..." : "✓ Mark as Done"}
                  </Button>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}

        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>Completed</Typography>
        <List>
          {completedTasks.map((task: Task) => (
            <ListItem key={task.id} secondaryAction={<span style={{ color: 'green' }}>✓</span>}>
              <ListItemText
                primary={task.exerciseTitle}
                sx={{ textDecoration: 'line-through', color: 'gray' }}
              />
            </ListItem>
          ))}
        </List>
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
